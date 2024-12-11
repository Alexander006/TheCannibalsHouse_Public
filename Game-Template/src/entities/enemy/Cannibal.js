import Animation from "../../../lib/Animation.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import Enemy from "../Enemy.js";
import Direction from "../../enums/Direction.js";
import { images } from "../../globals.js";

export default class Cannibal extends Enemy{
    static TILE_WIDTH = 38;
    static TILE_HEIGHT = 65;
    

    
    constructor(map){
        super(map);   
             
        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Cannibal),
            Cannibal.TILE_HEIGHT,
            Cannibal.TILE_WIDTH);

        

            const animations = {
                [EnemyStateName.Idle]: {
                    [Direction.Up]: new Animation([86], 1),
                    [Direction.Down]: new Animation([50], 1),
                    [Direction.Left]: new Animation([62], 1),
                    [Direction.Right]: new Animation([74], 1),
                },
                [EnemyStateName.Walking]: {
                    [Direction.Up]: new Animation([84, 85, 86, 85], 0.2),
                    [Direction.Down]: new Animation([48, 49, 50, 49], 0.2),
                    [Direction.Left]: new Animation([60, 61, 62, 61], 0.2),
                    [Direction.Right]: new Animation([72, 73, 74, 73], 0.2),
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