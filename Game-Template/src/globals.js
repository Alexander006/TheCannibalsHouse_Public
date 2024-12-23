import Fonts from "../lib/Fonts.js";
import Images from "../lib/Images.js";
import Sounds from "../lib/Sounds.js";
import StateMachine from "../lib/StateMachine.js";
import Timer from "../lib/Timer.js";
import StateStack from "../lib/StateStack.js"
import EnemyFactory from "../src/services/EnemyFactory.js"

export const canvas = document.createElement('canvas');
export const context = canvas.getContext('2d') || new CanvasRenderingContext2D();

// Replace these values according to how big you want your canvas.
export const CANVAS_WIDTH = 720;
export const CANVAS_HEIGHT = 480;

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateStack = new StateStack();
export const stateMachine = new StateMachine();
export const timer = new Timer();
export const sounds = new Sounds();

export const enemyFactory = new EnemyFactory();
export const DEBUG = false;
