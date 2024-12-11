import State from "../../../lib/State.js";
import { keys, stateStack } from "../../globals.js";
import InventoryPanel from "../../user-interface/InventoryPanel.js";

export default class InventoryState extends State {
	/**
	 * Consists of some text fields and a carousel of
	 * sprites that are displayed on the screen. There
	 * is then a fading transition to the next screen.
	 *
	 * @param {object} mapDefinition
	 */
	constructor(player, inventory) {
		super();

		this.player = player;
		this.panel = new InventoryPanel(player, inventory);
	}

	enter() {
		//sounds.play(SoundName.Title);
	}

	update(dt) {
		super.update(dt);
		this.panel.update(dt);
	}

	render() {
		this.panel.render();
	}
}