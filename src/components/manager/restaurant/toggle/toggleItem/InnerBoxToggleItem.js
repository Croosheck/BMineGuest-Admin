import "./InnerBoxToggleItem.css";
import Switch from "../../../../UI/Switch";

function InnerBoxToggleItem({ name, handleToggle, isOn, toggle, status }) {
	return (
		<li>
			<div>
				<div>{name}</div>
				<div>{status}</div>
				<div>
					{toggle && (
						<Switch isOn={isOn} handleToggle={handleToggle} onColor="#06D6A0" />
					)}
				</div>
			</div>
		</li>
	);
}

export default InnerBoxToggleItem;
