export const findOcc = (arr: [], key: string) => {
    const arr2: [] = [];

    arr.forEach((x) => {
        // Checking if there is any object in arr2
        // which contains the key value
        if (arr2.some(val => val[key] === x[key])) {
            // If yes! then increase the occurrence by 1
            arr2.forEach((k: any) => {
                if (k[key] === x[key]) {
                    // eslint-disable-next-line no-param-reassign, no-plusplus
                    k.occurrence++;
                }
            });
        } else {
            // If not! Then create a new object initialize
            // it with the present iteration key's value and
            // set the occurrence to 1
            const a: any = {};
            a[key] = x[key];
            a.occurrence = 1;
            arr2.push(a);
        }
    });

    return arr2;
};

export const dummy = 'a';
