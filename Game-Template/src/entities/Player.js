import GameEntity from "./GameEntity.js";
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import PlayerIdleState from "../states/player/PlayerIdleState.js";
import PlayerWalkingState from "../states/player/PlayerWalkingState.js";
import PlayerAttackState from "../states/player/PlayerAttackState.js";
import ImageName from "../enums/ImageName.js";
import { images, keys, sounds, stateStack, timer } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Tile from "../services/Tile.js";
import Inventory from "../../lib/Inventory.js";
import InventoryState from "../states/game/InventoryState.js";
import Hitbox from "../../lib/Hitbox.js";
import SoundName from "../enums/SoundName.js";
import Halo from "../../lib/Halo.js";

export default class Player extends GameEntity {    

    static WIDTH = Tile.SIZE
    static HEIGHT = Tile.SIZE
    static HEAL_AMOUNT = 2;
    static INVULNERABLE_DURATION = 1.5;
	static INVULNERABLE_FLASH_INTERVAL = 0.1;

    constructor(entityDefinition = {}, map){
        super(entityDefinition);

        this.map = map
        this.dimensions = new Vector(Player.WIDTH, Player.HEIGHT);
        this.speed = 0.1

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Player),
            Player.WIDTH,
            Player.HEIGHT
        );

        this.inventory = new Inventory();
        this.inventoryState = new InventoryState(this, this.inventory);     
        this.animation = new Animation();
        this.stateMachine = this.initializeStateMachine()
        this.currentAnimation = this.stateMachine.currentState.animation[this.direction];
        this.isInteracting = false;
        this.itemBeingUsed = -1;
        this.alpha = 1;
        this.isInvulnerable = false;
        this.isAttacking = false;
    }

    update(dt){
        super.update(dt);
        this.currentAnimation.update(dt);

		this.currentFrame = this.currentAnimation.getCurrentFrame();

        if(keys.i) {
            keys.i = false;
            stateStack.push(this.inventoryState);
        }
    }

    render(){
        const x = Math.floor(this.canvasPosition.x);

		/**
		 * Offset the Y coordinate to provide a more "accurate" visual.
		 * To see the difference, remove the offset and bump into something
		 * either above or below the character and you'll see why this is here.
		 */
		const y = Math.floor(this.canvasPosition.y - this.dimensions.y / 4);

		super.render(x, y);
    }

    /**
     * Heals the player
     */
    heal(){
        health += Player.HEAL_AMOUNT;
    }

    inflictDamage(damage){
        super.inflictDamage();
        //sounds.play(SoundName.Damage);
        this.health -= damage;
    }

    initializeStateMachine(){
        const stateMachine = new StateMachine();
        
        stateMachine.add(PlayerStateName.Idle, new PlayerIdleState(this));
        stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
        stateMachine.add(PlayerStateName.Attack, new PlayerAttackState(this))
        
        stateMachine.change(PlayerStateName.Idle);
        return stateMachine;
    }

    becomeInvulnerable() {
		this.isInvulnerable = true;
		this.invulnerabilityTimer = this.startInvulnerabilityTimer();
	}
	
	startInvulnerabilityTimer() {
		const action = () => {
			this.alpha = this.alpha === 1 ? 0.5 : 1;
		};
		const interval = Player.INVULNERABLE_FLASH_INTERVAL;
		const duration = Player.INVULNERABLE_DURATION;
		const callback = () => {
			this.alpha = 1;
			this.isInvulnerable = false;
		};

		return timer.addTask(action, interval, duration, callback);
	}
}