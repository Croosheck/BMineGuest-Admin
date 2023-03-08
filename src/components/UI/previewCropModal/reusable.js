export function isRequiredCropMinHandler(cropPercentage) {
	const { width, height } = cropPercentage;

	const minWidth = width > 55;
	const minHeight = height > 40;

	if (minWidth && minHeight) {
		const minWidthRatio = width / height <= 1.5 && width / height >= 1;
		const minHeightRatio = height / width <= 1.5 && height / width >= 1;

		if (minWidthRatio || minHeightRatio) return true;
	}

	return false;
}
