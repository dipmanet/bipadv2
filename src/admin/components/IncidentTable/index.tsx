/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { alpha } from '@mui/material/styles';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';

import { visuallyHidden } from '@mui/utils';
import {
    CsvBuilder,
} from 'filefy';

import { Paper } from '@mui/material';
import Loader from 'react-loader';
import { SetEpidemicsPageAction, SetIncidentPageAction } from '#actionCreators';
import { epidemicsPageSelector, incidentPageSelector } from '#selectors';
import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { AppState } from '#types';
import { tableTitleRef } from './utils';
import styles from './styles.module.scss';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    epidemmicsPage: epidemicsPageSelector(state),
    incidentPage: incidentPageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEpidemicsPage: params => dispatch(SetEpidemicsPageAction(params)),
    setIncidentPage: params => dispatch(SetIncidentPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    incidents: {
        url: '/incident/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            offset: params.offset,
            limit: 100,
            count: true,
            expand: ['loss.peoples', 'wards', 'wards.municipality', 'wards.municipality.district', 'wards.municipality.district.province'],
            ordering: '-id',
        }),
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({
                incidentData: response.results,
                incidentCount: response.count,
            });
            params.loadingCondition(false);
        },
    },
    incidentEditData: {
        url: ({ params }) => `/incident/${params.id}`,
        method: methods.GET,
        onMount: false,
        query: ({
            expand: ['loss.peoples', 'wards', 'wards.municipality', 'wards.municipality.district', 'wards.municipality.district.province'],
            format: 'json',
        }),
        onSuccess: ({ response, props, params }) => {
            console.log('This is response', response);
            props.setEpidemicsPage({
                incidentEditData: response,
            });
            params.loadingCondition(false);
        },
    },
};


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
    ) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: string) => (
        event: React.MouseEvent<unknown>,
    ) => onRequestSort(event, property);
    const headCells = Object.keys(tableTitleRef)

        .map((invD: string) => ({
            id: invD,
            numeric: invD.includes('count') || invD.includes('no_of') || invD.includes('number'),
            disablePadding: false,
            label: tableTitleRef[invD],
        }));

    return (
        <TableHead>
            <TableRow>
                <TableCell
                    align="center"
                    padding="checkbox"
                    sx={{ backgroundColor: '#DCECFE', fontWeight: 'bold' }}
                >
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        style={{ visibility: 'hidden' }}
                    />
                </TableCell>
                {headCells.map(headCell => (
                    <TableCell
                        align="left"
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ backgroundColor: '#DCECFE', fontWeight: 'bold' }}
                    >
                        <TableSortLabel
                            className={styles.setStyleForHead}
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    selected: [];
    dispatch: Dispatch;
    deleteEpidemicTable: ActionCreator;
    epidemicFormEdit: ActionCreator;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected, selected, dispatch, epidemicFormEdit, incidentEditData, loadingCondition } = props;

    // const { incidentEditData } = useSelector((state: RootState) => state.epidemic);

    const handleDelete = () => {
        console.log('...delete');
    };
    const handleEdit = () => {
        epidemicFormEdit.do({ id: selected, loadingCondition });
    };
    useEffect(() => {
        if (Object.keys(incidentEditData).length > 0) {
            navigate('/admin/incident/add-new-incident');
        }
    }, [incidentEditData]);


    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: theme => alpha(
                        theme.palette.primary.main, theme.palette.action.activatedOpacity,
                    ),
                }),
            }}
        >
            {numSelected > 0 && (
                <>
                    <Tooltip title="Edit">

                        <IconButton
                            onClick={handleEdit}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </>
            )}
        </Toolbar>
    );
};


const IncidentTable = (props) => {
    const [filteredRowData, setFilteredRowData] = useState();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data>('calories');
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [offset, setOffset] = useState(0);
    const [loader, setLoader] = useState(false);
    const { epidemmicsPage: { incidentData, incidentCount, incidentEditData } } = props;


    const loadingCondition = (boolean) => {
        setLoader(boolean);
    };

    useEffect(() => {
        setLoader(true);
        props.requests.incidents.do({ offset, loadingCondition });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (incidentData) {
            const tableRows = incidentData.map((row) => {
                const epidemicObj = {
                    id: row.id,
                    wards: row.wards,
                    dataSource: row.dataSource,
                    streetAddress: row.streetAddress, // use local address field
                    longitube: row.point.coordinates[0],
                    latitude: row.point.coordinates[1],
                    // incident_on: row.incidentOn && (row.incidentOn).split('T')[0],
                    reportedOn: row.reportedOn && (row.reportedOn).split('T')[0],
                    cause: row.cause, // hazard inducer
                    totalInjuredMale: row.loss && row.loss.peopleInjuredMaleCount,
                    totalInjuredFemale: row.loss && row.loss.peopleInjuredFemaleCount,
                    totalInjuredOther: row.loss && row.loss.peopleInjuredOtherCount,
                    totalInjuredDisabled: row.loss && row.loss.peopleInjuredDisabledCount,

                    totalDeadMale: row.loss && row.loss.peopleDeathMaleCount,
                    totalDeadFemale: row.loss && row.loss.peopleDeathFemaleCount,
                    totalDeadOther: row.loss && row.loss.peopleDeathOtherCount,
                    totalDeadDisabled: row.loss && row.loss.peopleDeathDisabledCount,

                    verified: row.verified,
                    verificationMessage: row.verificationMessage,
                    approved: row.approved,
                };
                return epidemicObj;
            });
            setFilteredRowData(tableRows);
        }
    }, [incidentData]);

    useEffect(() => {
        props.requests.incidents.do({ offset, loadingCondition });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        setLoader(true);
        const remainder = incidentCount % 100;
        const maxPages = ((incidentCount - remainder) / 100 + 1);
        if (newPage <= maxPages) {
            setOffset(newPage * 100);
        }
    };
    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleCheck = (e, id) => {
        if (e.target.checked) {
            setSelected([id]);
        } else {
            const temp = [...selected].filter(item => item !== id);
            setSelected(temp);
        }
    };

    const testCheckboxCondition = (id) => {
        const checkboxCondition = !!selected.find(i => i === id);
        return checkboxCondition;
    };


    const Dataforcsv = () => {
        const csvData = filteredRowData && filteredRowData
            .map((item) => {
                let date;
                let verified;
                let approved;

                if (item.reportedOn) {
                    const a = item.reportedOn;
                    date = `${a.split('-')[0]}/${a.split('-')[1]}/${a.split('-')[2]}`;
                } else {
                    date = '';
                }
                if (item.verified) {
                    verified = 'Yes';
                } else {
                    verified = '';
                }
                if (item.approved) {
                    approved = 'Yes';
                } else {
                    approved = '';
                }

                return ([
                    item.id,
                    item.wards[0].municipality.district.province.title,
                    item.wards[0].municipality.district.title,
                    item.wards[0].municipality.title,
                    item.wards[0].title,
                    item.streetAddress,
                    date,
                    item.cause,
                    item.totalInjuredMale,
                    item.totalInjuredFemale,
                    item.totalInjuredOther,
                    item.totalInjuredDisabled,
                    item.totalDeadMale,
                    item.totalDeadFemale,
                    item.totalDeadOther,
                    item.totalDeadDisabled,
                    verified,
                    item.verificationMessage,
                    approved,
                ]);
            });
        return csvData;
    };

    const handleDownload = () => {
        const csvBuilder = new CsvBuilder(`EpidemicData_${Date.now()}.csv`)
            .setColumns([
                'id',
                'Province',
                'District',
                'Municipality',
                'Ward',
                'Local Address',
                'Reported Date (A.D.)(eg. 2021/07/31)',
                'Hazard Inducer',
                'Total Male Affected',
                'Total Female Affected',
                'Total Other Affected',
                'Total Disabled Affected',
                'Total Male Death',
                'Total Female Death',
                'Total Other Death',
                'Total Disabled Death',
                'Verified (eg. Yes)',
                'Verification message',
                'Approved (eg. Yes)',
            ])
            .addRows(Dataforcsv())
            .exportFile();
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };
    return (
        <>
            {loader ? (
                <Loader options={{
                    position: 'fixed',
                    top: '48%',
                    right: 0,
                    bottom: 0,
                    left: '48%',
                    background: 'gray',
                    zIndex: 9999,
                }}
                />
            )
                : (
                    <Box sx={{ width: '80vw', boxShadow: '0px 2px 5px rgba(151, 149, 148, 0.25);' }}>
                        <div className={styles.credentialSearch}>
                            <div className={styles.rightOptions}>
                                <IconButton
                                    onClick={handleDownload}
                                    style={{ cursor: 'pointer' }}
                                >

                                    <DownloadIcon />
                                </IconButton>
                                <TablePagination
                                    className={styles.tablePagination}
                                    rowsPerPageOptions={[100]}
                                    component="div"
                                    count={incidentCount}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                />
                            </div>
                        </div>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <EnhancedTableToolbar
                                selected={selected}
                                numSelected={selected.length}
                                // dispatch={dispatch}
                                // deleteEpidemmicTable={deleteEpidemicTable}
                                epidemicFormEdit={props.requests.incidentEditData}
                                incidentEditData={incidentEditData}
                                loadingCondition={loadingCondition}

                            />
                            <TableContainer
                                sx={{ maxHeight: 800 }}
                                style={{ width: '100%', overflowX: 'scroll' }}
                            >

                                <Table
                                    sx={{ minWidth: 750 }}
                                    stickyHeader
                                    aria-label="sticky table"
                                    padding="normal"
                                >

                                    <EnhancedTableHead
                                        numSelected={selected.length}
                                        order={order}
                                        orderBy={orderBy}
                                        // onSelectAllClick={handleSelectAllClick}
                                        onRequestSort={handleRequestSort}
                                        rowCount={filteredRowData && filteredRowData.length}
                                    />
                                    <TableBody>
                                        {filteredRowData
                                            && stableSort(filteredRowData, getComparator(order, orderBy))
                                                .map((row, index) => {
                                                    // const isItemSelected = isSelected(row.id);
                                                    const labelId = `enhanced-table-checkbox-${index}`;

                                                    return (
                                                        <TableRow
                                                            hover
                                                            role="checkbox"
                                                            // aria-checked={isItemSelected}
                                                            tabIndex={-1}
                                                            key={row.id}
                                                        // selected={isItemSelected}
                                                        >
                                                            <TableCell
                                                                align="center"
                                                                padding="normal"
                                                            >
                                                                <Checkbox
                                                                    color="primary"
                                                                    onChange={e => handleCheck(e, row.id)}
                                                                    checked={testCheckboxCondition(row.id)}
                                                                    inputProps={{
                                                                        'aria-labelledby': labelId,
                                                                    }}
                                                                    disabled={row.dataSource === 'drr_api'}
                                                                />
                                                            </TableCell>
                                                            {
                                                                Object.keys(row)
                                                                    .map((val) => {
                                                                        if (val === 'verified') {
                                                                            return (
                                                                                <TableCell
                                                                                    align={typeof val === 'string' ? 'left' : 'center'}
                                                                                    className={styles.setStyleForTableCell}
                                                                                    component="th"
                                                                                    id={labelId}
                                                                                    scope="row"
                                                                                    padding="none"
                                                                                    key={val}
                                                                                >
                                                                                    {row[val] === true ? 'YES' : 'No'}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        if (val === 'wards') {
                                                                            return (
                                                                                <>
                                                                                    <TableCell>
                                                                                        {row[val][0].municipality.district.province.title}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {row[val][0].municipality.district.title}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {row[val][0].municipality.title}
                                                                                    </TableCell>
                                                                                    <TableCell
                                                                                        align={typeof val === 'string' ? 'left' : 'center'}
                                                                                        className={styles.setStyleForTableCell}
                                                                                        component="th"
                                                                                        id={labelId}
                                                                                        scope="row"
                                                                                        padding="none"
                                                                                        key={val}
                                                                                    >
                                                                                        {row[val][0].title}
                                                                                    </TableCell>


                                                                                </>
                                                                            );
                                                                        }
                                                                        if (val === 'dataSource') {
                                                                            return (
                                                                                <TableCell
                                                                                    align={typeof val === 'string' ? 'left' : 'center'}
                                                                                    className={styles.setStyleForTableCell}
                                                                                    component="th"
                                                                                    id={labelId}
                                                                                    scope="row"
                                                                                    padding="none"
                                                                                    key={val}
                                                                                >
                                                                                    {row[val] === 'drr_api' ? 'Nepal Police' : 'Admin'}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        if (val === 'approved') {
                                                                            return (
                                                                                <TableCell
                                                                                    align={typeof val === 'string' ? 'left' : 'center'}
                                                                                    className={styles.setStyleForTableCell}
                                                                                    component="th"
                                                                                    id={labelId}
                                                                                    scope="row"
                                                                                    padding="none"
                                                                                    key={val}
                                                                                >
                                                                                    {row[val] === true ? 'YES' : 'No'}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        if (val === 'point') {
                                                                            return (
                                                                                <TableCell
                                                                                    align={typeof val === 'string' ? 'left' : 'center'}
                                                                                    className={styles.setStyleForTableCell}
                                                                                    component="th"
                                                                                    id={labelId}
                                                                                    scope="row"
                                                                                    padding="none"
                                                                                    key={val}
                                                                                >
                                                                                    {`${row[val].coordinates[0].toFixed(4)}, ${row[val].coordinates[1].toFixed(4)}`}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        if (val === 'lastModifiedDate') {
                                                                            return (
                                                                                <TableCell
                                                                                    align="center"
                                                                                    className={styles.setStyleForTableCell}
                                                                                    component="th"
                                                                                    id={labelId}
                                                                                    scope="row"
                                                                                    padding="none"
                                                                                    key={val}
                                                                                >
                                                                                    {`${row[val].split('T')[0]}`}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        return (
                                                                            <TableCell
                                                                                align={typeof row[val] === 'string' ? 'left' : 'center'}
                                                                                className={styles.setStyleForTableCell}
                                                                                component="th"
                                                                                id={labelId}
                                                                                scope="row"
                                                                                padding="none"
                                                                                key={val}
                                                                            >
                                                                                {row[val] || '-'}
                                                                            </TableCell>
                                                                        );
                                                                    })
                                                            }
                                                        </TableRow>
                                                    );
                                                })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                )}


        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            IncidentTable,
        ),
    ),
);
