import SoundName from "../../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, canvas, context, sounds, stateStack } from "../../globals.js";
import State from "../../../lib/State.js";
import Map from "../../services/Map.js";
import Levels from "../../enums/Levels.js";
import Camera from "../../../lib/Camera.js";
import Player from "../../entities/Player.js";
import Vector from "../../../lib/Vector.js";
import Halo from "../../../lib/Halo.js";
import Door from "../../objects/Door.js";
import Direction from "../../enums/Direction.js";
import TransitionState from "./TransitionState.js";
import Tile from "../../services/Tile.js";
import Barrel from "../../objects/Barrel.js";
import Chair from "../../objects/Chair.js";
import Key from "../../objects/Key.js";
import DialogueState from "./DialogueState.js";
import Pot from "../../objects/Pot.js";
import Drawer from "../../objects/Drawer.js";
import Paper from "../../objects/Paper.js";

export default class PlayState extends State {
	constructor(mapDefinition) {
		super();

		this.mapDefinition = mapDefinition
		this.halo = new Halo();

		this.maps = [new Map("level1", mapDefinition, this.mapDefinition[Levels.Level_1], this.halo, SoundName.WindAmb),
					 new Map("level2", mapDefinition, this.mapDefinition[Levels.Level_2], this.halo, SoundName.HubAmbience),
					 new Map("level3", mapDefinition, this.mapDefinition[Levels.Level_3], this.halo, SoundName.AmbPuzzleRoomA),
					 new Map("level4", mapDefinition, this.mapDefinition[Levels.Level_4], this.halo, SoundName.AmbPuzzleRoomB, 750),
					 new Map("level5", mapDefinition, this.mapDefinition[Levels.Level_5], this.halo, SoundName.WindAmb)];

		this.map = this.maps[Levels.Level_1];
	}

	generateObjectsInLevels() {
		this.maps[Levels.Level_1].objects = [
			new Door(new Vector(Door.WIDTH, Door.HEIGHT),
					 new Vector(10,4), 
					 new Vector(11,14), 
					 this.maps[Levels.Level_2], 
					 Direction.Up, 
					 true, 
					 "doorTutorial"),
			new Drawer(new Vector(Drawer.WIDTH, Drawer.HEIGHT),
					new Vector(13,5),
					new Key(new Vector(Key.WIDTH, Key.HEIGHT),
						    new Vector(5,4),
						    "keyTutorial",
						    "doorTutorial"),
					this.player.inventory)
		]

		this.level2_door1 = new Door(new Vector(Door.WIDTH, Door.HEIGHT),
		new Vector(11,15), 
		new Vector(10,5), 
		this.maps[Levels.Level_1], 
		Direction.Down, 
		false);

		this.level2_door2 = new Door(new Vector(Door.WIDTH, Door.HEIGHT),
		new Vector(0,6), 
		new Vector(20,7), 
		this.maps[Levels.Level_3],
		Direction.Left, 
		false)

		this.level2_door3 = new Door(new Vector(Door.WIDTH, Door.HEIGHT),
		new Vector(22,6), 
		new Vector(8,9), 
		this.maps[Levels.Level_4], 
		Direction.Right, 
		true,
		"doorPuzzleRoom2")

		this.maps[Levels.Level_2].objects = [
			this.level2_door1,
			new Door(new Vector(Door.WIDTH, Door.HEIGHT),
					 new Vector(0,11), 
					 new Vector(10,7), 
					 this.maps[0], 
					 Direction.Left, 
					 true),
			new Door(new Vector(Door.WIDTH, Door.HEIGHT),
					 new Vector(22,11), 
					 new Vector(10,5), 
					 this.maps[0], 
					 Direction.Right, 
					 true),
			this.level2_door2,
			this.level2_door3,
			new Door(new Vector(Door.WIDTH, Door.HEIGHT),
					 new Vector(11,1), 
					 new Vector(4,32), 
					 this.maps[Levels.Level_5], 
					 Direction.Up, 
					 true,
					 "finalDoor"),
			new Paper(new Vector(Paper.WIDTH, Paper.HEIGHT),
					 new Vector(12, 1),
					 "I'll be waiting for you . . .\n\nSolve the puzzles in the rooms below to greet me.")
		]
		this.maps[Levels.Level_3].objects = [
			new Door(new Vector(Door.WIDTH, Door.HEIGHT),
					 new Vector(21,7), 
					 new Vector(1,6), 
					 this.maps[Levels.Level_2], 
					 Direction.Right, 
					 false),
			new Barrel(new Vector(Barrel.WIDTH, Barrel.HEIGHT),
					 new Vector(19,9),
					 this.maps[Levels.Level_3]),
			new Chair(new Vector(Chair.WIDTH, Chair.HEIGHT),
					 new Vector(17,9),
					 this.maps[Levels.Level_3],
					 Direction.Up),
			new Chair(new Vector(Chair.WIDTH, Chair.HEIGHT),
					 new Vector(12,5),
					 this.maps[Levels.Level_3],
					 Direction.Right),
			new Drawer(new Vector(Drawer.WIDTH, Drawer.HEIGHT),
					new Vector(14,3),
					new Key(new Vector(Key.WIDTH, Key.HEIGHT),
						    new Vector(14,3),
						    "keyPuzzleRoom2",
						    "doorPuzzleRoom2"),
					this.player.inventory,
					true),
			new Drawer(new Vector(Drawer.WIDTH, Drawer.HEIGHT),
					new Vector(6,3),
					null,
					this.player.inventory,
					true),
			new Paper(new Vector(Paper.WIDTH, Paper.HEIGHT),
					  new Vector(10, 4),
					  "Make right a mirror of left . . .")
		]
		this.maps[Levels.Level_4].objects = [
			new Door(new Vector(Door.WIDTH, Door.HEIGHT),
					 new Vector(7,9), 
					 new Vector(21,6), 
					 this.maps[Levels.Level_2], 
					 Direction.Left,
					 false),
			new Pot(new Vector(Pot.WIDTH, Pot.HEIGHT),
					new Vector(1,39),
					new Key(new Vector(Key.WIDTH, Key.HEIGHT),
							new Vector(5,4),
							"keyFromPot",
							"finalDoor"),
					this.player.inventory)
		]
		this.maps[Levels.Level_5].objects = [
			new Door(new Vector(Door.WIDTH, Door.HEIGHT),
					 new Vector(4,33), 
					 new Vector(4,32), 
					 this.maps[Levels.Level_5], 
					 Direction.Down, 
					 true),
			new Door(new Vector(Door.WIDTH, Door.HEIGHT),
					 new Vector(4,1), 
					 new Vector(4,32), 
					 this.maps[Levels.Level_5], 
					 Direction.Up, 
					 false, "endDoor"),
			new Paper(new Vector(Paper.WIDTH, Paper.HEIGHT),
					 new Vector(3, 1),
					 "You know what, I just realized I'm kind of shy . . .\n\nWhy don't you just leave, and we don't have to meet, alright? Cheerio!")
		]
	}

	enter() {
		canvas.style.backgroundColor = "black";

		let spawnPos = new Vector(10, 8);

		this.player = new Player({ position: spawnPos }, this.map);

		this.maps.forEach(map => {
			map.player = this.player;
		})

		this.generateObjectsInLevels();

		if(localStorage.getItem("cannibal_save")) {
			spawnPos = new Vector(11, 6);
			this.map.exit();
			this.map = this.maps[Levels.Level_2];
			this.level2_door1.locked = true;
			switch(localStorage.getItem("cannibal_save")) {
				case '1':
					this.level2_door2.locked = true;
					this.player.inventory.addItem(new Key(new Vector(Key.WIDTH, Key.HEIGHT),
												  new Vector(14,3),
												  "keyPuzzleRoom2",
												  "doorPuzzleRoom2"), true);
					break;
				case '2':
					this.level2_door2.locked = true;
					this.player.inventory.addItem(new Key(new Vector(Key.WIDTH, Key.HEIGHT),
												  new Vector(5,4),
												  "keyFromPot",
												  "finalDoor"), true);
					break;
			}
			this.player.map = this.map;
			this.map.enter();
		} else {
			stateStack.push(new DialogueState("Jennifer\n\nWhat the... where am I?"));
		}

		this.camera = new Camera(
			this.player,
			new Vector(CANVAS_WIDTH, CANVAS_HEIGHT),
		);

		this.update(0);
		this.render();
	}

	update(dt) {
		this.map.update(dt);
		this.player.update(dt);
		this.camera.update();
		this.updateHalo();
		this.checkForItemUse();
		this.checkForPlayerInteraction();
	}

	changeLevel(newMap, newPlayerPos) {
		TransitionState.fade(() => {
			this.map.exit();
			this.map = newMap;
			this.map.enter();
			this.player.map = this.map;
			this.player.position.x = newPlayerPos.x;
			this.player.position.y = newPlayerPos.y;
			this.player.canvasPosition.x = this.player.position.x * Tile.SIZE;
			this.player.canvasPosition.y = this.player.position.y * Tile.SIZE;
			this.update(0);
			this.render();
		}, { r: 0, g: 0, b: 0 }, 0.5, 0.5);
	}

	checkForPlayerInteraction() {
		if(this.player.isInteracting) {
			this.player.isInteracting = false;
			const positionOfInteract = this.getPointOfInteraction();

			this.map.objects.forEach((object) => {
				if(object.position.x === positionOfInteract.x && object.position.y === positionOfInteract.y) {
					object.handleInteract(this.player.direction);

					if (object instanceof Door) {
						if(!object.locked) {
							this.changeLevel(object.destinationMap, object.destinationPosition);
							return;
						}
					}
				}
			})
		}
	}

	getPointOfInteraction() {
		const positionOfInteract = new Vector(0,0);

		switch(this.player.direction){
			case Direction.Up:
				positionOfInteract.x = this.player.position.x
				positionOfInteract.y = this.player.position.y - 1
				break;
			case Direction.Down:
				positionOfInteract.x = this.player.position.x
				positionOfInteract.y = this.player.position.y + 1
				break;
			case Direction.Left:
				positionOfInteract.x = this.player.position.x - 1
				positionOfInteract.y = this.player.position.y
				break;
			case Direction.Right:
				positionOfInteract.x = this.player.position.x + 1
				positionOfInteract.y = this.player.position.y
				break;
		}

		return positionOfInteract;
	}

	checkForItemUse() {
		if(this.player.itemBeingUsed != -1) {
			const currentItem = this.player.itemBeingUsed;
			this.player.itemBeingUsed = -1;

			const positionOfInteract = this.getPointOfInteraction();

			for(let i = 0; i < this.map.objects.length; i++) {
				if(this.map.objects[i].position.x === positionOfInteract.x && this.map.objects[i].position.y === positionOfInteract.y) {
					if (this.map.objects[i].name == this.player.inventory.inventory[currentItem].target) {
						this.map.objects[i].handleUseItem();
						this.player.inventory.useItem(currentItem);
						return;
					}
				}
			}
			stateStack.push(this.player.inventoryState);
		}
	}

	updateHalo() {
		this.halo.position.x = Math.floor(this.player.canvasPosition.x - 
			                             (this.halo.size / 2 - this.player.dimensions.x / 2))

		this.halo.position.y = Math.floor(this.player.canvasPosition.y -
			                             (this.halo.size / 2 - this.player.dimensions.y / 2) + 22)
	}

	render() {
		context.save();
		context.translate(-this.camera.position.x, -this.camera.position.y);
		this.map.render();
		this.player.render();
		this.halo.render();
		context.restore();
	}
}
