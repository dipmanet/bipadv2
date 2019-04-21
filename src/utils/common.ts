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

interface KeyFunc<T, Q> {
    (val: T): Q;
}

function groupListRaw<T>(lst: T[] = [], getKey: KeyFunc<T, string | number>) {
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
    return mem;
}

export function groupList<T>(lst: T[] = [], getKey: KeyFunc<T, string | number>) {
    const mem = groupListRaw(lst, getKey);
    return Object.values(mem);
}

export function groupFilledList<T>(lst: T[] = [], getKey: KeyFunc<T, number>) {
    const mem = groupListRaw(lst, getKey);

    const identifierList = lst.map(getKey);
    const start = Math.min(...identifierList);

    const end = Math.max(...identifierList);
    const output = [];
    for (let i = start; i <= end; i += 1) {
        output.push(mem[i] || { key: i, value: [] });
    }
    return output;
}

export function sum(list: number[]) {
    return list.reduce(
        (acc, val) => acc + (isDefined(val) ? val : 0),
        0,
    );
}

export function getYmd(dateString: string | number | undefined) {
    if (!dateString) {
        return undefined;
    }
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getYesterday(days = 0) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date.getTime();
}

interface FrameFunction<T> {
    (percent: number, timestamp: number): T;
}
export function framize<T>(fn: FrameFunction<T>, duration = 2000) {
    let prevTimestamp: number;
    return (timestamp: number) => {
        if (!prevTimestamp) {
            prevTimestamp = timestamp;
        }
        const diff = timestamp - prevTimestamp;
        if (diff > duration) {
            prevTimestamp = timestamp;
        }
        const percent = (timestamp - prevTimestamp) / duration;
        return fn(percent, timestamp);
    };
}
