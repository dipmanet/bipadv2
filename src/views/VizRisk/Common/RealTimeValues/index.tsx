import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import MaxTempIcon from '#views/VizRisk/Rajapur/Icons/TempMax.svg';
import WaterLevel from '#resources/icons/Water-level.svg';
import TempIcon from '#views/VizRisk/Rajapur/Icons/Temp.svg';
import AvgRainFall from '#views/VizRisk/Rajapur/Icons/RainFall.svg';
import ElevationIcon from '#views/VizRisk/Rajapur/Icons/ElevationFromSea.svg';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';

import styles from './styles.scss';

interface Props{

}

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    rainRequest: {
        url: '/rain-stations/',
        method: methods.GET,
        query: ({ params }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            station_series_id: params.stationSeriesId,
        }),
        onSuccess: ({ params, response }) => {
            // interface Response { results: PageType.Incident[] }
            // const { results:  = [] } = response as Response;
            params.setAvg(response.results[0].averages);
        },
        onMount: false,
        // extras: { schemaName: 'incidentResponse' },
    },
    waterLevelReq: {
        url: '/river-stations/',
        method: methods.GET,
        query: ({ params }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            station_series_id: params.stationSeriesId,

        }),
        onSuccess: ({ params, response }) => {
            // interface Response { results: PageType.Incident[] }
            // const { results:  = [] } = response as Response;
            params.setWaterLevel(response.results[0].waterLevel);
        },
        onMount: false,
        // extras: { schemaName: 'incidentResponse' },
    },
    pollutionReq: {
        url: '/pollution-stations/',
        method: methods.GET,
        query: ({ params }) => ({
            name: params.pollutionStName,
        }),
        onSuccess: ({ params, response }) => {
            // interface Response { results: PageType.Incident[] }
            // const { results:  = [] } = response as Response;
            params.setPollution(response.results[0].observation);
        },
        onMount: false,
        // extras: { schemaName: 'incidentResponse' },
    },
};


const RealTimeValues = (props: Props) => {
    const {
        stationSeriesIdRain,
        stationSeriesIdRiver,
        pollutionStName,
        hideWaterLevel,
        requests: {
            rainRequest,
            waterLevelReq,
            pollutionReq,
        },
    } = props;

    const [rainFall, setRainFall] = useState<number | null>(null);
    const [temperature, setTemperature] = useState<number | null>(null);
    const [waterLevel, setWaterLvl] = useState<number | null>(null);

    const setAvg = (averages) => {
        if (averages) {
            setRainFall(averages.filter(item => item.interval === 24)[0].value);
            console.log('rainfall averages', averages);
        }
    };

    const setWaterLevel = (w) => {
        console.log('waterlevel', w);
        if (w) {
            setWaterLvl(w.toFixed(2));
        }
    };

    const setPollution = (pol) => {
        if (pol) {
            setTemperature(pol.filter(p => p.seriesId === 666)[0].data.value);
        }
    };


    useEffect(() => {
        rainRequest.setDefaultParams({
            setAvg,
            stationSeriesId: stationSeriesIdRain,
        });
        waterLevelReq.setDefaultParams({
            setWaterLevel,
            stationSeriesId: stationSeriesIdRiver,
        });
        pollutionReq.setDefaultParams({
            setPollution,
            pollutionStName,
        });
        rainRequest.do();
        waterLevelReq.do();
        pollutionReq.do();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <div className={styles.iconRow}>
                <div className={styles.infoIconsContainer}>
                    <ScalableVectorGraphics
                        className={styles.infoIcon}
                        src={TempIcon}
                    />
                    <div className={styles.descriptionCotainer}>
                        <div className={styles.iconTitle}>{`${temperature} ℃`}</div>
                        <div className={styles.iconText}>
                Temperature (Real Time)
                        </div>

                    </div>
                </div>
                {
                    !hideWaterLevel
                    && (
                        <div className={styles.infoIconsContainer}>
                            <ScalableVectorGraphics
                                className={styles.infoIcon}
                                src={WaterLevel}
                            />
                            <div className={styles.descriptionCotainer}>
                                <div className={styles.iconTitle}>{`${waterLevel} mm`}</div>
                                <div className={styles.iconText}>
                Water
                Level
                                </div>

                            </div>
                        </div>
                    )
                }
            </div>
            <div className={styles.iconRow}>
                <div className={styles.infoIconsContainer}>
                    <ScalableVectorGraphics
                        className={styles.infoIcon}
                        src={AvgRainFall}
                    />
                    <div className={styles.descriptionCotainer}>
                        <div className={styles.iconTitle}>
                            {rainFall}
                            {' '}
mm
                        </div>
                        <div className={styles.iconText}>
                Rainfall (24 Hrs)
                        </div>

                    </div>
                </div>
            </div>
        </>

    );
};


export default compose(
    connect(undefined, undefined),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(RealTimeValues);
