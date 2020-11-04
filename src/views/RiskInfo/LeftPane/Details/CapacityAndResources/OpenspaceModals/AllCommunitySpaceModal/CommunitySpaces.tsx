/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
    createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import {
    createRequestClient,
    ClientAttributes,
    methods,
    createConnectedRequestCoordinator,
} from '#request';
import { AppState } from '#store/types';
import { filtersSelector } from '#selectors';
import styles from './styles.scss';

interface Props {
    requests: any;
    pageState: any;
    handelListClick: any;
    closeModal: any;
}
interface State {
    order: string;
    orderBy: string;
    page: number;
    rowsPerPage: number;
    apiData: any;
    searchedData: any;
}
interface Params {}

interface HeaderProps {
    order: any;
    orderBy: any;
}

interface PropsFromState {
    pageState: any;
}

type ReduxProps = PropsFromState;

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    mediaGetRequest: {
        url: '/community-table/',
        method: methods.GET,
        onMount: false,
    },
};

function createData(
    number: number,
    name: string,
    location: string,
    total: number,
    capacity: number,
    id: number,
) {
    return { number, name, location, total, capacity, id };
}

function descendingComparator(a: any, b: any, orderBy: any) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order: any, orderBy: any) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: any, comparator: any) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

const headCells = [
    {
        id: 'number',
        numeric: true,
        disablePadding: true,
        label: 'S.N.',
    },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'ward', numeric: false, disablePadding: false, label: 'Ward' },
    {
        id: 'total',
        numeric: true,
        disablePadding: false,
        label: 'Total Area(Sq. Ft.)',
    },
    {
        id: 'capacity',
        numeric: true,
        disablePadding: false,
        label: 'Capacity(Persons)',
    },
];

function EnhancedTableHead(props: HeaderProps) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = property => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={'right'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={styles.visuallyHidden} />
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: option => option.name,
});

class OpenSpaces extends React.PureComponent<Props, State> {
    public constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'name',
            page: 0,
            rowsPerPage: 5,
            apiData: '',
            searchedData: '',
        };

        const {
            requests: { mediaGetRequest },
        } = this.props;

        mediaGetRequest.do({
            openspaceId: 1,
        });
    }

    public handleRequestSort = (event: any, property: any) => {
        const { orderBy, order } = this.state;
        const isAsc = orderBy === property && order === 'asc';
        this.setState({ order: isAsc ? 'desc' : 'asc', orderBy: property });
    };

    public handleChangePage = (
        e: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        this.setState({ page: newPage });
    };

    public handleChangeRowsPerPage = (
        event: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
        this.setState({
            page: 0,
            rowsPerPage: parseInt(event.target.value, 10),
        });
    };

    public componentDidUpdate(prevProps, prevState) {
        const {
            requests: {
                mediaGetRequest: { response, pending },
            },
            pageState: {
                region: { adminLevel, geoarea },
                region,
            },
        } = this.props;

        if (response !== prevProps.requests.mediaGetRequest.response) {
            const { results } = response;
            if (region && adminLevel && geoarea) {
                const filteredApiData = [];
                if (adminLevel === 1) {
                    results.forEach((data: any) => {
                        if (data.province === geoarea) {
                            filteredApiData.push(data);
                        }
                    });
                } else if (adminLevel === 2) {
                    results.forEach((data: any) => {
                        if (data.dsitrict === geoarea) {
                            filteredApiData.push(data);
                        }
                    });
                } else if (adminLevel === 3) {
                    results.forEach((data: any) => {
                        if (data.municipality === geoarea) {
                            filteredApiData.push(data);
                        }
                    });
                }
                this.setState({ apiData: filteredApiData });
            } else {
                this.setState({ apiData: response && response.results });
            }
        }
    }

    public searchHandler = (
        event: React.ChangeEvent<{}>,
        value: any,
        reason: string,
    ) => {
        if (value === null) {
            this.setState({ searchedData: [] });
        } else {
            this.setState({ searchedData: [value] });
        }
        console.log('event value', value);
    };

    // public removeCommas = (location: string) => {
    //     const substring = ',';

    //     if (location) {
    //         if (location.includes(substring)) {
    //             return location.replace(/,/g, ' ');
    //         } else {
    //             return location;
    //         }
    //     } else {
    //         return null;
    //     }
    // };

    public downloadCsv = () => {
        const rows = this.state.apiData;
        const headers = {
            serial: 'S.N',
            name: 'Name',
            ward: 'Ward',
            total: 'Total Area(Sq. Ft.)',
            capacity: 'Capacity(Persons)',
        };

        const itemsNotFormatted = rows.map((data: any, index) => ({
            serial: index + 1,
            name: data.title,
            ward: data.ward? data.ward:'N/A',
            total: data.totalArea,
            capacity: (data.totalArea / 3.5).toFixed(0),
        }));

        const fileTitle = 'Community Spaces List';

        this.exportCSVFile(headers, itemsNotFormatted, fileTitle);
    };

     public exportCSVFile = (headers: any, items: any, fileTitle: string) => {
        if (headers) {
            items.unshift(headers);
        }

        // Convert Object to JSON
        const jsonObject = JSON.stringify(items);

        const csv = this.convertToCSV(jsonObject);

        const exportedFilenmae = `${fileTitle}.csv` || 'export.csv';

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            const link = document.createElement('a');
            if (link.download !== undefined) {
                // feature detection
                // Browsers that support HTML5 download attribute
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };

    public convertToCSV = (objArray: any) => {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';

        for (let i = 0; i < array.length; i += 1) {
            let line = '';
            for (const index in array[i]) {
                if (line !== '') line += ',';
                line += array[i][index];
            }

            str += `${line}\r\n`;
        }

        return str;
    };

    public handelSelectedRow= (id:number)=>{      
        const {apiData}=this.state;
        const filteredData=apiData.filter(data =>data.id===id)
        this.props.closeModal();
        this.props.handelListClick(filteredData[0],'communityspace')
    }

    public render() {
        const {
            rowsPerPage,
            page,
            order,
            orderBy,
            apiData,
            searchedData,
        } = this.state;

        const dataArray = [];
        let tableList = [];

        if (apiData.length > 0) {
            apiData.forEach((item, index) => {
                dataArray.push(
                    createData(
                        index + 1,
                        item.title,
                        item.ward ? item.ward : "N/A",
                        item.totalArea,
                        parseInt((item.totalArea / 5).toFixed(0), 10),
                        item.id,
                    ),
                );
            });
        }

        if (searchedData.length > 0) {
            tableList = searchedData;
        } else {
            tableList = dataArray;
        }

        const emptyRows = rowsPerPage
        - Math.min(rowsPerPage, tableList.length - page * rowsPerPage);
        const {
            requests: {
                mediaGetRequest: { pending },
            },
        } = this.props;
        return (
            <div className={styles.listWarpper}>
                {dataArray.length === 0 && (
                    <div className={styles.noData}>
                        {pending ? 'Loading...' : 'No data present.'}
                    </div>
                )}
                {dataArray.length > 0 && (
                    <div className={styles.searchBar}>
                        <div className={styles.downloadField}>
                            <div
                                className={styles.button}
                                onClick={() => this.downloadCsv()}
                                onKeyDown={() => this.downloadCsv()}
                            >
                                Download csv
                            </div>
                        </div>
                        <div className={styles.searchField}>
                            {' '}
                            <Autocomplete
                                id="filter-demo"
                                options={dataArray}
                                getOptionLabel={option => option.name}
                                filterOptions={filterOptions}
                                style={{ width: 300 }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Search by Community Space"
                                        variant="outlined"
                                    />
                                )}
                                onChange={this.searchHandler}
                            />
                        </div>
                    </div>
                )}
                <div className={styles.listTable}>
                    {tableList.length > 0 && (
                        <Paper>
                            <TableContainer>
                                <Table
                                    aria-labelledby="tableTitle"
                                    size={'medium'}
                                    aria-label="enhanced table"
                                >
                                    <EnhancedTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={this.handleRequestSort}
                                    />
                                    <TableBody>
                                        {stableSort(
                                            tableList,
                                            getComparator(order, orderBy),
                                        )
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage
                                                + rowsPerPage,
                                            )
                                            .map((row, index) => {
                                                const labelId = `enhanced-table-checkbox-${index}`;

                                                return (
                                                    <TableRow
                                                        hover
                                                        tabIndex={-1}
                                                        onClick={()=>this.handelSelectedRow(row.id)}
                                                    >
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                            align="right"
                                                        >
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.location}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.total}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.capacity}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: 53 * emptyRows,
                                                }}
                                            >
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 20]}
                                component="div"
                                count={dataArray.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={e => this.handleChangeRowsPerPage(e)}
                            />
                        </Paper>
                    )}
                </div>
            </div>
        );
    }
}

// export default createRequestClient(requestOptions)(OpenSpaces);

const mapStateToProps = (state: AppState): PropsFromState => ({
    pageState: filtersSelector(state),
});

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requestOptions)(OpenSpaces),
    ),
);
