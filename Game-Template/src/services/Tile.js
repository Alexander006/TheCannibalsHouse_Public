export default class Tile {
	static SIZE = 48;
	static GRASS = 6;

	/**
	 * Represents one tile in a Layer and on the screen.
	 *
	 * @param {number} id
	 * @param {array} sprites
	 */
	constructor(id, sprites) {
		this.sprites = sprites;
		this.id = id;
	}

	render(x, y) {
		this.sprites[this.id].render(x * Tile.SIZE, y * Tile.SIZE);
	}
}
