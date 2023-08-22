import {
    isDefined,
    isNotDefined,
    isObject,
    isList,
    isTruthy,
    addSeparator,
} from '@togglecorp/fujs';
import { ADToBS, BSToAD } from 'bikram-sambat-js';

import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { lossMetrics } from '#utils/domain';
import {
    englishToNepaliNumber,

} from 'nepali-number';

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
    }
    if (isObject(data)) {
        let newData = {};
        forEach(data, (k, val) => {
            const newEntry = sanitizeResponse(val);
            if (newEntry !== null && newEntry !== undefined) {
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

export const getImageAsync = (src: string, width = 56, height = 56) => {
    const image = new Image(width, height);
    image.setAttribute('crossOrigin', '');

    image.src = src;

    return new Promise((resolve) => {
        image.onload = () => {
            resolve(image);
        };
    });
};

export function getImage(src: string, width = 56, height = 56) {
    const image = new Image(width, height);
    image.src = src;

    return image;
}

export const encodeTime = (date: Date) => (
    `${date.getHours()}:${date.getMinutes()}:00`
);

export { encodeDate } from '@togglecorp/fujs';

export const imageUrlToDataUrl = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result);
        };

        reader.readAsDataURL(xhr.response);
    };

    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
};

export function saveChart(elementId: string, name: string, functionData) {
    const scale = 2;
    const domNode = document.getElementById(elementId);
    domtoimage.toBlob(domNode,
        {
            width: domNode.clientWidth * scale,
            height: domNode.clientHeight * scale,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
            },
        })
        .then(blob => (
            saveAs(blob, `${name}.png`)

        ));
    functionData();
}

export const arrayGroupBy = (array: any[], key: any) => array.reduce((result, currentValue) => {
    // eslint-disable-next-line no-param-reassign
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue,
    );
    return result;
}, {});

export const httpGet = (url: string) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.response;
};

// user object from redux, example codeName="edit_resource", app="resource"
export const checkPermission = (user, codeName, app) => {
    let permission = false;
    if (!user) {
        permission = false;
    } else if (user.isSuperuser) {
        permission = true;
    }
    if (user && user.groups) {
        user.groups.forEach((group) => {
            if (group.permissions) {
                group.permissions.forEach((p) => {
                    if (p.codename === codeName && p.app === app) {
                        permission = true;
                    }
                });
            } else {
                permission = false;
            }
        });
    }
    if (user && user.userPermissions) {
        user.userPermissions.forEach((a) => {
            if (a.codename === codeName && a.app === app) {
                permission = true;
            }
        });
    } else {
        permission = false;
    }
    return permission;
    // temporary set true to all user for testing
    // return true;
};

// This function can be used to compare login in user's
// federal region and filtered federal region to check the accessibility of the data.
export const checkSameRegionPermission = (user, region) => {
    let permission = false;
    if (user && user.isSuperuser) {
        permission = true;
    } else if (region.adminLevel === 1) {
        if (user && user.profile.province === region.geoarea
            && user.profile.district === null && user.profile.municipality === null) {
            permission = true;
        }
    } else if (region.adminLevel === 2) {
        if (user && user.profile.district === region.geoarea) {
            permission = true;
        }
    } else if (region.adminLevel === 3) {
        if (user && user.profile.municipality === region.geoarea) {
            permission = true;
        }
    } else {
        permission = false;
    }
    return permission;
};


// convert date according to language
export const convertDateAccToLanguage = (date, language, forceAD = false) => {
    if (!date) {
        return '';
    }
    let dateToReturn = date;
    if (forceAD && (language === 'np')) {
        dateToReturn = (date);
    } else if (language === 'np') {
        try {
            // dateToReturn = englishToNepaliNumber(ADToBS(date));
            dateToReturn = ADToBS(date);
        } catch (e) {
            dateToReturn = date;
        }
    }
    return dateToReturn;
};

export const DataFormater = (value, lang) => {
    const decimalRemoveToComma = (num) => {
        const separator = ',';
        const decimalSeparator = '.';
        const [before, after] = String(num).split(decimalSeparator);

        let x1 = before;
        const rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, `$1${separator}$2`);
        }

        const x2 = after !== undefined ? `${separator}${after}` : '';

        const result = x1 + x2;

        return result;
    };

    if (lang === 'np' && value) {
        if (value > 10000000) {
            return { number: (decimalRemoveToComma((value / 10000000).toFixed(0))), normalizeSuffix: 'करोड' };
        } if (value > 100000) {
            return { number: (decimalRemoveToComma((value / 100000).toFixed(0))), normalizeSuffix: 'लाख' };
        } if (value > 10000) {
            return { number: (decimalRemoveToComma((value / 1000).toFixed(0))), normalizeSuffix: 'हजार' };
        }
        if (value > 1000) {
            return { number: value.toLocaleString(), normalizeSuffix: '' };
        }
        return { number: value, normalizeSuffix: '' };
    }

    if (value && value > 1000000000) {
        return { number: (decimalRemoveToComma((value / 1000000000).toFixed(0))), normalizeSuffix: 'B' };
    } if (value && value > 1000000) {
        return { number: (decimalRemoveToComma((value / 1000000).toFixed(0))), normalizeSuffix: 'M' };
    } if (value && value > 10000) {
        return { number: (decimalRemoveToComma((value / 1000).toFixed(0))), normalizeSuffix: 'K' };
    }
    if (value && value > 1000) {
        return { number: value.toLocaleString(), normalizeSuffix: '' };
    }
    return { number: value, normalizeSuffix: '' };
};

export const calculateSummary = (lossAndDamageList) => {
    const stat = lossMetrics.reduce((acc, { key }) => ({
        ...acc,
        [key]: sum(
            lossAndDamageList
                .filter(incident => incident.loss)
                .map(incident => incident.loss[key])
                .filter(isDefined),
        ),
    }), {});
    stat.count = lossAndDamageList.length;
    return stat;
};

export const nullCheck = (nullCondition, data, m) => {
    if (nullCondition) {
        const summaryData = calculateSummary(data);
        summaryData.estimatedLoss = '-';

        return summaryData[m];
    }
    const summaryData = calculateSummary(data);

    return summaryData[m];
};
