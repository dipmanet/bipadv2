import React from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { AppState } from '#store/types';
import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
} from '#selectors';

import {
    ProvinceElement,
    DistrictElement,
    MunicipalityElement,
} from '#types';

interface OwnProps {
    allData: AllData;
}

interface AllData {
    title: string;
    province: number;
    district: number;
    municipality: number;
    usableArea: number;
    totalArea: number;
    ownership: string;
    specialFeature: string;
    accessToSite: string;
    elevation: number;
}

interface Rows {
    name: number;
    calories: string;
    fat: any;
}

interface PropsFromState {
    provinceList: ProvinceElement[];
    districtList: DistrictElement[];
    municipalityList: MunicipalityElement[];
}

type Props = PropsFromState & OwnProps;
const useStyles = makeStyles({
    table: {
        minWidth: 300,
    },
    valueWidth: {
        maxWidth: 190,
        fontSize: 10,
        color: 'gray',
        fontFamily: 'Fira Sans',
    },
    container: {
        marginTop: 20,
    },
    snWidth: {
        maxWidth: 30,
        fontSize: 10,
        color: 'gray',
        fontFamily: 'Fira Sans',
    },
    characters: {
        maxWidth: 80,
        fontSize: 10,
        color: 'gray',
        fontFamily: 'Fira Sans',
    },

    titles: {
        fontWeight: 'bold',
        color: 'gray',
    },
});

function createData(name: number, calories: string, fat: string) {
    return { name, calories, fat };
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    provinceList: provincesSelector(state),
    districtList: districtsSelector(state),
    municipalityList: municipalitiesSelector(state),
});

// eslint-disable-next-line arrow-parens
const TableComponent: React.FC<Props> = (props: Props) => {
    const { allData, provinceList, districtList, municipalityList } = props;
    let provinceName;
    let districtName;
    let municipalityName;
    if (allData.province) {
        provinceName = provinceList.find(province => province.id === allData.province);
    }
    if (allData.district) {
        districtName = districtList.find(district => district.id === allData.district);
    }
    if (allData.municipality) {
        municipalityName = municipalityList.find(muni => muni.id === allData.municipality);
    }

    const rows = [
        createData(1, 'Name of OpenSpace', allData.title),
        createData(2, 'Province', provinceName ? provinceName.title : 'N/A'),
        createData(3, 'District', districtName ? districtName.title : 'N/A'),
        createData(4, 'Municipality', municipalityName ? municipalityName.title : 'N/A'),
        createData(5, 'Capacity', (allData.usableArea / 3.5).toFixed(0)),
        createData(6, 'Total Area', allData.totalArea),
        createData(7, 'Usable Area', allData.usableArea),
        createData(8, 'Ownership', allData.ownership),
        createData(9, 'Special Features', allData.specialFeature),
        createData(10, 'Access to Site', allData.accessToSite),
        createData(11, 'Elevation', allData.elevation),
    ];
    const classes = useStyles();
    return (
        <TableContainer component={Paper} className={classes.container}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead className={classes.titles}>
                    <TableRow>
                        <TableCell
                            className={(classes.snWidth, classes.titles)}
                        >
                            S.N
                        </TableCell>
                        <TableCell
                            align="right"
                            className={(classes.characters, classes.titles)}
                        >
                            Title
                        </TableCell>
                        <TableCell
                            align="right"
                            className={(classes.valueWidth, classes.titles)}
                        >
                            Value
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row: Rows) => (
                        <TableRow key={row.name}>
                            <TableCell
                                component="th"
                                scope="row"
                                className={classes.snWidth}
                            >
                                {row.name}
                            </TableCell>
                            <TableCell
                                align="right"
                                className={classes.characters}
                            >
                                {row.calories}
                            </TableCell>
                            <TableCell
                                align="right"
                                className={classes.valueWidth}
                            >
                                {row.fat}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default connect(mapStateToProps)(TableComponent);
