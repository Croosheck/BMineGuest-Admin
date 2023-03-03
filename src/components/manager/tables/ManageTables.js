import { useEffect, useState } from "react";
import "./ManageTables.css";

import uploadFile from "../../../util/storage";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";

function ManageTables() {
	const [restaurantTables, setRestaurantTables] = useState([]);
	const [tableImage, setTableImage] = useState();

	const restaurantRef = doc(db, "restaurants", auth.currentUser.uid);

	useEffect(() => {
		function getRestaurantData() {
			onSnapshot(restaurantRef, (doc) => {
				const tables = doc.data().tables;
				setRestaurantTables(tables);
			});
		}

		getRestaurantData();
	}, []);

	function renameNewTable(restTables) {
		let newTableId = Math.floor(Math.random() * Math.pow(10, 10));

		const isAny = restTables.some((table) => table.Id === newTableId);

		if (isAny) {
			newTableId = Math.floor(Math.random() * Math.pow(10, 10));
			return renameNewTable(restTables);
		}

		return newTableId;
	}

	async function uploadImg(file) {
		const newTableId = renameNewTable(restaurantTables);

		await uploadFile(file, "addTable", { tId: newTableId });
	}

	return (
		<div className="manageTables-container">
			<div className="manageTables--new-table-container">
				<fieldset className="new-table-container--image-input">
					<legend>Table Image:</legend>
					<input
						type="file"
						capture="environment"
						accept="image/*"
						name="picture"
						onChange={(e) => {
							const imgURL = URL.createObjectURL(e.currentTarget.files[0]);
							setTableImage(imgURL);
						}}
					/>
				</fieldset>
				{tableImage && (
					<img
						className="new-table-container--image-preview"
						src={tableImage}
						alt="Picked table"
					/>
				)}
			</div>
			<button
				onClick={() => {
					uploadImg(tableImage);
				}}
			>
				Upload
			</button>
			<div className="manageTables--tables-container"></div>
		</div>
	);
}

export default ManageTables;
