import { minTableImageSize } from "../../../../util/constants";

export function filteredKeys(e, type = "numbersOnly") {
	if (!/[0-9]/.test(e.key) && type === "numbersOnly") {
		e.preventDefault();
	}
	if (!/[a-zA-Z]/.test(e.key) && type === "lettersOnly") {
		e.preventDefault();
	}
	if (!/[a-zA-Z0-9\s]/.test(e.key) && type === "lettersAndSpaces") {
		e.preventDefault();
	}
}

export function checkImgSizeHandler(pickedImageRef, setState = () => {}) {
	const { naturalWidth: w, naturalHeight: h } = pickedImageRef.current;
	const minWidth = minTableImageSize.width;
	const minHeight = minTableImageSize.height;

	if (w >= minWidth && h >= minHeight) {
		setState({
			w: w,
			h: h,
			isOk: true,
			message: "",
		});

		return;
	}

	setState({
		w: w,
		h: h,
		isOk: false,
		message: `Image is too small. Minimal required size is: ${minWidth}x${minHeight} (width x height)`,
	});

	return;
}
