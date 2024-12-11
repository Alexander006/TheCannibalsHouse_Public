
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import EventName from "../enums/EventName.js";
import ImageName from "../enums/ImageName.js";
import { images, stateStack } from "../globals.js";
import Tile from "../services/Tile.js";
import DialogueState from "../states/game/DialogueState.js";
import Panel from "../user-interface/elements/Panel.js";
import GameObject from "./GameObject.js";
import Key from "./Key.js";

export default class Pot extends GameObject {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE;

    constructor(dimensions, position, item, inventory){
        super(dimensions, position);

        this.inventory = inventory;

        this.item = item;

        this.doneOnce = false;

        this.playerCanInteract = true;

        this.isCollidable = true;

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Props_1),
            Pot.WIDTH,
            Pot.HEIGHT
        );

        this.currentFrame = 153;
    }

    update(dt){
        super.update(dt);


    }

    render(){
		/**
		 * Offset the coordinates based on direction for a more
         * accurate visual
		 */
        const x = Math.floor(this.canvasPosition.x);
        const y = Math.floor(this.canvasPosition.y);

		super.render(x, y);
    }

    getKeyFromPot() {
        if(!this.doneOnce) {
            this.doneOnce = true;
            stateStack.push(new DialogueState("You found something in the pot.", Panel.BOTTOM_DIALOGUE, () => {
                stateStack.push(new DialogueState("Got a key."));
                if(this.item.name === "keyFromPot") {
                    localStorage.setItem("cannibal_save", 2);
                }
                this.inventory.addItem(this.item);
            }));
        }
    }

    handleInteract(entityDirection) {
        if(this.playerCanInteract) {
            super.handleInteract();

            this.getKeyFromPot();
        }
    }
}