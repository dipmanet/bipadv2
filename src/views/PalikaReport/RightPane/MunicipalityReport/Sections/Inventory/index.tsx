/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as ReachRouter from '@reach/router';
import Loader from 'react-loader';
import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis, YAxis,
} from 'recharts';
import NextPrevBtns from '../../NextPrevBtns';
import styles from './styles.scss';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import { provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    userSelector,
    palikaRedirectSelector,
    drrmRegionSelector } from '#selectors';
import Loading from '#components/Loading';


import {
    setPalikaRedirectAction,
    setDrrmInventoryAction,
} from '#actionCreators';
import Icon from '#rscg/Icon';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import editIcon from '#resources/palikaicons/edit.svg';

interface Props{

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
    drrmRegion: drrmRegionSelector(state),

});


const mapDispatchToProps = dispatch => ({
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
    setDrrmInventory: params => dispatch(setDrrmInventoryAction(params)),

});


const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportInventoriesReport: {
        url: ({ params }) => `${params.url}`,
        query: ({ params, props }) => {
            if (params && params.municipality) {
                return {
                    province: params.province,
                    district: params.district,
                    municipality: params.municipality,
                    limit: params.page,
                    resource_type: params.inventories,
                    expand: params.fields,
                    meta: params.meta,

                };
            }


            return { limit: params.page,
                offset: params.offset,
                resource_type: params.inventories,
                expand: params.fields,
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
let inventoriesData = [];

const Inventory: React.FC<Props> = (props: Props) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [url, setUrl] = useState('/resource/');
    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [fields, setfields] = useState('inventories');
    const [meta, setMeta] = useState(true);
    const [finalInventoriesData, setFinalInventoriesData] = useState([]);
    const [firstSerialNumber, setFirstSerialNumber] = useState(0);
    const [lastSerialNumber, setLastSerialNumber] = useState(10);
    const [chartData, setChartData] = useState([]);
    const [loader, setLoader] = useState(true);


    const [checkedRows, setCheckedRows] = useState([]);
    const [checkedAll, setCheckedAll] = useState(true);
    const [dataWithIndex, setDataWithIndex] = useState<number[]>([]);


    const { requests: { PalikaReportInventoriesReport }, provinces,
        districts,
        municipalities, drrmRegion,
        user, rows, setDrrmInventory } = props;

    const handleFetchedData = (response) => {
        setFetechedData(response);
        setLoader(false);
    };
    if (drrmRegion.municipality) {
        municipality = drrmRegion.municipality;
        district = drrmRegion.district;
        province = drrmRegion.province;
    } else {
        municipality = user.profile.municipality;
        district = user.profile.district;
        province = user.profile.province;
    }

    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };


    const handleEditInventory = (inventoryItem) => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            inventoryItem,
            showModal: 'inventory',
            redirectTo: 5,

        });
        ReachRouter.navigate('/risk-info/#/capacity-and-resources',
            { state: { showForm: true }, replace: true });
    };
    // const handleAddInventory = () => {
    //     const { setPalikaRedirect } = props;
    //     setPalikaRedirect({
    //         showForm: true,
    //         inventoryItem: { resource: '' },
    //         showModal: 'inventory',

    //     });
    //     ReachRouter.navigate('/risk-info/#/capacity-and-resources',
    //         { state: { showForm: true }, replace: true });
    // };

    PalikaReportInventoriesReport.setDefaultParams({
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
        rows,

    });


    let count = 0;
    useEffect(() => {
        if (fetchedData.length > 0) {
            inventoriesData = fetchedData.map(item => (
                item.inventories.map((data) => {
                    count += 1;
                    return ({
                        ...data,
                        SN: count,
                        resourceName: item.title,
                        organizationType: item.type,
                    }
                    );
                })
            ));
        }
    }, [fetchedData]);


    useEffect(() => {
        if (fetchedData.length > 0) {
            inventoriesData.map((item) => {
                if (item.length > 0) {
                    finalInventoriesData.push(...item);
                }
                return null;
            });
            const chatData = [...new Set(finalInventoriesData.map(inventory => inventory.item.category))];

            setChartData(chatData.slice(0, 4).map(item => ({
                name: item,
                Total: finalInventoriesData.filter(inven => inven.item.category === item).length,
            })));

            const chkArr = Array.from(Array(finalInventoriesData.length).keys());
            setCheckedRows(chkArr);
            setDataWithIndex(finalInventoriesData.map((item, i) => ({ ...item, index: i, selectedRow: true })));
        }
    }, [fetchedData.length, finalInventoriesData]);


    const handleCheckAll = (e) => {
        setCheckedAll(e.target.checked);
        if (e.target.checked) {
            setCheckedRows(Array.from(Array(fetchedData.length).keys()));
            setDataWithIndex(finalInventoriesData.map((item, i) => ({ ...item, index: i, selectedRow: true })));
        } else {
            setCheckedRows([]);
            setDataWithIndex(finalInventoriesData.map((item, i) => ({ ...item, index: i, selectedRow: false })));
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
        setDrrmInventory(dataWithIndex);
        props.handleNextClick();
    };

    return (
        <>
            { !props.previewDetails
            && (
                <div className={styles.tabsPageContainer}>
                    <h2>
                         Inventories
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
                                                    className={styles.checkBox}
                                                />
                                            </th>
                                        )
                                    }
                                    <th>S.N</th>
                                    <th>Name of Resource</th>
                                    <th>Quantity</th>
                                    <th>Unit</th>
                                    <th>Category</th>
                                    <th>Owner Organization Name</th>
                                    <th>Type of Organization</th>
                                    <th>Added Date</th>
                                    <th>Updated Date</th>
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
                                        {finalInventoriesData && finalInventoriesData.map((item, i) => (

                                            <tr>
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
                                                <td>
                                                    {item.SN}
                                                </td>
                                                <td>{item.item.title}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.item.unit}</td>
                                                <td>{item.item.category}</td>
                                                <td>

                                                    {item.resourceName}
                                                </td>
                                                <td>{item.organizationType}</td>
                                                <td>{item.createdOn.split('T')[0]}</td>
                                                <td>{item.modifiedOn.split('T')[0]}</td>


                                                {
                                                    !props.annex
                                            && (
                                                <td>
                                                    <button
                                                        className={styles.editButtn}
                                                        type="button"
                                                        onClick={() => handleEditInventory(item)}
                                                        title="Edit Inventory"
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
                            </tbody>
                        </table>
                        {!loader && finalInventoriesData.length === 0
                                 && <h2>Data Unavailable</h2>

                        }
                        {!loader && (
                            <>


                                {
                                    !props.annex
                            && (
                                <NextPrevBtns
                                    handlePrevClick={props.handlePrevClick}
                                    handleNextClick={handleNext}
                                />
                            )
                                }
                            </>
                        )}
                    </div>

                </div>
            )
            }
            { props.previewDetails
            && (
                <div className={styles.budgetPreviewContainer}>
                    <h2>
                        Disaster Inventories
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
            Inventory,
        ),
    ),
);
