import heatwaveIcon from '#resources/icons/heatwave.svg';
import landslideIcon from '#resources/icons/landslide.svg';
import waterIcon from '#resources/icons/water.svg';
import cycloneIcon from '#resources/icons/cyclone.svg';

import alertIcon from '#resources/icons/Alert.svg';
import airCrashIcon from '#resources/icons/Airport-destroyed.svg';
import animalTerrorIcon from '#resources/icons/Animal-terror.svg';
import avalancheIcon from '#resources/icons/Snow-avalanche.svg';
import boatCapsizeIcon from '#resources/icons/Boat.svg';
import bridgeCollapseIcon from '#resources/icons/Bridge-destroyed.svg';
import coldwaveIcon from '#resources/icons/Cold-wave.svg';
import drowningIcon from '#resources/icons/Drowned.svg';
import earthquakeIcon from '#resources/icons/Earthquake.svg';
import epidemicIcon from '#resources/icons/Epidemic.svg';
import fireIcon from '#resources/icons/Fire.svg';
import floodIcon from '#resources/icons/Flood.svg';
import forestFireIcon from '#resources/icons/Forest-fire.svg';
import hailstoneIcon from '#resources/icons/Hailstone.svg';
import heavyRainfallIcon from '#resources/icons/Heavy-rain.svg';
import helicopterCrashIcon from '#resources/icons/Helicopter.svg';
import highAltitudeIcon from '#resources/icons/High-altitude.svg';
import otherIcon from '#resources/icons/Warning-Error.svg';
import rainfallIcon from '#resources/icons/Rain.svg';
import snakeBiteIcon from '#resources/icons/Snake.svg';
import thunderboltIcon from '#resources/icons/Storm.svg';
// import snowStormIcon from '#resources/icons/.svg';
// import stormIcon from '#resources/icons/Storm.svg';
// import windstormIcon from '#resources/icons/Storm-surge.svg';


export const hazardIcons = {
    1: airCrashIcon,
    2: animalTerrorIcon,
    3: avalancheIcon,
    4: boatCapsizeIcon,
    5: bridgeCollapseIcon,
    6: coldwaveIcon,
    7: drowningIcon,
    8: earthquakeIcon,
    9: epidemicIcon,
    10: fireIcon,
    11: floodIcon,
    12: forestFireIcon,
    13: hailstoneIcon,
    14: heavyRainfallIcon,
    15: helicopterCrashIcon,
    16: highAltitudeIcon,
    17: landslideIcon,
    18: otherIcon,
    19: rainfallIcon,
    20: snakeBiteIcon,
    // 21: snowStormIcon,
    // 22: stormIcon,
    23: thunderboltIcon,
    // 24: windstormIcon,

    unknown: alertIcon,
};

// NOTE: probably unused
export const hazardTypeList = [
    { key: 'earthquake', label: 'Earthquake', icon: earthquakeIcon },
    { key: 'urbanFlood', label: 'Urban flood', icon: floodIcon },
    { key: 'costalFlood', label: 'Costal flood', icon: floodIcon },
    { key: 'landslide', label: 'Landslide', icon: landslideIcon },
    { key: 'wildfire', label: 'Wildfire', icon: fireIcon },
    { key: 'waterScarcity', label: 'Water scarcity', icon: waterIcon },
    { key: 'extremeHeat', label: 'Extreme heat', icon: heatwaveIcon },
    { key: 'cyclone', label: 'Cyclone', icon: cycloneIcon },
];

// NOTE: remove all of the variables below

export const donutChartData1 = [
    { label: 'Wildfire', value: 19 },
    { label: 'Cyclone', value: 5 },
    { label: 'Landslides', value: 13 },
];

export const donutChartData2 = [
    { label: 'Earthquake', value: 10 },
    { label: 'Flood', value: 15 },
    { label: 'Landslides', value: 23 },
];

export const pieChartData = [
    { label: 'Earthquake', value: 19 },
    { label: 'Flood', value: 5 },
    { label: 'Landslides', value: 13 },
];

export const barChartData = [
    { label: 'Health', value: 19 },
    { label: 'Pollution', value: 5 },
    { label: 'Disasters', value: 13 },
    { label: 'Refugees', value: 17 },
    { label: 'Crisis', value: 19 },
    { label: 'Environment', value: 27 },
];
