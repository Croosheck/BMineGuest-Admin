import "./TableImageModal.css";

function TableImageModal({
	tableModalVisible,
	onModalClose,
	tableImgUrl,
	tId,
	tPlacement,
	tSeats,
}) {
	function getClassNameHandler(e) {
		if (e.target.className === "table-modal-img") return;
		tableImgCloseHandler();
	}

	function tableImgCloseHandler() {
		onModalClose();

		document.removeEventListener("click", getClassNameHandler);
	}
	function onBackdropClickHandler() {
		document.addEventListener("click", getClassNameHandler);
	}

	return (
		<>
			{tableModalVisible && (
				<div
					className="modal--backdrop-container"
					onClick={onBackdropClickHandler}
				>
					<div className="table-image--modal-container">
						<div id="table-modal--close" onClick={tableImgCloseHandler}>
							X
						</div>
						<img className="table-modal-img" src={tableImgUrl} alt="Table" />
						<div className="modal--table-details">
							<p>Seats: {tSeats}</p>
							<p>{tPlacement}</p>
							<p>ID: {tId}</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default TableImageModal;
