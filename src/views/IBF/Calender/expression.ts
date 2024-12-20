/* eslint-disable import/prefer-default-export */

const backgroundColor = {
    bgDefault: {
        background: 'linear-gradient(135.86deg, rgba(177, 177, 177, 0.32) 5.24%, rgba(54, 53, 103, 0.2) 51.01%), rgba(49, 48, 54, 0.6)',
    },
    bgThree: {
        background: 'linear-gradient(135.86deg, rgba(177, 177, 177, 0.32) 5.24%, rgba(54, 53, 103, 0.2) 51.01%), rgba(220, 91, 36, 0.6)',
    },
    bgSeven: {
        background: 'linear-gradient(135.86deg, rgba(177, 177, 177, 0.32) 5.24%, rgba(54, 53, 103, 0.2) 51.01%), rgba(170, 156, 83, 0.6)',
    },
};

export const containerStyleData = {
    three: {
        bg: backgroundColor.bgThree,
        text: 'Activate mode - Flood Alert in next 3 Days',
        animate: true,
    },
    seven: {
        bg: backgroundColor.bgSeven,
        text: 'Readiness mode- Flood Alert in next 7 Days',
        animate: true,
    },
    default: {
        bg: backgroundColor.bgDefault,
        text: '',
        animate: false,
    },
};

export const getDate = (date) => {
    const mydate = new Date(date).toUTCString();
    const myArr = mydate.split(' ');
    return myArr[1];
};

export const getDay = (date) => {
    const mydate = new Date(date).toUTCString();
    const myArr = mydate.split(' ');
    const day = myArr[0].replace(',', '');
    return day;
};

export const getMonth = (date) => {
    const mydate = new Date(date).toUTCString();
    const myArr = mydate.split(' ');
    return myArr[2];
};

export const getYear = (date) => {
    const mydate = new Date(date).toUTCString();
    const myArr = mydate.split(' ');
    return myArr[3];
};

export const compareMonth = (indexNo, calendarDataList) => {
    if (indexNo === 0) { return true; }
    if (getMonth(
        calendarDataList[indexNo].date,
    ) === getMonth(calendarDataList[indexNo - 1].date)) {
        return false;
    }
    return true;
};
