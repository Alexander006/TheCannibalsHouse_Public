import Animation from "../../../lib/Animation.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import Enemy from "../Enemy.js";
import Direction from "../../enums/Direction.js";
import { images } from "../../globals.js";
import Tile from "../../services/Tile.js";
import Vector from "../../../lib/Vector.js";
import Hitbox from "../../../lib/Hitbox.js";
export default class Zombie extends Enemy{
    static TILE_WIDTH = 32;
    static TILE_HEIGHT = 32;

    static WIDTH = Tile.SIZE
    static HEIGHT = Tile.SIZE

    constructor(map){
        super(map);   
        
        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Zombies),
            Zombie.TILE_HEIGHT,
            Zombie.TILE_WIDTH);   
        
        this.dimensions = new Vector(Zombie.WIDTH, Zombie.HEIGHT); 
       
        const animations = {
            [EnemyStateName.Idle]: {
                [Direction.Up]: new Animation([1], 1),
                [Direction.Down]: new Animation([1], 1),
                [Direction.Left]: new Animation([1], 1),
                [Direction.Right]: new Animation([1], 1),
            },
            [EnemyStateName.Walking]: {
                [Direction.Up]: new Animation([27, 28, 29, 30,31,32,33], 0.2),
                [Direction.Down]: new Animation([27, 28, 29, 30,31,32,33], 0.2),
                [Direction.Left]: new Animation([33,32,31,30,29,28,27], 0.2),
                [Direction.Right]: new Animation([27, 28, 29, 30,31,32,33], 0.2),
            }
        };
        
        this.stateMachine = this.initializeStateMachine(animations);             
    }

    update(dt){
        super.update(dt);
    }

    render(){
        super.render();
    }
}