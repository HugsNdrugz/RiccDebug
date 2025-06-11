// utils.js

// Determine if debug mode is active based on localStorage.
// This allows conditional logging in development environments.
export const DEBUG_MODE = localStorage.getItem('rikkDebugMode') === 'true' || false;

/**
 * A centralized logger utility that respects the DEBUG_MODE.
 * Provides different levels of logging (log, error, warn, info).
 */
export const debugLogger = {
	/**
	 * Logs a general message if DEBUG_MODE is true.
	 * @param {string} component - The component or module logging the message (e.g., 'UIManager', 'GameState').
	 * @param {string} message - The main message to log.
	 * @param {any} [data] - Optional additional data to log.
	 */
	log: (component, message, data) => {
		if (DEBUG_MODE) console.log(`[${component}] ${message}`, data || '');
	},
	/**
	 * Logs an error message if DEBUG_MODE is true.
	 * @param {string} component - The component or module logging the error.
	 * @param {string} message - The main error message.
	 * @param {Error|any} [error] - The error object or additional error data.
	 */
	error: (component, message, error) => {
		if (DEBUG_MODE) console.error(`[${component} ERROR] ${message}`, error || '');
	},
	/**
	 * Logs a warning message if DEBUG_MODE is true.
	 * @param {string} component - The component or module logging the warning.
	 * @param {string} message - The main warning message.
	 * @param {any} [data] - Optional additional data to log.
	 */
	warn: (component, message, data) => {
		if (DEBUG_MODE) console.warn(`[${component} WARN] ${message}`, data || '');
	},
	/**
	 * Logs an informational message if DEBUG_MODE is true.
	 * @param {string} component - The component or module logging the information.
	 * @param {string} message - The main information message.
	 * @param {any} [data] - Optional additional data to log.
	 */
	info: (component, message, data) => {
		if (DEBUG_MODE) console.info(`[${component} INFO] ${message}`, data || '');
	}
};

/**
 * Returns a random element from an array.
 * @param {Array} arr - The array to pick from.
 * @returns {any|null} A random element, or null if the array is empty or invalid.
 */
export function getRandomElement(arr) {
	if (!arr || arr.length === 0) return null;
	return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Checks if localStorage is available and functional in the current browser environment.
 * Prevents errors in environments where localStorage might be restricted or unavailable (e.g., private browsing mode).
 * @returns {boolean} True if localStorage is available, false otherwise.
 */
export function isLocalStorageAvailable() {
	let storage;
	try {
		storage = window.localStorage;
		const x = '__storage_test__';
		storage.setItem(x, x); // Attempt to set an item
		storage.removeItem(x); // Attempt to remove it
		return true;
	} catch (e) {
		// Handle various DOMException codes for localStorage errors
		return e instanceof DOMException && (
				// everything except Firefox
				e.code === 22 ||
				// Firefox
				e.code === 1014 ||
				// test name field too, because code might not be present
				// everything except Firefox
				e.name === 'QuotaExceededError' ||
				// Firefox
				e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			// acknowledge QuotaExceededError only if there's something already stored
			(storage && storage.length !== 0);
	}
}

/**
 * Creates an HTML string for an image tag.
 * Primarily used by SlotGameManager for generating table content.
 * @param {object} options - Options for the image.
 * @param {string} options.src - The source URL of the image.
 * @param {number} options.width - The width of the image.
 * @param {string} [options.content] - Alt text/content for the image.
 * @returns {string} An HTML string representing an image tag.
 */
export const createImage = ({ src, width, content }) => {
	return `<img src="${src}" alt="${content || ''}" width="${width}" class="img-thumbnail rounded" />`;
};

/**
 * Creates an empty array of a specified length, populated with indices.
 * Useful for loops or creating new arrays with a set number of elements.
 * @param {number} length - The desired length of the array.
 * @returns {Array<number>} An array containing numbers from 0 to length-1.
 */
export const createEmptyArray = (length) => Array.from({ length }).map((_, i) => i);

/**
 * Converts a hexadecimal color string (e.g., "#RRGGBBAA") to an RGBA object.
 * @param {string} hex - The hexadecimal color string.
 * @param {number} [r=16] - The radix for parsing integers (defaults to 16 for hex).
 * @returns {object} An object with r, g, b, a properties (alpha defaults to 255 if not in hex string).
 */
export const hexToObject = (hex, r = 16) => ({
	r: parseInt(hex.slice(1, 3), r),
	g: parseInt(hex.slice(3, 5), r),
	b: parseInt(hex.slice(5, 7), r),
	a: parseInt(hex.slice(7, 9), r) || 255
});

/**
 * Converts a decimal number to a two-digit hexadecimal string.
 * Used for converting RGBA components back to hex.
 * @param {number} v - The decimal value.
 * @returns {string} A two-digit hexadecimal string.
 */
export const decToHex = (v) => Math.floor(v).toString(16).padStart(2, '0');

/**
 * Returns a Promise that resolves after a specified delay.
 * Useful for simple delays or sequential asynchronous operations.
 * @param {number} ms - The delay in milliseconds.
 * @returns {Promise<void>} A Promise that resolves after `ms` milliseconds.
 */
export const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));