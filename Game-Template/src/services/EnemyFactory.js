import Cannibal from "../entities/enemy/Cannibal.js"
import Zombie from "../entities/enemy/Zombie.js"
import EnemyType from "../enums/EnemyType.js";

export default class EnemyFactory{
	/**
	 * Encapsulates the instantiation logic for creating enemies.
	 * This method should be extended when adding new enemy.
	 *
	 * @param {object} type Uses the EnemyType enum.
	 * @returns An instance of an enemy.
	 */
    static createInstance(type, map) {
		switch (type) {
			case EnemyType.Zombie:
				return new Zombie(map);
			case EnemyType.Cannibal:
				return new Cannibal(map);
		}
	}
}