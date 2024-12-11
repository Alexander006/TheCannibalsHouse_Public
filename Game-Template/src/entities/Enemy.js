import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import StateMachine from "../../lib/StateMachine.js";
import EnemyStateName from "../enums/EnemyStateName.js";
import SoundName from "../enums/SoundName.js";
import { sounds } from "../globals.js";
import Tile from "../services/Tile.js";
import EnemyIdlingState from "../states/enemy/EnemyIdlingState.js";
import EnemyWalkingState from "../states/enemy/EnemyWalkingState.js";
import GameEntity from "./GameEntity.js";
import Map from "../services/Map.js"
import { CANVAS_HEIGHT,CANVAS_WIDTH } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Hitbox from "../../lib/Hitbox.js";

export default class Enemy extends GameEntity {

	static POS_START_MIN_OFFSET_X = 8;	
	static POS_START_MAX_OFFSET_X = 13;
	static POS_START_MIN_OFFSET_Y = 6;	
	static POS_START_MAX_OFFSET_Y = 10;
	
	/**
	 * The enemy characters in the game that randomly
	 * walk around the room and can damage the player.
	 */
	constructor(map) {		
		let x = getRandomPositiveInteger(Enemy.POS_START_MIN_OFFSET_X, Enemy.POS_START_MAX_OFFSET_X);
		let y = getRandomPositiveInteger(Enemy.POS_START_MIN_OFFSET_Y,  Enemy.POS_START_MAX_OFFSET_Y);
		
		super({position: new Vector(x,y)});		
		this.map = map;					
		        
        this.speed = 0.5;		
		
        this.animation = new Animation();      
        this.isInteracting = false;
		this.damage = 1;
	}

	receiveDamage(damage) {
		this.health -= damage;
		sounds.play(SoundName.HitEnemy);
	}

	update(dt){
		super.update(dt);
		this.stateMachine.update(dt);		
		this.currentAnimation.update(dt);
		this.currentFrame = this.currentAnimation.getCurrentFrame();
	}

	render(){
        const x = Math.floor(this.canvasPosition.x);

		/**
		 * Offset the Y coordinate to provide a more "accurate" visual.
		 * To see the difference, remove the offset and bump into something
		 * either above or below the character and you'll see why this is here.
		 */
		const y = Math.floor(this.canvasPosition.y - this.dimensions.y / 4);

		super.render(x, y, {x: 2, y: 2});		
	}

	initializeStateMachine(animations) {
		const stateMachine = new StateMachine();

		stateMachine.add(EnemyStateName.Idle, new EnemyIdlingState(this,animations));
		stateMachine.add(EnemyStateName.Walking, new EnemyWalkingState(this,animations));
		
		stateMachine.change(EnemyStateName.Idle);

		return stateMachine;
	}
}
