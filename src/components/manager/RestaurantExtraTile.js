import { useRef } from "react";
import "./AvailableExtraTile.css";
import "./RestaurantExtraTile.css";

function RestaurantExtraTile({
	label,
	url,
	picked,
	onClick,
	onSubmit,
	onDelete,
	xPrice,
}) {
	const priceRef = useRef();

	const extraImage = url ? (
		<img src={url} alt="Extra Item" />
	) : (
		<div className="extras-nofile">Image loading...</div>
	);

	return (
		<>
			<div
				className="available-extras-item restaurant-extras-item"
				onClick={onClick}
			>
				<div className="extras-item-picture">{extraImage}</div>
				<div className="extras-item-label-container">
					<p className="extras-item-label">{label}</p>
				</div>
				<div className="restaurantExtra-dropdown-content">
					<form
						className="restaurantExtra-dropdown-inner-content"
						// onSubmit={(e, value) => onSubmit(e, priceRef, value)}
					>
						<h6>Price: {xPrice}</h6>
						<div className="restaurantExtra-buttons-container">
							{/* <button type="submit">Add</button> */}
							<button onClick={(e) => onDelete(e)}>Delete</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default RestaurantExtraTile;
