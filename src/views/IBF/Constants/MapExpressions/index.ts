import PurpleMarker from "#resources/icons/PurpleMarker.png";
import Location20 from "#resources/icons/Location20.png";
import Location2 from "#resources/icons/Location2.png";
import Location5 from "#resources/icons/Location5.png";
import LocationDisabled from "#resources/icons/LocationDisabled.png";
import LocationDefault from "#resources/icons/LocationDefault.png";
import indicators from "../Indicators";

// eslint-disable-next-line import/prefer-default-export
export const markerLocations = [
	{
		name: "Location20",
		image: Location20,
	},
	{
		name: "Location2",
		image: Location2,
	},
	{
		name: "Location5",
		image: Location5,
	},
	{
		name: "LocationDisabled",
		image: LocationDisabled,
	},
	{
		name: "LocationDefault",
		image: LocationDefault,
	},
	{
		name: "PurpleMarker",
		image: PurpleMarker,
	},
];

export const getCircleProp = (circleProp, timeLead) => {
	switch (circleProp) {
		case "opacity":
			return [
				"case",
				["==", ["get", "exceed_twenty", ["at", timeLead, ["get", "calculation"]]], true],
				0.6,
				["==", ["get", "exceed_five", ["at", timeLead, ["get", "calculation"]]], true],
				0.6,
				["==", ["get", "exceed_two", ["at", timeLead, ["get", "calculation"]]], true],
				0.6,
				0,
			];
		case "color":
			return [
				"case",
				["==", ["get", "exceed_twenty", ["at", timeLead, ["get", "calculation"]]], true],
				"red",
				["==", ["get", "exceed_five", ["at", timeLead, ["get", "calculation"]]], true],
				"yellow",
				["==", ["get", "exceed_two", ["at", timeLead, ["get", "calculation"]]], true],
				"green",
				"white",
			];
		case "strokewidth":
			return [
				"case",
				["==", ["get", "exceed_twenty", ["at", timeLead, ["get", "calculation"]]], true],
				1,
				["==", ["get", "exceed_five", ["at", timeLead, ["get", "calculation"]]], true],
				1,
				["==", ["get", "exceed_two", ["at", timeLead, ["get", "calculation"]]], true],
				1,
				0,
			];
		default:
	}
	return null;
};

export const getRasterLayer = (years: number) =>
	[
		`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
		"&version=1.1.1",
		"&service=WMS",
		"&request=GetMap",
		`&layers=Bipad:IBF_Meteor_Flood_FD_1in${years}`,
		// `&layers=Bipad:Vector_FD_1in${years}`,
		"&tiled=true",
		"&width=256",
		"&height=256",
		"&srs=EPSG:3857",
		"&bbox={bbox-epsg-3857}",
		"&transparent=true",
		"&format=image/png",
		// '&CQL_FILTER=BBOX(the_geom, 81.2902824581022,
		//  28.2204802166605, 81.4884978072765, 28.4247247855239)',
	].join("");

export const getScore = (location, indicatorSelected) => {
	if (indicatorSelected === "risk") {
		const score = location.normalized_risk_score
			? location.normalized_risk_score
			: location.risk_score;
		return `<div style="padding: 5px;border-radius: 5px">
        <p>Risk Score: ${score && score !== 0 ? score.toFixed(2) : 0}</p>
    </div>
    `;
	}
	if (indicatorSelected === "hazard") {
		const score = location.normalized_hazard_and_exposure;
		return `<div style="padding: 5px;border-radius: 5px">
        <p>Hazard and expossure: ${score && score !== 0 ? score.toFixed(2) : 0}</p>
    </div>
    `;
	}
	if (indicatorSelected === "vulnerability") {
		const score = location.normalized_vulnerability;
		return `<div style="padding: 5px;border-radius: 5px">
        <p>Vulnerability: ${score && score !== 0 ? score.toFixed(2) : 0}</p>
    </div>
    `;
	}
	if (indicatorSelected === "lackOfCopingCapacity") {
		const score = location.normalized_lack_of_coping_capacity;
		return `<div style="padding: 5px;border-radius: 5px">
        <p>Lack of coping capacity: ${score && score !== 0 ? score.toFixed(2) : 0}</p>
    </div>
    `;
	}
	return "";
};

export const getPaint = (layer) => indicators[layer];
