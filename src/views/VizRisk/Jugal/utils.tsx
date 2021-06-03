export const getGeoJSON = (filterBy: string, data: any) => {
    const geoObj = {};
    geoObj.type = 'FeatureCollection';
    geoObj.name = filterBy;
    geoObj.features = [];
    const d = data.features.filter(item => item.properties.CI === filterBy);
    geoObj.features.push(...d);
    return geoObj;
};
// Jugal_hillshade
export const getHillShadeLayer = (layer: string) => [
    `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
    '&version=1.1.1',
    '&service=WMS',
    '&request=GetMap',
    `&layers=Bipad:${layer}`,
    '&tiled=true',
    '&width=256',
    '&height=256',
    '&srs=EPSG:3857',
    '&bbox={bbox-epsg-3857}',
    '&transparent=true',
    '&format=image/png',
].join('');
