
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

export default class Drawer extends GameObject {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE;

    constructor(dimensions, position, item, inventory, locked = false){
        super(dimensions, position);

        this.inventory = inventory;

        this.locked = locked

        this.doneOnce = false;

        this.item = item;

        this.playerCanInteract = true;

        this.isCollidable = true;

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Props_1),
            Drawer.WIDTH,
            Drawer.HEIGHT
        );

        this.currentFrame = 115;
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
    
    getKeyFromDrawer() {
        if(!this.locked) {
            if(!this.doneOnce) {
                this.doneOnce = true;
                stateStack.push(new DialogueState("You found something in the drawer.", Panel.BOTTOM_DIALOGUE, () => {
                    this.inventory.addItem(this.item);
                    stateStack.push(new DialogueState("Got a key."));

                    if(this.item.name === "keyTutorial") {
                        localStorage.setItem("cannibal_save", 0);
                    }
                    else if(this.item.name === "keyPuzzleRoom2") {
                        localStorage.setItem("cannibal_save", 1);
                    }

                }));
            }
        } else {
            stateStack.push(new DialogueState("Will not budge."));
        }
    }

    handleInteract(entityDirection) {
        if(this.playerCanInteract) {
            super.handleInteract();

            this.getKeyFromDrawer();
        }
    }
}