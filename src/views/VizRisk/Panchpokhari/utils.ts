export const getGeoJSON = (filterBy: string, data: any) => {
    const geoObj = {};
    geoObj.type = 'FeatureCollection';
    geoObj.name = filterBy;
    geoObj.features = [];
    const d = data.features.filter(item => item.properties.CI === filterBy);
    geoObj.features.push(...d);
    return geoObj;
};
export const getGeoJSONPH = (filterBy: string, data: any) => {
    const geoObj = {};
    geoObj.type = 'FeatureCollection';
    geoObj.name = filterBy;
    geoObj.features = [];
    const d = data.features.filter(item => item.properties.Type === filterBy);
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

export const getgeoJsonLayer = (layer: string) => [
    `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/ows?`,
    '&version=1.1.0',
    '&service=WFS',
    '&request=GetFeature',
    `&typeName=Bipad:${layer}`,
    '&outputFormat=application/json',
].join('');

export const getbuildingVul = (d) => {
    if (d.length > 0) {
        const arr = d.filter(item => item.vulnerabilityScore !== undefined);
        if (arr.length > 0) {
            const low = arr.filter(v => v.vulnerabilityScore < 50).length;
            const med = arr.filter(v => v
                .vulnerabilityScore >= 50 && v.vulnerabilityScore < 60).length;
            const high = arr.filter(v => v.vulnerabilityScore >= 60).length;
            return {
                low,
                med,
                high,
            };
        }
        return {
            low: '-',
            medium: '-',
            high: '-',
        };
    }
    return {
        low: '-',
        medium: '-',
        high: '-',
    };
};

export const getfoundationTypeChartData = (d) => {
    if (d.length > 0) {
        const typeArr = [...new Set(
            d.map(i => i.foundationType).filter(f => f !== undefined),
        )];

        return typeArr.map(ftype => ({
            name: ftype,
            Total: d.filter(f => f.foundationType === ftype).length,
        }));
    }
    return [];
};

export const getsocialFactorChartData = (d) => {
    const socialChartref = {
        noOfMale: 'Male',
        noOfFemale: 'Female',
        peopleWithDisability: 'PWD',
        ownership: 'Women Headed',
    };
    if (d.length > 0) {
        const totalMFData = d.reduce((a, b) => (
            {
                noOfMale: (a.noOfMale || 0) + (b.noOfMale || 0),
                noOfFemale: (a.noOfFemale || 0) + (b.noOfFemale || 0),
                peopleWithDisability: (a.peopleWithDisability || 0) + (b.peopleWithDisability || 0),
            }
        ));

        totalMFData.ownership = d.filter(wh => wh.ownership === 'Female').length;
        console.log('totalMFData', totalMFData);
        const arr = Object.keys(totalMFData);
        const chartData = arr.map(g => ({
            name: socialChartref[g],
            Total: totalMFData[g],
        }));
        console.log('chartData', chartData);
        return chartData;
    }


    return [];
};

export const getageGroupChartData = (d) => {
    if (d.length > 0) {
        const totalMFData = d.reduce((a, b) => (
            {
                seniorCitizens: (a.seniorCitizens || 0) + (b.seniorCitizens || 0),
                childrenUnder5: (a.childrenUnder5 || 0) + (b.childrenUnder5 || 0),
                totalPopulation: (a.totalPopulation || 0) + (b.totalPopulation || 0),
            }
        ));

        const finalData = {
            '>65': totalMFData.seniorCitizens,
            '6-64': totalMFData.totalPopulation - totalMFData.seniorCitizens - totalMFData.childrenUnder5,
            '<5': totalMFData.childrenUnder5,
        };

        console.log('totalMFData', finalData);
        const arr = Object.keys(finalData);
        const chartData = arr.map(g => ({
            name: g,
            Total: finalData[g],
        }));
        console.log('chartData', chartData);
        return chartData;
    }


    return [];
};
