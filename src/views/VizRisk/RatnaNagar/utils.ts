/* eslint-disable max-len */
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
    const totalPopulationByWard = demographicsData.map((item: any) => ({ ward: item.name, totalpop: item.MalePop + item.FemalePop }));
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
