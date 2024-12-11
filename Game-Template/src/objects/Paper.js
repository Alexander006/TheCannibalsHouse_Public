
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import EventName from "../enums/EventName.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import { images, sounds, stateStack } from "../globals.js";
import Tile from "../services/Tile.js";
import DialogueState from "../states/game/DialogueState.js";
import GameObject from "./GameObject.js";

export default class Paper extends GameObject {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE;

    constructor(dimensions, position, text){
        super(dimensions, position);

        this.playerCanInteract = true;

        this.text= text;

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Props_1),
            Paper.WIDTH,
            Paper.HEIGHT
        );

        this.currentFrame = 74;
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
        const y = Math.floor(this.canvasPosition.y - Tile.SIZE);

		super.render(x, y);
    }

    readNote() {
        sounds.play(SoundName.PickupPaper);

        stateStack.push(new DialogueState(this.text));
    }

    handleInteract(entityDirection) {
        if(this.playerCanInteract) {
            super.handleInteract();

            this.readNote();
        }
    }
}