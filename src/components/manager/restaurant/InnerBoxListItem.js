import "./InnerBoxListItem.css";
import Switch from "../../UI/Switch";

function InnerBoxListItem({ name, handleToggle, switchValue, toggle, status }) {
	// const statusToggle = switchValue ? (
	// 	<div>{status.active}</div>
	// ) : (
	// 	<div>{status.inactive}</div>
	// );

	return (
		<li>
			<div>
				<div>{name}</div>
				<div>{status}</div>
				<div>
					{toggle && (
						<Switch
							isOn={switchValue}
							handleToggle={handleToggle}
							onColor="#06D6A0"
						/>
					)}
				</div>
			</div>
		</li>
	);
}

export default InnerBoxListItem;
