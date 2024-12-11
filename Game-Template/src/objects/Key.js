import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Tile from "../services/Tile.js";
import GameObject from "./GameObject.js";

export default class Key extends GameObject {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE;

    constructor(dimensions, position, name, target){
        super(dimensions, position)

        this.name = name;
        this.target = target;

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Key),
            Key.WIDTH,
            Key.HEIGHT
        );
    }
}