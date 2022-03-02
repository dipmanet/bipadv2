/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import Loader from 'react-loader';
import Modal from '@mui/material/Modal';
// import { adminData, adminGetDataId, adminDeleteDataId }
// from '../../Redux/adminActions/adminActions';
// import { RootState, store } from '../../Redux/store';
import AdminForm from 'src/admin/components/AdminForm/index';
import styles from './styles.module.scss';
import EditIcon from '../../resources/editicon.svg';
import DeleteIconSvg from '../../resources/deleteicon.svg';

import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { SetAdminPageAction } from '#actionCreators';
import { adminPageSelector, userSelector, provincesSelector, districtsSelector } from '#selectors';


const mapStateToProps = (state: AppState): PropsFromAppState => ({
    adminPage: adminPageSelector(state),
    userDataMain: userSelector(state),
    province: provincesSelector(state),
    district: districtsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAdminPage: params => dispatch(SetAdminPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    admin: {
        url: '/user/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            province: params.province,
            district: params.district,
            munincipality: params.municipality,
        }),
        onSuccess: ({ response, props, params }) => {
            props.setAdminPage({
                adminDataMain: response.results,
            });
            params.setLoading(false);
        },
    },
    getUser: {
        url: ({ params }) => `/user/${params.id}`,
        method: methods.GET,
        onMount: false,
        query: () => ({
            format: 'json',
        }),
        onSuccess: ({ response, props, params }) => {
            props.setAdminPage({
                adminDataMainId: response,
            });
            params.setLoading(false);
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
interface Props {
    formtoggler: string;
}
const headCells: readonly HeadCell[] = [
    {
        id: 'firstName',
        numeric: false,
        disablePadding: false,
        label: 'NAME',
    },
    {
        id: 'email',
        numeric: true,
        disablePadding: false,
        label: 'Email',
    },
    {
        id: 'phoneNumber',
        numeric: true,
        disablePadding: false,
        label: 'PHONE NUMBER',
    },
    {
        id: 'province',
        numeric: true,
        disablePadding: false,
        label: 'PROVINCE',
    },
    {
        id: 'district',
        numeric: true,
        disablePadding: false,
        label: 'DISTRICT',
    },
    {
        id: 'institution',
        numeric: true,
        disablePadding: false,
        label: 'INSTITUTION',
    },
    {
        id: 'action',
        numeric: true,
        disablePadding: false,
        label: 'ACTION',
    },
];

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


    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell> */}
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        // padding={headCell.disablePadding ? 'none' : 'normal'}
                        sx={{ backgroundColor: '#DCECFE', fontWeight: 'bold' }}
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
                    bgcolor: theme => alpha(
                        theme.palette.primary.main,
                        theme.palette.action.activatedOpacity,
                    ),
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


const AdminTable = (props) => {
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('calories');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const [toggleForm, settoggleForm] = useState(false);
    const {
        adminPage: {
            adminDataMain,
            loadingAdmin,
        },
        province,
        distict,
        userDataMain,
    } = props;

    useEffect(() => {
        setLoading(true);
        props.requests.admin.do({
            province: userDataMain.profile.province,
            district: userDataMain.profile.district,
            municipality: userDataMain.profile.municipality,
            setLoading,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // const { adminDataMain, loadingAdmin } = useSelector((state: RootState) => state.adminGetData);

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = adminDataMain.map(n => n.id);
            setSelected(newSelecteds);
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

    const handleEditForm = (id) => {
        settoggleForm(true);
        setLoading(true);
        if (id) {
            props.requests.getUser.do({ id, setLoading });
            // dispatch(adminGetDataId(id));
        }
    };
    const isSelected = (name: string) => selected.indexOf(name) !== -1;
    const toggleAdminForm = () => {
        // dispatch(adminDeleteDataId());
        window.scrollTo(0, 0);
        if (toggleForm === false) {
            settoggleForm(true);
        } else {
            settoggleForm(false);
        }
    };

    const handleClose = () => {
        window.scrollTo(0, 0);
        settoggleForm(false);
    };
    const provinceName = provinceId => props.province.filter(item => item.id === provinceId)[0].title;

    const districtName = districtId => props.district.filter(item => item.id === districtId)[0].title;
    return (

        <>
            {loading ? (
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
                    <Box sx={{ width: '100%' }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table
                                    sx={{ minWidth: 750 }}
                                    aria-labelledby="tableTitle"
                                    stickyHeader
                                >
                                    <EnhancedTableHead
                                        numSelected={selected.length}
                                        order={order}
                                        orderBy={orderBy}
                                        onSelectAllClick={handleSelectAllClick}
                                    />
                                    <TableBody>
                                        { adminDataMain && stableSort(adminDataMain, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                const isItemSelected = isSelected(row.province);
                                                const labelId = `enhanced-table-checkbox-${index}`;
                                                return (
                                                    <TableRow
                                                        hover
                                                        onClick={event => handleClick(event, row.province)}
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={row.name}
                                                        selected={isItemSelected}
                                                    >
                                                        {/* <TableCell padding="checkbox">
                                                            <Checkbox
                                                                color="primary"
                                                                checked={isItemSelected}
                                                                inputProps={{
                                                                    'aria-labelledby': labelId,
                                                                }}
                                                            />
                                                        </TableCell> */}
                                                        <TableCell
                                                            className={styles.setStyleForTableCell}
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                        >
                                                            {row.firstName && row.lastName ? `${row.firstName}${' '}${row.lastName}` : '-'}
                                                        </TableCell>
                                                        <TableCell className={styles.setStyleForTableCell} align="right">
                                                            {row.email ? row.email : '-'}

                                                        </TableCell>
                                                        <TableCell className={styles.setStyleForTableCell} align="right">
                                                            {row.profile.phoneNumber ? row.profile.phoneNumber : '-'}

                                                        </TableCell>
                                                        <TableCell className={styles.setStyleForTableCell} align="right">
                                                            {row.profile.province ? provinceName(row.profile.province) : '-'}

                                                        </TableCell>
                                                        <TableCell className={styles.setStyleForTableCell} align="right">
                                                            {row.profile.district ? districtName(row.profile.district) : '-'}

                                                        </TableCell>
                                                        <TableCell className={styles.setStyleForTableCell} align="right">
                                                            {row.profile.institution ? row.profile.institution : '-'}

                                                        </TableCell>
                                                        <TableCell className={styles.setStyleForTableCell} align="right">
                                                            <img onClick={() => handleEditForm(row.id)} role="presentation" className={styles.curdOptions} src={EditIcon} alt="" />
                                                            <img className={styles.curdOptions} src={DeleteIconSvg} alt="" />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                        <Modal
                            className={styles.adminForm}
                            open={toggleForm}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            {/* <Box className={styles.boxStyle}> */}
                            <AdminForm toggleForm={toggleForm} handleClose={handleClose} />
                            {/* </Box> */}
                        </Modal>
                        <div className={styles.saveOrAddButtons}>
                            <button className={styles.submitButtons} onClick={toggleAdminForm} type="submit">Add New User</button>
                        </div>
                    </Box>
                ) }
        </>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            AdminTable,
        ),
    ),
);
