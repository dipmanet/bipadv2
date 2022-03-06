/* eslint-disable @typescript-eslint/camelcase */
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
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ViewIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import {
    CsvBuilder,
} from 'filefy';
import Loader from 'react-loader';
import { ActionCreator, Dispatch } from 'redux';
import DeleteIconSvg from 'src/admin/resources/deleteicon.svg';
import SearchIcon from 'src/admin/resources/searchicon.svg';
import styles from './styles.module.scss';
import { tableTitleRef, institutionDetails, downloadedTitle } from './utils';
import HealthForm from '../HealthForm';
import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
// import { getHealthTable, deleteHealthTable, formDataForEdit, setInventoryItem, healthDataLoading } from '../../Redux/actions';

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

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    resource: {
        url: '/resource/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            resource_type: 'health',
            meta: true,
            offset: params.offset,
            limit: 100,
            count: true,
            expand: ['ward', 'ward.municipality', 'ward.municipality.district', 'ward.municipality.district.province'],
            ordering: '-last_modified_date',
        }),
        onSuccess: ({ response, props }) => {
            props.setHealthInfrastructurePage({
                healthTableData: response.results,
                healthDataCount: response.count,
            });
        },
    },

    formDataForEdit: {
        url: ({ params }) => `/resource/${params.resourceID}/`,
        method: methods.GET,
        onMount: false,
        query: ({
            format: 'json',
            expand: ['ward', 'ward.municipality', 'ward.municipality.district', 'ward.municipality.district.province'],
        }),
        onSuccess: ({ response, props }) => {
            props.setHealthInfrastructurePage({
                healthFormEditData: response,
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
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, inventoryItem } = props;
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => onRequestSort(event, property);
    const headCells = Object.keys(tableTitleRef)
        .filter(fI => fI !== 'resource_type')
        .filter(fI => fI !== 'title_ne')
        .filter(fI => fI !== 'description')
        .filter(fI => fI !== 'last')
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
    // dispatch: Dispatch;
    // deleteHealthTable: ActionCreator;
    // formDataForEdit: ActionCreator;
    userDataMain: Record<string|undefined>;
    healthFormEditData: Record<string|undefined>;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected, selected, dispatch, formDataForEdit, healthFormEditData, userDataMain } = props;
    // const navigate = useNavigate();


    const handleDelete = () => {
        console.log('...delete');
    };
    const handleEdit = () => {
        formDataForEdit.do({ resourceID: selected[0] });
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
                        (
                            Object.keys(userDataMain).length > 0 && userDataMain.profile && !userDataMain.isSuperuser && userDataMain.profile.role === null
                        )
                            ? (
                                <>
                                    <Tooltip title="Edit">

                                        <IconButton
                                            onClick={handleEdit}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )
                            : (
                                <>
                                    <Tooltip title="Edit">

                                        <IconButton
                                            onClick={handleEdit}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )

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


const HealthTable = (props) => {
    const [searchValue, setsearchValue] = useState('');
    const [filteredRowDatas, setfilteredRowDatas] = useState([]);
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof Data>('last_modified_date');
    const [loader, setLoader] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [offset, setOffset] = useState(0);

    // const { healthTableData, healthFormEditData, inventoryItem, healthDataCount } = useSelector((state: RootState) => state.health);
    const {
        healthInfrastructurePage: {
            healthTableData,
            healthFormEditData,
            inventoryItem,
            healthDataCount,
        },
        userDataMain,
    } = props;

    useEffect(() => {
        if (Object.keys(healthFormEditData).length > 0) {
            navigate('/admin/health-infrastructure/add-new-health-infrastructure');
        }
    }, [healthFormEditData]);

    useEffect(() => {
        props.requests.resource.do();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const searchParam = ['title'];
        if (searchValue) {
            const filter = filteredRowDatas.filter(item => searchParam.some(newItem => (
                item[newItem]
                    .toString()
                    .toLowerCase()
                    .indexOf(searchValue.toLowerCase()) > -1
            )));
            setfilteredRowDatas(filter);
        } else {
            setfilteredRowDatas(healthTableData);
        }
    }, [filteredRowDatas, healthTableData, searchValue]);

    useEffect(() => {
        if (healthTableData.length > 0) {
            console.log('...setting table data', healthTableData);
            setLoader(false);
            setfilteredRowDatas(healthTableData);
        }
    }, [healthTableData]);

    // new code
    const Dataforcsv = () => {
        const csvData = filteredRowDatas
            .map((item) => {
                const objToSend = [
                    item.id,
                    item.ward.municipality.district.province.title,
                    item.ward.municipality.district.title,
                    item.ward.municipality.title,
                    item.ward.title,
                    item.localAddress,
                    item.point.coordinates[1],
                    item.point.coordinates[0],
                    item.title,
                    item.titleNe,
                    item.startTime,
                    item.endTime,
                    item.phoneNumber,
                    item.emailAddress,
                    item.website,
                    item.registrationEstDate,
                    item.lastRenewalDate,
                    item.dateOfValidity,
                    item.authority,
                    item.authority_level,
                    item.ownership,
                    item.type,
                    item.serviceType,
                    item.operationalStatus,
                    item.bedCount,
                    item.hospitalBed,
                    item.icuBed,
                    item.ventilatorBed,
                    item.hasChildImmunization || '',
                    item.hasTdVaccination || '',
                    item.vaccinationFacility || '',
                    item.hasImnci || '',
                    item.hasGrowthMonitoring || '',
                    item.hasSafeMotherhood || '',
                    item.hasAntenatalCare || '',
                    item.hasPostnatalCare || '',
                    item.birthingCenter || '',
                    item.hasBasicEmergencyObstetricCare || '',
                    item.hasComprehensiveEmergencyObstetricCare || '',
                    item.hasPostAbortionCare || '',
                    item.familyPlanning || '',
                    item.hasCondomPillsDepoprovera || '',
                    item.hasIucd || '',
                    item.hasImplant || '',
                    item.hasMinilap || '',
                    item.hasVasectomy || '',
                    item.hasOpd || '',
                    item.hasGeneral || '',
                    item.hasPediatric || '',
                    item.hasObsAndGynae || '',
                    item.hasDentalOpd || '',
                    item.hasSurgery || '',
                    item.hasGastrointestinal || '',
                    item.hasCardiac || '',
                    item.hasMental || '',
                    item.hasRespiratory || '',
                    item.hasNephrology || '',
                    item.hasEnt || '',
                    item.hasDermatology || '',
                    item.hasEndocrinology || '',
                    item.hasOncology || '',
                    item.hasNeurology || '',
                    item.hasOphthalmology || '',
                    item.hasTreatementOfTb || '',
                    item.hasTreatementOfMdrTb || '',
                    item.hasTreatementOfLeprosy || '',
                    item.hasTreatementOfMalaria || '',
                    item.hasTreatementOfKalaazar || '',
                    item.hasTreatementOfJapaneseEncephalitis || '',
                    item.hasLaboratoryService || '',
                    item.hasTestHiv || '',
                    item.hasTestMalaria || '',
                    item.hasTestTb || '',
                    item.hasTestKalaazar || '',
                    item.hasUrineRe || '',
                    item.hasStoolRe || '',
                    item.hasGeneralBloodCbc || '',
                    item.hasCulture || '',
                    item.hasHormones || '',
                    item.hasLeprosySmearTest || '',
                    item.hasTestCovidPcr || '',
                    item.hasTestCovidAntigen || '',
                    item.hasVolunteerCounselingTest || '',
                    item.hasPmtct || '',
                    item.hasAntiRetroViralTreatment || '',
                    item.hasDental || '',
                    item.hasInPatient || '',
                    item.hasRadiology || '',
                    item.hasXRay || '',
                    item.hasXRayWithContrast || '',
                    item.hasUltrasound || '',
                    item.hasEchocardiogram || '',
                    item.hasEcg || '',
                    item.hasTrademill || '',
                    item.hasCtScan || '',
                    item.hasMri || '',
                    item.hasEndoscopy || '',
                    item.hasColonoscopy || '',
                    item.hasSurgicalService || '',
                    item.hasCaesarianSection || '',
                    item.hasGastrointestinalSurgery || '',
                    item.hasTraumaSurgery || '',
                    item.hasCardiacSurgery || '',
                    item.hasNeuroSurgery || '',
                    item.hasPlasticSurgery || '',
                    item.hasSpecializedService || '',
                    item.hasIcu || '',
                    item.hasCcu || '',
                    item.hasNicu || '',
                    item.hasMicu || '',
                    item.hasSncu || '',
                    item.hasPicu || '',
                    item.hasCardiacCatheterization || '',
                    item.hasPhysiotherapy || '',
                    item.hasAmbulanceService || '',
                    item.hasExtendedHealthService || '',
                    item.hasGeriatricWard || '',
                    item.hasPharmacy || '',
                    item.hasOcmc || '',
                    item.hasHealthInsurance || '',
                    item.hasSsu || '',
                    item.hasAyurvedaService || '',
                    item.hasCovidClinicService || '',
                    item.hasEmergencyServices || '',
                    item.hasOperatingTheatre || '',
                    item.hasBloodDonation || '',
                    item.hasFreeTreatmentKidneyDialysis || '',
                    item.hasFreeTreatmentKidneyTransplant || '',
                    item.hasFreeTreatmentMedicationAfterKidneyTransplant || '',
                    item.hasFreeTreatmentHeadInjury || '',
                    item.hasFreeTreatmentSpinalInjury || '',
                    item.hasFreeTreatmentAlzheimer || '',
                    item.hasFreeTreatmentCancer || '',
                    item.hasFreeTreatmentHeart || '',
                    item.hasFreeTreatmentParkinson || '',
                    item.hasFreeTreatmentSickleCellAnemia || '',
                    item.specialization,
                    item.hasInternetFacility || '',
                    item.noOfEmployee,
                    item.noOfFemaleEmployee,
                    item.noOfMaleEmployee,
                    item.noOfOtherEmployee,
                    item.noOfDifferentlyAbledMaleEmployees,
                    item.noOfDifferentlyAbledFemaleEmployees,
                    item.noOfDifferentlyAbledOtherEmployees,
                    item.hasEvacuationRoute || '',
                    item.hasDisableFriendlyInfrastructure || '',
                    item.specifyInfrastructure,
                    item.isDesignedFollowingBuildingCode || '',
                    item.hasHelipad || '',
                    item.hasFocalPerson || '',
                    item.focalPersonName,
                    item.focalPersonPhoneNumber,
                    item.hasOpenSpace || '',
                    item.areaOfOpenSpace || '',
                    item.areaOfOpenSpace,
                    'sq km',
                    item.hasMedicineStorageSpace || '',
                    item.hasBackupElectricity || '',
                    '', // are invntories available
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    item.isVerified || '',
                    item.verficationMessage,
                    item.isApproved || '',
                ];
                return objToSend;
            });
        return csvData;
    };


    const handleDownload = () => {
        const csvBuilder = new CsvBuilder(`HealthData_${Date.now()}.csv`)
            .setColumns(downloadedTitle)
            .addRows(Dataforcsv())
            .exportFile();
    };
    // new code end

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    useEffect(() => {
        console.log('test offset', offset);
        props.requests.resource.do({ offset });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        setLoader(true);
        const remainder = healthDataCount % 100;
        const maxPages = ((healthDataCount - remainder) / 100 + 1);
        if (newPage <= maxPages) {
            console.log('test page', newPage);
            setOffset(newPage * 100);
        }
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };
    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const handleCheck = (e, id) => {
        if (e.target.checked) {
            setSelected([id]);
        } else {
            setSelected([]);
        }
    };
    const snakeToCamel = str => str.toLowerCase().replace(/([-_][a-z])/g, group => group
        .toUpperCase()
        .replace('-', '')
        .replace('_', ''));

    // Avoid a layout jump when reaching the last page with empty rows.
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
                            sx={{ width: '88vw', boxShadow: '0px 2px 5px rgba(151, 149, 148, 0.25);' }}
                        >
                            <div className={styles.credentialSearch}>
                                <div className={styles.leftOptions} />
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
                                        count={healthDataCount}
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
                                    // deleteHealthTable={deleteHealthTable}
                                    formDataForEdit={props.requests.formDataForEdit}
                                    userDataMain={userDataMain}
                                    healthFormEditData={healthFormEditData}
                                />
                                <TableContainer
                                    sx={{ maxHeight: 800 }}
                                    stickyHeader
                                    style={{ width: '100%', overflowX: 'scroll' }}
                                >
                                    <Table
                                        sx={{ minWidth: 750 }}
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
                                            // onRequestSort={handleRequestSort}
                                            rowCount={filteredRowDatas.length}
                                            // inventoryItem={inventoryItem}
                                        />

                                        <TableBody>
                                            {
                                                filteredRowDatas.map((row, index) => {
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
                                                            <TableCell
                                                                align="center"
                                                                padding="normal"
                                                            >
                                                                <Checkbox
                                                                    color="primary"
                                                                    onChange={e => handleCheck(e, row.id)}
                                                                    checked={isItemSelected}
                                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                                />
                                                            </TableCell>
                                                            {

                                                                Object.keys(tableTitleRef)
                                                                    .filter(fI => fI !== 'resource_type')
                                                                    .filter(fI => fI !== 'title_ne')
                                                                    .filter(fI => fI !== 'description')
                                                                    .filter(fI => fI !== 'last')
                                                                    .map((val) => {
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
                                                                                    {`${row[snakeToCamel(val)].coordinates[0].toFixed(4)}, ${row[snakeToCamel(val)].coordinates[1].toFixed(4)}`}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        if (val === 'province') {
                                                                            return (
                                                                                <TableCell
                                                                                    align={typeof val === 'string' ? 'left' : 'center'}
                                                                                    className={styles.setStyleForTableCell}
                                                                                    component="th"
                                                                                    id={labelId}
                                                                                    scope="row"
                                                                                    padding="none"
                                                                                    key={val + 1}
                                                                                >
                                                                                    {`${row.ward.municipality.district.province.title}`}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        if (val === 'district') {
                                                                            return (
                                                                                <TableCell
                                                                                    align={typeof val === 'string' ? 'left' : 'center'}
                                                                                    className={styles.setStyleForTableCell}
                                                                                    component="th"
                                                                                    id={labelId}
                                                                                    scope="row"
                                                                                    padding="none"
                                                                                    key={val + 2}
                                                                                >
                                                                                    {`${row.ward.municipality.district.title}`}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        if (val === 'municipality') {
                                                                            return (
                                                                                <TableCell
                                                                                    align={typeof val === 'string' ? 'left' : 'center'}
                                                                                    className={styles.setStyleForTableCell}
                                                                                    component="th"
                                                                                    id={labelId}
                                                                                    scope="row"
                                                                                    padding="none"
                                                                                    key={val + 3}
                                                                                >
                                                                                    {`${row.ward.municipality.title}`}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        if (val === 'ward') {
                                                                            return (
                                                                                <>
                                                                                    <TableCell
                                                                                        align={typeof val === 'string' ? 'left' : 'center'}
                                                                                        className={styles.setStyleForTableCell}
                                                                                        component="th"
                                                                                        id={labelId}
                                                                                        scope="row"
                                                                                        padding="none"
                                                                                        key={val + 4}
                                                                                    >
                                                                                        {`${row[snakeToCamel(val)].title}`}
                                                                                    </TableCell>
                                                                                </>
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
                                                                                    {`${row[snakeToCamel(val)].split('T')[0]}`}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        if (typeof row[snakeToCamel(val)] === 'boolean') {
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
                                                                                    {row[snakeToCamel(val)] === true ? 'Yes' : 'No'}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                        return (
                                                                            <TableCell
                                                                                align={typeof row[snakeToCamel(val)] === 'string' ? 'left' : 'center'}
                                                                                className={styles.setStyleForTableCell}
                                                                                component="th"
                                                                                id={labelId}
                                                                                scope="row"
                                                                                padding="none"
                                                                                key={val}
                                                                            >
                                                                                {row[snakeToCamel(val)] === null ? '-' : row[snakeToCamel(val)]
                                                                                }
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
                    )
            }


        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            HealthTable,
        ),
    ),
);
