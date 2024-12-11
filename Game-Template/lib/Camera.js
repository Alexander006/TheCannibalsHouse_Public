import Vector from "./Vector.js";

export default class Camera {
	/**
	 * The "camera" in video games boils down to a small section of the space the player can look at
	 * at any given time. The camera's position is used to translate the canvas based on where the
	 * subject currently is in the scene.
	 *
	 * @param {Object} subject The camera will follow the subject. Subject must have a position vector.
	 * @param {Vector} scene The entire space the camera can potentially look at.
	 * @param {Vector} viewport How much of the scene the player can look at at any one time.
	 */
	constructor(subject, viewport) {
		this.subject = subject;
		this.viewport = viewport;
		this.position = new Vector(0, 0);
		this.operatesManually = false;
	}

	update() {
		if(!this.operatesManually) {
			this.position = this.getNewPosition();
		}
	}

	/**
	 * Clamp movement of the camera's X between 0 and the edge of the scene,
	 * setting it to half the screen to the left of the subject so they are
	 * always in the center of the viewport.
	 */
	getNewPosition() {
		return new Vector(
		// Set X position
		Math.floor
		(this.subject.canvasPosition.x - (this.viewport.x / 2 - this.subject.dimensions.x / 2) - 10)
		,
		// Set Y position
		Math.floor(
		this.subject.canvasPosition.y - (this.viewport.y / 2 - this.subject.dimensions.y / 2) - 22)
		);
	}
}
