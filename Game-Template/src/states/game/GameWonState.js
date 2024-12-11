import State from "../../../lib/State.js"
import Colour from "../../enums/Colour.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, stateStack, timer } from "../../globals.js";
import TitleScreenState from "./TitleScreenState.js";
import TransitionState from "./TransitionState.js";

export default class GameWonState extends State {
	constructor(mapDefinitions) {
		super();

		this.titleScreenState = new TitleScreenState(mapDefinitions);
		this.alpha = 1;
	}

	enter() {
		timer.tween(this, ['alpha'], [0], 2, ()=>{
			timer.addTask(()=>{}, 0, 4, ()=>{
				this.goToTitleScreen();
			})
		})
	}

	render() {
		context.save();
		this.renderGameOverTitle();
		this.renderText();
		context.fillStyle = `rgba(0,0,0, ${this.alpha})`;
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore();
	}

	renderGameOverTitle() {
		context.font = '50px BloodyCre';
		context.textAlign = 'center';
		context.fillStyle = Colour.Crimson;
		context.fillText("The Cannibal's House", CANVAS_WIDTH / 2, 250);
	}

	renderText() {
		context.font = '25px PowerRed';
		context.fillStyle = Colour.Black;
		context.fillText('By', CANVAS_WIDTH / 2 + 2, 302);
		context.fillText('Seth Nowac and Alexander Burlec-Plaies', CANVAS_WIDTH / 2 + 2, 352);
		context.fillStyle = Colour.Crimson;
		context.fillText('By', CANVAS_WIDTH / 2, 300);
		context.fillText('Seth Nowac and Alexander Burlec-Plaies', CANVAS_WIDTH / 2 + 2, 350);
	}

	goToTitleScreen() {
		localStorage.removeItem("cannibal_save");
		TransitionState.fade(() => {
			stateStack.pop();
			stateStack.push(this.titleScreenState);
		}, { r: 0, g: 0, b: 0 }, 1, 1);
	}
}
