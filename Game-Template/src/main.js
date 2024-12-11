/**
 * The Cannibal's House
 *
 * Seth Nowac and Alexander Burlec-Plaies
 *
 * Brief description
 * In the haunted world where houses are gritty and smell awfully bad. The player 
 * begins his adventure in the cannibals house where he must find all the keys to unlock
 * every door he can find.  
 *
 * Asset sources
 * 
 * Monster Images: https://www.spriters-resource.com/gamecube/bombermanland2/sheet/163108/
 * Player Images: https://www.spriters-resource.com/mobile/romancingsaga2/sheet/111522/
 * Doors Images: https://www.spriters-resource.com/wii/barbieandthethreemusketeers/sheet/200753/
 * 
 * 
 */

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	fonts,
	images,
	keys,
	sounds,
	stateMachine,
	stateStack,
	timer,
} from "./globals.js";
import TitleScreenState from "./states/game/TitleScreenState.js";

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);
// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
} = await fetch('./assets/config/assets.json').then((response) => response.json());

const mapDefinition = [
	await fetch('./assets/config/01_tutorial.json').then((response) => response.json()),
	await fetch('./assets/config/02_hub.json').then((response) => response.json()),
	await fetch('./assets/config/03_puzzleroomA.json').then((response) => response.json()),
	await fetch('./assets/config/04_puzzleroomB.json').then((response) => response.json()),
	await fetch('./assets/config/05_cannibalhall.json').then((response) => response.json())
];

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

// Add all the states to the state machine.
stateStack.push(new TitleScreenState(mapDefinition));

const game = new Game(stateStack, context, timer, CANVAS_WIDTH, CANVAS_HEIGHT);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();



// Add event listeners for player input.
canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});