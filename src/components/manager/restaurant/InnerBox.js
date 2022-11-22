import "./InnerBox.css";

function InnerBox({ children, title, wrap }) {
	if (title)
		return (
			<fieldset className="manage-restaurant--inner-box">
				<legend>{title}</legend>
				<div className="inner-box--inner-container ">
					<ul className={`${wrap && "inner-box--inner-container--wrap"}`}>
						{children}
					</ul>
				</div>
			</fieldset>
		);

	return (
		<div className="manage-restaurant--inner-box">
			<div className="inner-box--inner-container inner-box--inner-container--wrap">
				<ul className={`${wrap && "inner-box--inner-container--wrap"}`}>
					{children}
				</ul>
			</div>
		</div>
	);
}

export default InnerBox;
