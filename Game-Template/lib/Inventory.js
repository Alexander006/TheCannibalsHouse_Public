import SoundName from "../src/enums/SoundName.js";
import { sounds } from "../src/globals.js";
import Vector from "./Vector.js";

export default class Inventory {
    constructor() {
        this.inventory = [];
        this.wasUpdated = false;
    }

    addItem(item, inSecret = false) {
        if(!inSecret) {
            sounds.play(SoundName.PickupJingle);
        }
        this.inventory.push({name: item.name, target: item.target, image: item.sprites[item.currentFrame], position: new Vector(0,0)})
        this.wasUpdated = true;
    }

    findItemByName(name) {
        for(let i = 0; i < this.inventory.length; i++) {
            if(this.inventory[i].name === name) {
                return true;
            }
        }
        return false;
    }

    useItem(index) {
        this.inventory.splice(index, 1);
        this.wasUpdated = true;
    }
}