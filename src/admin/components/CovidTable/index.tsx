/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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
import DeleteIconSvg from '../../resources/deleteicon.svg';
import EditIcon from '../../resources/editicon.svg';
import SearchIcon from '../../resources/searchicon.svg';
import styles from './styles.module.scss';
// import { getAllCovidDataIndividual, covidDataGroup, covidTableData, getAllCovidDataGroup } from '../../Redux/actions';
// import { RootState } from '../../Redux/store';
// import { covidDataGetGroupId, covidDataGetIndividualId } from '../../Redux/covidActions/covidActions';
import { SetCovidPageAction } from '#actionCreators';
import { covidPageSelector } from '#selectors';
import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { AppState } from '#types';

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
            hazard: 9,
            offset: params.offset,
            limit: 100,
            count: true,
            expand: ['loss.peoples', 'ward', 'municipality', 'district', 'province'],
            ordering: '-last_modified_date',
        }),
        onSuccess: ({ response, props }) => {
            // console.log('response test', response);
            props.setCovidPage({
                covidIndivisualData: response.results,
                covidIndivisualCount: response.count,
            });
        },
    },
};


const CovidTable = (props) => {
    const { covidPage: { covidIndivisualData, covidIndivisualCount } } = props;
    console.log('test redux', covidIndivisualData, covidIndivisualCount);
    React.useEffect(() => {
        props.requests.covid19Indivisual.do();
    }, []);
    return (
        <div>test</div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            CovidTable,
        ),
    ),
);
