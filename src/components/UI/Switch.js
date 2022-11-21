import "./Switch.css";

function Switch({ isOn, handleToggle, onColor }) {
	return (
		<>
			<input
				className="react-switch-switch"
				type="checkbox"
				checked={isOn}
				readOnly
			/>
			<label
				className="react-switch-label"
				style={{ background: isOn && onColor }}
				onClick={handleToggle}
				checked={isOn}
			>
				<span className={`react-switch-button`} />
			</label>
		</>
	);
}

export default Switch;
