/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */

import React, { useState, useEffect } from 'react';
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
import { connect, useDispatch, useSelector } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import Loader from 'react-loader';
import {
    CsvBuilder,
} from 'filefy';
import { navigate } from '@reach/router';
import { SetCovidPageAction } from '#actionCreators';
import { covidPageSelector } from '#selectors';
import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { AppState } from '#types';
import DeleteIconSvg from '../../resources/deleteicon.svg';
import EditIcon from '../../resources/editicon.svg';
import SearchIcon from '../../resources/searchicon.svg';
import styles from './styles.module.scss';
// import { getAllCovidDataIndividual, covidDataGroup, covidTableData, getAllCovidDataGroup } from '../../Redux/actions';
// import { RootState } from '../../Redux/store';
// import { covidDataGetGroupId, covidDataGetIndividualId } from '../../Redux/covidActions/covidActions';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    covidPage: covidPageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setCovidPage: params => dispatch(SetCovidPageAction(params)),
});


const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    covid19Indivisual: {
        url: '/covid19-case/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            offset: params.offset,
            limit: 100,
            count: true,
            expand: ['ward', 'municipality', 'district', 'province'],
            ordering: '-last_modified_date',
        }),
        onSuccess: ({ response, props }) => {
            props.setCovidPage({
                covidIndivisualData: response.results,
                covidIndivisualCount: response.count,
            });
        },
    },
    covid19Group: {
        url: '/covid19-quarantineinfo/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            offset: params.offset,
            limit: 100,
            count: true,
            expand: ['ward', 'municipality', 'district', 'province'],
            ordering: '-last_modified_date',
        }),
        onSuccess: ({ response, props }) => {
            props.setCovidPage({
                covidGroupData: response.results,
                covidGroupCount: response.count,
            });
        },
    },
    covid19IndivisualEdit: {
        url: ({ params }) => `/covid19-case/${params.id}`,
        method: methods.GET,
        onMount: false,
        query: ({
            format: 'json',
            expand: ['ward', 'municipality', 'district', 'province'],
        }),
        onSuccess: ({ response, props }) => {
            props.setCovidPage({
                covid19IndividualEditData: response,
            });
        },
    },
    covid19GroupEdit: {
        url: ({ params }) => `/covid19-quarantineinfo/${params.id}`,
        method: methods.GET,
        onMount: false,
        query: ({
            format: 'json',
            expand: ['ward', 'municipality', 'district', 'province'],
        }),
        onSuccess: ({ response, props }) => {
            props.setCovidPage({
                covid19GroupEditData: response,
            });
        },
    },
};


interface Data {
    calories: number;
    carbs: number;
    fat: number;
    name: string;
    protein: number;
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
interface Props {
    formtoggler: string;
}
const headCells: readonly HeadCell[] = [
    {
        id: 'province',
        numeric: false,
        disablePadding: false,
        label: 'Province',
    },
    {
        id: 'district',
        numeric: false,
        disablePadding: true,
        label: 'District',
    },
    {
        id: 'municipality',
        numeric: false,
        disablePadding: true,
        label: 'Municipality',
    },
    {
        id: 'ward',
        numeric: false,
        disablePadding: true,
        label: 'Ward',
    },
    {
        id: 'reportedOn',
        numeric: true,
        disablePadding: false,
        label: 'Reported On',
    },
    {
        id: 'hazardInducer',
        numeric: true,
        disablePadding: false,
        label: 'Hazard Inducer',
    },
    {
        id: 'loacaladdress',
        numeric: true,
        disablePadding: false,
        label: 'Local Address',
    },
    {
        id: 'currentState',
        numeric: true,
        disablePadding: false,
        label: 'Patient Status',
    },
    {
        id: 'age',
        numeric: true,
        disablePadding: false,
        label: 'Age',
    },
    {
        id: 'gender',
        numeric: true,
        disablePadding: false,
        label: 'Gender',
    },
    {
        id: 'verified',
        numeric: true,
        disablePadding: false,
        label: 'Verified',
    },
    {
        id: 'verificationMessage',
        numeric: true,
        disablePadding: false,
        label: 'Verification Message',
    },
    {
        id: 'approved',
        numeric: true,
        disablePadding: false,
        label: 'Approved',
    },
    {
        id: 'action',
        numeric: true,
        disablePadding: false,
        label: 'Action',
    },
];
const headCellsGroup: readonly HeadCell[] = [
    {
        id: 'province',
        numeric: false,
        disablePadding: false,
        label: 'Province',
    },
    {
        id: 'district',
        numeric: false,
        disablePadding: true,
        label: 'District',
    },
    {
        id: 'municipality',
        numeric: false,
        disablePadding: true,
        label: 'Municipality',
    },
    {
        id: 'ward',
        numeric: false,
        disablePadding: true,
        label: 'Ward',
    },
    {
        id: 'reportedOn',
        numeric: true,
        disablePadding: false,
        label: 'Reported On',
    },
    {
        id: 'hazardInducer',
        numeric: true,
        disablePadding: false,
        label: 'Hazard Inducer',
    },
    {
        id: 'newCasesMale',
        numeric: true,
        disablePadding: false,
        label: 'Total Male Infected',
    },
    {
        id: 'newCasesFemale',
        numeric: true,
        disablePadding: false,
        label: 'Total Female infected',
    },
    {
        id: 'newCasesOther',
        numeric: true,
        disablePadding: false,
        label: 'Total Other Infected',
    },
    {
        id: 'newCasesDisabled',
        numeric: true,
        disablePadding: false,
        label: 'Total Disabled Infected',
    },
    {
        id: 'newDeathMale',
        numeric: true,
        disablePadding: false,
        label: 'Total Male Death',
    },
    {
        id: 'newDeathFemale',
        numeric: true,
        disablePadding: false,
        label: 'Total Female Death',
    },
    {
        id: 'newDeathOther',
        numeric: true,
        disablePadding: false,
        label: 'Total Other Death',
    },
    {
        id: 'newDeathDisabled',
        numeric: true,
        disablePadding: false,
        label: 'Total Disabled Death',
    },
    {
        id: 'newRecoveredMale',
        numeric: true,
        disablePadding: false,
        label: 'Total Male Recovered',
    },
    {
        id: 'newRecoveredFemale',
        numeric: true,
        disablePadding: false,
        label: 'Total Female Recovered',
    },
    {
        id: 'newRecoveredOther',
        numeric: true,
        disablePadding: false,
        label: 'Total Other Recovered',
    },
    {
        id: 'newRecoveredDisabled',
        numeric: true,
        disablePadding: false,
        label: 'Total Disabled Recovered',
    },
    {
        id: 'verified',
        numeric: true,
        disablePadding: false,
        label: 'Verified',
    },
    {
        id: 'verificationMessage',
        numeric: true,
        disablePadding: false,
        label: 'Verification Message',
    },
    {
        id: 'approved',
        numeric: true,
        disablePadding: false,
        label: 'Approved',
    },
    {
        id: 'action',
        numeric: true,
        disablePadding: false,
        label: 'Action',
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


const CovidTable = (props) => {
    const { formtoggler } = props;
    const [searchValue, setsearchValue] = useState('');
    const [filteredRowDatas, setfilteredRowDatas] = useState([]);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data>('calories');
    const [selected, setSelected] = useState<readonly string[]>([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [offset, setOffset] = useState(0);

    const { covidPage: {
        covidIndivisualData,
        covidIndivisualCount,
        covidGroupData,
        covidGroupCount,
        covid19IndividualEditData,
        covid19GroupEditData,
    } } = props;

    useEffect(() => {
        if (formtoggler === 'Individual Form') {
            props.requests.covid19Indivisual.do();
            setfilteredRowDatas(covidIndivisualData);
        }
        if (formtoggler === 'Group Form') {
            props.requests.covid19Group.do();
            setfilteredRowDatas(covidGroupData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formtoggler]);

    // const navigate = useNavigate();
    function EnhancedTableHead() {
        const { onSelectAllClick, numSelected, rowCount, onRequestSort } = props;
        const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => onRequestSort(event, property);

        return (
            <TableHead>
                <TableRow>
                    {formtoggler === 'Individual Form'
                        ? (
                            <>
                                {headCells.map(headCell => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        padding={headCell.disablePadding ? 'none' : 'normal'}
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
                            </>
                        ) : (
                            <>
                                {headCellsGroup.map(headCell => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        padding={headCell.disablePadding ? 'none' : 'normal'}
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
                            </>
                        )
                    }

                </TableRow>
            </TableHead>
        );
    }
    const handleEditForm = (id) => {
        // navigate('/admin/covid-19/add-new-covid-19');
        if (formtoggler === 'Individual Form') {
            if (id) {
                props.requests.covid19IndivisualEdit.do({ id });
            }
        }
        if (formtoggler === 'Group Form') {
            if (id) {
                props.requests.covid19GroupEdit.do({ id });
            }
        }
    };

    useEffect(() => {
        if (Object.keys(covid19IndividualEditData).length > 0 || Object.keys(covid19GroupEditData).length > 0) {
            navigate('/admin/covid-19/add-new-covid-19');
        }
    }, [covid19IndividualEditData, covid19GroupEditData]);

    // useEffect(() => {
    //     if (Object.keys(covid19IndividualEditData).length > 0) {
    //         navigate('/admin/covid-19/add-new-covid-19');
    //     }
    // }, [covid19IndividualEditData]);

    // useEffect(() => {
    //     if (Object.keys(covid19GroupEditData).length > 0) {
    //         navigate('/admin/covid-19/add-new-covid-19');
    //     }
    // }, [covid19GroupEditData]);

    const Dataforcsv = () => {
        if (formtoggler === 'Individual Form') {
            if (filteredRowDatas) {
                const csvData = filteredRowDatas.map((item) => {
                    let disabled;
                    let ward;
                    let province;
                    let district;
                    let municipality;
                    let date;
                    let verified;
                    let approved;
                    if (item.reportedOn) {
                        const a = item.reportedOn;
                        date = `${a.split('-')[0]}/${a.split('-')[1]}/${a.split('-')[2]}`;
                    } else {
                        date = '';
                    }
                    if (item.disabled) {
                        disabled = 'Yes';
                    } else {
                        disabled = '';
                    }
                    if (item.ward
                        && typeof item.ward === 'object'
                        && Object.keys(item.ward).length > 0) {
                        ward = item.ward.title;
                    } else {
                        ward = '';
                    }
                    if (item.municipality
                        && typeof item.municipality === 'object'
                        && Object.keys(item.municipality).length > 0
                    ) {
                        municipality = item.municipality.title;
                    } else {
                        municipality = '';
                    }
                    if (
                        item.district
                        && typeof item.district === 'object'
                        && Object.keys(item.district).length > 0
                    ) {
                        district = item.district.title;
                    } else {
                        district = '';
                    }
                    if (item.province
                        && typeof item.province === 'object'
                        && Object.keys(item.province).length > 0
                    ) {
                        province = item.province.title;
                    } else {
                        province = '';
                    } if (item.verified) {
                        verified = 'Yes';
                    } else {
                        verified = '';
                    }
                    if (item.approved) {
                        approved = 'Yes';
                    } else {
                        approved = '';
                    }
                    return (
                        [item.id, province, district, municipality, ward, item.localAddress,
                        item.point.coordinates[1], item.point.coordinates[0], date, item.hazardInducer,
                        item.currentState, item.age, item.gender, disabled, verified,
                        item.verificationMessage, approved]
                    );
                });
                return csvData;
            }
        } else if (filteredRowDatas) {
            const csvData = filteredRowDatas.map((item) => {
                let ward;
                let province;
                let district;
                let municipality;
                let date;
                if (item.reportedOn) {
                    const a = item.reportedOn;
                    date = `${a.split('-')[0]}/${a.split('-')[1]}/${a.split('-')[2]}`;
                } else {
                    date = '';
                }
                if (item.ward) {
                    ward = item.ward.title;
                } else {
                    ward = '';
                }
                if (item.municipality) {
                    municipality = item.municipality.title;
                } else {
                    municipality = '';
                }
                if (item.district) {
                    district = item.district.title;
                } else {
                    district = '';
                }
                if (item.province) {
                    province = item.province.title;
                } else {
                    province = '';
                }

                return ([
                    item.id,
                    province,
                    district,
                    municipality,
                    ward,
                    date,
                    item.hazardInducer,
                    item.newCasesMale,
                    item.newCasesFemale,
                    item.newCasesOther,
                    item.newCasesDisabled,
                    item.newRecoveredMale,
                    item.newRecoveredFemale,
                    item.newRecoveredOther,
                    item.newRecoveredDisabled,
                    item.newDeathMale,
                    item.newDeathFemale,
                    item.newDeathOther,
                    item.newDeathDisabled,
                    item.verified,
                    item.verificationMessage,
                    item.approved,
                ]);
            });
            return csvData;
        }
        return null;
    };

    const handleDownload = () => {
        if (formtoggler === 'Individual Form') {
            const csvBuilder = new CsvBuilder(`CovidDataIndividual_${Date.now()}.csv`)
                .setColumns(['Id', 'Province', 'District', 'Municipality', 'Ward', 'Local Address',
                    'Latitude', 'Longitude', 'Reported Date (A.D.)(eg. 2021/07/31)', 'Hazard Inducer', 'Patient Status (Active/Recovered/Death)', 'Age', 'Gender (Male/Female/Other)', 'Disabled (eg. Yes)', 'Verified (eg. Yes)', 'Verification message', 'Approved (eg. Yes)',
                ])
                .addRows(Dataforcsv())
                .exportFile();
        } else {
            const csvBuilder = new CsvBuilder(`CovidDataGroup_${Date.now()}.csv`)
                .setColumns(['Id',
                    'Province', 'District',
                    'Municipality', 'Ward',
                    'Reported Date (A.D.)(eg. 2021/07/31)',
                    'Hazard Inducer',
                    'Total Male Infected',
                    'Total Female Infected',
                    'Total Other Infected',
                    'Total Disabled Infected',
                    'Total Male Recovered',
                    'Total Female Recovered',
                    'Total Other Recovered',
                    'Total Disabled Recovered',
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
        }
    };


    // const dispatch = useDispatch();

    const covidDataCountGroup = 0;
    const loadingCovid19GetGroup = 0;
    const covidDataCount = 0;
    const loadingCovid19GetIndividual = 0;
    const loadingCovid19PutBulkData = 0;


    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.checked) {
    //         const newSelecteds = filteredRowDatas.map(n => n.id);
    //         setSelected(newSelecteds);
    //         return;
    //     }
    //     setSelected([]);
    // };

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
        // setLoader(true);
        if (formtoggler === 'Individual Form') {
            const remainder = covidIndivisualCount % 100;
            const maxPages = ((covidIndivisualCount - remainder) / 100 + 1);
            if (newPage <= maxPages) {
                setOffset(newPage * 100);
            }
        } else {
            const remainder = covidGroupCount % 100;
            const maxPages = ((covidGroupCount - remainder) / 100 + 1);
            if (newPage <= maxPages) {
                setOffset(newPage * 100);
            }
        }
    };

    useEffect(() => {
        if (formtoggler === 'Individual Form') {
            props.requests.covid19Indivisual.do({ offset });
        } else {
            props.requests.covid19Group.do({ offset });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const options = {
        top: '85%',
        left: '50%',
        position: 'absolute',
    };
    // const {
    //     userDataMain,
    // } = useSelector(state => state.user);
    // React.useEffect(() => {
    //     if (formtoggler === 'Individual Form' && Object.keys(userDataMain).length > 0) {
    //         // dispatch(getAllCovidDataIndividual());
    //     } else if (formtoggler === 'Group Form' && Object.keys(userDataMain).length > 0) {
    //         // dispatch(getAllCovidDataGroup());
    //     }
    // }, [formtoggler, userDataMain]);

    return (
        <>
            {
                (loadingCovid19GetGroup || loadingCovid19GetIndividual) ? (
                    <Loader
                        options={{
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
                        <Box sx={{ width: '100%', boxShadow: '0px 2px 5px rgba(151, 149, 148, 0.25);' }}>
                            <div className={styles.credentialSearch}>

                                <DownloadIcon className={styles.downloadIcon} onClick={handleDownload} />
                                <TablePagination
                                    className={styles.tablePagination}
                                    rowsPerPageOptions={[100]}
                                    component="div"
                                    count={formtoggler === 'Individual Form' ? covidIndivisualCount : covidGroupCount}
                                    rowsPerPage={100}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </div>
                            <Paper sx={{ width: '100%', mb: 2 }}>
                                <EnhancedTableToolbar numSelected={selected.length} />
                                <TableContainer sx={{ maxHeight: 800 }}>
                                    <Table
                                        aria-labelledby="tableTitle"
                                        size={dense ? 'small' : 'medium'}
                                        aria-label="sticky table"
                                        sx={{ minWidth: 750 }}
                                        stickyHeader
                                    >
                                        <EnhancedTableHead
                                            // numSelected={selected.length}
                                            order={order}
                                            orderBy={orderBy}
                                            onRequestSort={handleRequestSort}
                                            rowCount={covidDataCount}
                                        />
                                        <TableBody>
                                            {filteredRowDatas
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
                                                            key={row.id}
                                                            selected={isItemSelected}
                                                        >

                                                            <TableCell
                                                                className={styles.setStyleForTableCell}
                                                                id={labelId}
                                                                scope="row"
                                                            >
                                                                {row.province ? row.province.title : '-'}
                                                            </TableCell>
                                                            <TableCell
                                                                className={styles.setStyleForTableCell}
                                                                component="th"
                                                                id={labelId}
                                                                scope="row"
                                                                padding="none"
                                                            >
                                                                {row.district ? row.district.title : '-'}
                                                            </TableCell>
                                                            <TableCell
                                                                className={styles.setStyleForTableCell}
                                                                component="th"
                                                                id={labelId}
                                                                scope="row"
                                                                padding="none"
                                                            >
                                                                {row.municipality ? row.municipality.title : '-'}
                                                            </TableCell>
                                                            <TableCell
                                                                className={styles.setStyleForTableCell}
                                                                component="th"
                                                                id={labelId}
                                                                scope="row"
                                                                padding="none"
                                                            >
                                                                {row.ward ? row.ward.title : '-'}
                                                            </TableCell>

                                                            <TableCell className={styles.setStyleForTableCell} align="right">{row.reportedOn}</TableCell>
                                                            <TableCell className={styles.setStyleForTableCell} align="right">{row.hazradInducer ? row.hazradInducer : 'No Data'}</TableCell>
                                                            {formtoggler === 'Individual Form' && (
                                                                <>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.localAddress ? row.localAddress : 'No Data'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.currentState ? row.currentState.charAt(0).toUpperCase() + row.currentState.slice(1) : 'No Data'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.age ? row.age : 'No Data'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.gender ? row.gender.charAt(0).toUpperCase() + row.gender.slice(1) : 'No Data'}</TableCell>
                                                                </>
                                                            )}
                                                            {formtoggler === 'Group Form' && (
                                                                <>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newCasesMale ? row.newCasesMale : '-'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newCasesFemale ? row.newCasesFemale : '-'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newCasesOther ? <row className="newCasesOther" /> : '-'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newCasesDisabled ? row.newCasesDisabled : '-'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newDeathMale ? row.newDeathMale : '-'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newDeathFemale ? row.newDeathFemale : '-'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newDeathOther ? row.newDeathOther : '-'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newDeathDisabled ? row.newDeathDisabled : '-'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newRecoveredMale ? row.newRecoveredMale : '-'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newRecoveredFemale ? row.newRecoveredFemale : '-'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newRecoveredOther ? row.newRecoveredOther : '-'}</TableCell>
                                                                    <TableCell className={styles.setStyleForTableCell} align="right">{row.newRecoveredDisabled ? row.newRecoveredDisabled : '-'}</TableCell>
                                                                </>
                                                            )}

                                                            <TableCell className={styles.setStyleForTableCell} align="right">{row.verified ? 'Yes' : 'No'}</TableCell>
                                                            <TableCell className={styles.setStyleForTableCell} align="right">{row.verificationMessage ? row.verificationMessage : 'No Data'}</TableCell>
                                                            <TableCell className={styles.setStyleForTableCell} align="right">{row.approved ? 'Yes' : 'No'}</TableCell>
                                                            <TableCell className={styles.setStyleForTableCell} align="right">
                                                                <img onClick={() => handleEditForm(row.id)} className={styles.curdOptions} src={EditIcon} alt="" />
                                                                <img className={styles.curdOptions} src={DeleteIconSvg} alt="" />
                                                            </TableCell>
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
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            CovidTable,
        ),
    ),
);
