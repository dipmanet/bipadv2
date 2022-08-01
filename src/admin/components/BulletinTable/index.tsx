/* eslint-disable indent */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-indent */

// / <reference no-default-lib="true"/>

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import ViewIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { getUserPermission } from 'src/admin/utils';
// import EditIcon from '../../../resources/editicon.svg';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Loader from 'react-loader';
import { navigate } from '@reach/router';
import { setBulletinEditDataAction } from '#actionCreators';
import {
    bulletinEditDataSelector,
    bulletinPageSelector,
    userSelector,
} from '#selectors';
import styles from './styles.module.scss';

import { tableTitleRef } from './utils';


const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setBulletinEditData: params => dispatch(setBulletinEditDataAction(params)),
});

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    bulletinEditData: bulletinEditDataSelector(state),
    bulletinData: bulletinPageSelector(state),
    user: userSelector(state),
});

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

const stableSort = (tData: DashboardTable[], order: Order, orderBy: keyof DashboardTable) => tData.sort((a, b) => {
    if (order === 'desc') {
        return descendingComparator(a, b, orderBy);
    } if (order === 'asc') {
        return -descendingComparator(a, b, orderBy);
    }
    return 0;
});


interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

interface InventoryData{
    id: number;
    item: InventoryItem;
    itemId: number;
    createdOn: string;
    modifiedOn: string;
    quantity: number;
    description: string;
    status: string;
    incharge: string;
    resource: number;
    unit: string;
    title: string;
}
interface InventoryItem {
    id: number;
    category: string;
    title: string;
    titleNp: string;
    description: string;
    unit: string;
    unitNp: string;
}
interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    inventoryData?: InventoryData;
    inventoryItem: [];
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy,
        numSelected, rowCount, onRequestSort, inventoryItem, headCells } = props;
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => onRequestSort(event, property);
    return (
        <TableHead>
            <TableRow>

                {headCells.map(headCell => (
                    <TableCell
                        align="center"
                        key={headCell.id}
						// align={headCell.numeric ? 'right' : 'left'}
                        // padding={headCell.disablePadding ? 'none' : 'normal'}
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
    numSelected?: number;
    selected?: [];
    dispatch?: Dispatch;
    deleteHealthTable?: ActionCreator;
    formDataForEdit?: ActionCreator;
    userDataMain?: Record<string|undefined>;
    healthFormEditData?: Record<string|undefined>;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected, selected, dispatch, formDataForEdit, healthFormEditData } = props;


    const handleEdit = () => {
        // dispatch(formDataForEdit(selected[0]));
        // navigate('/health-form');
        console.log('edit clicked');
    };


    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <>
                    {
                        <Tooltip title="Edit">

                            <IconButton
                                onClick={handleEdit}
                            >
                                <ViewIcon />
                            </IconButton>
                        </Tooltip>

                    }

                </>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};


const BulletinTable = (props) => {
    const { bulletinTableData, setBulletinEditData, bulletinEditData, user } = props;
    const [searchValue, setsearchValue] = React.useState('');
    const [filteredRowDatas, setfilteredRowDatas] = React.useState(props.bulletinTableData);
    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('last_modified_date');
    const [loader, setLoader] = React.useState(false);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const [permission, setPermission] = React.useState(getUserPermission(user));
    const [headCells, setHeadCells] = useState([]);
    const [tableTitle, setFinalObj] = useState({});

    useEffect(() => {
        if (user) {
            setPermission(getUserPermission(user));
        }
    }, [user]);

    useEffect(() => {
        if (bulletinTableData[0] && bulletinTableData[0].hazardWiseLoss && Object.keys(bulletinTableData[0].hazardWiseLoss).length > 0) {
            const temp = {};
            Object.keys(bulletinTableData[0].hazardWiseLoss).map((kys, i) => {
                temp[`Hazard${i + 1} (${kys}) Deaths`] = `Hazard${i + 1} (${kys}) Deaths`;
                temp[`Hazard${i + 1} (${kys}) Incidents`] = `Hazard${i + 1} (${kys}) Incidents`;
                return null;
            });
            // const finalObj = { ...tableTitleRef, ...temp, action: 'Actions' };
            const finalObj = { ...tableTitleRef, action: 'Actions' };
            setFinalObj(finalObj);
            const headCellsData = Object.keys(finalObj)
                .map((invD: string) => ({
                    id: invD,
                    disablePadding: false,
                    label: finalObj[invD],
                }));
                setHeadCells(headCellsData);
        } else {
            const finalObj = { ...tableTitleRef, action: 'Actions' };
            setFinalObj(finalObj);

            const headCellsData = Object.keys(finalObj)
                .map((invD: string) => ({
                    id: invD,
                    disablePadding: false,
                    label: finalObj[invD],
                }));
                setHeadCells(headCellsData);
        }
    }, [bulletinTableData]);

    const handleTableEdit = (row) => {
        setBulletinEditData(row);
        navigate('/admin/bulletin/add-new-bulletin');
    };


    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        // if (event.target.checked) {
        // 	const newSelecteds = filteredRowDatas.map((n) => n.id);
        // 	setSelected(newSelecteds);
        // 	return;
        // }
        setSelected([]);
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

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    return (
        <>
            {
                filteredRowDatas.length === 0 || loader ? (
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
                        <Box
                            sx={{ width: '100%', boxShadow: '0px 2px 5px rgba(151, 149, 148, 0.25);' }}
                        >
                            <div className={styles.credentialSearch}>

                                <div className={styles.rightOptions}>


                                    <TablePagination
                                        className={styles.tablePagination}
                                        rowsPerPageOptions={[100]}
                                        component="div"
                                        count={bulletinTableData.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={() => console.log('dfsfs')}
                                    />
                                </div>
                            </div>
                            <Paper sx={{ width: '100%', mb: 2 }}>
                                <EnhancedTableToolbar
                                    selected={selected}
                                    numSelected={selected.length}
                                    // healthFormEditData={healthFormEditData}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableContainer
                                    sx={{ maxHeight: 800 }}
                                    stickyHeader
                                    style={{ width: '100%', overflowX: 'scroll' }}
                                >
                                    <Table
                                        sx={{ minWidth: 750 }}
                                // aria-labelledby="tableTitle"
                                        size={dense ? 'small' : 'medium'}
                                        stickyHeader
                                        aria-label="sticky table"
                                        responsive="scrollMaxHeight"
                                        padding="normal"
                                    >
                                        <EnhancedTableHead
                                            numSelected={selected.length}
                                            order={order}
                                            orderBy={orderBy}
                                            onSelectAllClick={handleSelectAllClick}
                                            onRequestSort={handleRequestSort}
                                            rowCount={filteredRowDatas.length}
                                            headCells={headCells}
                                        />

                                        <TableBody>
                                            {
                                                filteredRowDatas
                                                && stableSort(filteredRowDatas, order, orderBy)
                                                .map((row, index) => {
                                                    const isItemSelected = isSelected(row.id);
                                                    const labelId = `enhanced-table-checkbox-${index}`;
                                                    return (
                                                        <TableRow
                                                            hover
                                                            role="checkbox"
                                                            aria-checked={isItemSelected}
                                                            tabIndex={-1}
                                                            key={row.id}
                                                            selected={isItemSelected}
                                                        >

                                                            <>
            {
               tableTitle && Object.keys(tableTitle).map((k) => {
//                     if (k === 'numberOfIncidents') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
//                                 key={'numberOfIncidents'}
// >
//                                 {row.incidentSummary.numberOfIncidents}
//                             </TableCell>
//                         );
//                     } if (k === 'numberOfDeath') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
//                                 key={'numberOfDeath'}
// >
//                                 {row.incidentSummary.numberOfDeath}
//                             </TableCell>
//                         );
//                     } if (k === 'numberOfMissing') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
//                                 key={'numberOfMissing'}
// >
//                                 {row.incidentSummary.numberOfMissing}
//                             </TableCell>
//                         );
//                     } if (k === 'numberOfInjured') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
//                                 key={'numberOfInjured'}
// >
//                                 {row.incidentSummary.numberOfInjured}
//                             </TableCell>
//                         );
//                     } if (k === 'estimatedLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.incidentSummary.estimatedLoss}
//                             </TableCell>
//                         );
//                     } if (k === 'roadBlock') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
//                                 key={'roadBlock'}
// >
//                                 {row.incidentSummary.roadBlock}
//                             </TableCell>
//                         );
//                     } if (k === 'cattleLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.incidentSummary.cattleLoss}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p1DeathLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.p1.death}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p1MissingLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.p1.missing}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p1InjuredLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.p1.injured}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p2DeathLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.p2.death}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p2MissingLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.p2.missing}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p2InjuredLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.p2.injured}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p3DeathLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.bagmati.death}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p3MissingLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.bagmati.missing}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p3InjuredLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.bagmati.injured}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p4DeathLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.gandaki.death}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p4MissingLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.gandaki.missing}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p4InjuredLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.gandaki.injured}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p5DeathLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.lumbini.death}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p5MissingLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.lumbini.missing}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p5InjuredLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.lumbini.injured}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p6DeathLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.karnali.death}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p6MissingLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.karnali.missing}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p6InjuredLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.karnali.injured}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p7DeathLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.sudurpaschim.death}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p7MissingLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.sudurpaschim.missing}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'p7InjuredLoss') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.peopleLoss.sudurpaschim.injured}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'deathMale') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.genderWiseLoss.male}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'deathFemale') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.genderWiseLoss.female}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'deathOther') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.genderWiseLoss.unknown}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidAffectedDaily') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidTwentyfourHrsStat.affected}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidfemaleAffectedDaily') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidTwentyfourHrsStat.femaleAffected}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidmaleAffectedDaily') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidTwentyfourHrsStat.maleAffected}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'coviddeathsDaily') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidTwentyfourHrsStat.deaths}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidrecoveredDaily') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidTwentyfourHrsStat.recovered}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'totalAffected') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidTotalStat.totalAffected}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'totalActive') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidTotalStat.totalActive}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'totalRecovered') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidTotalStat.totalRecovered}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'totalDeaths') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidTotalStat.totalDeaths}
//                             </TableCell>
//                         );
//                     }

//                     if (k === 'firstDosage') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.vaccineStat.firstDosage}
//                             </TableCell>
//                         );
//                     }

//                     if (k === 'secondDosage') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.vaccineStat.secondDosage}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp1totalAffected') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.p1.totalAffected}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp1totalActive') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.p1.totalActive}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp1totalDeaths') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.p1.totalDeaths}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp2totalAffected') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.p2.totalAffected}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp2totalActive') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.p2.totalActive}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp2totalDeaths') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.p2.totalDeaths}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp3totalAffected') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.bagmati.totalAffected}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp3totalActive') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.bagmati.totalActive}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp3totalDeaths') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.bagmati.totalDeaths}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp4totalAffected') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.gandaki.totalAffected}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp4totalActive') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.gandaki.totalActive}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp4totalDeaths') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.gandaki.totalDeaths}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp5totalAffected') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.lumbini.totalAffected}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp5totalActive') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.lumbini.totalActive}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp5totalDeaths') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.lumbini.totalDeaths}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp6totalAffected') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.karnali.totalAffected}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp6totalActive') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.karnali.totalActive}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp6totalDeaths') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.karnali.totalDeaths}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp7totalAffected') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.sudurpaschim.totalAffected}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp7totalActive') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.sudurpaschim.totalActive}
//                             </TableCell>
//                         );
//                     }
//                     if (k === 'covidp7totalDeaths') {
//                         return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"
// >
//                                 {row.covidProvinceWiseTotal.sudurpaschim.totalDeaths}
//                             </TableCell>
//                         );
//                     }

                    if (k === 'pdfFile') {
                        return (
                            <TableCell
                                align="center"
                                padding="normal"
                            >
                                <a href={row[k]}>Download</a>
                            </TableCell>
                        );
                    } if (k === 'modifiedOn') {
                        return (
                            <TableCell
                                align="center"
                                padding="normal"
                            >
                                {row[k].split('T')[0]}
                            </TableCell>
                        );
                    } if (k === 'createdOn') {
                        return (
                            <TableCell
                                align="center"
                                padding="normal"
                            >
                                {row[k].split('T')[0]}
                            </TableCell>
                        );
                    }
//                     if (k.includes('Hazard') && row.hazardWiseLoss) {
//                         const haz = k.substring(
//                             k.indexOf('(') + 1,
//                             k.lastIndexOf(')'),
//                         );
//                         const ici = k.split(')')[1].toLowerCase().trim();

//                             return (
//                             <TableCell
//                                 align="center"
//                                 padding="normal"

//                                                         >
//                             { row.hazardWiseLoss[haz] ? row.hazardWiseLoss[haz][ici] : '-'}
//                             </TableCell>
// );
//                     }

                    if (k === 'action') {
                        return (

                             <TableCell
                                 align="center"
                                 padding="normal"
                        >
                            {
                                (permission === 'editor' || permission === 'user' || permission === 'superuser')
                                ? (
                                <IconButton
                                    onClick={() => handleTableEdit(row)}
                                >
                                    <EditIcon />
                                </IconButton>
                                )
                                : <span>No Action</span>

                            }


                             </TableCell>

                        );
                    }
                    return (
                        <TableCell
                            align="center"
                            padding="normal"
                        >
                            { row[k] || '-'}
                        </TableCell>
                    );
                })
            }

                                                            </>


                                                        </TableRow>
                                                    );
                                                })}

                                        </TableBody>

                                    </Table>
                                </TableContainer>

                            </Paper>
                        </Box>
                    )
            }


        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
            BulletinTable,
);
