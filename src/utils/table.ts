import { isNotDefined } from '@togglecorp/fujs';

import TableCell from '#components/TableCell';
import TableHeader from '#components/TableHeader';

export const readNestedValue = (obj, keystring) => {
    const keylist = keystring.split('.');
    let op = obj;
    for (let i = 0; i < keylist.length; i += 1) {
        const key = keylist[i];

        if (isNotDefined(op)) {
            return undefined;
        }
        op = op[key];
    }
    return op;
};

export const convertTableToCsv = (data, columns) => (
    data.map((datum) => {
        const val = {};
        columns.forEach((column) => {
            const {
                key,
                value: { title },
                transformer,
                csvTransformer,
            } = column;

            const finalTransformer = csvTransformer || transformer;

            val[title] = finalTransformer ? finalTransformer(datum) : readNestedValue(datum, key);
        });
        return val;
    })
);

export const convertNormalTableToCsv = (data, headers) => (
    data.map((datum) => {
        const val = {};
        headers.forEach((header) => {
            const {
                key,
                label,
                modifier,
            } = header;

            const value = modifier ? modifier(datum) : datum[key];
            val[label] = value;
        });
        return val;
    })
);

const cellRendererParams = ({ datum, column, columnKey }) => ({
    value: column.transformer ? column.transformer(datum) : readNestedValue(datum, columnKey),
});

const headerRendererParams = styles => ({ column, columnKey }) => ({
    title: column.value.title,
    className: styles.header,
    sortOrder: column.sortOrder,
    onSortClick: column.onSortClick,
    sortable: column.sortable,
    columnKey,
});

export const defaultState = {
    columnWidths: {
        title: 200,
        verified: 80,
    },
    defaultColumnWidth: 160,
};

export const prepareColumns = (columns, styles) => (
    columns.map(item => ({
        headerRendererParams: headerRendererParams(styles),
        cellRendererParams,
        headerRenderer: TableHeader,
        cellRenderer: TableCell,
        ...item,
    }))
);
