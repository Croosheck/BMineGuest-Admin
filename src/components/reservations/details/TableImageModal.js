import { useRef, useState } from "react";
import "./TableImageModal.css";
import { VscChromeClose } from "react-icons/vsc";
import {
	base64StringtoFile,
	image64toCanvasRef,
} from "../../../util/base64Reusable";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDispatch } from "react-redux";
import { setNewTableBase64ImageData } from "../../../redux/slices/restaurant";

function TableImageModal({
	tableModalVisible = Boolean(),
	onModalClose = () => {},
	tableImgUrl = String(),
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

	const dispatch = useDispatch();

	const imagePreviewCanvasRef = useRef();
	const pickedImageRef = useRef();

	const isTextData = Boolean(tSeats && tPlacement && tId);

	const buttonInactive = !crop ? 0.2 : 1;

	function getClassNameHandler(e) {
		if (e.target.className !== "modal--backdrop-container") return;

		onCloseClickHandler();
	}
	function onCloseClickHandler() {
		document.removeEventListener("click", getClassNameHandler);

		onModalClose();
	}
	function onBackdropClickHandler() {
		document.addEventListener("click", getClassNameHandler);
	}

	function onChangeCropHandler(crop) {
		setCrop(crop);
	}

	function onCompleteCropHandler(crop, pixelCrop) {
		const canvasRef = imagePreviewCanvasRef.current;
		const imgSrc = forCropData.base64Img;

		image64toCanvasRef(canvasRef, imgSrc, crop, pickedImageRef);
	}

	function onSubmitCroppedImageHandler() {
		if (!crop) return;

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
							>
								<img
									className="table-modal-img"
									src={forCropData.base64Img}
									alt="Table"
									ref={pickedImageRef}
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
											style={{ opacity: buttonInactive }}
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

export default TableImageModal;
