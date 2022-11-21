import "./InnerBox.css";

function InnerBox({ children, title }) {
	if (title)
		return (
			<fieldset className="manage-restaurant--inner-box">
				<legend>{title}</legend>
				<div className="inner-box--inner-container">
					<ul>{children}</ul>
				</div>
			</fieldset>
		);

	return (
		<div className="manage-restaurant--inner-box">
			<div className="inner-box--inner-container">
				<ul>{children}</ul>
			</div>
		</div>
	);
}

export default InnerBox;
