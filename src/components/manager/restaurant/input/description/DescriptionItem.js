import "./DescriptionItem.css";

function DescriptionItem({
	title,
	inputStyle,
	inputType,
	letterSpacing,
	onChange,
	value,
}) {
	return (
		<fieldset className="input-container input-description-container">
			<legend>{title}</legend>
			<div className="input-container--description-innerContainer">
				{inputType === "text" ? (
					<textarea
						className={inputStyle}
						rows={4}
						onChange={(event) => onChange(event.target.value)}
						value={value}
					/>
				) : (
					<input
						className={inputStyle}
						style={{ letterSpacing: letterSpacing }}
						type={inputType}
						onChange={(event) => onChange(event.target.value)}
						value={value}
					/>
				)}
			</div>
		</fieldset>
	);
}

export default DescriptionItem;
