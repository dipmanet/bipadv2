/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
import React, { useEffect, useRef, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Text,
} from 'recharts';
import { _cs } from '@togglecorp/fujs';
import { Translation, useTranslation } from 'react-i18next';
import Button from '#rsca/Button';
import { nullCheck } from '#utils/common';
import { lossMetrics } from '#utils/domain';
import styles from './styles.scss';
import { returnValueByDropdown, formatNumeralAccLang } from '../utils/utils';
import {
    BarchartProps,
    ChartData,
    TooltipInterface,
    RadioValue,
    ContainerSize,
} from './types';
import FullScreenIcon from '../FullScreen';
import { handleDownload } from './util';

const BarChartVisual = (props: BarchartProps) => {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState<ChartData>([]);
    const [fullScreen, setFullScreen] = useState<ContainerSize>({
        width: '100%',
        height: 300,
    });
    const [isAllBarData, setAllBarData] = useState(false);
    const imageDownloadRef = useRef();
    const {
        selectOption,
        regionRadio,
        data,
        valueOnclick,
        className,
        downloadButton,
        fullScreenMode,
        language,
        barChartData,
        barData,
    } = props;

    const setFullScreenHeightWidth = (width: string, height: string | number) => {
        setFullScreen({ width, height });
    };
    const setBarAllDataOnFullScreen = (value: boolean) => {
        setAllBarData(value);
    };

    function exitHandler() {
        if (
            !document.webkitIsFullScreen
            && !document.mozFullScreen
            && !document.msFullscreenElement
        ) {
            setFullScreen({ width: '100%', height: 300 });
            setAllBarData(false);
            const titleHeading = document.getElementById('titleHeading');
            titleHeading.remove();
        }
    }
    if (document.addEventListener) {
        document.addEventListener('fullscreenchange', exitHandler, false);
        document.addEventListener('mozfullscreenchange', exitHandler, false);
        document.addEventListener('MSFullscreenChange', exitHandler, false);
        document.addEventListener('webkitfullscreenchange', exitHandler, false);
    }

    const provinceIndex = data
        .map(i => ({
            name: i.provinceTitle,
            nameNe: i.provinceTitleNe,
            id: i.province,
        }))
        .filter(
            (element, index, array) => array.findIndex(newEl => newEl.id === element.id) === index,
        )
        .sort((a, b) => a.id - b.id);

    const districtIndex = data
        .map(i => ({
            name: i.districtTitle,
            nameNe: i.districtTitleNe,
            id: i.district,
        }))
        .filter(
            (element, index, array) => array.findIndex(newEl => newEl.id === element.id) === index,
        )
        .sort((a, b) => a.id - b.id);

    const municipalityIndex = data
        .map(i => ({
            name: i.municipalityTitle,
            nameNe: i.municipalityTitleNe,
            id: i.municipality,
        }))
        .filter(
            (element, index, array) => array.findIndex(newEl => newEl.id === element.id) === index,
        )
        .sort((a, b) => a.id - b.id);

    const wardIndex = data
        .map(i => ({
            name: i.wardTitle,
            nameNe: i.wardTitleNe,
            id: i.ward,
        }))
        .filter(
            (element, index, array) => array.findIndex(newEl => newEl.id === element.id) === index,
        )
        .sort((a, b) => a.id - b.id);

    const distributionCalculate = (
        typeKey: { name: string; id: number }[],
        type: string,
    ) => {
        const key = lossMetrics.map(item => item.key);
        const filteredData = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < typeKey.length; i++) {
            const filteredRegion = data.filter(
                item => item[type] === typeKey[i].id,
            );
            filteredData.push(filteredRegion);
        }
        const regiondata = [];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < filteredData.length; i++) {
            const regionWiseData = [];
            // eslint-disable-next-line no-plusplus
            for (let j = 0; j < key.length; j++) {
                regionWiseData.push({
                    [key[j]]: nullCheck(false, filteredData[i], key[j]),
                });
            }
            regiondata.push({
                [language === 'en' ? typeKey[i].name : typeKey[i].nameNe]:
                    regionWiseData,
            });
        }

        const finalRegionData = regiondata.map((item) => {
            const obj = {
                name: Object.keys(item)[0],
                value:
                    item[Object.keys(item)[0]][valueOnclick.index][valueOnclick.value],
            };
            return obj;
        });
        return finalRegionData;
    };

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (regionRadio.adminLevel || regionRadio.name) {
            switch (true) {
                case regionRadio.adminLevel === 1 || regionRadio.name === 'province':
                    setChartData(
                        distributionCalculate(provinceIndex, 'province').sort(
                            (a, b) => b.value - a.value,
                        ),
                    );
                    break;
                case regionRadio.adminLevel === 2 || regionRadio.name === 'district':
                    // eslint-disable-next-line no-case-declarations
                    const AlldistrictData = distributionCalculate(
                        districtIndex,
                        'district',
                    ).sort((a, b) => b.value - a.value);
                    // eslint-disable-next-line no-case-declarations
                    const TopTendistrictData = distributionCalculate(
                        districtIndex,
                        'district',
                    )
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 10);
                    setChartData(isAllBarData ? AlldistrictData : TopTendistrictData);
                    break;
                case regionRadio.adminLevel === 3
                    || regionRadio.name === 'municipality':
                    // eslint-disable-next-line no-case-declarations
                    const muniData = distributionCalculate(
                        municipalityIndex,
                        'municipality',
                    ).sort((a, b) => b.value - a.value);
                    // eslint-disable-next-line no-case-declarations
                    const TopTenMuniData = distributionCalculate(
                        municipalityIndex,
                        'municipality',
                    )
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 10);
                    setChartData(isAllBarData ? muniData : TopTenMuniData);
                    break;
                case regionRadio.name === 'ward':
                    // eslint-disable-next-line no-case-declarations
                    const wardData = distributionCalculate(wardIndex, 'ward').sort(
                        (a, b) => b.value - a.value,
                    );
                    // eslint-disable-next-line no-case-declarations
                    const TopTenwardData = distributionCalculate(wardIndex, 'ward')
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 10);
                    setChartData(isAllBarData ? wardData : TopTenwardData);

                    break;
                default:
                    break;
            }
        }
    }, [regionRadio, valueOnclick, data, isAllBarData, language]);

    function nameReturn(region: RadioValue) {
        if (
            region.name === 'district'
            || region.name === 'municipality'
            || region.name === 'ward'
        ) {
            if (region.name === 'district') {
                return language === 'en'
                    ? 'District-wise distribution (Top 10)'
                    : 'जिल्‍ला अनुसार (शीर्ष १०)';
            }
            if (region.name === 'municipality') {
                return language === 'en'
                    ? 'Municipality-wise distribution (Top 10)'
                    : 'नगरपालिका अनुसार (शीर्ष १०)';
            }
            return language === 'en'
                ? 'Ward-wise distribution (Top 10)'
                : 'वडा अनुसार (शीर्ष १०)';
        }
        if (region.name === 'province') {
            return language === 'en'
                ? `${regionRadio.name}-wise distribution`
                : 'प्रदेश अनुसार';
        }
        if (region.adminLevel === 1) {
            return language === 'en'
                ? 'Province-Wise distribution'
                : 'प्रदेश अनुसार';
        }
        if (region.adminLevel === 2) {
            return language === 'en'
                ? 'District-Wise distribution'
                : 'जिल्‍ला अनुसार';
        }
        return language === 'en'
            ? 'Municipality-Wise distribution'
            : 'नगरपालिका अनुसार';
    }

    function CustomTooltip({ payload, active }: TooltipInterface) {
        if (payload && active && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    {isAllBarData && (
                        <Translation>
                            {k => (
                                <span className={styles.label}>
                                    {`${k(regionRadio.name)}: ${payload[0].payload.name}`}
                                </span>
                            )}
                        </Translation>
                    )}
                    <Translation>
                        {k => (
                            <span className={styles.label}>
                                {`${k(selectOption.name)}: ${payload[0].payload.value}`}
                            </span>
                        )}
                    </Translation>
                </div>
            );
        }
        return null;
    }

    const CustomizedLabel = (prop) => {
        // eslint-disable-next-line react/prop-types
        const { x, y, payload, dy, dx } = prop;
        return typeof payload.value === 'string' ? (
            <Text
                dy={dy}
                dx={dx}
                x={x}
                y={y}
                textAnchor="end"
                verticalAnchor="middle"
                fontSize={12}
                angle={-30}
                width={100}
            >
                {!isAllBarData ? payload.value : ''}
            </Text>
        ) : (
            <Text dy={dy} dx={dx} x={x} y={y}>
                {formatNumeralAccLang(payload.value, language)}
            </Text>
        );
    };

    const downloadProps = {
        domElement: 'barChart',
        selectOption: selectOption.name,
        headerText:
            language === 'en'
                ? `${nameReturn(regionRadio)} of ${selectOption.name} `
                : `${nameReturn(regionRadio)} ${t(selectOption.name)}को विवरण`,
        fileName: 'Bar Chart',
        height: 20,
        width: 0,
    };

    return (
        // <div className={styles.container}>
        <div
            className={className ? _cs(className, styles.wrapper) : styles.wrapper}
        >
            <div className={styles.firstDiv}>
                <Translation>
                    {k => (
                        <p className={styles.text}>
                            {language === 'en'
                                ? `${nameReturn(regionRadio)} of ${selectOption.name}`
                                : `${nameReturn(regionRadio)} ${k(selectOption.name)}को विवरण`
                            }
                        </p>
                    )}
                </Translation>

                {fullScreenMode && (
                    <FullScreenIcon
                        domElement="barChart"
                        setFullScreenHeightWidth={setFullScreenHeightWidth}
                        setBarAllDataOnFullScreen={setBarAllDataOnFullScreen}
                        selectOption={selectOption.name}
                        headerText={
                            language === 'en'
                                ? `${nameReturn(regionRadio)} of ${selectOption.name}`
                                : `${nameReturn(regionRadio)} ${t(selectOption.name)}को विवरण`
                        }
                        language={language}
                    />
                )}

                {downloadButton && (
                    <Button
                        title={
                            language === 'en' ? 'Download Chart' : 'चार्ट डाउनलोड गर्नुहोस्'
                        }
                        className={styles.downloadButton}
                        transparent
                        // disabled={pending}
                        onClick={() => handleDownload(downloadProps)}
                        iconName="download"
                    />
                )}
            </div>
            <div
                className={_cs(styles.barChart, language === 'np' && styles.languageNp)}
                id="barChart"
                ref={imageDownloadRef}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                {barChartData && barChartData.length > 0 && (
                    <ResponsiveContainer
                        width={fullScreen.width}
                        height={fullScreen.height}
                    >
                        <BarChart
                            data={barChartData}
                            margin={{
                                top: 10,
                                bottom: 45,
                                left: -15,
                            }}
                            padding={{ top: 10 }}
                            barSize={20}
                        >
                            <XAxis
                                dy={10}
                                dx={10}
                                tickLine={false}
                                dataKey="name"
                                scale="auto"
                                padding={{ left: 8, right: 0 }}
                                interval={0}
                                tick={<CustomizedLabel />}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={<CustomizedLabel />}
                                dx={-30}
                            />
                            <Tooltip cursor={false} content={<CustomTooltip />} />
                            <CartesianGrid stroke="#ccc" horizontal vertical={false} />
                            <Bar dataKey="value" fill="#db6e51" minPointSize={3} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
        // </div>
    );
};

export default BarChartVisual;
