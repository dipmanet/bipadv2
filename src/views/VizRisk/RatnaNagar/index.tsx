/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import Loader from 'react-loader';
import mapboxgl from 'mapbox-gl';
import {
    ClientAttributes,
    createConnectedRequestCoordinator,
    createRequestClient,
    methods,
} from '#request';
import * as PageTypes from '#store/atom/page/types';
import Leftpane1 from './Leftpanes/Leftpane1/index';
import Leftpane2 from './Leftpanes/Leftpane2/index';
import Demographic from './Leftpanes/Demographic/index';
import Leftpane3 from './Leftpanes/Leftpane3/index';
import Leftpane4 from './Leftpanes/Leftpane4/index';
import Leftpane5 from './Leftpanes/Leftpane5/index';
import Leftpane6 from './Leftpanes/Leftpane6/index';
import Leftpane7 from './Leftpanes/Leftpane7/index';
import Leftpane8 from './Leftpanes/Leftpane8/index';
import Leftpane10 from './Leftpanes/Leftpane10/index';
import Map from './Map/index';
import styles from './styles.scss';
import LeftTopBar from './Components/LeftTopBar';
import {
    CIData,
    HtmlData,
    JsonData,
    Params,
    PostionInitialValues,
    ReduxProps,
    ScrollTopInitialValues,
} from './interfaces';
import {
    MainPageDataContext,
    positionInitialValues,
    RatnaNagarMapContext,
    scrollTopPageInitialValues,
} from './context';


const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    htmlDataRequest: {
        url: '/keyvalue-html/',
        method: methods.GET,
        query: ({ params }) => ({
            municipality: params.municipalityId,
            limit: -1,
        }),

        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.HtmlData[] }
            const { results: htmlData = [] } = response as Response;
            params.setKeyValueHtmlData(htmlData);
            // params.setPending(false);
        },
        onMount: false,
        // extras: { schemaName: 'htmlResponse' },
    },

    jsonDataRequest: {
        url: '/keyvalue-json/',
        method: methods.GET,
        query: ({ params }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            municipality: params.municipalityId,
            limit: -1,

        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: jsonData = [] } = response as Response;
            if (params) {
                params.setKeyValueJsonData(jsonData);
            }
            // params.setPending(false);
        },
        onMount: false,
        // extras: { schemaName: 'jsonResponse' },
    },

    houseHoldDataRequest: {
        url: '/vizrisk-household/',
        method: methods.GET,
        query: ({ params }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            limit: -1,

        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: jsonData = [] } = response as Response;
            if (params) {
                params.setHouseholdData(jsonData);
            }
            // params.setPending(false);
        },
        onMount: false,
        // extras: { schemaName: 'jsonResponse' },
    },
    cIGetRequest: {
        url: '/resource/',
        method: methods.GET,
        query: ({ params }) => ({
            municipality: params && params.municipalityId,
            limit: -1,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: cI = [] } = response as Response;
            if (params) {
                params.setcIData(cI);
            }
        },
        onMount: false,
    },
    chartDataGetRequest: {
        url: '/vizrisk-household/?municipality=35007&aggrigated=true',
        method: methods.GET,
        query: ({ params }) => ({
            // municipality: params && params.municipalityId,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { aggrigated: chartData } = response as Response;
            if (params) {
                params.setHouseholdChartData(chartData);
            }
        },
        onMount: false,
    },

};

const Ratnanagar = (props: any) => {
    const [pending, setpending] = useState<boolean>(true);
    const [leftElement, setLeftElement] = useState<number>(0);
    const [scrollTopValuesPerPage, setScrollTopValuesPerPage] = useState<ScrollTopInitialValues>(scrollTopPageInitialValues);
    const [postionsPerPage, setPostionsPerPage] = useState<PostionInitialValues>(positionInitialValues);
    const [clickedCiName, setclickedCiName] = useState<string[]>(['finance']);
    const [ciNameList, setciNameList] = useState<string[]>([]);
    const [unClickedCIName, setunClickedCIName] = useState<string[]>([]);
    const [keyValueJsonData, setKeyValueJsonData] = useState([]);
    const [keyValueHtmlData, setKeyValueHtmlData] = useState<HtmlData>([]);
    const [householdData, setHouseholdData] = useState<JsonData>([]);
    const [currentHeaderVal, setCurrentHeaderVal] = useState('');
    const [navIdleStatus, setNavIdleStatus] = useState(false);
    const [floodLayer, setFloodLayer] = useState(5);
    const mapRef = useRef<mapboxgl.Map>();

    /**
     * filtering data on tmap
     */
    const [rangeValues, setRangeValues] = useState<number[]>([]);
    const [rangeNames, setRangeNames] = useState<string[]>([]);

    // state for requested data
    const [cIData, setcIData] = useState<CIData>([]);
    const [householdChartData, setHouseholdChartData] = useState({});


    const { requests: {
        cIGetRequest,
        htmlDataRequest,
        jsonDataRequest,
        houseHoldDataRequest,
        chartDataGetRequest,
    } } = props;

    const municipalityId = 35007;


    useEffect(() => {
        cIGetRequest.setDefaultParams({
            setcIData,
            municipalityId,
        });
        cIGetRequest.do();
        jsonDataRequest.setDefaultParams({
            setKeyValueJsonData,
            municipalityId,
        });
        jsonDataRequest.do();
        htmlDataRequest.setDefaultParams({
            setKeyValueHtmlData,
            municipalityId,
        });
        htmlDataRequest.do();
        houseHoldDataRequest.setDefaultParams({
            setHouseholdData,
        });
        houseHoldDataRequest.do();
        chartDataGetRequest.setDefaultParams({
            setHouseholdChartData,
        });
        chartDataGetRequest.do();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (cIData.length > 0 && keyValueJsonData.length > 0
            && householdData.length > 0 && keyValueHtmlData.length > 0
            && Object.keys(householdChartData).length > 0
        ) {
            setpending(false);
        }
    }, [cIData, keyValueJsonData, householdData, keyValueHtmlData, householdChartData]);


    const onButtonClick = (item: number) => {
        setLeftElement(item);
        setNavIdleStatus(false);
    };

    const handleCIClick = (ciName: string) => {
        setclickedCiName(prevState => [...prevState, ciName]);
        setunClickedCIName(prevState => prevState.filter(ciItem => ciItem !== ciName));

        if (clickedCiName.includes(ciName)) {
            setclickedCiName(prevState => prevState.filter(ciItem => ciItem !== ciName));
            setunClickedCIName(prevState => [...new Set([...prevState, ciName])]);
        }
    };


    const handleReset = () => {
        setRangeNames([]);
        setRangeValues([]);
    };

    const geoJsonCI = {
        type: 'FeatureCollection',
        features: cIData.map(item => ({
            type: 'Feature',
            id: item.id,
            geometry: item.point,
            properties: {
                Name: item.title,
                layer: item.resourceType,
                Type: item.resourceType,
            },
        })),
    };

    const mainKey = 'vizrisk_ratnanagar';
    const suffix = '301_3_35_35007';

    const handleRangeLegendClick = (rangeData: number[]) => {
        setRangeValues(prevState => [...new Set([...prevState, ...rangeData])]
            .sort((a: number, b: number) => a - b));

        if (rangeData.length > 0
            && (rangeValues.includes(rangeData[0]) || rangeValues.includes(rangeData[1]))) {
            setRangeValues(prevState => prevState.filter(
                item => item !== rangeData[0] && item !== rangeData[1],
            ));
        }
    };


    const contextValues = {
        mainKey,
        suffix,
        leftElement,
        setLeftElement,
        scrollTopValuesPerPage,
        setScrollTopValuesPerPage,
        postionsPerPage,
        setPostionsPerPage,
        onButtonClick,
        keyValueHtmlData,
        keyValueJsonData,
        householdChartData,
        setCurrentHeaderVal,
        householdData,
        rangeValues,
        navIdleStatus,
        setNavIdleStatus,
        handleRangeLegendClick,
        handleReset,
    };

    const mapValue = {
        map: mapRef.current,
    };

    return (
        <>
            <MainPageDataContext.Provider value={contextValues}>
                <RatnaNagarMapContext.Provider value={mapValue}>
                    {
                        pending ? (
                            <div className={styles.loaderInfo}>
                                <Loader loaded={!pending} color="#fff" className={styles.loader} />
                                <p className={styles.loaderText}>
                                    Loading Data...
                                </p>
                            </div>
                        )
                            : (
                                <>
                                    {
                                        leftElement < 10 && (
                                            <>
                                                <Map
                                                    mapRef={mapRef}
                                                    municipalityId={municipalityId}
                                                    leftElement={leftElement}
                                                    CIData={geoJsonCI}
                                                    clickedCiName={clickedCiName}
                                                    ciNameList={ciNameList}
                                                    setciNameList={setciNameList}
                                                    unClickedCIName={unClickedCIName}
                                                    setNavIdleStatus={setNavIdleStatus}
                                                    rangeNames={rangeNames}
                                                    setRangeNames={setRangeNames}
                                                    floodLayer={floodLayer}
                                                    setFloodLayer={setFloodLayer}

                                                />
                                                <LeftTopBar currentHeaderVal={currentHeaderVal} />
                                            </>

                                        )
                                    }
                                    {leftElement === 0 && (
                                        <Leftpane1 />
                                    )}
                                    {leftElement === 1 && (
                                        <Leftpane2 />
                                    )}
                                    {leftElement === 2 && (
                                        <Demographic />
                                    )}
                                    {leftElement === 3 && (
                                        <Leftpane3
                                            clickedCiName={clickedCiName}
                                            handleCIClick={handleCIClick}
                                            cIData={cIData}
                                        />
                                    )}
                                    {leftElement === 4 && (
                                        <Leftpane4 />
                                    )}
                                    {leftElement === 5 && (
                                        <Leftpane5 />
                                    )}
                                    {leftElement === 6 && (
                                        <Leftpane6 />
                                    )}
                                    {leftElement === 7 && (
                                        <Leftpane7 />
                                    )}
                                    {leftElement === 8 && (
                                        <Leftpane8 />
                                    )}
                                    {leftElement === 9 && (
                                        <Leftpane10 />
                                    )}

                                </>
                            )
                    }
                </RatnaNagarMapContext.Provider>
            </MainPageDataContext.Provider>
        </>
    );
};


export default compose(
    // connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(Ratnanagar);
