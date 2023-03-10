import "./WarningModal.css";

function WarningModal({
	buttonAbort = { title: "", onClick: () => {} },
	buttonConfirm = { title: "", onClick: () => {} },
	message = "Are you sure?",
}) {
	return (
		<div className="warning-modal--backdrop">
			<div className="warning-modal--content-container">
				<div className="warning-modal--title-container">
					<pre>{message}</pre>
				</div>
				<div className="warning-modal--buttons-container">
					<button onClick={buttonAbort.onClick} id="cancel">
						{buttonAbort.title}
					</button>
					<button onClick={buttonConfirm.onClick} id="delete">
						{buttonConfirm.title}
					</button>
				</div>
			</div>
		</div>
	);
}

export default WarningModal;
