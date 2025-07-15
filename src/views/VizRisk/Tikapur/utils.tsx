// eslint-disable-next-line import/prefer-default-export
export const getgeoJsonLayer = (layer: string) =>
	[
		`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/ows?`,
		"&version=1.1.0",
		"&service=WFS",
		"&request=GetFeature",
		`&typeName=Bipad:${layer}`,
		"&outputFormat=application/json",
	].join("");
