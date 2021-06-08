/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as ReachRouter from '@reach/router';
import Loader from 'react-loader';

import { ADToBS } from 'bikram-sambat-js';
import NextPrevBtns from '../../NextPrevBtns';
import styles from './styles.scss';
import { AppState } from '#store/types';
import * as PageTypes from '#store/atom/page/types';
import { User } from '#store/atom/auth/types';

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
    drrmRegionSelector,
    palikaLanguageSelector } from '#selectors';
import {
    setPalikaRedirectAction,
    setDrrmInventoryAction,
    setDrrmProgressAction,
    setPalikaLanguageAction,
} from '#actionCreators';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import editIcon from '#resources/palikaicons/edit.svg';
import Gt from '../../../../utils';
import Translations from '../../../../Constants/Translations';
import ReportChart from './ReportChart';

interface Props{
    handleNextClick: () => void;
    previewDetails: any;
    annex: any;
    handlePrevClick: any;
    drrmRegion: PageTypes.DrrmRegion;
    user: User;
    rows: number;
}

interface Params{
    province: PageTypes.Province;
    district: PageTypes.District;
    municipality: PageTypes.Municipality;
    user: User;
    palikaRedirect: PageTypes.PalikaRedirect;
    drrmRegion: PageTypes.DrrmRegion;
    drrmLanguage: PageTypes.PalikaLanguage;
    page: number;
    offset: number;
    inventories: any;
    fields: any;
    meta: any;
    organisation: (response: []) => void;
    annex: boolean;
    previewDetails: boolean;
}

interface PropsFromAppState {
    provinces: PageTypes.Province[];
    districts: PageTypes.District[];
    municipalities: PageTypes.Municipality[];
    user: User;
    palikaRedirect: PageTypes.PalikaRedirect;
    drrmRegion: PageTypes.DrrmRegion;
    drrmLanguage: PageTypes.PalikaLanguage;
}

type ReduxProps = PropsFromAppState & PropsFromDispatch;
type NewProps = ReduxProps & Props;

interface PropsFromDispatch {
    setDrrmInventory: typeof setDrrmInventoryAction;
    drrmLanguage?: typeof setPalikaLanguageAction;
    setProgress: typeof setDrrmProgressAction;
    setPalikaRedirect: typeof setPalikaRedirectAction;
}

const mapStateToProps = (state: AppState) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
    drrmRegion: drrmRegionSelector(state),
    drrmLanguage: palikaLanguageSelector(state),
});


const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
    setDrrmInventory: params => dispatch(setDrrmInventoryAction(params)),
    setProgress: params => dispatch(setDrrmProgressAction(params)),
});


const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportInventoriesReport: {
        url: ({ params }) => `${params.url}`,
        query: ({ params }) => {
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
            let reportReportList = [];
            const reportReportsResponse = response;
            reportReportList = reportReportsResponse.results;
            if (params && params.organisation) {
                params.organisation(reportReportList);
            }
        },
    },
};

let province = 0;
let district = 0;
let municipality = 0;
let inventoriesData: array = [];
const finalInventoriesData: array = [];

const url = '/resource/';
const fields = 'inventories';
const meta = true;
const defaultQueryParameter = 'governance';

const Inventory: React.FC<Props> = (props: NewProps) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [checkedRows, setCheckedRows] = useState([]);
    const [checkedAll, setCheckedAll] = useState(true);
    const [dataWithIndex, setDataWithIndex] = useState<number[]>([]);

    const {
        requests: { PalikaReportInventoriesReport },
        drrmRegion,
        setProgress,
        user,
        rows,
        setDrrmInventory,
        drrmLanguage,
        annex,
        previewDetails,
    } = props;

    const handleFetchedData = (response) => {
        setFetechedData(response);
        setLoader(false);
    };
    if (drrmRegion.municipality) {
        const {
            municipality: munFromProps,
            district: districtFromProps,
            province: provinceFromProps,
        } = drrmRegion;
        municipality = munFromProps;
        district = districtFromProps;
        province = provinceFromProps;
    } else {
        const {
            profile: {
                municipality: munFromUser,
                district: districtFromUser,
                province: provinceFromUser,
            },
        } = user;
        if (munFromUser && districtFromUser && provinceFromUser) {
            municipality = munFromUser;
            district = districtFromUser;
            province = provinceFromUser;
        }
    }

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


    PalikaReportInventoriesReport.setDefaultParams({
        organisation: handleFetchedData,
        url,
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
            const categories = [...new Set(finalInventoriesData.map(inventory => inventory.item.category))];
            const chart = categories.slice(0, 4).map(item => ({
                name: item,
                Total: finalInventoriesData.filter(inven => inven.item.category === item).length,
            }));
            setChartData(chart);

            const chkArr = Array.from(Array(finalInventoriesData.length).keys());
            setCheckedRows(chkArr);
            setDataWithIndex(finalInventoriesData.map((item, i) => ({ ...item, index: i, selectedRow: true })));
        }
    }, [fetchedData.length]);


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
        setProgress(5);
        props.handleNextClick();
    };

    return (
        <div className={drrmLanguage.language === 'np' && styles.nep}>
            { !previewDetails
            && (
                <div className={styles.tabsPageContainer}>
                    <h2 className={styles.invenTitle}>
                        <Gt section={Translations.InventoryHeading} />
                    </h2>
                    <div className={styles.palikaTable}>
                        <table>
                            <tbody>
                                <tr>
                                    {
                                        !annex && finalInventoriesData.length
                                            ? (
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleCheckAll}
                                                        checked={checkedAll}
                                                        className={styles.checkBox}
                                                    />
                                                </th>
                                            ) : null
                                    }
                                    <th>
                                        {' '}
                                        <Gt section={Translations.InventorySerialNumber} />
                                    </th>
                                    <th><Gt section={Translations.InventoryResourceName} /></th>
                                    <th><Gt section={Translations.InventoryResourceQuantity} /></th>
                                    <th><Gt section={Translations.InventoryResourceUnit} /></th>
                                    <th><Gt section={Translations.InventoryResourceCategory} /></th>
                                    <th><Gt section={Translations.InventoryResourceOwnerOrganization} /></th>
                                    <th><Gt section={Translations.InventoryResourceOwnerOrganizationType} /></th>
                                    <th><Gt section={Translations.InventoryResourceAddedDate} /></th>
                                    <th><Gt section={Translations.InventoryResourceUpdatedDate} /></th>
                                    {
                                        !annex && finalInventoriesData.length
                                            ? <th><Gt section={Translations.InventoryAction} /></th> : null
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
                                                <td>{drrmLanguage.language === 'np' ? item.item.titleNp : item.item.title}</td>
                                                <td>{item.quantity}</td>
                                                <td>{drrmLanguage.language === 'np' ? item.item.unitNp : item.item.unit}</td>
                                                <td>{item.item.category}</td>
                                                <td>

                                                    {item.resourceName}
                                                </td>
                                                <td>{item.organizationType}</td>
                                                <td>{ADToBS(item.createdOn.split('T')[0])}</td>
                                                <td>{ADToBS(item.modifiedOn.split('T')[0])}</td>


                                                {
                                                    !annex
                                            && (
                                                <td>
                                                    <button
                                                        className={styles.editButtn}
                                                        type="button"
                                                        onClick={() => handleEditInventory(item)}
                                                        title={drrmLanguage.language === 'np' ? Translations.InventoryEditTooltip.np : Translations.InventoryEditTooltip.en}
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
                                 && <h2><Gt section={Translations.InventoryNoDataMessage} /></h2>

                        }
                        {!loader && (
                            <>


                                {
                                    !annex
                            && (
                                <NextPrevBtns
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
            { previewDetails
            && (
                <ReportChart
                    chartData={chartData}
                />
            )
            }

        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Inventory,
        ),
    ),
);
