import State from '../../../lib/State.js';
import PlayerIdleState from './PlayerIdleState.js';
import { keys, sounds, timer } from "../../globals.js"
import Direction from '../../enums/Direction.js';
import Animation from '../../../lib/Animation.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Tile from '../../services/Tile.js';
import SoundName from '../../enums/SoundName.js';
export default class PlayerWalkingState extends State {

    static SPEED = 10;
    constructor(player){
        super();

        this.player = player
		this.bottomLayer = this.player.map.bottomLayer;
		this.collisionLayer = this.player.map.collisionLayer;
		this.objects = this.player.map.objects;
        this.speed = PlayerWalkingState.SPEED;
        this.animation = {
			[Direction.Up]: new Animation([42, 43, 44, 43], 0.2),
			[Direction.Down]: new Animation([6, 7, 8, 7], 0.2),
			[Direction.Left]: new Animation([18, 19, 20, 19], 0.2),
			[Direction.Right]: new Animation([30, 31, 32, 31], 0.2),
		};

		this.isMoving = false;
    }

    update(dt) {
		this.player.currentAnimation = this.animation[this.player.direction];

		if(this.player.currentAnimation.currentFrame == 2 || this.player.currentAnimation.currentFrame == 0) {
			sounds.play(SoundName.Step);
		}

		// We must update the collision layer and objects since the maps are changing
		this.collisionLayer = this.player.map.collisionLayer;
		this.objects = this.player.map.objects;

		this.handleMovement();
	}

	handleMovement() {
		if (this.isMoving) {
			return;
		}

		if (!keys.w && !keys.a && !keys.s && !keys.d) {
			this.player.changeState(PlayerStateName.Idle);
			return;
		}

		this.updateDirection();
		this.move();
	}

    updateDirection() {
		if (keys.s) {
			this.player.direction = Direction.Down;
		}
		else if (keys.d) {
			this.player.direction = Direction.Right;
		}
		else if (keys.w) {
			this.player.direction = Direction.Up;
		}
		else if (keys.a) {
			this.player.direction = Direction.Left;
		}
	}


    move(){
		let x = this.player.position.x;
		let y = this.player.position.y;

		if (this.player.direction === Direction.Up) {
			y--;
		}
		else if (this.player.direction === Direction.Down) {
			y++;
		}
		else if (this.player.direction === Direction.Left) {
			x--;
		}
		else if (this.player.direction === Direction.Right) {
			x++;
		}

		if (!this.isValidMove(x, y)) {
			return;
		}

		this.player.position.x = x;
		this.player.position.y = y;

		this.tweenMovement(x, y);
    }

	tweenMovement(x, y) {
		this.isMoving = true;

		timer.tween(
			this.player.canvasPosition,
			['x', 'y'],
			[x * Tile.SIZE, y * Tile.SIZE],
			0.25,
			() => {
				this.isMoving = false;

				this.updateDirection();
			}
		);
	}


	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns Whether the player is going to move on to a non-collidable tile.
	 */
	isValidMove(x, y) {
		for(let i = 0; i < this.objects.length; i++) {
			if (this.objects[i].position.x === x && this.objects[i].position.y === y) {
				if (this.objects[i].isCollidable) {
					return false;
				}
			}
		}
		return this.collisionLayer.getTile(x, y) === null;
	}
}