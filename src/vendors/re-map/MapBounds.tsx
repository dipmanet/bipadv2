import { useContext, useEffect, useMemo } from "react";

import { MapChildContext } from "./context";

interface Props {
	bounds?: [number, number, number, number];
	padding?: number;
	duration?: number;
}

const MapBounds: React.FC<Props> = ({ bounds, padding = 0, duration = 200 }) => {
	const { map, setBounds } = useContext(MapChildContext);

	// Memoize validated bounds
	const validatedBounds = useMemo(() => {
		if (!bounds || bounds.length !== 4 || bounds.includes(null as any)) {
			return null;
		}
		return bounds;
	}, [bounds]);

	useEffect(() => {
		if (!map || !validatedBounds) {
			return;
		}

		const [fooLon, fooLat, barLon, barLat] = validatedBounds;

		// Defensive: ensure no undefined coordinates
		if ([fooLon, fooLat, barLon, barLat].some((coord) => coord === undefined || coord === null)) {
			console.warn("Invalid bounds detected:", validatedBounds);
			return;
		}

		setBounds(validatedBounds, padding, duration);

		map.fitBounds(
			[
				[fooLon, fooLat],
				[barLon, barLat],
			],
			{
				padding,
				duration,
			}
		);
	}, [map, validatedBounds, padding, duration, setBounds]);

	return null;
};

export default MapBounds;
