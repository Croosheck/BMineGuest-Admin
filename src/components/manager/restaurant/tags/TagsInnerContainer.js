import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { auth, db } from "../../../../firebase";
import TagItem from "./TagItem";
import "./TagsInnerContainer.css";

function TagsInnerContainer({ availableTags, pickedTags }) {
	const restaurantTagsRef = doc(db, "restaurants", auth.currentUser.uid);

	async function onAvailTagClickHandler(tag) {
		if (pickedTags.some((tagItem) => tag.tagName === tagItem.tagName)) return;

		await updateDoc(restaurantTagsRef, {
			restaurantTags: arrayUnion(tag),
		});
	}

	async function onPickedTagClickHandler(tag) {
		await updateDoc(restaurantTagsRef, {
			restaurantTags: arrayRemove(tag),
		});
	}

	return (
		<div className="tags--outer-container">
			<fieldset>
				<legend>Available Tags</legend>
				<div>
					{availableTags.map((tag, i) => (
						<TagItem
							key={i}
							available
							title={tag.tagName}
							onClick={onAvailTagClickHandler.bind(this, tag)}
						/>
					))}
				</div>
			</fieldset>
			<fieldset>
				<legend>Picked Tags</legend>
				<TransitionGroup component="div">
					{pickedTags.map((tag, i) => (
						<CSSTransition key={tag.tagName} timeout={800} classNames="tag">
							<TagItem
								key={i}
								picked
								title={tag.tagName}
								onClick={onPickedTagClickHandler.bind(this, tag)}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			</fieldset>
		</div>
	);
}

export default TagsInnerContainer;
