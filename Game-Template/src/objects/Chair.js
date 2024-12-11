
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import EventName from "../enums/EventName.js";
import ImageName from "../enums/ImageName.js";
import { images, timer } from "../globals.js";
import Tile from "../services/Tile.js";
import MoveableObject from "./MoveableObject.js";

export default class Chair extends MoveableObject {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE;

    constructor(dimensions, position, map, direction){
        super(dimensions, position, map);

        this.direction = direction;

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Props_1),
            Chair.WIDTH,
            Chair.HEIGHT
        );

        if(direction == Direction.Up) {
            this.currentFrame = 240;
        } else if (direction == Direction.Right) {
            this.currentFrame = 241;
        } else {
            throw new Error("Direction of a chair can only be up or right");
        }
    }
}