/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-bracket-spacing */
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
import Modal from '@mui/material/Modal';

import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import {
    CsvBuilder,
} from 'filefy';

import { Paper } from '@mui/material';
import Loader from 'react-loader';
import { object } from 'prop-types';
import { SetEpidemicsPageAction, SetIncidentPageAction } from '#actionCreators';
import { epidemicsPageSelector, hazardFilterSelector, hazardTypesSelector, incidentPageSelector } from '#selectors';
import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { AppState } from '#types';
import { tableTitleRef } from './utils';
import styles from './styles.module.scss';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    epidemmicsPage: epidemicsPageSelector(state),
    incidentPage: incidentPageSelector(state),
    hazardList: hazardTypesSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEpidemicsPage: params => dispatch(SetEpidemicsPageAction(params)),
    setIncidentPage: params => dispatch(SetIncidentPageAction(params)),

});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    familyLoss: {
        url: ({ props }) => `/loss-family/?loss=${props.epidemmicsPage.lossID}`,
        // url: ({ props }) => '/loss-people/?loss=24180',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({
                familyLossData: response.results,
            });
            params.loadingCondition(false);
        },
    },
    familyLossEditData: {
        url: ({ params }) => `/loss-family/${params.id}`,
        method: methods.GET,
        onMount: false,
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({
                familyLossEditData: response,
            });
            params.loadingCondition(false);
        },
    },
    familyLossDeleteData: {
        url: ({ params }) => `/loss-family/${params.id}`,
        method: methods.DELETE,
        onMount: false,
        onSuccess: ({ response, props, params }) => {
            params.fetchDataAfterDelete();
            params.setLoader(false);
            params.setOpen(false);
            props.setEpidemicsPage({
                familyLossEditData: response,
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
    const { numSelected, selected, dispatch, epidemicFormEdit, familyLossEditData,
        loadingCondition, openDataForm, fetchDataAfterDelete, setSelected, familyLossFormEdit, familyLossFormDelete, setLoader } = props;
    const [open, setOpen] = useState(false);


    const handleFinalDelete = () => {
        setLoader(true);
        familyLossFormDelete.do({ id: selected, loadingCondition, setLoader, setOpen, fetchDataAfterDelete });
        setSelected([]);
    };
    const handleDelete = () => {
        setOpen(true);
        // peopleLossFormEdit.do({ id: selected, loadingCondition });
    };
    const handleEdit = () => {
        familyLossFormEdit.do({ id: selected, loadingCondition });
    };
    useEffect(() => {
        if (Object.keys(familyLossEditData).length > 0) {
            // navigate('/admin/incident/add-new-incident');
            openDataForm(true);
        }
    }, [familyLossEditData]);


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
            <Modal
                open={open}
                // onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.box}>
                    <h3>Are You sure to delete this data?</h3>
                    <div className={styles.checkBoxArea}>


                        <div className={styles.saveOrAddButtons}>
                            <button
                                className={styles.cancelButtons}
                                onClick={() => {
                                    setSelected([]);
                                    setOpen(false);
                                }}
                                type="submit"
                            >
                                Cancel

                            </button>
                            <button
                                className={styles.submitButtons}
                                type="submit"
                                onClick={handleFinalDelete}
                            >
                                Yes

                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
            {numSelected > 0 && (
                <>
                    <Tooltip title="Delete">

                        <IconButton
                            onClick={handleDelete}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
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


const FamilyLossTable = (props) => {
    const [filteredRowData, setFilteredRowData] = useState();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data>('calories');
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [offset, setOffset] = useState(0);
    const [loader, setLoader] = useState(false);
    const { epidemmicsPage: { familyLossData, incidentData, incidentCount, familyLossEditData },
        openDataForm, hazardList, familyLossResponseId, updatedTable } = props;


    const loadingCondition = (boolean) => {
        setLoader(boolean);
    };

    useEffect(() => {
        setLoader(true);
        props.requests.familyLoss.do({ offset, loadingCondition });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedTable]);

    const array = [];
    for (const obj in hazardList) {
        const objective = hazardList[obj];
        array.push(objective);
    }

    const hazardNameSelected = id => (array.length && (array.find(i => i.id === id)).title);
    const numberFormatter = (n) => {
        const numberFormat = Intl.NumberFormat('en-US');
        const formatted = n ? numberFormat.format(n) : '-';
        // const formatted = n.toLocaleString('en-US');
        return formatted;
    };
    const fetchDataAfterDelete = () => {
        setLoader(true);
        props.requests.familyLoss.do({ offset, loadingCondition });
    };
    useEffect(() => {
        if (familyLossData.length) {
            const tableRows = familyLossData.map((row) => {
                const epidemicObj = {
                    id: row.id,
                    title: row.title,
                    status: row.status,
                    belowPoverty: row.belowPoverty,
                    phoneNumber: row.phoneNumber,
                    verified: row.verified,
                    verificationMessage: row.verificationMessage,

                };

                return epidemicObj;
            });
            setFilteredRowData(tableRows);
        } else {
            setFilteredRowData([]);
        }
    }, [familyLossData, hazardList]);

    useEffect(() => {
        props.requests.familyLoss.do({ offset, loadingCondition });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset, familyLossResponseId]);

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
                    item.hazard,
                    item.cause,
                    item.estimatedLoss,
                    item.agricultureEconomicLoss,
                    item.infrastructureEconomicLoss,
                    item.infrastructureDestroyedCount,
                    item.infrastructureDestroyedHouseCount,
                    item.infrastructureAffectedHouseCount,
                    item.livestockDestroyedCount,

                    item.totalInjuredMale,
                    item.totalInjuredFemale,
                    item.totalInjuredOther,
                    item.totalInjuredDisabled,
                    item.peopleMissingMaleCount,
                    item.peopleMissingFemaleCount,
                    item.peopleMissingOtherCount,
                    item.peopleMissingDisabledCount,


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
                'Hazard',
                'Hazard Inducer',
                'Total Estimated Loss(NPR)',
                'Agriculture Economic Loss(NPR)',
                'Infrastructure Economic Loss(NPR)',
                'Total Infrastructure Destroyed',
                'House Destroyed',
                'House Affected',
                'Total Livestock Destroyed',
                'Total Injured Male',
                'Total Injured Female',
                'Total Injured Others',
                'Total Injured Disabled',
                'Total Missing Male',
                'Total Missing Female',
                'Total Missing Other',
                'Total Missing Disabled',
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
                    <Box sx={{ boxShadow: '0px 2px 5px rgba(151, 149, 148, 0.25);' }}>
                        <div className={styles.credentialSearch}>
                            <div className={styles.rightOptions}>

                                <TablePagination
                                    className={styles.tablePagination}
                                    rowsPerPageOptions={[100]}
                                    component="div"
                                    count={familyLossData.length}
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
                                loadingCondition={loadingCondition}
                                familyLossFormEdit={props.requests.familyLossEditData}
                                familyLossFormDelete={props.requests.familyLossDeleteData}
                                familyLossEditData={familyLossEditData}
                                familyLossDataFetch={props.requests.familyLoss}
                                openDataForm={openDataForm}
                                loader={loader}
                                setLoader={setLoader}
                                fetchDataAfterDelete={fetchDataAfterDelete}
                                setSelected={setSelected}

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
                                                                        if (val === 'belowPoverty') {
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
                                                                                    {row[val] === true ? 'Yes' : 'No'}
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
                                {filteredRowData && filteredRowData.length === 0 && <div><h3 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>No Data Available</h3></div>}
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
            FamilyLossTable,
        ),
    ),
);
