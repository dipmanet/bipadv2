import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

interface Props {
    allData: AllData;
}

interface AllData {
    title: string;
    province: any;
    municipality: any;
    usableArea: number;
    totalArea: number;
    ownership: string;
    specialFeature: string;
    accessToSite: string;
    elevation: any;
}

interface Rows {
    name: number;
    calories: string;
    fat: any;
}

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

// eslint-disable-next-line arrow-parens
const TableComponent: React.FC<Props> = (props) => {
    const { allData } = props;
    const rows = [
        createData(1, 'Name of OpenSpace', allData.title),
        createData(2, 'Province', allData.province),
        createData(3, 'Municipality', allData.municipality),
        createData(4, 'Capacity', (allData.usableArea / 3.5).toFixed(0)),
        createData(5, 'Total Area', allData.totalArea),
        createData(6, 'Usable Area', allData.usableArea),
        createData(7, 'Ownership', allData.ownership),
        createData(8, 'Special Features', allData.specialFeature),
        createData(9, 'Access to Site', allData.accessToSite),
        createData(10, 'Elevation', allData.elevation),
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

export default TableComponent;
