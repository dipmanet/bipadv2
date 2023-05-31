/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
// Calculate calendar view data
export const calendarData = (stations, selectedStation) => {
    let stationsForCalendar;
    if (Object.keys(selectedStation).length > 0) {
        stationsForCalendar = stations.features
            .filter(item => item.id === selectedStation.id);
    } else {
        stationsForCalendar = stations.features
            .filter(item => item.properties.is_activated === true);
    }

    let toProduceDates;
    if (stationsForCalendar.length > 0) {
        toProduceDates = stationsForCalendar[0].properties.calculation[0].recorded_date;
    }

    const twoDArray = stationsForCalendar.map((item) => {
        const twoDArrayValues: number[] = [];
        // eslint-disable-next-line no-unused-expressions
        item.properties.calculation && item.properties.calculation.length > 0 && item.properties.calculation.map((leadtime) => {
            if (leadtime.exceed_five || leadtime.exceed_twenty || leadtime.exceed_two) {
                twoDArrayValues.push(1);
            } else {
                twoDArrayValues.push(0);
            }
            return null;
        });
        return twoDArrayValues;
    });


    const sumOfTwoDArrayValues: number[] = [];
    const totalActiveStations = stationsForCalendar.length;

    // eslint-disable-next-line no-plusplus
    for (let j = 1; j < 11; j++) {
        sumOfTwoDArrayValues[j] = 0;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < totalActiveStations; i++) {
            sumOfTwoDArrayValues[j] += twoDArray[i][j];
        }
    }


    const baseDate = new Date(toProduceDates);
    const producedDates = (Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        x => (baseDate.setDate(baseDate.getDate() + 1))));

    const producedDatesArray = producedDates.map((dateItem, index) => (
        { date: dateItem, status: sumOfTwoDArrayValues[index + 1] }));

    return producedDatesArray;
};

// filter unique district, municipality or wards
export const uniquePlace = (data, comparator) => {
    const uniqueArr = [...new Set(data.map(item => item[comparator]))];
    return uniqueArr;
};

// Returns district name for the districtID
export const getDistrictName = (district, districtId) => {
    const result = district.filter(item => item.id === Number(districtId));
    return result[0].title;
};

// Returns municipality name for the municipality
export const getMunicipalityName = (municipality, municipalityId) => {
    const result = municipality.filter(item => item.id === Number(municipalityId));
    if (result && result[0]) {
        return result[0].title;
    }
    return '';
};

// Returns the row for overall summary
export const getRow = (data, district, mystationdata) => {
    // Get name of the district
    const result = district.filter(item => item.id === data);
    const dist = result[0].title;

    // Get municipality and ward count for district
    const filteredStation = mystationdata.filter(item => item.district === data);
    const totalWards = uniquePlace(filteredStation, 'ward');
    const totalMuncipality = uniquePlace(filteredStation, 'municipality');
    const totalWard = (totalWards[0] !== null) ? totalWards.length : 'N/A';
    return [dist, totalMuncipality.length, totalWard];
};

// Returns the row for district summary
export const getDistrictRow = (data, municipality, mystationdata) => {
    // Get name of the municipality
    const result = municipality.filter(item => item.id === data);
    const mun = result[0].title;

    // Get ward count for district
    const filteredStation = mystationdata.filter(item => item.municipality === data);
    const totalWards = uniquePlace(filteredStation, 'ward');
    const totalWard = (totalWards[0] !== null) ? totalWards.length : 'N/A';
    return [mun, totalWard];
};
// Returns the row for district summary
export const getTotalDistrictRow = (data, municipality, ward) => {
    // Get name of the municipality
    const result = municipality.filter(item => item.id === data);
    const mun = result[0].title;

    // Get ward count for district
    const totalWards = ward.filter(item => item.municipality === data);
    // const totalWards = uniquePlace(filteredStation, 'ward');
    // const totalWard = (totalWards[0] !== null) ? totalWards.length : 'N/A';

    return [mun, totalWards.length];
};

// Returns the row for municipality summary
export const getMunicipalityRow = (mystationdata, municipalityid, municipality, ward) => {
    // Get name of the municipality
    const result = municipality.filter(item => item.id === Number(municipalityid));
    let muni;
    if (result && result[0]) {
        const mun = result[0].title;
        muni = mun;
    }
    // Get name of the ward
    const temp = mystationdata.filter(item => item.municipality === Number(municipalityid));
    let wardData;
    if (temp && temp[0]) {
        const wardname = (temp[0].ward !== null) ? (
            temp.map(item => ward.filter(t => t.id === item.ward)[0].title)
        ) : (
            'N/A'
        );
        const wardResult = wardname.toString();
        wardData = wardResult;
    }

    return [muni, wardData];
};

// Returns unique disttrict array
export const getDistrictArray = (stationDetail, selectedStation) => {
    const mystationdata = stationDetail.results.filter(item => item.station === selectedStation.id);
    return uniquePlace(mystationdata, 'district');
};

// Returns the bbox of the first district in an array
export const getBboxFromDistrictArray = (districtArray, districts) => {
    const bbox = districtArray.map((districtid) => {
        const filteredDis = districts.filter(item => item.id === districtid);
        return filteredDis[0].bbox;
    });
    return bbox[0];
};
// Returns the bbox of the first district in an array
export const getBboxOfMunicipality = (municipalityArray, municipality) => {
    const bbox = municipalityArray.map((municipalityid) => {
        const filteredMun = municipality.filter(item => item.id === municipalityid);
        return filteredMun[0].bbox;
    });
    return bbox[0];
};

// Returns the building count
export const countBuilding = (building) => {
    let count;
    if (building && building !== undefined) {
        count = building.map(
            item => item[Object.keys(item)[0]].totalCount,
        ).reduce((a, b) => a + b);
    }
    return count;
};

// Returns the highway length
export const countHighway = (highway) => {
    let count;
    if (highway && highway !== undefined) {
        count = highway.map(
            item => item[Object.keys(item)[0]].totalLength,
        ).reduce((a, b) => a + b);
    }
    return count;
};

// Returns the landuse area
export const countLand = (land) => {
    let count;
    if (land && land !== undefined) {
        count = land.map(
            item => item[Object.keys(item)[0]].totalArea,
        ).reduce((a, b) => a + b);
    }
    return count;
};

// Start- Functions for calculating score count
// const getAbbNum = (numToAbb) => {
//     const num = numToAbb;
//     if (num < 1000) {
//         return `${num}`;
//     } if (num >= 1000 && num < 1000000) {
//         return `${Math.round(num / 1000)}K`;
//     } if (num >= 1000000 && num < 100000000) {
//         return `${Math.round(num / 1000000)}M`;
//     }
//     return num;
// };

const getBoolForKeys = (data, selectedIndicator) => {
    const dataKeys = Object.keys(data);
    const bool = dataKeys.includes(selectedIndicator);
    return bool;
};

// eslint-disable-next-line consistent-return
export const getTotalCounts = (householdRiskData, selectedIndicator, range = []) => {
    if (selectedIndicator === 'impactScore') {
        const unArray = [];
        for (const item of householdRiskData) {
            const cuData = item[selectedIndicator];
            if (typeof (range[0]) === 'number') {
                if (cuData >= range[0] && cuData <= range[1]) {
                    unArray.push(1);
                }
            }
            if (typeof (range[0]) === 'undefined') {
                if (Number(cuData) === 0) {
                    unArray.push(1);
                }
            }
        }
        return unArray.length;
    }
    const filteredData = householdRiskData.filter((data) => {
        const curData = data[selectedIndicator];
        if (range.length === 2) {
            if (curData >= range[0] && curData < range[1]) {
                return true;
            }
            return false;
        } if (range.length === 1) {
            if (curData === range[0] && getBoolForKeys(data, selectedIndicator)) {
                return true;
            }
            return false;
        }

        return [];
    });
    return filteredData.length;
};
// End- Functions for calculating score count

export const defaultValues = {
    sourceDefaultPosition: {
        x: '20px',
        y: '645px',
    },
    impactDefaultPosition: {
        x: '20px',
        y: '225px',
    },
    summaryDefaultPosition: {
        x: '20px',
        y: '100px',
    },
    legendDefaultPosition: {
        x: '20px',
        y: '180px',
    },
    householdFormPosition: {
        x: '0px',
        y: '0px',
    },
};
