import Hitbox from "../../lib/Hitbox.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import { context, DEBUG } from "../globals.js";
import Tile from "../services/Tile.js";


export default class GameEntity{

    static DEFAULT_HEALTH = 100;

    constructor(entityDefinition = {}){
        this.position = entityDefinition.position ?? new Vector();
        this.canvasPosition = new Vector(Math.floor(this.position.x * Tile.SIZE), Math.floor(this.position.y * Tile.SIZE));
        this.dimensions = entityDefinition.dimensions ?? new Vector();

        this.speed = entityDefinition.speed ?? 1;
        this.totalHealth = entityDefinition.health ?? 1;
        this.damage = entityDefinition.damage ?? 1;
        this.hitboxOffsets = entityDefinition.hitboxOffsets ?? new Hitbox();
        this.hitbox = new Hitbox(
        this.position.x + this.hitboxOffsets.position.x,
        this.position.y + this.hitboxOffsets.position.y,
        this.dimensions.x + this.hitboxOffsets.dimensions.x,
        this.dimensions.y + this.hitboxOffsets.dimensions.y,
        );

        this.direction = entityDefinition.direction ?? Direction.Down;
        this.shouldCleanUp = false;
        this.health = GameEntity.DEFAULT_HEALTH;
        this.renderOffsets = {x:0,y:0};
        this.currentAnimation = null;
        this.currentFrame = 0;        
        this.isDead = false;
        this.sprites = [];
        this.Direction = Direction.Down;       
        this.stateMachine = null;    
        this.cleanUp = false;
        this.renderPriority = 0;
    }

    update(dt){
        this.stateMachine?.update(dt);       
        if(this.shouldCleanUp){
            this.cleanUp = true;
        }

        this.hitbox.set(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
    }

    render(x,y, scale = { x: 1, y: 1 }){
        this.stateMachine?.render();
		this.sprites[this.currentFrame].render(Math.floor(x), Math.floor(y),scale);

        if (DEBUG) {
			this.hitbox.render(context);
		}
    }

    generateSprites(measurements){

    }  

    /**
     * Takes damage from another entity
     */
    inflictDamage(entity){
        
    }

    /**
     * Changes the state of an entity
     * @param {*} state 
     * @param {*} params 
     */
    changeState(state, params) {
		this.stateMachine?.change(state, params);
	}

    /**
	 * @param {Hitbox} hitbox
	 * @returns Whether this hitbox collided with another using AABB collision detection.
	 */
	didCollideWithEntity(hitbox) {
		return this.hitbox.didCollide(hitbox);
	}
}