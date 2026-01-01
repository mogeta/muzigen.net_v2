/**
 * Extracts tags from a Firestore document, supporting both
 * the new tags array and legacy tag string field.
 *
 * @param data - Firestore document data
 * @returns Array of tag strings
 */
export function extractTags(data: any): string[] {
	const tags = data.tags || (data.tag ? [data.tag] : []);
	return Array.isArray(tags) ? tags : [];
}

/**
 * Validates if a tag is a non-empty string.
 *
 * @param tag - Tag value to validate
 * @returns true if tag is a valid non-empty string
 */
export function isValidTag(tag: any): tag is string {
	return tag && typeof tag === 'string';
}
