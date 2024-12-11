import Animation from "../../../lib/Animation.js";
import { getRandomPositiveInteger, pickRandomElement,didSucceedPercentChance } from "../../../lib/RandomNumberHelpers.js";
import State from "../../../lib/State.js";
import Enemy from "../../entities/Enemy.js";
import Direction from "../../enums/Direction.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import { timer } from "../../globals.js";
import Tile from "../../services/Tile.js";
export default class EnemyWalkingState extends State {
	static IDLE_CHANCE = 0.5;
	static MOVE_DURATION_MIN = 2;
	static MOVE_DURATION_MAX = 6;

	/**
	 * In this state, the enemy moves around in random
	 * directions for a random period of time.
	 *
	 * @param {Enemy} enemy
	 * @param {Animation} animation
	 */
	constructor(enemy, animation) {
		super();

		this.enemy = enemy;		
		this.bottomLayer = this.enemy.map.bottomLayer;
		this.collisionLayer = this.enemy.map.collisionLayer;
		this.animation = animation;
		this.objects = this.enemy.map.objects;
	}

	enter() {
		this.enemy.currentAnimation = this.animation.walking[this.enemy.direction];

		this.reset();
		this.startTimer();
	}

	update(dt) {
		this.move(dt);		
	}

	startTimer() {
		this.timer = timer.wait(this.moveDuration, () => this.decideMovement());
	}

	/**
	 * 50% chance for the snail to go idle for more dynamic movement.
	 * Otherwise, start the movement timer again.
	 */
	decideMovement() {
		if (didSucceedPercentChance(EnemyWalkingState.IDLE_CHANCE)) {
			this.enemy.changeState(EnemyStateName.Idle);
		}
		else {
			this.reset();
			this.startTimer();
		}
	}

	/**
	 * 25% chance for the enemy to move in any direction.
	 * Reset the movement timer to a random duration.
	 */
	reset() {
		this.enemy.direction = pickRandomElement([Direction.Up, Direction.Down, Direction.Left, Direction.Right]);
		this.enemy.currentAnimation = this.animation.walking[this.enemy.direction];
		this.moveDuration = getRandomPositiveInteger(EnemyWalkingState.MOVE_DURATION_MIN, EnemyWalkingState.MOVE_DURATION_MAX);
	}

	/**
	 * Movement of the enemy
	 * @param {*} dt 
	 */
    move(dt){
		let x = this.enemy.position.x;
		let y = this.enemy.position.y;

		if (this.enemy.direction === Direction.Down) {			
			y += this.enemy.speed * dt;
		}
		else if (this.enemy.direction === Direction.Right) {			
			x += this.enemy.speed * dt;			
		}
		else if (this.enemy.direction === Direction.Up) {			
			y -= this.enemy.speed * dt;			
		}
		else if (this.enemy.direction === Direction.Left) {			
			x -= this.enemy.speed * dt;		
		}

		if (!this.isValidMove(Math.floor(x), Math.floor(y))) {			
			this.reset();
			console.log("Enemy Invalid Move")
			return
		}

		this.enemy.position.x = x;
		this.enemy.position.y = y;

		this.enemy.canvasPosition.x = x * Tile.SIZE;
		this.enemy.canvasPosition.y = y * Tile.SIZE;
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
			return this.collisionLayer.getTile(x,y) === null;
		}
}
