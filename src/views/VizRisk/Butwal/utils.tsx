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
        const arr = d.filter(item => typeof item.vulnerabilityScore === 'number');
        if (arr.length > 0) {
            const low = arr.filter(v => v.vulnerabilityScore < 50).length;
            const medium = arr.filter(v => v
                .vulnerabilityScore >= 50 && v.vulnerabilityScore < 60).length;
            const high = arr.filter(v => v.vulnerabilityScore >= 60).length;
            return {
                low,
                medium,
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
        noOfFemale: 'Female',
        peopleWithDisability: 'People with Disability',
        totalPopulation: 'Number of People',
    };
    if (d.length > 0) {
        const totalMFData = d.reduce((a, b) => (
            {
                totalPopulation: (a.totalPopulation || 0) + (b.totalPopulation || 0),
                noOfFemale: (a.noOfFemale || 0) + (b.noOfFemale || 0),
                peopleWithDisability: (a.peopleWithDisability || 0) + (b.peopleWithDisability || 0),
            }
        ));

        const arr = Object.keys(totalMFData);
        const chartData = arr.map(g => ({
            name: socialChartref[g],
            Total: totalMFData[g],
        }));
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

        const arr = Object.keys(finalData);
        const chartData = arr.map(g => ({
            name: g,
            Total: finalData[g],
        }));
        return chartData;
    }
    return [];
};

export const getownershipChartData = (d) => {
    if (d.length > 0) {
        const typeArr = [...new Set(
            d.map(i => i.ownership).filter(f => f !== undefined),
        )];

        return typeArr.map(ftype => ({
            name: ftype,
            Total: d.filter(f => f.ownership === ftype).length,
        }));
    }
    return [];
};

export const getsourceofIncomeChartData = (d) => {
    if (d.length > 0) {
        const typeArr = [...new Set(
            d.map(i => i.majorOccupation).filter(f => f !== undefined),
        )];

        return typeArr.map(ftype => ({
            name: ftype,
            Total: d.filter(f => f.majorOccupation === ftype).length,
        }));
    }
    return [];
};
export const getaverageAnnualincomeChartData = (d) => {
    if (d.length > 0) {
        const typeArr = [...new Set(
            d.map(i => i.averageAnnualIncome).filter(f => f !== undefined),
        )];
        const arr = [
            {
                name: '>500000',
                Total: d.filter(item => item.averageAnnualIncome >= 50000).length,
            },
            {
                name: '300000-500000',
                Total: d.filter(item => item.averageAnnualIncome >= 300000
                    && item.averageAnnualIncome < 500000).length,
            },
            {
                name: '100000-300000',
                Total: d.filter(item => item.averageAnnualIncome >= 100000
                    && item.averageAnnualIncome < 300000).length,
            },
            {
                name: '<100000',
                Total: d.filter(item => item.averageAnnualIncome < 100000).length,
            },
        ];
        return arr;
        // return typeArr.map(ftype => ({
        //     name: ftype,
        //     Total: d.filter(f => f.averageAnnualIncome === ftype).length,
        // }));
    }
    return [];
};

export const getsingularAgeGroupsChart = (d) => {
    console.log('agegroup chart object', d);
    if (
        typeof d === 'object'
    && d.seniorCitizens !== undefined
    && d.totalPopulation !== undefined
    && d.childrenUnderFive !== undefined
    ) {
        const finalData = {
            '>65': d.seniorCitizens || 0,
            '6-64': d.totalPopulation - d.seniorCitizens - d.childrenUnderFive,
            '<5': d.childrenUnderFive,
        };

        const arr = Object.keys(finalData);
        const chartData = arr.map(g => ({
            name: g,
            Total: finalData[g],
        }));
        return chartData;
    }


    return [];
};

export const getSingularBuildingData = (osmID, buildingsData) => {
    if (osmID) {
        const d = buildingsData.filter(o => o.osmId === Number(osmID));
        if (d.length > 0) {
            return d[0];
        }
    }
    return {};
};
