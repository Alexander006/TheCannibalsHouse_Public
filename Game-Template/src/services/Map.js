import Colour from "../enums/Colour.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import EnemyType from "../enums/EnemyType.js";
import EnemyFactory from "../services/EnemyFactory.js";
import Tile from "./Tile.js";
import Layer from "./Layer.js";
import Door from "../objects/Door.js";
import { getRandomPositiveInteger, pickRandomElement } from "../../lib/RandomNumberHelpers.js";
import Levels from "../enums/Levels.js";
import TransitionState from "../states/game/TransitionState.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	DEBUG,
	images,
	sounds,
	stateStack
} from "../globals.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import DialogueState from "../states/game/DialogueState.js";
import SoundName from "../enums/SoundName.js";
import Skull from "../entities/Skull.js";
import GameOverState from "../states/game/GameOverState.js";
import GameWonState from "../states/game/GameWonState.js";
import PlayerStateName from "../enums/PlayerStateName.js";


export default class Map {
	
	/**
	 * The collection of layers, sprites,
	 * and characters that comprises the world.
	 *
	 * @param {object} mapDefinition JSON from Tiled map editor.
	 */
	constructor(mapName, mapDefinitions, mapDefinition, halo, ambience = "", haloSize = 1000) {
		const sprites = [];
		Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Walls),
			Tile.SIZE,
			Tile.SIZE,
		).forEach(sprite => sprites.push(sprite));
		Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Floors),
			Tile.SIZE,
			Tile.SIZE,
		).forEach(sprite => sprites.push(sprite));
		Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Props_1),
			Tile.SIZE,
			Tile.SIZE,
		).forEach(sprite => sprites.push(sprite));
		Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Props_2),
			Tile.SIZE,
			Tile.SIZE,
		).forEach(sprite => sprites.push(sprite));

		this.mapName = mapName;
		this.mapDefinitions = mapDefinitions;

		this.bottomLayer = new Layer(mapDefinition.layers[Layer.BOTTOM], sprites);

		this.topLayer = new Layer(mapDefinition.layers[Layer.TOP], sprites); 
		this.collisionLayer = new Layer(mapDefinition.layers[Layer.COLLISION], sprites);
		this.halo = halo;
		this.haloSize = haloSize;
		this.objects = [];
		if(mapName !== "level1" && mapName !== "level4" && mapName !== "level5") {
			this.enemies = this.generateEnemies();
		} else {
			this.enemies = [];
		}
		this.ambience = ambience;
		this.musicStopped = false;
		this.player = null;
		this.skullChaseWasInitiated = false;
		this.skull = null;
	}

	enter() {
		this.halo.size = this.haloSize;
		if(this.ambience != "") {
			sounds.play(this.ambience);
		}
	}

	exit() {
		if(this.ambience != "") {
			sounds.stop(this.ambience);
		}
	}

	update(dt) {
		this.objects.forEach((object) => {
			object.update(dt);
		})
    
		this.enemies.forEach(enemy => enemy.update(dt));
		this.updateEntities(dt);
		this.checkForSkullChase();
		this.checkForGameEnd();
		this.cleanUpEnemies();


		if(this.skull) {
			this.skull.update(dt);
		}
		this.cleanUpEnemies();
		
		if (this.mapName == "level4") {
			const pot = 1;
			if(this.objects[pot].doneOnce) {
				if(!this.musicStopped) {
					this.musicStopped = true;
					sounds.stop(this.ambience);
					this.ambience = "";
				}
			}
		}
	}

	updateEntities(dt) {
		this.enemies.forEach((enemy) => {
			if (enemy.health <= 0) {
				enemy.isDead = true;
			}

			this.objects.forEach((object) => {
				if (object.didCollideWithEntity(enemy.hitbox)) {
					if (object.isCollidable) {
						object.onCollision(enemy);
					}
					else if (object.isConsumable) {
						object.onConsume(enemy);
					}
				}			
			});

			if(!enemy.isDead && this.player.didCollideWithEntity(enemy.hitbox) && this.player.isAttacking){				
				enemy.cleanUp = true;
			}			
			else if (!enemy.isDead && this.player.didCollideWithEntity(enemy.hitbox) && !this.player.isInvulnerable) {
				this.player.inflictDamage(enemy.damage);
				this.player.becomeInvulnerable();				
			}
		});
	}

	render() {
		this.bottomLayer.render();
		//this.collisionLayer.render();
		this.topLayer.render();
		this.objects.forEach((object) => {
			object.render();
		})

		if(this.skull) {
			this.skull.render();
		}


		if (DEBUG) {
			Map.renderGrid();
		}

		this.enemies.forEach(enemy => enemy.render());
	}

	/**
	 * @returns An array of enemies for the player to fight.
	 */
	generateEnemies() {
		const enemies = new Array();
		
		/**
		 * Choose a random enemy type and fill the room with only that type.
		 * This is more to make each room feel like a different room.
		 */
		
		//const enemyType = EnemyType[pickRandomElement(Object.keys(EnemyType))];

		const enemyType = 0;

		for (let i = 0; i < 3; i++) {
			enemies.push(EnemyFactory.createInstance(enemyType, this));
		}	
		return enemies;
	}

	postMoveObjectEvent() {
		if (this.mapName === "level3") {
			const barrel = 1;
			const chairUp = 2;
			const chairRight = 3;
			const drawer = 4;

			if(!(this.objects[chairUp].position.x == 15 && this.objects[chairUp].position.y == 8)) {
				return;
			}
			if(!(this.objects[barrel].position.x == 19 && this.objects[barrel].position.y == 11)) {
				return;
			}
			if(!(this.objects[chairRight].position.x == 14 && this.objects[chairRight].position.y == 7)) {
				return;
			}

			this.objects[barrel].playerCanInteract = false;
			this.objects[chairUp].playerCanInteract = false;
			this.objects[chairRight].playerCanInteract = false;

			sounds.play(SoundName.DrawerUnlock)
			stateStack.push(new DialogueState("You heard an unlocking sound in the direction of the room's furniture."));
			
			this.objects[drawer].locked = false;
		}
	}

	cleanUpEnemies() {
		this.enemies = this.enemies.filter((enemy) => !enemy.cleanUp);
	}

	checkForGameEnd() {
		const endDoor = 1;
		if(this.mapName === "level5") {
			if(this.objects[endDoor].wasInteracted) {
				this.exit();
				stateStack.pop();
				stateStack.push(new GameWonState(this.mapDefinitions));
			}
		}
	}

	checkForSkullChase() {
		if(!this.skullChaseWasInitiated) {
			if(this.mapName === "level4") {
				if(this.player.position.x > 13 && this.player.inventory.findItemByName("keyFromPot")) {

					let movementList = [];

					for(let i = 0; i < 6; i++) {
						movementList.push(Direction.Left);
					}

					for(let i = 0; i < 14; i++) {
						movementList.push(Direction.Up);
					}

					this.skullChaseWasInitiated = true;
					this.skull = new Skull({position: new Vector(20,39),
					movementList: movementList});
					this.skull.startChase();
					sounds.play(SoundName.SkullJumpscare);
				}
			}
		} else {
			if(this.skull) {
				if(this.skull.position.x === this.player.position.x &&
					this.skull.position.y === this.player.position.y) {
						this.skull.endChase();
						sounds.stop(SoundName.SkullJumpscare);
						sounds.play(SoundName.GoreBurst);
						stateStack.pop();
						stateStack.push(new GameOverState(this.mapDefinitions));
					}
				if(this.skull.chaseOver) {
					this.skull = null;
				}
			}
		}
	}

	/**
	 * Draws a grid of squares on the screen to help with debugging.
	 */
	static renderGrid() {
		context.save();
		context.strokeStyle = Colour.White;

		for (let y = 1; y < CANVAS_HEIGHT / Tile.SIZE; y++) {
			context.beginPath();
			context.moveTo(0, y * Tile.SIZE);
			context.lineTo(CANVAS_WIDTH, y * Tile.SIZE);
			context.closePath();
			context.stroke();

			for (let x = 1; x < CANVAS_WIDTH / Tile.SIZE; x++) {
				context.beginPath();
				context.moveTo(x * Tile.SIZE, 0);
				context.lineTo(x * Tile.SIZE, CANVAS_HEIGHT);
				context.closePath();
				context.stroke();
			}
		}

		context.restore();
	}
}
