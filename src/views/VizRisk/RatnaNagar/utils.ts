export const findOcc = (arr: [], key: string) => {
    const arr2: [] = [];

    arr.forEach((x) => {
        // Checking if there is any object in arr2
        // which contains the key value
        if (arr2.some(val => val[key] === x[key])) {
            // If yes! then increase the count by 1
            arr2.forEach((k: any) => {
                if (k[key] === x[key]) {
                    // eslint-disable-next-line no-param-reassign, no-plusplus
                    k.count++;
                }
            });
        } else {
            // If not! Then create a new object initialize
            // it with the present iteration key's value and
            // set the count to 1
            const a: any = {};
            a[key] = x[key];
            a.count = 1;
            arr2.push(a);
        }
    });

    return arr2;
};

export const dummy = 'a';


export const getMainArrayForColor = (demographicsData: any) => {
    const totalPopulationByWard = demographicsData.map(
        (item: any) => ({ ward: item.name, totalpop: item.MalePop + item.FemalePop }),
    );
    const arrayValue = totalPopulationByWard.map((item: any) => item.totalpop);
    const mainArray = Array.from({ length: arrayValue.length }, (v, i) => i + 1);
    return mainArray;
};


export const fillPaint = (mainArray: any, getColorFunc: (item: string) => void) => {
    const colorArray = mainArray.map((item: string) => [item, getColorFunc(item)]);


    const saveArray = [];

    for (let i = 0; i < colorArray.length; i += 1) {
        const newArray = [...colorArray[i]];
        saveArray.push(...newArray);
    }
    return {
        'fill-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'value'],
            ...saveArray,
        ],
        'fill-opacity':
            [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                1,
            ],
    };
};


export const getHouseHoldDataColor = (number: number) => {
    switch (true) {
        case number >= 0 && number <= 2:
            return '#457ded';
        case number > 2 && number <= 3.5:
            return '#45c4fe';
        case number > 3.5 && number <= 5:
            return '#2af5ac';
        case number > 5 && number <= 6.5:
            return '#e79546';
        case number > 6.5:
            return '#e75d4f';
        default:
            return 'white';
    }
};

export const getHouseHoldDataStatus = (number: number) => {
    switch (true) {
        case number >= 0 && number <= 2:
            return 'Very Low';
        case number > 2 && number <= 3.5:
            return 'Low';
        case number > 3.5 && number <= 5:
            return 'Medium';
        case number > 5 && number <= 6.5:
            return 'High';
        case number > 6.5:
            return 'Very High';
        default:
            return 'None';
    }
};


export const percentageCalculator = (arr: [], totalArr: []) => {
    const veryLowCount = arr.filter(
        number => number >= 0 && number <= 20,
    ).length;

    const veryLowPercentage = (veryLowCount / totalArr.length) * 100;

    const lowCount = arr.filter(
        number => number > 20 && number <= 35,
    ).length;

    const lowPercentage = (lowCount / totalArr.length) * 100;

    const mediumCount = arr.filter(
        number => number > 35 && number <= 50,
    ).length;

    const mediumPercentage = (mediumCount / totalArr.length) * 100;

    const highCount = arr.filter(
        number => number > 50 && number <= 65,
    ).length;

    const highPercentage = (highCount / totalArr.length) * 100;

    const veryHighCount = arr.filter(
        number => number > 65,
    ).length;

    const veryHighPercentage = (veryHighCount / totalArr.length) * 100;

    return {
        dataKeyName: [
            `${Math.ceil(veryHighPercentage)}% Very High`,
            `${Math.ceil(highPercentage)}% High`,
            `${Math.ceil(mediumPercentage)}% Medium`,
            `${Math.ceil(lowPercentage)}% Low`,
            `${Math.ceil(veryLowPercentage)}% Very Low`,
        ],
        chartData: [
            {
                [`${Math.ceil(veryLowPercentage)}% Very Low`]: veryLowCount,
                [`${Math.ceil(lowPercentage)}% Low`]: lowCount,
                [`${Math.ceil(mediumPercentage)}% Medium`]: mediumCount,
                [`${Math.ceil(highPercentage)}% High`]: highCount,
                [`${Math.ceil(veryHighPercentage)}% Very High`]: veryHighCount,
            },
        ],
    };
};
