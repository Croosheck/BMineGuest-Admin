import { useEffect, useRef, useState } from "react";
import "./ManageTables.css";

import uploadFile from "../../../util/storage";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db, storage } from "../../../firebase";
import PreviewCropModal from "../../UI/previewCropModal/PreviewCropModal";

import "react-image-crop/dist/ReactCrop.css";
import { extractImageFileExtensionFromBase64 } from "../../../util/base64Reusable";
import { useDispatch, useSelector } from "react-redux";
import { setNewTableBase64ImageData } from "../../../redux/slices/restaurant";
import { checkImgSizeHandler, filteredKeys } from "./utils/reusable";
import ImagePreview from "./newTable/ImagePreview";
import { getDownloadURL, listAll, ref } from "firebase/storage";

import TableCard from "./tablesList/TableCard";
import { CSSTransition } from "react-transition-group";

function ManageTables() {
	const [restaurantTables, setRestaurantTables] = useState([]);
	const [imageModal, setImageModal] = useState({
		isVisible: false,
		imgUrl: null,
	});
	const [inputValue, setInputValue] = useState({
		tSeats: "",
		tShape: "",
		tPlacement: "",
	});
	const [newTableData, setNewTableData] = useState({
		image: null,
		rawImageData: null,
		tPlacement: "",
		tSeats: Number(),
		tShape: String(),
		tAvailability: true,
		tPicked: false,
	});
	const [base64Image, setBase64Image] = useState({
		img: "",
		imgExt: "",
	});
	const [status, setStatus] = useState({
		message: "",
		uploadProgress: 0,
	});
	const [imageSize, setImageSize] = useState({
		w: 0,
		h: 0,
		isOk: false,
		message: "",
	});
	const [tablesImgs, setTablesImgs] = useState({});

	const { newTableBase64ImageData } = useSelector(
		(state) => state.restaurantReducer
	);

	const dispatch = useDispatch();

	const pickedImageRef = useRef();
	const imagePreviewCanvasRef = useRef();

	const restaurantRef = doc(db, "restaurants", auth.currentUser.uid);

	const tablesImgsRef = ref(
		storage,
		`restaurants/${auth.currentUser.uid}/tables`
	);

	function getTablesData() {
		onSnapshot(restaurantRef, (doc) => {
			const tables = doc.data().tables;
			setRestaurantTables(tables);
		});
	}

	async function getTablesImages() {
		const tablesList = await listAll(tablesImgsRef);

		tablesList.items.forEach(async (table) => {
			const tableId = table.name.includes(".")
				? table.name.match(/^.*(?=(\.))/g).join("")
				: table.name;

			const tableImgRef = ref(
				storage,
				`restaurants/${auth.currentUser.uid}/tables/${table.name}`
			);
			const tableImgUrl = await getDownloadURL(tableImgRef);

			setTablesImgs((prev) => ({
				...prev,
				[tableId]: {
					imgUrl: tableImgUrl,
					filename: table.name,
				},
			}));
		});
	}

	useEffect(() => {
		setRestaurantTables([]);
		setTablesImgs({});

		getTablesData();
		getTablesImages();
	}, []);

	function renameNewTable(restTables) {
		let newTableId = Math.floor(Math.random() * Math.pow(10, 10));

		const isAny = restTables.some((table) => table.Id === newTableId);

		if (isAny) {
			newTableId = Math.floor(Math.random() * Math.pow(10, 10));
			return renameNewTable(restTables);
		}

		return newTableId;
	}

	async function addNewTableHandler() {
		if (!newTableBase64ImageData.img || !imageSize.isOk) return;

		const newTableId = renameNewTable(restaurantTables);

		setNewTableData((prev) => ({
			...prev,
			...inputValue,
		}));

		//Upload the image (Storage) and table data (Firestore)
		const { uploadTask } = await uploadFile(
			newTableBase64ImageData.img,
			"addTable",
			{
				tId: newTableId,
				tAvailability: newTableData.tAvailability,
				tPicked: newTableData.tPicked,
				tPlacement: newTableData.tPlacement,
				tSeats: newTableData.tSeats,
				tShape: newTableData.tShape,
				...inputValue,
			}
		);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setStatus({
					message: "Upload is " + progress.toFixed(2) + "% done",
					uploadProgress: progress,
				});
			},
			(error) => {
				// Handle unsuccessful uploads
				setStatus({
					message: `Something went wrong: ${error}\n
					Check your internet connection and try again later.`,
					uploadProgress: 0,
				});
			},
			() => {
				// Handle successful uploads on complete
				dispatch(
					setNewTableBase64ImageData({
						img: "",
						imgExt: "",
					})
				);
				setBase64Image({
					img: "",
					imgExt: "",
				});
				setStatus({
					message: "The data has been sent successfully!",
					uploadProgress: 100,
				});
				setInputValue({
					tPlacement: "",
					tSeats: "",
					tShape: "",
				});

				const successTimeout = setTimeout(() => {
					setStatus({
						message: "",
						uploadProgress: 0,
					});

					return clearTimeout(successTimeout);
				}, 5000);

				getTablesImages();
			}
		);
	}

	function inputFieldHandler(e, type) {
		if (type === "tSeats") {
			const value = Number(e.target.value);

			if (e.target.value[0] === "0") {
				setInputValue((prev) => ({
					...prev,
					tSeats: 1,
				}));
				return;
			}

			if (value > 99) {
				setInputValue((prev) => ({
					...prev,
					tSeats: 99,
				}));
				return;
			}

			setInputValue((prev) => ({
				...prev,
				tSeats: value,
			}));

			return;
		}
		if (type === "tShape") {
			setInputValue((prev) => ({
				...prev,
				tShape: e.target.value,
			}));

			return;
		}
		if (type === "tPlacement") {
			if (inputValue.tPlacement.length === 0 && e.target.value === " ") return;

			setInputValue((prev) => ({
				...prev,
				tPlacement: e.target.value,
			}));

			return;
		}
	}

	function onImageInputChange(e) {
		if (e.currentTarget.files.length === 0) return;

		imageToBase64Handler(e.currentTarget.files[0]);

		const imgURL = URL.createObjectURL(...e.currentTarget.files);

		setNewTableData((prev) => ({
			...prev,
			image: imgURL,
		}));
	}

	function imageToBase64Handler(file) {
		const currentFile = file;
		const myFileItemReader = new FileReader();
		myFileItemReader.addEventListener("load", () => {
			const myResult = myFileItemReader.result;
			setBase64Image({
				img: myResult,
				imgExt: extractImageFileExtensionFromBase64(myResult),
			});

			dispatch(
				setNewTableBase64ImageData({
					img: myResult,
					imgExt: extractImageFileExtensionFromBase64(myResult),
				})
			);
		});
		myFileItemReader.readAsDataURL(currentFile);
	}

	function onCropClickHandler() {
		if (!imageSize.isOk) return;

		setImageModal({
			isVisible: true,
			imgUrl: newTableData.image,
		});
	}
	function onResetClickHandler() {
		dispatch(
			setNewTableBase64ImageData({
				img: base64Image.img,
				imgExt: base64Image.imgExt,
			})
		);
	}

	return (
		<>
			<div className="manageTables-container">
				{imageModal.isVisible && (
					<PreviewCropModal
						tableModalVisible={true}
						tableImgUrl={newTableData.image}
						onModalClose={() =>
							setImageModal({ isVisible: false, imgUrl: null })
						}
						mode="crop"
						forCropData={{
							base64Img: base64Image.img,
							imgExt: base64Image.imgExt,
						}}
					/>
				)}
				<div className="manageTables--new-table-outer-container">
					<div className="new-table-outer-container">
						<div className="new-table-outer-container--new-table-container">
							<fieldset className="new-table-container--image-input">
								<legend>Table Image:</legend>
								<input
									type="file"
									accept="image/*"
									name="picture"
									onChange={(e) => onImageInputChange(e)}
								/>
							</fieldset>

							<fieldset className="new-table-container--seats-input">
								<legend>Number of seats:</legend>
								<input
									value={inputValue.tSeats}
									type="number"
									placeholder="1-99"
									min="1"
									max="99"
									onKeyDown={(e) => filteredKeys(e)}
									onChange={(e) => inputFieldHandler(e, "tSeats")}
								/>
								<button
									onClick={() =>
										setInputValue((prev) => ({
											...prev,
											tSeats: "",
										}))
									}
								>
									Clear
								</button>
							</fieldset>

							<fieldset className="new-table-container--shape-input">
								<legend>Shape (optional):</legend>
								<input
									value={inputValue.tShape}
									type="text"
									placeholder="i.e. 'Round' (max 12 chars)"
									minLength={0}
									maxLength={12}
									onKeyDown={(e) => filteredKeys(e, "lettersOnly")}
									onChange={(e) => inputFieldHandler(e, "tShape")}
								/>
							</fieldset>

							<fieldset className="new-table-container--placement-input">
								<legend>Placement:</legend>
								<input
									value={inputValue.tPlacement}
									type="text"
									placeholder="i.e. 1st Floor"
									minLength={0}
									maxLength={14}
									onKeyDown={(e) => filteredKeys(e, "lettersAndSpaces")}
									onChange={(e) => inputFieldHandler(e, "tPlacement")}
								/>
							</fieldset>
							{imageSize.isOk && (
								<div className="manageTables--new-table-submit-button">
									<button onClick={addNewTableHandler.bind(this, newTableData)}>
										Submit
									</button>
								</div>
							)}
						</div>
						{base64Image.img && (
							<ImagePreview
								pickedImageSrc={newTableBase64ImageData.img}
								pickedImageRef={pickedImageRef}
								onImgLoad={() =>
									checkImgSizeHandler(pickedImageRef, setImageSize)
								}
								onCropClick={onCropClickHandler}
								onResetClick={onResetClickHandler}
								canvasRef={imagePreviewCanvasRef}
							/>
						)}
					</div>
				</div>
				{status.message && <p>{status.message}</p>}
				{!imageSize.isOk && imageSize.message && <h2>{imageSize.message}</h2>}
			</div>
			<h1 id="tables-title">Restaurant Tables</h1>

			<TableCard restaurantTables={restaurantTables} tablesImgs={tablesImgs} />
		</>
	);
}

export default ManageTables;
