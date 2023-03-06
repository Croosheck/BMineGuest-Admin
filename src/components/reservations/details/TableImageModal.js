import "./TableImageModal.css";
import { VscChromeClose } from "react-icons/vsc";

function TableImageModal({
	tableModalVisible = Boolean(),
	onModalClose = () => {},
	tableImgUrl = String(),
	tId = String(),
	tPlacement = String(),
	tSeats,
}) {
	function getClassNameHandler(e) {
		if (e.target.className === "table-modal-img") return;
		tableImgCloseHandler();
	}

	function tableImgCloseHandler() {
		document.removeEventListener("click", getClassNameHandler);

		onModalClose();
	}
	function onBackdropClickHandler() {
		document.addEventListener("click", getClassNameHandler);
	}

	const isTextData = Boolean(tSeats && tPlacement && tId);

	return (
		<>
			{tableModalVisible && (
				<div
					className="modal--backdrop-container"
					onClick={onBackdropClickHandler}
				>
					<div className="table-image--modal-container">
						<div id="table-modal--close" onClick={tableImgCloseHandler}>
							<VscChromeClose color="#FFFFFF" size={26} />
						</div>
						<img className="table-modal-img" src={tableImgUrl} alt="Table" />
						<div
							className="modal--table-details"
							style={{
								padding: !isTextData && 0,
							}}
						>
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
