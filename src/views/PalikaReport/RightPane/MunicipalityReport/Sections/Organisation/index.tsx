/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as ReachRouter from '@reach/router';
import {
    Bar, BarChart,
    CartesianGrid,
    XAxis, YAxis,
} from 'recharts';
import Loader from 'react-loader';

import styles from './styles.scss';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import {
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    userSelector,
    palikaRedirectSelector,
    drrmOrgSelecter,
    drrmRegionSelector,
} from '#selectors';

import NextPrevBtns from '../../NextPrevBtns';
import {
    setPalikaRedirectAction,
    setGeneralDataAction,
    setDrrmOrgAction,
    setDrrmProgressAction,
} from '#actionCreators';
import editIcon from '#resources/palikaicons/edit.svg';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Icon from '#rscg/Icon';

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
    setDrrmOrg: params => dispatch(setDrrmOrgAction(params)),
    setProgress: params => dispatch(setDrrmProgressAction(params)),
});

interface Props{

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
    drrmOrg: drrmOrgSelecter(state),
    drrmRegion: drrmRegionSelector(state),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportOrganizationReport: {
        url: '/resource/',
        query: ({ params, props }) => {
            if (params && params.municipality) {
                return {
                    province: params.province,
                    district: params.district,
                    municipality: params.municipality,
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


let province = 0;
let district = 0;
let municipality = 0;

const Organisation: React.FC<Props> = (props: Props) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [CIselected, setCISelected] = useState('');
    const [chartData, setChartData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [checkedRows, setCheckedRows] = useState([]);
    const [checkedAll, setCheckedAll] = useState(true);
    const [dataWithIndex, setDataWithIndex] = useState<number[]>([]);


    const { requests: { PalikaReportOrganizationReport }, url, provinces,
        districts,
        municipalities,
        user, drrmRegion, setProgress,
        updateTab, setDrrmOrg } = props;


    if (drrmRegion.municipality) {
        municipality = drrmRegion.municipality;
        district = drrmRegion.district;
        province = drrmRegion.province;
    } else {
        municipality = user.profile.municipality;
        district = user.profile.district;
        province = user.profile.province;
    }

    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [meta, setMeta] = useState(2);

    const handleFetchedData = (response) => {
        setFetechedData(response);
        setLoader(false);
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };

    const handleEditResource = (organisationItem) => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            organisationItem,
            showModal: 'addResource',
            redirectTo: 4,
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
            redirectTo: 4,

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
        municipality,
        district,
        province,
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

            const chkArr = Array.from(Array(fetchedData.length).keys());
            setCheckedRows(chkArr);
            setDataWithIndex(fetchedData.map((item, i) => ({ ...item, index: i, selectedRow: true })));
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedData]);

    const handleCheckAll = (e) => {
        setCheckedAll(e.target.checked);
        if (e.target.checked) {
            setCheckedRows(Array.from(Array(fetchedData.length).keys()));
            setDataWithIndex(fetchedData.map((item, i) => ({ ...item, index: i, selectedRow: true })));
        } else {
            setCheckedRows([]);
            setDataWithIndex(fetchedData.map((item, i) => ({ ...item, index: i, selectedRow: false })));
        }
    };

    const handleCheck = (idx: number, e) => {
        if (e.target.checked) {
            const arr = [...checkedRows, idx];
            setCheckedRows(arr);
            setDataWithIndex(dataWithIndex.map((item) => {
                if (item.index === idx) {
                    return Object.assign({}, item, { selectedRow: true });
                }
                return item;
            }));
        } else {
            setCheckedRows(checkedRows.filter(item => item !== idx));

            setDataWithIndex(dataWithIndex.map((item) => {
                if (item.index === idx) {
                    return Object.assign({}, item, { selectedRow: false });
                }
                return item;
            }));
        }
    };

    const handleNext = () => {
        setDrrmOrg(dataWithIndex);
        setProgress(4);
        props.handleNextClick();
    };

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
                                    {
                                        !props.annex
                                        && (
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    onChange={handleCheckAll}
                                                    checked={checkedAll}
                                                    // defaultChecked
                                                    className={styles.checkBox}
                                                />
                                            </th>
                                        )
                                    }
                                    <th>S.N</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    {/* <th>Level (for governmental organization)</th> */}
                                    <th>Number of Male Employee</th>
                                    <th>Number of Female Employee</th>
                                    {
                                        !props.annex
                                        && <th>Action</th>
                                    }
                                </tr>
                                {loader ? (
                                    <>
                                        {' '}
                                        <Loader
                                            top="50%"
                                            left="60%"
                                        />
                                        <p className={styles.loaderInfo}>Loading...Please Wait</p>
                                    </>
                                ) : (
                                    <>
                                        {fetchedData && fetchedData.length > 0
                                            ? fetchedData.map((item, i) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={checkedRows.indexOf(i) !== -1}

                                                            // defaultChecked
                                                            onChange={e => handleCheck(i, e)}
                                                            className={styles.checkBox}
                                                            key={item.id}
                                                        />
                                                    </td>
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
                                                            title="Edit Organization"
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
                                    </>
                                )}

                            </tbody>
                        </table>
                        {!loader
                        && (
                            <>
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
                                                    handlePrevClick={handleNext}
                                                    handleNextClick={handleNext}
                                                />
                                            </div>
                                        )
                                        : ''
                                }
                            </>
                        )
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
                    height={180}
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
