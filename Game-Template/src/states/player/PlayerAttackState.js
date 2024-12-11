import State from "../../../lib/State.js"
import Timer from "../../../lib/Timer.js"
import Direction from '../../enums/Direction.js';
import Animation from '../../../lib/Animation.js';
import PlayerStateName from "../../enums/PlayerStateName.js";
import {timer} from "../../globals.js"

export default class PlayerAttackState extends State{


    constructor(player){
        super()
        this.player = player;	
		this.isDone = false;
		this.player.isAttacking = false;	
    }

    enter(){  }

    update(dt){
		if(this.isDone){
			this.player.isAttacking = false;	
			this.player.changeState(PlayerStateName.Idle);
		}

		timer.update(dt);

		if(!this.player.isAttacking){
			this.player.isAttacking = true;
			this.tweenAttack();
		}
	}

	
tweenAttack(){
		this.offSetter = 35;
		this.player.initialX = this.player.canvasPosition.x;
		this.player.destinationX = this.player.canvasPosition.x + this.offSetter;
		this.player.initialY = this.player.canvasPosition.y;
		this.player.destinationY = this.player.canvasPosition.y + this.offSetter;
	
		
		this.isMoving = true;

		if(this.player.direction == Direction.Down){
			timer.tween(
				this.player.canvasPosition,
				['y'],
				[this.player.destinationY],
				0.1,
				() => {
					timer.tween(
						this.player.canvasPosition,
						['y'],
						[this.player.initialY],
						0.1,
						() => {
							this.isMoving = false;		
							this.isDone = true;											
						}
					);					
				}
			);
		}
		else if(this.player.direction == Direction.Up){
			timer.tween(
				this.player.canvasPosition,
				['y'],
				[this.player.destinationY - this.offSetter * 2],
				0.1,
				() => {
					timer.tween(
						this.player.canvasPosition,
						['y'],
						[this.player.initialY],
						0.1,
						() => {
							this.isMoving = false;		
							this.isDone = true;										
						}
					);					
				}
			);
		}		
		else if(this.player.direction == Direction.Right){
			timer.tween(
				this.player.canvasPosition,
				['x'],
				[this.player.destinationX],
				0.1,
				() => {
					timer.tween(
						this.player.canvasPosition,
						['x'],
						[this.player.initialX],
						0.1,
						() => {
							this.isMoving = false;	
							this.isDone = true;												
						}
					);					
				}
			);
		}		
		else if(this.player.direction == Direction.Left){
			timer.tween(
				this.player.canvasPosition,
				['x'],
				[this.player.destinationX - this.offSetter * 2],
				0.1,
				() => {
					timer.tween(
						this.player.canvasPosition,
						['x'],
						[this.player.initialX],
						0.1,
						() => {
							this.isMoving = false;	
							this.isDone = true;															
						}
					);					
				}
			);
		}		
	}
}