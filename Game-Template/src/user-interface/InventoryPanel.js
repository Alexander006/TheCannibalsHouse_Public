import { context, keys, stateStack } from "../globals.js";
import Panel from "./elements/Panel.js";
import Vector from "../../lib/Vector.js";
import Colour from "../../src/enums/Colour.js";
import { roundedRectangle } from "../../lib/DrawingHelpers.js";
import Tile from "../services/Tile.js";

export default class InventoryPanel extends Panel {
	constructor(player, inventory) {
		super(
			Panel.INVENTORY_DIMENSIONS.x,
			Panel.INVENTORY_DIMENSIONS.y,
			Panel.INVENTORY_DIMENSIONS.width,
			Panel.INVENTORY_DIMENSIONS.height,
		);

        this.inventory = inventory;
        this.player = player;
        this.items = this.initializeItems(this.player.inventory.inventory);
		this.currentSelection = 0;
	}

	update(dt) {
        if(keys.i) {
            keys.i = false;
            stateStack.pop();
        }
		else if (keys.a || keys.ArrowLeft) {
			this.navigateLeft();
		}
		else if (keys.d || keys.ArrowRight) {
			this.navigateRight();
		}
		else if (keys.Enter) {
			this.select();
		}

        if (this.inventory.wasUpdated) {
            this.inventory.wasUpdated = false;
            this.items = this.initializeItems(this.player.inventory.inventory);
        }
	}

	render() {
		super.render();

        this.items.forEach((element, index) => {
            this.renderInventoryItems(element, index);
        });
    }

    renderInventoryItems(item, index) {
        if (index === this.currentSelection) {
            this.renderSelectionBox(item);
        }

        context.save();
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = this.font;
        item.image.render(item.position.x, item.position.y);
        context.restore();
    }

    renderSelectionBox(item) {
        context.fillStyle = Colour.White;
        roundedRectangle(
            context,
            item.position.x - 2,
            item.position.y - 2,
            Tile.SIZE + 4,
            Tile.SIZE + 4,
            Panel.BORDER_WIDTH,
            true,
            false
        );
    }

    navigateLeft() {
        keys.a = false;
        keys.ArrowLeft = false;

        //sounds.play(SoundName.SelectionMove);

        if (this.currentSelection === 0) {
            this.currentSelection = this.items.length - 1;
        }
        else {
            this.currentSelection--;
        }
    }

    navigateRight() {
        keys.d = false;
        keys.ArrowRight = false;

        //sounds.play(SoundName.SelectionMove);

        if (this.currentSelection === this.items.length - 1) {
            this.currentSelection = 0;
        }
        else {
            this.currentSelection++;
        }
    }

    select() {
        keys.Enter = false;

        //sounds.play(SoundName.SelectionChoice);
        stateStack.pop();
        this.player.itemBeingUsed = this.currentSelection;
    }

    /**
     * Adds a position property to each item to be used for rendering.
     *
     * @param {array} items
     * @returns The items array where each item now has a position property.
     */
    initializeItems(items) {
        let currentX = this.position.x;

        items.forEach((item) => {
            const padding = currentX + Tile.SIZE + 10;

            item.position = new Vector(padding, this.position.y + Tile.SIZE);

            currentX += Tile.SIZE + 10;
        });

        return items;
    }
}
