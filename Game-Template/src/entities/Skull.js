import Sprite from "../../lib/Sprite.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import { images, sounds, timer } from "../globals.js";
import Tile from "../services/Tile.js";
import GameEntity from "./GameEntity.js";

export default class Skull extends GameEntity {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE;

    constructor(entityDefinition = {}) {
        super(entityDefinition);

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Skull),
            Skull.WIDTH,
            Skull.HEIGHT
        );

        this.isMoving = false

        this.isChasing = false;

        this.chaseOver = false;

        this.movementList = entityDefinition.movementList;
    }

    update(dt) {
        super.update(dt);

        if(this.isChasing) {
            if(!this.isMoving) {
                if(this.movementList.length === 0) {
                    this.endChase();
                } else {
                    this.move(this.movementList.shift())
                }
            }
        }
    }

    endChase() {
        sounds.stop(SoundName.SkullMove);
        this.isChasing = false;
        this.chaseOver = true;
    }

    startChase() {
        this.isChasing = true;
        sounds.play(SoundName.SkullMove);
    }

    render(){
        const x = Math.floor(this.canvasPosition.x);

		const y = Math.floor(this.canvasPosition.y);

		super.render(x - Tile.SIZE / 2, y - Tile.SIZE, {x: 1.7, y: 2});
    }

    move(direction){
		let x = this.position.x;
		let y = this.position.y;

		if (direction === Direction.Up) {
			y--;
		}
		else if (direction === Direction.Down) {
			y++;
		}
		else if (direction === Direction.Left) {
			x--;
		}
		else if (direction === Direction.Right) {
			x++;
		}

		this.position.x = x;
		this.position.y = y;

		this.tweenMovement(x, y);
    }

	tweenMovement(x, y) {
		this.isMoving = true;

		timer.tween(
			this.canvasPosition,
			['x', 'y'],
			[x * Tile.SIZE, y * Tile.SIZE],
			0.18,
			() => {
				this.isMoving = false;
			}
		);
	}
}