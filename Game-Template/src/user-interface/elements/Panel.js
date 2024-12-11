import UserInterfaceElement from "../UserInterfaceElement.js";
import Colour from "../../enums/Colour.js";
import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import { context } from "../../globals.js";

export default class Panel extends UserInterfaceElement {
	static INVENTORY_DIMENSIONS = { x: 1, y: 1, width: 13, height: 8 };
	static BOTTOM_DIALOGUE = { x: 0.1, y: 7, width: 14.8, height: 2.9 };

	static DEFAULT_PADDING = 20;
	static BORDER_WIDTH = 4;
	static FONT_FAMILY = 'Verdana';
	static FONT_SIZE = '20'

	/**
	 * A UI element that is simply a rectangle that
	 * other UI elements are placed on top of.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {object} options
	 */
	constructor(x, y, width, height, options = {}) {
		super(x, y, width, height);

		this.borderColour = options.borderColour ?? Colour.Black;
		this.panelColour = options.panelColour ?? Colour.GreyTransparent;
		this.padding = options.padding ?? Panel.DEFAULT_PADDING;
		this.isVisible = true;
	}

	render() {
		if (!this.isVisible) {
			return;
		}

		context.save();
		this.renderBackground();
		this.renderForeground();
		context.restore();
	}

	renderBackground() {
		context.fillStyle = this.borderColour;
		roundedRectangle(
			context,
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			Panel.BORDER_WIDTH,
			true,
			false
		);
	}

	renderForeground() {
		context.fillStyle = this.panelColour;
		roundedRectangle(
			context,
			this.position.x + Panel.BORDER_WIDTH / 2,
			this.position.y + Panel.BORDER_WIDTH / 2,
			this.dimensions.x - Panel.BORDER_WIDTH,
			this.dimensions.y - Panel.BORDER_WIDTH,
			Panel.BORDER_WIDTH,
			true,
			false
		);
	}

	toggle() {
		this.isVisible = !this.isVisible;
	}
}
