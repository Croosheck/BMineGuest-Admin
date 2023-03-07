import "./ImagePreview.css";

function ImagePreview({
	onCropClick = () => {},
	onResetClick = () => {},
	pickedImageSrc,
	pickedImageRef,
	canvasRef,
}) {
	return (
		<div className="new-table-outer-container--image-container">
			<img
				className="new-table-outer-container--image-preview"
				src={pickedImageSrc}
				ref={pickedImageRef}
				alt="Picked table"
			/>
			<div className="newTable-image--buttons-container">
				<button onClick={onCropClick} className="newTable-image--crop-button">
					Crop
				</button>
				<button onClick={onResetClick} className="newTable-image--reset-button">
					Reset
				</button>
			</div>
			<canvas className="manageTable--canvas-preview" ref={canvasRef} />
		</div>
	);
}

export default ImagePreview;
