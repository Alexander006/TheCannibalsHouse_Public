import Colour from "../src/enums/Colour.js";
import ImageName from "../src/enums/ImageName.js";
import { context, images } from "../src/globals.js";
import Sprite from "./Sprite.js";
import Vector from "./Vector.js";

export default class Halo {
    constructor() {
		this.size = 900;

        this.graphic = images.get(ImageName.Halo);
        this.position = new Vector(50,50);
        this.visible = true;
	}

   /**
	 * Draws the halo onto the canvas.
	 *
	 * @param {number} canvasX The X coordinate of where the Sprite will be drawn on the canvas.
	 * @param {number} canvasY The Y coordinate of where the Sprite will be drawn on the canvas.
	 * @param {object} scale Can be used to draw the Sprite bigger or smaller.
	 */
	render(scale = { x: this.scale, y: this.scale }) {
        if(this.visible) {
            this.graphic.render(
                this.position.x,
                this.position.y,
                this.size,
                this.size
            )
        }
	}
}