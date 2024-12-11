
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

export default class Door extends GameObject {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE * 2;

    constructor(dimensions, position, destinationPosition, destinationMap, direction, locked, name){
        super(dimensions, position, name);

        this.locked = locked;

        this.destinationPosition = destinationPosition;

        this.destinationMap = destinationMap

        this.direction = direction;

        this.playerCanInteract = true;

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Door),
            Door.WIDTH,
            Door.HEIGHT
        );

        this.currentAnimation = new Animation([1,2,3,4], 0.2)

        this.isOpening = false;

        this.setFrameBasedOnDirection();
    }

    setFrameBasedOnDirection() {
        if(this.direction == Direction.Left) {
            this.currentFrame = 6;
        } else if(this.direction == Direction.Right) {
            this.currentFrame = 5;
        } else if(this.direction == Direction.Down) {
            this.currentFrame = 7;
        } else {
            this.currentFrame = 0;
        }
    }

    update(dt){
        super.update(dt);

        if(this.isOpening) {
            this.currentAnimation.update(dt);
            this.currentFrame = this.currentAnimation.getCurrentFrame();

            if(this.currentAnimation.isDone()) {
                this.isOpening = false;
                this.currentFrame = 0;
            }
        }
    }

    render(){
		/**
		 * Offset the coordinates based on direction for a more
         * accurate visual
		 */
        let x;
        let y;

        switch(this.direction) {
            case Direction.Up:
                 x = Math.floor(this.canvasPosition.x);
                 y = Math.floor(this.canvasPosition.y - Tile.SIZE);
                break;
            case Direction.Down:
                 x = Math.floor(this.canvasPosition.x);
                 y = Math.floor(this.canvasPosition.y - Tile.SIZE * 2);
                break;
            case Direction.Left:
                 x = Math.floor(this.canvasPosition.x + 4);
                 y = Math.floor(this.canvasPosition.y - 30);
                break;
            case Direction.Right:
                x = Math.floor(this.canvasPosition.x - 4);
                y = Math.floor(this.canvasPosition.y - 30);
                break;
        }

		super.render(x, y);
    }

    doorOpen() {
        if(!this.locked) {
            sounds.play(SoundName.OpenDoor);
            if(this.direction == Direction.Up) {
                this.isOpening = true;
            }
        } else {
            sounds.play(SoundName.DoorLocked);
            stateStack.push(new DialogueState("The door is locked."));
        }
    }

    handleInteract(entityDirection) {
        if(this.playerCanInteract) {
            super.handleInteract();

            this.doorOpen();
        }
    }

    handleUseItem() {
		super.handleUseItem();

        stateStack.push(new DialogueState("Unlocked the door."));

        sounds.play(SoundName.DoorUnlock)

        this.locked = false;
	}
}