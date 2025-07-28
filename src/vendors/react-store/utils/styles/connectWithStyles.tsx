import React, { useEffect, useState, useCallback } from "react";
import { currentStyle } from "./index";

// Define types for styles and props
interface Styles {
	[key: string]: any; // Replace with actual style type if known
}

interface ConnectWithStylesProps {
	currentStyles: Styles;
	updatedStyles: Styles;
	[key: string]: any; // Allow additional props
}

const connectWithStyles = <P extends ConnectWithStylesProps>(
	WrappedComponent: React.ComponentType<P>,
	styleList: string[] = []
) => {
	const WrappedWithStyles: React.FC<Omit<P, keyof ConnectWithStylesProps>> = (props) => {
		const [stylesState, setStylesState] = useState<{
			currentStyles: Styles;
			updatedStyles: Styles;
		}>({
			currentStyles: { ...currentStyle },
			updatedStyles: {},
		});

		const handleStyleUpdate = useCallback(
			({ updatedStyles }: { updatedStyles: Styles }) => {
				// Only update if styleList is empty or updatedStyles contains a relevant key
				const shouldUpdate =
					styleList.length === 0 || styleList.some((style) => updatedStyles[style]);

				if (shouldUpdate) {
					setStylesState({
						updatedStyles,
						currentStyles: { ...currentStyle }, // Create new object as in original
					});
				}
			},
			[styleList]
		);

		useEffect(() => {
			// Add event listener
			document?.addEventListener("styleupdate", handleStyleUpdate);

			// Cleanup on unmount
			return () => {
				document?.removeEventListener("styleupdate", handleStyleUpdate);
			};
		}, [handleStyleUpdate]);

		return (
			<WrappedComponent
				{...(props as P)}
				currentStyles={stylesState.currentStyles}
				updatedStyles={stylesState.updatedStyles}
			/>
		);
	};

	// Set display name for better debugging
	WrappedWithStyles.displayName = `ConnectWithStyles(${
		WrappedComponent.displayName || WrappedComponent.name || "Component"
	})`;

	return WrappedWithStyles;
};

export default connectWithStyles;
