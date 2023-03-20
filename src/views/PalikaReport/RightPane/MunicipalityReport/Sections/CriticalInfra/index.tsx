/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as ReachRouter from '@reach/router';
import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis, YAxis,
} from 'recharts';
import Loader from 'react-loader';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import editIcon from '#resources/palikaicons/edit.svg';
import {
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    userSelector,
    drrmRegionSelector,
    drrmProgresSelector,
    palikaLanguageSelector,
} from '#selectors';
import {
    setPalikaRedirectAction,
    setDrrmCriticalAction,
    setDrrmProgressAction,
} from '#actionCreators';
import Icon from '#rscg/Icon';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import NextPrevBtns from '../../NextPrevBtns';
import styles from './styles.scss';
import Gt from '../../../../utils';
import Translations from '../../../../Constants/Translations';

interface Props {
    width: string;
    height?: string;

}
const mapDispatchToProps = dispatch => ({
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
    setDrrmCritical: params => dispatch(setDrrmCriticalAction(params)),
    setProgress: params => dispatch(setDrrmProgressAction(params)),

});

const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
    drrmRegion: drrmRegionSelector(state),
    drrmProgress: drrmProgresSelector(state),
    drrmLanguage: palikaLanguageSelector(state),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    PalikaResources: {
        url: ({ params }) => `${params.url}`,
        query: ({ params, props }) => {
            if (params && params.municipality) {
                return {
                    province: params.province,
                    district: params.district,
                    municipality: params.municipality,
                    limit: -1,

                    meta: params.meta,

                };
            }


            return {
                limit: params.page,
                offset: params.offset,


                meta: params.meta,
            };
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

const CriticalInfra = (props: Props) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [ciType, setciType] = useState('all');
    const [filteredSelectData, setFilteredSelectData] = useState([]);
    const [filteredtData, setFilteredData] = useState([]);
    const [url, setUrl] = useState('/resource/');
    const [chartData, setChartData] = useState([]);
    const [loader, setLoader] = useState(true);


    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [fields, setfields] = useState('inventories');
    const [meta, setMeta] = useState(true);

    const [checkedRows, setCheckedRows] = useState([]);
    const [checkedAll, setCheckedAll] = useState(true);
    const [dataWithIndex, setDataWithIndex] = useState<number[]>([]);

    const { requests: { PalikaResources }, provinces,
        districts, setProgress, drrmProgress,
        municipalities, drrmRegion,
        user, setDrrmCritical, drrmLanguage } = props;

    if (drrmRegion.municipality) {
        municipality = drrmRegion.municipality;
        district = drrmRegion.district;
        province = drrmRegion.province;
    } else {
        municipality = user.profile.municipality;
        district = user.profile.district;
        province = user.profile.province;
    }

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
            redirectTo: 6,
        });
        ReachRouter.navigate('/risk-info/#/capacity-and-resources',
            { state: { showForm: true }, replace: true });
    };

    const handleCIFilter = (filter) => {
        setciType(filter.target.value);
        const selected = filter.target.value;
        if (selected !== 'all') {
            const fD = fetchedData.filter(item => item.resourceType === selected);
            setFilteredData(fD);
        } else {
            setFilteredData(fetchedData);
        }
    };

    const handleAddResource = () => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            showModal: 'addResource',
            redirectTo: 6,

        });
        ReachRouter.navigate('/risk-info/#/capacity-and-resources',
            { state: { showForm: true }, replace: true });
    };

    PalikaResources.setDefaultParams({
        organisation: handleFetchedData,
        paginationParameters: handlePaginationParameters,
        url,
        page: paginationQueryLimit,
        inventories: defaultQueryParameter,
        fields,
        municipality,
        district,
        province,
        meta,

    });


    useEffect(() => {
        PalikaResources.do({
            offset,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);
    // Finding Header for table data

    useEffect(() => {
        if (fetchedData.length > 0 && filteredSelectData.length === 0) {
            const filteredSelectDataArr = [...new Set(fetchedData.map(item => item.resourceType))];
            setFilteredSelectData(filteredSelectDataArr);
            setFilteredData(fetchedData);
        }
        if (fetchedData.length > 0 && chartData.length === 0) {
            setChartData(
                [

                    {
                        name: 'Educational Institutions',
                        nameNp: 'शैक्षिक संस्थानहरू',
                        Total: fetchedData.filter(item => item.resourceType === 'education').length,
                    },
                    {
                        name: 'Banks',
                        nameNp: 'बैंकहरू',
                        Total: fetchedData.filter(item => item.resourceType === 'finance').length,
                    },
                    {
                        name: 'Hospitals',
                        nameNp: 'अस्पतालहरू',
                        Total: fetchedData.filter(item => item.resourceType === 'health').length,
                    },
                    {
                        name: 'Cultural Sites',
                        nameNp: 'सांस्कृतिक साइटहरू',
                        Total: fetchedData.filter(item => item.resourceType === 'cultural').length,
                    },
                    {
                        name: 'Hotels or Restaurants',
                        nameNp: 'होटल वा रेस्टुरेन्ट',
                        Total: fetchedData.filter(item => item.resourceType === 'hotelandrestaurant').length,
                    },
                    {
                        name: 'Government Buildings',
                        nameNp: 'सरकारी भवनहरू',
                        Total: fetchedData.filter(item => item.resourceType === 'governance').length,
                    },
                    {
                        name: 'Industries',
                        nameNp: 'उद्योगहरू',
                        Total: fetchedData.filter(item => item.resourceType === 'industry').length,
                    },
                ],

            );

            const chkArr = Array.from(Array(fetchedData.length).keys());
            setCheckedRows(chkArr);
            setDataWithIndex(fetchedData.map((item, i) => ({ ...item, index: i, selectedRow: true })));
        }
    }, [chartData.length, fetchedData, filteredSelectData.length, filteredtData]);


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
        setCheckedAll(false);

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
        setDrrmCritical(dataWithIndex);
        if (drrmProgress < 6) {
            setProgress(6);
        }
        props.handleNextClick();
    };


    return (
        <div className={drrmLanguage.language === 'np' && styles.nep}>
            {
                !props.previewDetails

                && (
                    <div className={styles.tabsPageContainer}>
                        <h2>
                            <Gt section={Translations.ResourcesHeading} />
                        </h2>
                        <div className={styles.palikaTable}>
                            {/* {
                        !props.annex
                        && (
                            <>

                            Filter by:
                                <select
                                    value={ciType}
                                    onChange={handleCIFilter}
                                    className={styles.inputElement}
                                >
                                    <option value="select">Select an Option</option>
                                    <option value="all">All Resource Type</option>
                                    {filteredSelectData
                             && filteredSelectData.map(item => <option value={item}>{item}</option>)
                                    }
                                </select>
                            </>
                        )
                    } */}
                            <table id="table-to-xls">
                                <tbody>
                                    <tr>
                                        {!props.annex && filteredtData.length
                                            ? (
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleCheckAll}
                                                        checked={checkedAll}
                                                        defaultChecked
                                                        className={styles.checkBox}
                                                    />
                                                </th>
                                            ) : null}
                                        <th>
                                            {' '}
                                            <Gt section={Translations.ResourcesSerialNumber} />
                                        </th>
                                        <th>
                                            {' '}
                                            <Gt section={Translations.ResourcesName} />
                                        </th>
                                        <th>
                                            {' '}
                                            <Gt section={Translations.ResourcesType} />
                                        </th>
                                        <th>
                                            {' '}
                                            <Gt section={Translations.ResourcesOperatorType} />
                                        </th>
                                        <th>
                                            {' '}
                                            <Gt section={Translations.ResourcesNumberOfMaleEmployee} />
                                        </th>
                                        <th>
                                            {' '}
                                            <Gt section={Translations.ResourcesNumberOfFemaleEmployee} />
                                        </th>
                                        <th>
                                            {' '}
                                            <Gt section={Translations.ResourcesNumberOfTotalEmployee} />
                                        </th>
                                        {
                                            !props.annex && filteredtData.length
                                                ? (
                                                    <th>
                                                        {' '}
                                                        <Gt section={Translations.ResourcesAction} />
                                                    </th>
                                                ) : null
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
                                    )
                                        : (
                                            <>
                                                {filteredtData && filteredtData.map((item, i) => (
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
                                                        <td>{item.title ? item.title : '-'}</td>
                                                        <td>{item.resourceType ? item.resourceType : '-'}</td>
                                                        <td>{item.operatorType ? item.operatorType : '-'}</td>
                                                        <td>{item.noOfMaleEmployee ? item.noOfMaleEmployee : '-'}</td>
                                                        <td>{item.noOfFemaleEmployee ? item.noOfFemaleEmployee : '-'}</td>
                                                        <td>{item.noOfEmployee ? item.noOfEmployee : '-'}</td>
                                                        {
                                                            !props.annex
                                                            && (
                                                                <td>
                                                                    <button
                                                                        className={styles.editButtn}
                                                                        type="button"
                                                                        onClick={() => handleEditResource(item)}
                                                                        title={drrmLanguage.language === 'np'
                                                                            ? Translations.ResourcesEditTooltip.np
                                                                            : Translations.ResourcesEditTooltip.en}
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
                                                ))}
                                            </>
                                        )}
                                    {!props.annex && !loader
                                        && (
                                            <tr>
                                                <td />
                                                <td />
                                                <td>
                                                    <button
                                                        type="button"
                                                        className={styles.savebtn}
                                                        onClick={handleAddResource}
                                                    >
                                                        <Icon
                                                            name="plus"
                                                            className={styles.plusIcon}
                                                        />
                                                        <Gt section={Translations.ResourcesAddButton} />
                                                    </button>
                                                </td>
                                                <td />
                                                <td />
                                                <td />
                                                <td />
                                                <td />
                                                <td />
                                            </tr>
                                        )

                                    }
                                </tbody>
                            </table>
                            {!loader && filteredtData.length === 0
                                && <h2><Gt section={Translations.ResourcesNoDataMessage} /></h2>

                            }
                            {!loader && !props.annex
                                && (
                                    <>

                                        <NextPrevBtns
                                            handlePrevClick={props.handlePrevClick}
                                            handleNextClick={handleNext}
                                        />
                                    </>
                                )
                            }


                        </div>

                    </div>
                )
            }
            {
                props.previewDetails
                && (
                    <div className={styles.budgetPreviewContainer}>
                        <h2>
                            <Gt section={Translations.ResourcesHeading} />
                        </h2>
                        <BarChart
                            width={350}
                            height={200}
                            data={chartData}
                            layout="vertical"
                            margin={{ left: 10, right: 5, top: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                tick={false}

                            />
                            <YAxis
                                type="category"
                                dataKey={drrmLanguage.language === 'en' ? 'name' : 'nameNp'}
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
                                barSize={15}
                            />
                        </BarChart>

                    </div>
                )
            }

        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            CriticalInfra,
        ),
    ),
);
