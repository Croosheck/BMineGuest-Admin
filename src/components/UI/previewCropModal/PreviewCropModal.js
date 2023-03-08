import "./PreviewCropModal.css";
import { useRef, useState } from "react";

import { VscChromeClose } from "react-icons/vsc";

import {
	base64StringtoFile,
	image64toCanvasRef,
} from "../../../util/base64Reusable";

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { useDispatch } from "react-redux";
import { setNewTableBase64ImageData } from "../../../redux/slices/restaurant";

import { minTableImageSize } from "../../../util/constants";

const imgPlaceholder = require("../../../assets/imgs/imagePlaceholders/default.jpg");

function PreviewCropModal({
	tableModalVisible = Boolean(),
	onModalClose = () => {},
	tableImgUrl = imgPlaceholder,
	tId = String(),
	tPlacement = String(),
	tSeats = Number(),
	mode = "preview",
	forCropData = {
		base64Img: "",
		imgExt: "",
	},
}) {
	const [crop, setCrop] = useState();
	const [isButtonActive, setIsButtonActive] = useState(false);
	const [minImgSize, setMinImgSize] = useState({
		w: 0,
		h: 0,
	});

	const dispatch = useDispatch();

	const imagePreviewCanvasRef = useRef();
	const pickedImageRef = useRef();

	const isTextData = Boolean(tSeats && tPlacement && tId);

	function getClassNameHandler(e) {
		if (e.target.className !== "modal--backdrop-container") return;

		onCloseClickHandler();
	}
	function onCloseClickHandler() {
		document.removeEventListener("mousedown", getClassNameHandler);

		onModalClose();
	}
	function onBackdropClickHandler() {
		document.addEventListener("mousedown", getClassNameHandler);
	}

	const buttonInactive = isButtonActive > 0 ? 1 : 0.2;
	function onChangeCropHandler(crop, cropPercent) {
		// const isRequiredCropMin = isRequiredCropMinHandler(cropPercent);
		// setIsButtonActive(isRequiredCropMin);

		setCrop(crop);
	}

	function onCompleteCropHandler(crop, pixelCrop) {
		const canvasRef = imagePreviewCanvasRef.current;
		const imgSrc = forCropData.base64Img;

		image64toCanvasRef(canvasRef, imgSrc, crop, pickedImageRef);
	}

	function onSubmitCroppedImageHandler() {
		// if (!isButtonActive) return;

		const canvasRef = imagePreviewCanvasRef.current;
		const imageData64 = canvasRef.toDataURL("image/" + forCropData.imgExt);
		const croppedImg = URL.createObjectURL(
			base64StringtoFile(imageData64, "cropped")
		);

		dispatch(
			setNewTableBase64ImageData({
				img: croppedImg,
				imgExt: forCropData.imgExt,
			})
		);

		onCloseClickHandler();
	}

	function minImageSize() {
		const imgWidth = pickedImageRef.current.naturalWidth;

		const imageContainerWidth = document.querySelector(
			".table-image--modal-container"
		).clientWidth;

		const calculatedCropMinWidth = Math.ceil(
			(minTableImageSize.width / imgWidth) * imageContainerWidth
		);

		setMinImgSize((prev) => ({ ...prev, w: calculatedCropMinWidth }));

		return;
	}

	return (
		<>
			{tableModalVisible && (
				<div
					className="modal--backdrop-container"
					onClick={onBackdropClickHandler}
				>
					<div className="table-image--modal-container">
						{mode === "preview" && (
							<div id="table-modal--close" onClick={onCloseClickHandler}>
								<VscChromeClose color="#FFFFFF" size={26} />
							</div>
						)}
						{mode === "preview" && (
							<img className="table-modal-img" src={tableImgUrl} alt="Table" />
						)}
						{mode === "crop" && (
							<ReactCrop
								crop={crop}
								onChange={onChangeCropHandler}
								onComplete={onCompleteCropHandler}
								ruleOfThirds
								aspect={4 / 3}
								minWidth={minImgSize.w}
							>
								<img
									className="table-modal-img"
									src={forCropData.base64Img}
									alt="Table"
									ref={pickedImageRef}
									onLoad={minImageSize}
								/>
							</ReactCrop>
						)}

						<div
							className="modal--table-details"
							style={{
								padding: !isTextData && 0,
							}}
						>
							{mode === "crop" && (
								<>
									<canvas
										className="modal--table--canvas-preview"
										ref={imagePreviewCanvasRef}
									/>
									<div className="modal--crop-buttons-container">
										<button
											className="modal--crop--cancel-button"
											onClick={onCloseClickHandler}
										>
											CANCEL
										</button>
										<button
											className="modal--crop--submit-button"
											onClick={crop && onSubmitCroppedImageHandler}
											// style={{ opacity: buttonInactive }}
										>
											SUBMIT
										</button>
									</div>
								</>
							)}
							{isTextData && (
								<>
									<p>Seats: {tSeats}</p>
									<p>{tPlacement}</p>
									<p>ID: {tId}</p>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default PreviewCropModal;
