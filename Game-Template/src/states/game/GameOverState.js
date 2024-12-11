import State from "../../../lib/State.js"
import Colour from "../../enums/Colour.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, stateStack, timer } from "../../globals.js";
import TitleScreenState from "./TitleScreenState.js";
import TransitionState from "./TransitionState.js";

export default class GameOverState extends State {
	constructor(mapDefinitions) {
		super();

		this.titleScreenState = new TitleScreenState(mapDefinitions);
		this.alpha = 1;
	}

	enter() {
		timer.addTask(()=>{}, 0, 3, ()=>{
			timer.tween(this, ['alpha'], [0], 2, ()=>{
				timer.addTask(()=>{}, 0, 3, ()=>{
					this.goToTitleScreen();
				})
			})
		})
	}

	render() {
		context.save();
		this.renderGameOverTitle();
		context.fillStyle = `rgba(0,0,0, ${this.alpha})`;
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore();
	}

	renderGameOverTitle() {
		context.font = '50px BloodyCre';
		context.textAlign = 'center';
		context.fillStyle = Colour.DeepRed;
		context.fillText("Game Over!", CANVAS_WIDTH / 2, 250);
	}

	goToTitleScreen() {
		TransitionState.fade(() => {
			stateStack.pop();
			stateStack.push(this.titleScreenState);
		}, { r: 0, g: 0, b: 0 }, 1, 1);
	}
}
