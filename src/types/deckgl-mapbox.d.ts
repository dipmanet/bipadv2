declare module "@deck.gl/mapbox" {
	import { Layer, LayerProps } from "@deck.gl/core";

	export class MapboxLayer<T = unknown> extends Layer<T> {
		constructor(props: LayerProps<T>);
	}
}
