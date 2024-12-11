import Colour from "../../enums/Colour.js";
import ImageName from "../../enums/ImageName.js";
import SoundName from "../../enums/SoundName.js";
import { CANVAS_WIDTH, context, images, keys, sounds, stateStack, timer } from "../../globals.js";
import State from "../../../lib/State.js";
import PlayState from "./PlayState.js";
import TransitionState from "./TransitionState.js";
import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import Vector from "../../../lib/Vector.js";

export default class TitleScreenState extends State {
	static POSITION = {
		start: { x: 480, y: 150 },
		mid: { x: 160, y: 150 },
		end: { x: -160, y: 150 },
	}

	static SELECTION_WIDTH = 5;

	/**
	 * Consists of some text fields and a carousel of
	 * sprites that are displayed on the screen. There
	 * is then a fading transition to the next screen.
	 *
	 * @param {object} mapDefinition
	 */
	constructor(mapDefinition) {
		super();

		this.playState = new PlayState(mapDefinition);
		this.background = images.get(ImageName.TitleScreenBackground);
		this.beginHeight = 268;
		this.continueHeight = 313;
		this.quitHeight = 358;
		this.selectionPosition = CANVAS_WIDTH / 2 - 55;
		this.selectionDimensions = new Vector(110, 50)
		this.currentSelection = 0;
		this.selectionHeight = this.beginHeight;
		this.numSelections = 3;
	}

	enter() {
		sounds.play(SoundName.TitleMusic);
	}

	exit() {
		sounds.stop(SoundName.TitleMusic);
	}

	update(dt) {
		if (keys.w || keys.ArrowUp) {
			this.navigateUp();
		}
		else if (keys.s || keys.ArrowDown) {
			this.navigateDown();
		}
		else if (keys.Enter) {
			this.select();
		}
    
    	timer.update(dt);
	}

	navigateUp() {
        keys.w = false;
        keys.ArrowUp = false;

        sounds.play(SoundName.MenuScroll);

        if (this.currentSelection === 0) {
            this.currentSelection = this.numSelections - 1;
        }
        else {
            this.currentSelection--;
        }

		if(this.currentSelection === 0) {
			this.selectionHeight = this.beginHeight;
		} else if (this.currentSelection === 1) {
			this.selectionHeight = this.continueHeight;
		} else {
			this.selectionHeight = this.quitHeight;
		}
    }

    navigateDown() {
        keys.s = false;
        keys.ArrowDown = false;

        sounds.play(SoundName.MenuScroll);

        if (this.currentSelection === this.numSelections - 1) {
            this.currentSelection = 0;
        }
        else {
            this.currentSelection++;
        }

		if(this.currentSelection === 0) {
			this.selectionHeight = this.beginHeight;
		} else if (this.currentSelection === 1) {
			this.selectionHeight = this.continueHeight;
		} else {
			this.selectionHeight = this.quitHeight;
		}
    }

    select() {
        keys.Enter = false;
		sounds.play(SoundName.MenuSelect);

        //sounds.play(SoundName.SelectionChoice);
        if(this.currentSelection === 0) {
			localStorage.removeItem("cannibal_save");
			this.play();
		} else if (this.currentSelection === 1) {
			if (localStorage.getItem("cannibal_save")) {
				this.play();
			}
		} else {
			window.close();
		}
    }

	render() {
		context.save();
		this.renderBackground();
		this.renderSelection();
		this.renderTitle();
		this.renderText();
		context.restore();
	}

	renderSelection() {
		context.fillStyle = Colour.DeepRed;
		roundedRectangle(
			context,
			this.selectionPosition,
			this.selectionHeight,
			this.selectionDimensions.x,
			this.selectionDimensions.y,
			TitleScreenState.SELECTION_WIDTH,
			true,
			false
		);
		context.fillStyle = Colour.Crimson;
		roundedRectangle(
			context,
			this.selectionPosition + 3,
			this.selectionHeight + 3,
			this.selectionDimensions.x - 6,
			this.selectionDimensions.y - 6,
			TitleScreenState.SELECTION_WIDTH,
			true,
			false
		);
	}

	renderBackground() {
		this.background.render(
			0,
			0,
			this.background.width,
			this.background.height
		)
	}

	renderTitle() {
		context.font = '50px BloodyCre';
		context.textAlign = 'center';
		context.fillStyle = Colour.DeepRed;
		context.fillText("The Cannibal's House", CANVAS_WIDTH / 2, 150);
	}

	renderText() {
		context.font = '25px PowerRed';
		context.fillStyle = Colour.Black;
		context.fillText('Begin', CANVAS_WIDTH / 2 + 2, 302);
		context.fillText('Continue', CANVAS_WIDTH / 2 + 2, 347);
		context.fillText('Quit', CANVAS_WIDTH / 2 + 2, 392);
		context.fillStyle = Colour.White;
		context.fillText('Begin', CANVAS_WIDTH / 2, 300);
		context.fillStyle = localStorage.getItem("cannibal_save") ? Colour.White : Colour.Grey;
		context.fillText('Continue', CANVAS_WIDTH / 2, 345);
		context.fillStyle = Colour.White;
		context.fillText('Quit', CANVAS_WIDTH / 2 + 2, 390);
	}

	play() {
		TransitionState.fade(() => {
			stateStack.pop();
			this.playState.map.enter();
			stateStack.push(this.playState);
		}, { r: 0, g: 0, b: 0 }, 1.5, 3);
	}
}
