export const getMonthName = (month: string) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return monthNames[Number(month) - 1];
};

export const getWeekName = (dayString: string) => {
    const day = Number(dayString);
    const weekThresholds = [
        { threshold: 7, name: 'Week 1' },
        { threshold: 14, name: 'Week 2' },
        { threshold: 28, name: 'Week 3' },
        { threshold: 31, name: 'Week 4' },
    ];
    let weekName = '';
    weekThresholds.forEach((t) => {
        const { threshold, name } = t;
        if (day <= threshold) {
            weekName = name;
            return weekName;
        }
        return weekName;
    });
    return weekName;
};

export const getTemporals = (eventOn: string) => {
    const date = eventOn.substring(0, eventOn.indexOf('T'));
    const temp = date.split('-');
    const [yearValue, monthValue, dayValue] = temp;
    const year = Number(yearValue);
    const month = getMonthName(monthValue);
    const week = getWeekName(dayValue);
    return [year, month, week];
};
