import { useEffect, useRef, useState } from "react";
import "./ManageTables.css";

import uploadFile from "../../../util/storage";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import TableImageModal from "../../reservations/details/TableImageModal";

import "react-image-crop/dist/ReactCrop.css";
import { extractImageFileExtensionFromBase64 } from "../../../util/base64Reusable";
import { useDispatch, useSelector } from "react-redux";
import { setNewTableBase64ImageData } from "../../../redux/slices/restaurant";
import { filteredKeys } from "./utils/reusable";
import ImagePreview from "./newTable/ImagePreview";

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

	const { newTableBase64ImageData } = useSelector(
		(state) => state.restaurantReducer
	);

	const dispatch = useDispatch();

	const pickedImageRef = useRef();
	const imagePreviewCanvasRef = useRef();

	const restaurantRef = doc(db, "restaurants", auth.currentUser.uid);

	useEffect(() => {
		function getRestaurantData() {
			onSnapshot(restaurantRef, (doc) => {
				const tables = doc.data().tables;
				setRestaurantTables(tables);
			});
		}

		getRestaurantData();
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
		const newTableId = renameNewTable(restaurantTables);

		setNewTableData((prev) => ({
			...prev,
			...inputValue,
		}));

		//Insert the table image into the Storage
		await uploadFile(
			// data.image,
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
		<div className="manageTables-container">
			{imageModal.isVisible && (
				<TableImageModal
					tableModalVisible={true}
					tableImgUrl={newTableData.image}
					onModalClose={() => setImageModal({ isVisible: false, imgUrl: null })}
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
					</div>
					{newTableData.image && (
						<ImagePreview
							pickedImageSrc={newTableBase64ImageData.img}
							pickedImageRef={pickedImageRef}
							onCropClick={onCropClickHandler}
							onResetClick={onResetClickHandler}
							canvasRef={imagePreviewCanvasRef}
						/>
					)}
				</div>
			</div>
			<div className="manageTables--new-table-submit-button">
				<button onClick={addNewTableHandler.bind(this, newTableData)}>
					Submit
				</button>
			</div>
			{/* <div className="manageTables--tables-container"></div> */}
		</div>
	);
}

export default ManageTables;
