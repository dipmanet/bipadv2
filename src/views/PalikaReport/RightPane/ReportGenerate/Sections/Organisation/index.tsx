/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { reverseRoute, _cs } from '@togglecorp/fujs';
import { useTheme } from '@material-ui/core';
import * as ReachRouter from '@reach/router';
import { Table } from 'react-bootstrap';
import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import {
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    userSelector,
    palikaRedirectSelector,
} from '#selectors';

import NextPrevBtns from '../../NextPrevBtns';
import {
    setPalikaRedirectAction,
    setGeneralDataAction,
} from '#actionCreators';
import editIcon from '#resources/palikaicons/edit.svg';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Icon from '#rscg/Icon';

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
});

interface Props{

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportOrganizationReport: {
        url: '/resource/',
        query: ({ params, props }) => {
            if (params && params.user) {
                return {
                    province: params.user.profile.province,
                    district: params.user.profile.district,
                    municipality: params.user.profile.municipality,
                    limit: params.page,
                    resource_type: params.governance,
                    meta: params.meta,
                };
            }


            return { limit: params.page,
                offset: params.offset,
                resource_type: params.governance,
                meta: params.meta };
        },
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.organisation) {
                params.organisation(citizenReportList);
            }
            if (params && params.paginationParameters) {
                params.paginationParameters(response);
            }
        },
    },
};


const Organisation: React.FC<Props> = (props: Props) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [CIselected, setCISelected] = useState('');
    const [chartData, setChartData] = useState([]);

    const { requests: { PalikaReportOrganizationReport }, url, provinces,
        districts,
        municipalities,
        user,
        updateTab } = props;
    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [meta, setMeta] = useState(2);


    const handleDataSave = () => {
        updateTab();
    };


    const handleFetchedData = (response) => {
        setFetechedData(response);
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * 2);
    };
    const handleCIButton = (item) => {
        setCISelected(item);
    };

    const handleEditResource = (organisationItem) => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            organisationItem,
            showModal: 'addResource',
        });
        ReachRouter.navigate('/risk-info/#/capacity-and-resources',
            { state: { showForm: true }, replace: true });
    };

    const handleOrnaisationRedirect = () => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            organisationItem: null,
            showModal: 'addResource',
        });
        ReachRouter.navigate('/risk-info/#/capacity-and-resources',
            { state: { showForm: true }, replace: true });
    };
    PalikaReportOrganizationReport.setDefaultParams({
        organisation: handleFetchedData,
        paginationParameters: handlePaginationParameters,
        url,
        page: paginationQueryLimit,
        governance: defaultQueryParameter,
        meta,
        user,
    });

    useEffect(() => {
        PalikaReportOrganizationReport.do({
            offset,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);
    // Finding Header for table data

    useEffect(() => {
        if (fetchedData.length > 0 && chartData.length === 0) {
            const chartDataArr = [...new Set(fetchedData.map(org => org.operatorType))];
            setChartData(chartDataArr.map(item => ({
                name: item,
                Total: fetchedData.filter(organisation => organisation.operatorType === item).length,
            })));

            console.log('organisation data:', fetchedData);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedData]);

    return (
        <>
            {!props.previewDetails
            && (
                <div className={styles.tabsPageContainer}>
                    <h2>
                            DRR related Organizations
                    </h2>
                    <div className={styles.palikaTable}>
                        <table id="table-to-xls">
                            <tbody>
                                <tr>
                                    <th>S.N</th>
                                    <th>Name of Organization</th>
                                    <th>Type of organization</th>
                                    {/* <th>Level (for governmental organization)</th> */}
                                    <th>Number of Male Employee</th>
                                    <th>Number of Female Employee</th>
                                    {
                                        !props.annex
                                        && <th>Action</th>
                                    }
                                </tr>
                                {fetchedData && fetchedData.length > 0
                                    ? fetchedData.map((item, i) => (
                                        <tr key={item.id}>
                                            <td>{i + 1}</td>
                                            <td>{item.title}</td>
                                            <td>{item.type}</td>
                                            <td>
                                                {item.noOfMaleEmployee ? item.noOfMaleEmployee : 0}
                                            </td>
                                            <td>
                                                {item.noOfFemaleEmployee ? item.noOfFemaleEmployee : 0}
                                            </td>
                                            {
                                                !props.annex
                                                && (
                                                    <td>

                                                        <button
                                                            className={styles.editButtn}
                                                            type="button"
                                                            onClick={() => handleEditResource(item)}
                                                        >
                                                            <ScalableVectorGraphics
                                                                className={styles.bulletPoint}
                                                                src={editIcon}
                                                                alt="editPoint"
                                                            />
                                                        </button>
                                                    </td>
                                                )
                                            }
                                        </tr>
                                    )) : ''
                                }


                            </tbody>
                        </table>
                        {
                            !props.annex
                            && (
                                <button
                                    type="button"
                                    onClick={handleOrnaisationRedirect}
                                    className={styles.savebtn}
                                >
                                    <Icon
                                        name="plus"
                                        className={styles.plusIcon}
                                    />
                             Add Organisation Data
                                </button>
                            )
                        }
                        {
                            !props.annex
                                ? (
                                    <div className={styles.btnsCont}>
                                        <NextPrevBtns
                                            handlePrevClick={props.handlePrevClick}
                                            handleNextClick={props.handleNextClick}
                                        />
                                    </div>
                                )
                                : ''
                        }

                    </div>

                </div>
            )
            }

            {props.previewDetails
        && (
            <div className={styles.budgetPreviewContainer}>
                <h2>
                    Organizations working
                    on DRRM activities in Rajapur
                </h2>
                <BarChart
                    width={350}
                    height={200}
                    data={chartData}
                    // layout="vertical"
                    margin={{ left: 10, right: 5, top: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis
                        type="number"
                        tick={false}
                    />
                    <XAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#777', fontSize: '10px' }}
                    />
                    <Bar
                        dataKey="Total"
                        fill="rgb(0,164,109)"
                        // barCategoryGap={30}
                        barCategoryGap={80}
                        label={{ position: 'insideRight', fill: '#fff', fontSize: '10px' }}
                        tick={{ fill: 'rgb(200,200,200)' }}
                        cx={90}
                        cy={105}
                        barSize={20}
                    />
                </BarChart>
            </div>
        )
            }

        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Organisation,
        ),
    ),
);
