/* eslint-disable import/prefer-default-export */
export const returnDataByFormat = (key, value) => {
    if (key === 'incidentOn') {
        const d = new Date(value).toISOString().split('T')[0];
        return d;
    }

    if (key === 'description') {
        if (value === undefined) return '-';
        return value;
    }

    if (key === 'verified') {
        if (value === true) return 'Yes';
        return 'No';
    }

    if (value === undefined) {
        return 0;
    }

    return value;
};
