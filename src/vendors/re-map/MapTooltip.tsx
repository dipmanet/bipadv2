import React, { useContext, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import mapboxgl from "mapbox-gl";

import { MapChildContext } from "./context";

const noop = () => {};

interface Props {
	children: React.ReactElement;
	coordinates: [number, number];
	hidden: boolean;
	onHide?: () => void;
	tooltipOptions?: mapboxgl.PopupOptions;
	trackPointer?: boolean;
}

const MapTooltip = ({
	children,
	coordinates,
	hidden = false,
	tooltipOptions,
	onHide,
	trackPointer = false,
}: Props) => {
	const { map } = useContext(MapChildContext);

	const tooltipContainerRef = useRef<HTMLDivElement | null>(null);
	const popupRef = useRef<mapboxgl.Popup | null>(null);
	const rootRef = useRef<Root | null>(null);

	// Create the tooltip <div> and React root once
	useEffect(() => {
		const tooltipDiv = document.createElement("div");
		tooltipContainerRef.current = tooltipDiv;
		rootRef.current = createRoot(tooltipDiv);

		return () => {
			popupRef.current?.remove();
			rootRef.current?.unmount();
			tooltipContainerRef.current = null;
		};
	}, []);

	// Render the React children into the tooltip div
	useEffect(() => {
		if (!rootRef.current || !tooltipContainerRef.current) return;
		rootRef.current.render(children);
	}, [children]);

	// Initialize and show popup
	useEffect(() => {
		if (!map || !tooltipContainerRef.current || hidden) return noop;

		const popup = new mapboxgl.Popup(tooltipOptions)
			.setDOMContent(tooltipContainerRef.current)
			.addTo(map);

		popupRef.current = popup;
		console.log("popupRefinitialized", popupRef.current);

		if (coordinates) {
			popup.setLngLat(coordinates);
		}
		if (trackPointer) {
			popup.trackPointer();
		}

		return () => {
			popup.remove();
			popupRef.current = null;
		};
	}, [map, hidden, tooltipOptions, trackPointer, coordinates]);

	// Update coordinates when they change (if not tracking pointer)
	useEffect(() => {
		if (!map || !popupRef.current || trackPointer) return;
		popupRef.current.setLngLat(coordinates);
	}, [map, coordinates, trackPointer]);

	// Register close event
	useEffect(() => {
		if (!popupRef.current) return;

		const handleClose = () => {
			onHide?.();
		};

		popupRef.current.on("close", handleClose);
		return () => {
			popupRef.current?.off("close", handleClose);
		};
	}, [map, onHide]);

	return null;
};

export default MapTooltip;
