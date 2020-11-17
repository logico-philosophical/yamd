export default abstract class Node {

	public toString() {
		return this.toIndentedString(0);
	};

	public abstract toIndentedString(level: number): string;
}