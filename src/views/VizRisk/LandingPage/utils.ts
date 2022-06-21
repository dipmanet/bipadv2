export const checkType = (indicator: number) => {
    switch (indicator) {
        case 6:
            return 'blue';

        case 12:
            return 'brown';

        case 14:
            return 'red';

        default:
            return '';
    }
};
export const vizRiskType = (indicator: number) => {
    switch (indicator) {
        case 6:
            return 'Flood Exposure';

        case 12:
            return 'Landslide Exposure';

        case 14:
            return 'Muti-Hazard Exposure';

        default:
            return '';
    }
};

export const checkIndicator = (vzRiskMunicipalData: any[], data: {}) => {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < vzRiskMunicipalData.length; index++) {
        if (data.title === vzRiskMunicipalData[index].name) {
            return vzRiskMunicipalData[index].indicator;
        }
    }
    return 0;
};

export const filterDataWithIndicator = (data: [], indicator: number) => {
    if (data.length > 0) {
        const filterdData = data.filter(
            (item: { indicator: number }) => item.indicator === indicator,
        );
        return filterdData.map(filData => filData.id);
    }
    return [];
};
