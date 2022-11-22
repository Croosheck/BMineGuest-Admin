import "./ManageLimitButton.css";

function ManageLimitButton({ children, onClick }) {
	return (
		<div className="manage-limit-button--container">
			<button onClick={onClick}>{children}</button>
		</div>
	);
}

export default ManageLimitButton;
