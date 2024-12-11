
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import EventName from "../enums/EventName.js";
import ImageName from "../enums/ImageName.js";
import { images, timer } from "../globals.js";
import Tile from "../services/Tile.js";
import MoveableObject from "./MoveableObject.js";

export default class Barrel extends MoveableObject {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE;

    constructor(dimensions, position, map){
        super(dimensions, position, map);

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Props_1),
            Barrel.WIDTH,
            Barrel.HEIGHT
        );

        this.currentFrame = 169;
    }
}