import "./TagItem.css";

function TagItem({ title, available, picked, onClick }) {
	return (
		<>
			{available && (
				<div className="tag-container tag-available" onClick={onClick}>
					<div className="tag-title ">{title}</div>
				</div>
			)}
			{picked && (
				<div className="tag-container tag-picked" onClick={onClick}>
					<div className="tag-title ">{title}</div>
				</div>
			)}
		</>
	);
}

export default TagItem;
