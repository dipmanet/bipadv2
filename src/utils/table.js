import TableHeader from '#components/TableHeader';
import TableCell from '#components/TableCell';

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

            val[title] = finalTransformer ? finalTransformer(datum) : datum[key];
        });
        return val;
    })
);

const cellRendererParams = ({ datum, column, columnKey }) => ({
    value: column.transformer ? column.transformer(datum) : datum[columnKey],
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
        title: 160,
    },
    defaultColumnWidth: 108,
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
