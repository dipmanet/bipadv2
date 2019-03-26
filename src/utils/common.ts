import { isDefined, isNotDefined, isObject, isList } from '@togglecorp/fujs';

interface Row {
    [key: string]: string | number | boolean | undefined | null;
}

export const convertJsonToCsv = (data: Row[] | undefined | null, columnDelimiter = ',', lineDelimiter = '\n', emptyValue = '') => {
    if (!data || data.length <= 0) {
        return undefined;
    }

    // TODO: get exhaustive keys
    const keys = Object.keys(data[0]);

    let result = keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach((item) => {
        result += keys
            .map(key => item[key])
            .map((str) => {
                if (isNotDefined(str)) {
                    return emptyValue;
                }
                const val = String(str);
                if (val.includes(columnDelimiter)) {
                    return `"${val}"`;
                }
                return val;
            })
            .join(columnDelimiter);
        result += lineDelimiter;
    });

    return result;
};

export const convertCsvToLink = (csvRaw?: string) => {
    if (!csvRaw) {
        return undefined;
    }
    let csv = csvRaw;
    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }
    return encodeURI(csv);
};

export const toTitleCase = (str: string | undefined | null) => {
    if (isNotDefined(str)) {
        return undefined;
    }
    return String(str).replace(
        /(^|\s)\S/g,
        t => t.toUpperCase(),
    );
};

export const forEach = (obj: object, func: (key: string, val: any) => void) => {
    Object.keys(obj).forEach((key) => {
        const val = (obj as any)[key];
        func(key, val);
    });
};

export const sanitizeResponse = (data: unknown): any => {
    if (data === null || data === undefined) {
        return undefined;
    }
    if (isList(data)) {
        return data.map(sanitizeResponse).filter(isDefined);
    } else if (isObject(data)) {
        let newData = {};
        forEach(data, (k, val) => {
            const newEntry = sanitizeResponse(val);
            if (newEntry) {
                newData = {
                    ...newData,
                    [k]: newEntry,
                };
            }
        });
        return newData;
    }
    return data;
};

interface KeyFunc<T> {
    (val: T): string | number;
}

export function groupList<T>(lst: T[] = [], getKey: KeyFunc<T>) {
    const mem: {
        [key: string]: {
            key: string | number;
            value: T[];
        };
    } = {};
    lst.forEach((item) => {
        const key = getKey(item);
        if (!mem[key]) {
            mem[key] = {
                key,
                value: [],
            }; // eslint-disable-line no-param-reassign
        }
        mem[key].value.push(item);
    });
    return Object.values(mem);
}

