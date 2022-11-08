import { useRef } from "react";
import "./AvailableExtraTile.css";

function AvailableExtraTile({ label, url, picked, onClick, onSubmit }) {
	const priceRef = useRef();

	const extraImage = url ? (
		<img src={url} alt="Extra Item" />
	) : (
		<div className="extras-nofile">Image loading...</div>
	);

	return (
		<>
			<div
				className={`available-extras-item ${
					picked && "available-extras-dropdown-active"
				}`}
				onClick={onClick}
			>
				<div className="extras-item-picture">{extraImage}</div>
				<div className="extras-item-label-container">
					<p className="extras-item-label">{label}</p>
				</div>
				<div
					className={`availableExtra-dropdown-content ${
						picked && "available-extras-dropdown-active"
					}`}
				>
					<form
						className="availableExtra-dropdown-inner-content"
						onSubmit={(e, value) => onSubmit(e, priceRef, value)}
					>
						<h6>Price:</h6>
						<input
							placeholder="0.00"
							ref={priceRef}
							type="number"
							step={0.01}
						/>
						<button type="submit">Add</button>
					</form>
				</div>
			</div>
		</>
	);
}

export default AvailableExtraTile;
