export const checkType = (indicator: number) => {
    switch (indicator) {
        case 6:
            return 'blue';

        case 12:
            return 'brown';

        case 14:
            return 'red';

        default:
            return 'white';
    }
};

export const checkIndicator = (vzRiskMunicipalData, data) => {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < vzRiskMunicipalData.length; index++) {
        if (data.title === vzRiskMunicipalData[index].name) {
            return vzRiskMunicipalData[index].indicator;
        }
    }
    return 0;
};
