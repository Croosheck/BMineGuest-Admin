import { useEffect, useRef, useState } from "react";
import "./ManageTables.css";

import uploadFile from "../../../util/storage";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import TableImageModal from "../../reservations/details/TableImageModal";

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
	base64StringtoFile,
	extractImageFileExtensionFromBase64,
	image64toCanvasRef,
} from "../../../util/base64Reusable";

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
	const [crop, setCrop] = useState();
	const [completedCrop, setCompletedCrop] = useState();

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

	async function addNewTableHandler(
		data = {
			...newTableData,
		}
	) {
		const newTableId = renameNewTable(restaurantTables);

		setNewTableData((prev) => ({
			...prev,
			...inputValue,
		}));

		//cropped image
		const canvasRef = imagePreviewCanvasRef.current;
		const imageData64 = canvasRef.toDataURL("image/" + base64Image.imgExt);
		const croppedImg = URL.createObjectURL(
			base64StringtoFile(imageData64, newTableId)
		);

		//Insert the table image into the Storage
		await uploadFile(
			// data.image,
			croppedImg,
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

	function filteredKeys(e, type = "numbersOnly") {
		if (!/[0-9]/.test(e.key) && type === "numbersOnly") {
			e.preventDefault();
		}
		if (!/[a-zA-Z]/.test(e.key) && type === "lettersOnly") {
			e.preventDefault();
		}
		if (!/[a-zA-Z\s]/.test(e.key) && type === "lettersAndSpaces") {
			e.preventDefault();
		}
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
	function imageToBase64Handler(file) {
		// imageBase64Data
		const currentFile = file;
		const myFileItemReader = new FileReader();
		myFileItemReader.addEventListener("load", () => {
			const myResult = myFileItemReader.result;
			setBase64Image({
				img: myResult,
				imgExt: extractImageFileExtensionFromBase64(myResult),
			});
		});
		myFileItemReader.readAsDataURL(currentFile);
	}

	function onChangeCropHandler(crop) {
		setCrop(crop);
	}

	function onCompleteCropHandler(crop, pixelCrop) {
		const canvasRef = imagePreviewCanvasRef.current;
		const imgSrc = base64Image.img;

		image64toCanvasRef(canvasRef, imgSrc, crop, pickedImageRef);
	}

	return (
		<div className="manageTables-container">
			{imageModal.isVisible && (
				<TableImageModal
					tableModalVisible={true}
					tableImgUrl={newTableData.image}
					onModalClose={() => setImageModal({ isVisible: false, imgUrl: null })}
				/>
			)}
			<div className="manageTables--new-table-outer-container">
				<div className="new-table-outer-container">
					<div className="new-table-outer-container--new-table-container">
						<fieldset className="new-table-container--image-input">
							<legend>Table Image:</legend>
							<input
								type="file"
								// capture="environment"
								accept="image/*"
								name="picture"
								onChange={(e) => {
									imageToBase64Handler(e.currentTarget.files[0]);

									const imgURL = URL.createObjectURL(...e.currentTarget.files);
									setNewTableData((prev) => ({
										...prev,
										image: imgURL,
									}));
								}}
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
						<div className="new-table-outer-container--image-container">
							<ReactCrop
								crop={crop}
								onChange={onChangeCropHandler}
								onComplete={onCompleteCropHandler}
							>
								<img
									className="new-table-outer-container--image-preview"
									// src={newTableData.image}
									src={base64Image.img}
									alt="Picked table"
									ref={pickedImageRef}
								/>
							</ReactCrop>
							<button
								onClick={() =>
									setImageModal({
										isVisible: true,
										imgUrl: newTableData.image,
									})
								}
							>
								Preview
							</button>
							<canvas ref={imagePreviewCanvasRef} />
						</div>
					)}
				</div>
			</div>
			<div className="manageTables--new-table-submit-button">
				<button
					onClick={() => {
						// addNewTableHandler(newTableData);
					}}
				>
					Submit
				</button>
			</div>
			{/* <div className="manageTables--tables-container"></div> */}
		</div>
	);
}

export default ManageTables;
