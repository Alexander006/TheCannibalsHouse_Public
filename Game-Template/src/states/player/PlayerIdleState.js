import State from '../../../lib/State.js';
import PlayerWalkingState from './PlayerWalkingState.js';
import Animation from "../../../lib/Animation.js"
import Direction from '../../enums/Direction.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import { keys } from '../../globals.js';

export default class PlayerIdleState extends State {

    constructor(player){
        super();
        
        this.player = player;

        //Frame numbers TBD
        this.animation = {
            [Direction.Up]: new Animation([43], 1),
			[Direction.Down]: new Animation([7], 1),
			[Direction.Left]: new Animation([19], 1),
			[Direction.Right]: new Animation([31], 1),
        }
    }

    enter(){
        this.player.currentAnimation = this.animation[this.player.direction];
    }


    update(){
        this.checkForMovement();
		this.checkForInteract();
        this.checkForAttack();
    }


    checkForMovement() {
		if (keys.s) {
			this.player.direction = Direction.Down;
			this.player.changeState(PlayerStateName.Walking);
		}
		else if (keys.d) {
			this.player.direction = Direction.Right;
			this.player.changeState(PlayerStateName.Walking);
		}
		else if (keys.w) {
			this.player.direction = Direction.Up;
			this.player.changeState(PlayerStateName.Walking);
		}
		else if (keys.a) {
			this.player.direction = Direction.Left;
			this.player.changeState(PlayerStateName.Walking);
		}
	}    

	checkForAttack() {
		if (keys[' ']) {
			this.player.changeState(PlayerStateName.Attack);
		}
	}

	checkForInteract() {
		if (keys.f) {
			keys.f = false;
			this.player.isInteracting = true;
		}
	}	
}