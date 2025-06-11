// phone_launcher_drag.js
// This module provides the core logic for drag-and-drop functionality on the phone launcher.

let draggedItem = null; // Stores the HTML element currently being dragged
let dragOverContainer = null; // Stores the HTML element currently being dragged over
let onAppOrderChangedCallback = null; // Callback to notify the UIManager (or script.js) of order changes

/**
 * Initializes the draggable grid system for the phone launcher.
 * @param {function} callback - A function to be called when the app order changes (receives pageId, newOrder array).
 */
export function initDraggableGrid(callback) {
	onAppOrderChangedCallback = callback;
	debugLogger.log('phone_launcher_drag', 'Draggable grid module initialized.');
}

/**
 * Handles the `dragstart` event for an draggable app icon.
 * Sets `draggedItem` and prepares the drag image.
 * @param {DragEvent} event - The dragstart event.
 * @param {HTMLElement} appElement - The app icon element being dragged.
 */
export function handleDragStart(event, appElement) {
	draggedItem = appElement;
	event.dataTransfer.effectAllowed = 'move'; // Specifies the type of drag operation
	event.dataTransfer.setData('text/plain', appElement.dataset.appId); // Set data (e.g., app ID)
	
	// Create a temporary clone for the drag image (optional, but good for custom visuals)
	const clone = appElement.cloneNode(true);
	clone.classList.add('drag-image-clone'); // Add a class for specific styling
	document.body.appendChild(clone);
	// Set the custom drag image, then remove the clone after it's captured
	event.dataTransfer.setDragImage(clone, clone.offsetWidth / 2, clone.offsetHeight / 2);
	requestAnimationFrame(() => {
		document.body.removeChild(clone);
	});
	
	// Add 'dragging' class to the original element to hide it during drag
	appElement.classList.add('dragging');
	debugLogger.log('phone_launcher_drag', `Drag Start: ${appElement.dataset.appId}`);
}

/**
 * Handles the `dragover` event for drag-and-drop targets (app icons or empty grid areas).
 * Prevents default behavior to allow a drop and updates `dragOverContainer`.
 * @param {DragEvent} event - The dragover event.
 * @param {HTMLElement} containerElement - The element being dragged over (either an app icon or the app grid).
 */
export function handleDragOver(event, containerElement) {
	event.preventDefault(); // Essential to allow dropping
	event.dataTransfer.dropEffect = 'move'; // Visual feedback for 'move' operation
	dragOverContainer = containerElement; // Keep track of the current target
	
	// Add 'drag-over' class for visual feedback (e.g., highlighting target)
	if (containerElement.classList.contains('app-icon')) {
		containerElement.classList.add('drag-over');
	} else if (containerElement.classList.contains('app-grid')) {
		// You might add a different class for grid-level drag-over feedback
		containerElement.classList.add('drag-over-grid');
	}
	// debugLogger.log('phone_launcher_drag', `Drag Over: ${containerElement.id || containerElement.className}`);
	return false;
}

/**
 * Handles the `dragleave` event. Removes visual feedback when leaving a drop target.
 * @param {DragEvent} event - The dragleave event.
 * @param {HTMLElement} containerElement - The element that the drag is leaving.
 */
export function handleDragLeave(event, containerElement) {
	// Remove 'drag-over' class when drag leaves the element
	if (containerElement.classList.contains('app-icon')) {
		containerElement.classList.remove('drag-over');
	} else if (containerElement.classList.contains('app-grid')) {
		containerElement.classList.remove('drag-over-grid');
	}
	// debugLogger.log('phone_launcher_drag', `Drag Leave: ${containerElement.id || containerElement.className}`);
}


/**
 * Handles the `drop` event when a draggable item is released.
 * Inserts the dragged item into its new position.
 * @param {DragEvent} event - The drop event.
 * @param {HTMLElement} targetAppElementOrGrid - The element where the dragged item was dropped (an app icon or the grid itself).
 */
export function handleDrop(event, targetAppElementOrGrid) {
	event.preventDefault();
	if (!draggedItem) return; // No item being dragged
	
	const targetIsApp = targetAppElementOrGrid.classList.contains('app-icon');
	// Find the parent app-grid element regardless of whether drop was on an icon or empty grid space
	const parentGrid = targetIsApp ? targetAppElementOrGrid.closest('.app-grid') : targetAppElementOrGrid;
	
	if (parentGrid && draggedItem !== targetAppElementOrGrid) { // Ensure drop is valid and not on itself
		// Remove 'dragging' class from the original element to make it visible again
		draggedItem.classList.remove('dragging');
		draggedItem.style.visibility = ''; // Restore visibility
		
		// Determine insertion point
		if (targetIsApp) {
			// Drop occurred over another app icon, insert before it
			parentGrid.insertBefore(draggedItem, targetAppElementOrGrid);
		} else {
			// Drop occurred over the empty grid space, append to the end
			parentGrid.appendChild(draggedItem);
		}
		debugLogger.log('phone_launcher_drag', `Dropped: ${draggedItem.dataset.appId} into/before: ${targetAppElementOrGrid.dataset.appId || 'grid'}`);
		
		// Notify the main application logic (UIManager/script.js) of the order change
		persistAppOrder(parentGrid);
	} else {
		// If drop was invalid (e.g., outside a grid), ensure original element is visible again
		if (draggedItem) {
			draggedItem.classList.remove('dragging');
			draggedItem.style.visibility = '';
		}
		debugLogger.warn('phone_launcher_drag', `Invalid drop for ${draggedItem?.dataset.appId || 'unknown item'}.`);
	}
	
	// Clean up drag state
	handleDragEnd(event, draggedItem);
}

/**
 * Handles the `dragend` event (fires when the drag operation finishes, regardless of success).
 * Cleans up any temporary styling or state.
 * @param {DragEvent} event - The dragend event.
 * @param {HTMLElement} appElement - The app icon element that was dragged.
 */
export function handleDragEnd(event, appElement) {
	// Remove 'dragging' class and restore visibility if it was not handled by handleDrop
	if (appElement) { // appElement might be null if handleDrop already nulled draggedItem and called this.
		appElement.classList.remove('dragging');
		appElement.style.visibility = '';
	}
	// Remove drag-over classes from any elements that might still have them
	document.querySelectorAll('.app-icon.drag-over').forEach(icon => icon.classList.remove('drag-over'));
	document.querySelectorAll('.app-grid.drag-over-grid').forEach(grid => grid.classList.remove('drag-over-grid'));
	
	// Reset module-level drag state variables
	draggedItem = null;
	dragOverContainer = null;
	debugLogger.log('phone_launcher_drag', `Drag End.`);
}

/**
 * Helper function to extract the new order of app icons from an `app-grid` element.
 * Invokes the `onAppOrderChangedCallback` if available.
 * @param {HTMLElement} appGridElement - The `div.app-grid` element whose children's order has changed.
 */
function persistAppOrder(appGridElement) {
	const pageElement = appGridElement.closest('.launcher-page');
	if (!pageElement || !onAppOrderChangedCallback) {
		debugLogger.warn('phone_launcher_drag', 'Cannot persist app order: page element or callback missing.');
		return;
	}
	
	const pageId = pageElement.dataset.pageId; // Get the ID of the launcher page
	const appIcons = Array.from(appGridElement.querySelectorAll('.app-icon'));
	const newOrder = appIcons.map(icon => icon.dataset.appId); // Get the IDs of apps in their new order
	
	debugLogger.log('phone_launcher_drag', `Persisting order for page: ${pageId}. New order: ${newOrder.join(', ')}`);
	onAppOrderChangedCallback(pageId, newOrder); // Call the callback to update the main game state
}