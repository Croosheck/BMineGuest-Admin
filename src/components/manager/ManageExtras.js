import "./ManageExtras.css";
import React, { useEffect, useState } from "react";
import AvailableExtraTile from "./AvailableExtraTile";
import { getAuth } from "firebase/auth";
import {
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	getDocs,
	onSnapshot,
	query,
	updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import {
	pickedExtra,
	resetAvailableExtrasGlobal,
	resetPickedExtras,
	setAvailableExtrasGlobal,
} from "../../redux/slices/restaurant";
import RestaurantExtraTile from "./RestaurantExtraTile";

function ManageExtras(props) {
	const [availableExtras, setAvailableExtras] = useState([]);
	const [extrasImages, setExtrasImages] = useState({});
	const [restaurantExtras, setRestaurantExtras] = useState([]);
	const { availableExtrasGlobal } = useSelector(
		(state) => state.restaurantReducer
	);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(resetAvailableExtrasGlobal());
		setAvailableExtras([]);

		getAuth().onAuthStateChanged((user) => {
			if (!user) return;
		});

		const qAvailExtras = query(collection(db, "extras"));
		async function getAvailableExtras() {
			setAvailableExtras([]);
			const querySnapshot = await getDocs(qAvailExtras);
			querySnapshot.forEach(async (doc) => {
				const extraImg = ref(storage, `extras/${doc.id}.png`);
				const extraImgUrl = await getDownloadURL(extraImg);
				setExtrasImages((prev) => ({ ...prev, [doc.id]: extraImgUrl }));

				//For default state (to reset picked item highlight)
				setAvailableExtras((prev) => [
					...prev,
					{ ...doc.data(), xUrl: extraImgUrl },
				]);

				dispatch(
					setAvailableExtrasGlobal({ ...doc.data(), xUrl: extraImgUrl })
				);
			});
		}

		// Realtime restaurant picked extras
		const unsub = onSnapshot(
			doc(db, "restaurants", auth.currentUser.uid),
			(doc) => {
				setRestaurantExtras([...doc.data().extras]);
			}
		);

		getAvailableExtras();
	}, [dispatch]);

	async function addNewExtraHandler(e, priceRef, item) {
		e.preventDefault();

		const restaurantRef = doc(db, "restaurants", auth.currentUser.uid);

		const itemPrice = !priceRef.current.value
			? 0
			: parseFloat(priceRef.current.value).toFixed(2);

		await updateDoc(restaurantRef, {
			extras: arrayUnion({
				xName: item.xName,
				xFileName: item.xFilename,
				xPrice: Number(itemPrice),
				xAvailability: item.xAvailability,
				xPicked: false,
			}),
		});

		//Clear price input
		priceRef.current.value = "";

		//Hide dropdown
		dispatch(resetPickedExtras(availableExtras));
	}

	async function onDeleteExtraHandler(e, item) {
		e.preventDefault();
		const restaurantRef = doc(db, "restaurants", auth.currentUser.uid);

		await updateDoc(restaurantRef, {
			extras: arrayRemove(item),
		});
	}

	return (
		<div className="manageExtras-container">
			<div className="manageExtras-inner-container">
				<div className="manageExtras-manage">
					<div className="manageExtras-available-extras-list">
						{availableExtrasGlobal.map((item, index) => {
							return (
								<AvailableExtraTile
									key={index}
									label={item.xName}
									url={item.xUrl}
									picked={item.xPicked}
									onClick={() => {
										dispatch(resetPickedExtras(availableExtras));
										dispatch(pickedExtra(item.xName));
									}}
									onSubmit={(e, priceRef) =>
										addNewExtraHandler(e, priceRef, item)
									}
								/>
							);
						})}
					</div>
				</div>
				<div className="manageExtras-manage">
					<div className="manageExtras-available-extras-list">
						{restaurantExtras.map((item, index) => {
							return (
								<RestaurantExtraTile
									key={index}
									label={item.xName}
									xPrice={item.xPrice}
									url={extrasImages[item.xFileName.slice(0, -4)]}
									onDelete={(e) => onDeleteExtraHandler(e, item)}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ManageExtras;
