/* eslint-disable max-len */
import * as React from 'react';
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
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { connect, useDispatch, useSelector } from 'react-redux';
import DeleteIconSvg from 'src/admin/resources/deleteicon.svg';
import SearchIcon from 'src/admin/resources/searchicon.svg';
import styles from './styles.module.scss';
// import { RootState } from '../../../../Redux/store';
// import { getAllCovidDataIndividual, covidDataGroup } from '../../../../Redux/actions';
// import { RootState } from '../../../../Redux';


import { SetHealthInfrastructurePageAction } from '#actionCreators';
import {
    healthInfrastructurePageSelector,
    userSelector,
} from '#selectors';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    healthInfrastructurePage: healthInfrastructurePageSelector(state),
    userDataMain: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setHealthInfrastructurePage: params => dispatch(SetHealthInfrastructurePageAction(params)),
});

interface Data {
    calories: number;
    carbs: number;
    fat: number;
    name: string;
    protein: number;
}

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
): Data {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
    };
}

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
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => onRequestSort(event, property);
    const tableFields = ['title', 'quantity', 'unit', 'action'];
    const headCells = tableFields.map((invD: string) => ({
        id: invD,
        numeric: invD === 'quantity',
        disablePadding: false,
        label: invD.charAt(0).toUpperCase() + invD.slice(1),
    }));

    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align="center"
                        padding="normal"
                        sortDirection={orderBy === headCell.id ? order : false}
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
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected } = props;

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
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
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

interface Props {
    getEditRowData: () => void;
    openModal: () => void;
}
const InventoryTable = (props: Props) => {
    const [searchValue, setsearchValue] = React.useState('');
    const [filteredRowDatas, setfilteredRowDatas] = React.useState([]);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('calories');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const {
        healthInfrastructurePage: {
            resourceID,
            inventoryItem,
            inventoryData,
        },
    } = props;


    // const { inventoryData, inventoryItem } = useSelector((state: RootState) => state.health);
    const { getEditRowData, openModal } = props;
    const handleInvEdit = (resourceId: number) => {
        // edit data goes here
        getEditRowData(filteredRowDatas.filter(d => d.id === resourceId)[0]);
        openModal();
    };
    const handleInvDelete = () => {
        console.log('fsdfs');
    };

    React.useEffect(() => {
        if (inventoryData) {
            setfilteredRowDatas(inventoryData);
        }
    }, [inventoryData]);

    React.useEffect(() => {
        if (searchValue) {
            const filter = filteredRowDatas.filter(item => item.province === Number(searchValue));
            setfilteredRowDatas(filter);
        } else {
            setfilteredRowDatas(inventoryData);
        }
    }, [filteredRowDatas, inventoryData, searchValue]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            // const newSelecteds = rows.map(n => n.name);
            // setSelected(newSelecteds);
            return;
        }
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

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const getUnit = (title) => {
        if (inventoryItem.length > 0) {
            const iunit = inventoryItem.filter(t => t.title === title);
            if (iunit.length > 0) {
                return iunit[0].unit || '-';
            }
            console.log(`not found ${title} in inventory itenm`);
            return '-';
        }
        console.log('inventory item null', inventoryItem);
        return '-';
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const emptyRows = 0;
    return (

        <>
            {
                (inventoryData.length === 0 && inventoryItem.length > 0) ? <div>No Inventory available for this resource</div>
                    : (
                        <Box sx={{ width: '100%' }}>
                            <div className={styles.credentialSearch}>
                                <img src={SearchIcon} alt="" />
                                <input
                                    className={styles.credentialSearchBar}
                                    type="search"
                                    name=""
                                    id=""
                                    value={searchValue}
                                    onChange={e => setsearchValue(e.target.value)}
                                    placeholder="Search"
                                />
                                <TablePagination
                                    className={styles.tablePagination}
                                    rowsPerPageOptions={[25, 100, 125]}
                                    component="div"
                                    count={filteredRowDatas.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                />
                            </div>
                            <Paper sx={{ width: '100%', mb: 2 }}>
                                <EnhancedTableToolbar numSelected={selected.length} />
                                <TableContainer>
                                    <Table
                                        sx={{ minWidth: 750 }}
                                        aria-labelledby="tableTitle"
                                        size={dense ? 'small' : 'medium'}
                                    >
                                        <EnhancedTableHead
                                            numSelected={selected.length}
                                            order={order}
                                            orderBy={orderBy}
                                            onSelectAllClick={handleSelectAllClick}
                                            onRequestSort={handleRequestSort}
                                            rowCount={filteredRowDatas.length}
                                        />
                                        <TableBody>
                                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                            rows.slice().sort(getComparator(order, orderBy)) */}
                                            {stableSort(filteredRowDatas, getComparator(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    const isItemSelected = isSelected(row.id);
                                                    const labelId = `enhanced-table-checkbox-${index}`;
                                                    console.log('inventory row', row);
                                                    return (
                                                        <TableRow
                                                            hover
                                                            role="checkbox"
                                                            aria-checked={isItemSelected}
                                                            tabIndex={-1}
                                                            key={row.id}
                                                            selected={isItemSelected}
                                                        >
                                                            <TableCell
                                                                className={styles.setStyleForTableCell}
                                                                component="th"
                                                                id={labelId}
                                                                scope="row"
                                                                align="center"
                                                                padding="none"
                                                            >
                                                                {row.description}
                                                            </TableCell>
                                                            <TableCell
                                                                className={styles.setStyleForTableCell}
                                                                align="center"
                                                            >
                                                                {row.quantity || '-'}
                                                            </TableCell>
                                                            <TableCell
                                                                className={styles.setStyleForTableCell}
                                                                align="center"
                                                            >
                                                                {getUnit(row.description) || '-'}
                                                            </TableCell>
                                                            <TableCell
                                                                className={styles.setStyleForTableCell}
                                                                align="center"
                                                            >
                                                                <IconButton
                                                                    onClick={() => handleInvEdit(row.id)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >

                                                                    <EditIcon />
                                                                </IconButton>

                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            {emptyRows > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: (dense ? 33 : 53) * emptyRows,
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
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
    InventoryTable,
);
