
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import EventName from "../enums/EventName.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import { images, sounds, timer } from "../globals.js";
import Tile from "../services/Tile.js";
import GameObject from "./GameObject.js";

export default class MoveableObject extends GameObject {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE;

    constructor(dimensions, position, map){
        super(dimensions, position);

        this.map = map;

        this.isMoving = false;

        this.playerCanInteract = true;

        this.currentFrame = 0;

        this.isCollidable = true;
    }

    update(dt){
        super.update(dt);


    }

    render() {
        const x = Math.floor(this.canvasPosition.x);
        const y = Math.floor(this.canvasPosition.y);

		super.render(x, y);
    }

    moveObject(entityDirection) {
        let x = this.position.x;
		let y = this.position.y

		if (entityDirection === Direction.Up) {
			y--;
		}
		else if (entityDirection === Direction.Down) {
			y++;
		}
		else if (entityDirection === Direction.Left) {
			x--;
		}
		else if (entityDirection === Direction.Right) {
			x++;
		}

		if (!this.isValidMove(x, y)) {
			return;
		}

		this.position.x = x;
		this.position.y = y;

		sounds.play(SoundName.Drag);

		this.tweenMovement(x, y);
    }

    tweenMovement(x, y) {
		this.isMoving = true;

		timer.tween(
			this.canvasPosition,
			['x', 'y'],
			[x * Tile.SIZE, y * Tile.SIZE],
			0.25,
			() => {
				this.isMoving = false;
				this.map.postMoveObjectEvent();
			}
		);
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns Whether the player is going to move on to a non-collidable tile.
	 */
	isValidMove(x, y) {
		for(let i = 0; i < this.map.objects.length; i++) {
			if (this.map.objects[i].position.x === x && this.map.objects[i].position.y === y) {
				if (this.map.objects[i].isCollidable) {
					return false;
				}
			}
		}
		return this.map.collisionLayer.getTile(x, y) === null;
	}

    handleInteract(entityDirection) {
        if(this.playerCanInteract){
            super.handleInteract(entityDirection);

            this.moveObject(entityDirection);
        }
    }
}