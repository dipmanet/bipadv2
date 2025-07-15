// Check permission for the user
// eslint-disable-next-line import/prefer-default-export

import styles from "./popupstyles.module.scss";

export const checkPermission = (user, codeName, app) => {
	let permission = false;
	if (!user) {
		permission = false;
	} else if (user.isSuperuser) {
		permission = true;
	}
	if (user && user.groups) {
		user.groups.forEach((group) => {
			if (group.permissions) {
				group.permissions.forEach((p) => {
					if (p.codename === codeName && p.app === app) {
						permission = true;
					}
				});
			} else {
				permission = false;
			}
		});
	}
	if (user && user.userPermissions) {
		user.userPermissions.forEach((a) => {
			if (a.codename === codeName && a.app === app) {
				permission = true;
			}
		});
	} else {
		permission = false;
	}
	return permission;
	// temporary set true to all user for testing
	// return true;
};

const dataItemsPopup = {
	buildingCondition: "Building Condition",
	storeys: "Storyes",
	groundSurface: "Ground Surface",
	foundationType: "Foundation Type",
	roofType: "Roof Type",
	damageGrade: "Damage Grade",
	nameOfHouseOwner: "Name of House Owner",
	ageOfHouseOwner: "Age of House Owner",
	ownership: "Ownership",
	noOfMale: "No. of Males",
	noOfFemale: "No. of Females",
	noOfOther: "No. of Others Gender",
	totalPopulation: "Total Population",
	peopleWithDisability: "People with Disability",
	seniorCitizens: "Senior Citizens",
	chronicallyIll: "Chronically Ill",
	pregnantWomen: "Pregnant Women",
	childrenUnderFive: "Children Under Five",
	singleWomen: "Single Women",
	majorOccupation: "Major Occupation",
	supportingOccupation: "Supporting Occupation",
	averageAnnualIncome: "Average Annual Income",
	healthPostDistance: "Health Post Distance",
	schoolDistance: "School Distance",
	roadDistance: "Road Distance",
	policeStationDistance: "Police Station Distance",
	drinkingWaterDistance: "Drinking Wate Distance",
	openSafeSpaceDistance: "Open Space Distance",
	flashFlood: "Flash Flood",
};

export const popupElement = (buildingData, msg, handleClick, showButton, permission) => {
	const content = document.createElement("div");
	const heading = document.createElement("h2");
	heading.innerHTML = msg;

	if (showButton) {
		heading.classList.add(styles.heading);
		content.classList.add(styles.content);
	} else {
		heading.classList.add(styles.noDataHeading);
		content.classList.add(styles.noDataContent);
	}
	content.appendChild(heading);

	if (Object.keys(buildingData).length > 2) {
		Object.keys(dataItemsPopup).map((item) => {
			const listItem = document.createElement("div");
			listItem.classList.add(styles.listItem);
			const l = document.createElement("span");
			const m = document.createElement("span");
			if (buildingData[item]) {
				l.innerHTML = `${dataItemsPopup[item]}`;
				l.style.fontWeight = "bold";
				m.innerHTML = `${buildingData[item]}`;
				m.classList.add(styles.m);
				listItem.appendChild(l);
				listItem.appendChild(m);
				content.appendChild(listItem);
			}
			return null;
		});
	}
	if (permission && showButton) {
		const buttonContainer = document.createElement("div");
		buttonContainer.classList.add(styles.btnContainer);
		const button = document.createElement("BUTTON");
		button.innerHTML = "Add/Edit Details";
		button.addEventListener("click", handleClick, false);
		button.classList.add(styles.addButton);
		buttonContainer.appendChild(button);
		content.appendChild(buttonContainer);
	}

	return content;
};

const safeItems = {
	// Title: 'Safe Shelter House, Chanaura',
	Capacity: "Shelter Capacity",
	altitude: "Altitude",
	// precision: 'Precision',
	Ward: "Ward",
	BuildingCo: "Building Code",
	Cooking: "Cooking",
	DisableFri: "Disable Friendly",
	DrinkingWa: "Drinking Water",
	Toilet: "Toilet Available",
	AreInvento: "Are inventories available for disaster response?",
	Structure: "Structure(single or multiple storey)",
	"Local Add": "Local Address",
};

export const popupElementFlood = (safeshelterObj) => {
	const content = document.createElement("div");
	const heading = document.createElement("h2");
	heading.innerHTML = safeshelterObj.Title;
	heading.classList.add(styles.heading);
	content.classList.add(styles.content);
	content.appendChild(heading);

	if (Object.keys(safeshelterObj).length > 2) {
		Object.keys(safeItems).map((item) => {
			const listItem = document.createElement("div");
			listItem.classList.add(styles.listItem);
			const l = document.createElement("span");
			const m = document.createElement("span");
			if (safeshelterObj[item]) {
				l.innerHTML = `${safeItems[item]}`;
				l.style.fontWeight = "bold";
				m.innerHTML = `${safeshelterObj[item]}`;
				m.classList.add(styles.m);
				listItem.appendChild(l);
				listItem.appendChild(m);
				content.appendChild(listItem);
			}
			return null;
		});
	}
	return content;
};

export const drawStyle = [
	{
		id: "gl-draw-polygon-fill-inactive",
		type: "fill",
		filter: [
			"all",
			["==", "active", "false"],
			["==", "$type", "Polygon"],
			["!=", "mode", "static"],
		],
		paint: {
			"fill-color": "#3bb2d0",
			"fill-outline-color": "#3bb2d0",
			"fill-opacity": 0.1,
		},
	},
	{
		id: "gl-draw-polygon-fill-active",
		type: "fill",
		filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
		paint: {
			"fill-color": "#fbb03b",
			"fill-outline-color": "#fbb03b",
			"fill-opacity": 0.1,
		},
	},
	{
		id: "gl-draw-polygon-midpoint",
		type: "circle",
		filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
		paint: {
			"circle-radius": 3,
			"circle-color": "#fbb03b",
		},
	},
	{
		id: "gl-draw-polygon-stroke-inactive",
		type: "line",
		filter: [
			"all",
			["==", "active", "false"],
			["==", "$type", "Polygon"],
			["!=", "mode", "static"],
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#3bb2d0",
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-polygon-stroke-active",
		type: "line",
		filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#fbb03b",
			"line-dasharray": [0.2, 2],
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-line-inactive",
		type: "line",
		filter: [
			"all",
			["==", "active", "false"],
			["==", "$type", "LineString"],
			["!=", "mode", "static"],
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#3bb2d0",
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-line-active",
		type: "line",
		filter: ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#fbb03b",
			"line-dasharray": [0.2, 2],
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
		type: "circle",
		filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
		paint: {
			"circle-radius": 5,
			"circle-color": "#fff",
		},
	},
	{
		id: "gl-draw-polygon-and-line-vertex-inactive",
		type: "circle",
		filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
		paint: {
			"circle-radius": 3,
			"circle-color": "#fbb03b",
		},
	},
	{
		id: "gl-draw-point-point-stroke-inactive",
		type: "circle",
		filter: [
			"all",
			["==", "active", "false"],
			["==", "$type", "Point"],
			["==", "meta", "feature"],
			["!=", "mode", "static"],
		],
		paint: {
			"circle-radius": 5,
			"circle-opacity": 1,
			"circle-color": "#fff",
		},
	},
	{
		id: "gl-draw-point-inactive",
		type: "circle",
		filter: [
			"all",
			["==", "active", "false"],
			["==", "$type", "Point"],
			["==", "meta", "feature"],
			["!=", "mode", "static"],
		],
		paint: {
			"circle-radius": 3,
			"circle-color": "#3bb2d0",
		},
	},
	{
		id: "gl-draw-point-stroke-active",
		type: "circle",
		filter: ["all", ["==", "$type", "Point"], ["==", "active", "true"], ["!=", "meta", "midpoint"]],
		paint: {
			"circle-radius": 7,
			"circle-color": "#fff",
		},
	},
	{
		id: "gl-draw-point-active",
		type: "circle",
		filter: ["all", ["==", "$type", "Point"], ["!=", "meta", "midpoint"], ["==", "active", "true"]],
		paint: {
			"circle-radius": 5,
			"circle-color": "#fbb03b",
		},
	},
	{
		id: "gl-draw-polygon-fill-static",
		type: "fill",
		filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
		paint: {
			"fill-color": "#404040",
			"fill-outline-color": "#404040",
			"fill-opacity": 0.1,
		},
	},
	{
		id: "gl-draw-polygon-stroke-static",
		type: "line",
		filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#404040",
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-line-static",
		type: "line",
		filter: ["all", ["==", "mode", "static"], ["==", "$type", "LineString"]],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#404040",
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-point-static",
		type: "circle",
		filter: ["all", ["==", "mode", "static"], ["==", "$type", "Point"]],
		paint: {
			"circle-radius": 5,
			"circle-color": "#404040",
		},
	},

	{
		id: "gl-draw-polygon-color-picker",
		type: "fill",
		// filter: ['all', ['==', '$type', 'Polygon'],
		//     ['has', 'user_portColor'],
		// ],
		paint: {
			"fill-color": "#ff0000",
			"fill-outline-color": "#ffffff",
			"fill-opacity": 0.1,
		},
	},
	{
		id: "gl-draw-line-color-picker",
		type: "line",
		// filter: ['all', ['==', '$type', 'LineString'],
		//     ['has', 'user_portColor'],
		// ],
		paint: {
			"line-color": "#ffffff",
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-point-color-picker",
		type: "circle",
		// filter: ['all', ['==', '$type', 'Point'],
		//     ['has', 'user_portColor'],
		// ],
		paint: {
			"circle-radius": 3,
			"circle-color": "#ffffff",
		},
	},
];

export const ciRef = {
	"Water sources": "Water Source",
	"Trade and business (groceries, meat, textiles)": "Trade and business",
	"Industry/ hydropower": "Industry",
	"Hotel/resort/homestay": "Hotel or Restaurant",
	Health: "Hospital",
	"Government Buildings": "Government Building",
	Bridge: "Bridge",
	"Community buildings": "Community Building",
	"Cultural heritage sites": "Cultural Heritage",
	Finance: "Financial Institution",
	Education: "Education Institution",
};

export const rasterLayers = ["5", "10", "20", "50", "75", "100", "200", "250", "500", "1000"];

export const getFloodRasterLayer = (layerName: string) =>
	[
		`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
		"&version=1.1.1",
		"&service=WMS",
		"&request=GetMap",
		`&layers=Bipad:Panchpokhari_FD_1in${layerName}`,
		"&tiled=true",
		"&width=256",
		"&height=256",
		"&srs=EPSG:3857",
		"&bbox={bbox-epsg-3857}",
		"&transparent=true",
		"&format=image/png",
	].join("");
