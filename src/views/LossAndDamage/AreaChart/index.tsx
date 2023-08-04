/* eslint-disable arrow-parens */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Translation, useTranslation } from 'react-i18next';
import { _cs } from '@togglecorp/fujs';
import Button from '#rsca/Button';
import { convertDateAccToLanguage } from '#utils/common';
import styles from './styles.scss';
import { returnValueByDropdown, formatNumeralAccLang } from '../utils/utils';
import { AreaChartProps, TooltipInterface } from './types';
import { ContainerSize } from '../Barchart/types';
import FullScreenIcon from '../FullScreen';
import { handleDownload } from '../Barchart/util';

const AreaChartVisual = (props: AreaChartProps) => {
    const [fullScreen, setFullScreen] = useState<ContainerSize>({
        width: '100%',
        height: 300,
    });
    const {
        selectOption: { name, key },
        data,
        handleSaveClick,
        downloadButton,
        fullScreenMode,
        language,
    } = props;
    const { t } = useTranslation();


    const setFullScreenHeightWidth = (width: string, height: string | number) => {
        setFullScreen({ width, height });
    };

    function exitHandler() {
        if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            setFullScreen({
                width: '100%',
                height: 300,
            });
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

    const chartData = data && data.length && data.map((item) => {
        const date = new Date();
        date.setTime(parseInt(item.incidentMonthTimestamp, 10));

        const year = date.getFullYear();

        const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const finalDate = convertDateAccToLanguage(`${year}-${month}`, language);

        const obj = {
            date: finalDate,
            [name]: item.summary[key],
        };
        return obj;
    });

    const CustomizedTick = (value: number) => formatNumeralAccLang(value, language);

    function CustomTooltip({ payload, active }: TooltipInterface) {
        if (payload && active && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <Translation>
                        {(k) => <span className={styles.label}>{`${k(payload[0].name)}: ${payload[0].value}`}</span>}
                    </Translation>
                </div>
            );
        }
        return null;
    }

    const downloadProps = {
        domElement: 'areaChart',
        selectOption: name,
        headerText: language === 'en' ? `Temporal distribution of ${name}` : `${t(name)}को समयिक विवरण`,
        fileName: 'Area Chart',
        height: 0,
        width: 30,
    };

    return (
        <div className={_cs(styles.wrapper, language === 'np' && styles.languageNp)}>
            <div className={styles.firstDiv}>
                <Translation>
                    {(k) => (
                        <p className={styles.text}>
                            {language === 'en' ? `Temporal distribution of ${name}` : `${k(name)}को समयिक विवरण`}
                        </p>
                    )}
                </Translation>

                {fullScreenMode && (
                    <FullScreenIcon
                        domElement="areaChart"
                        setFullScreenHeightWidth={setFullScreenHeightWidth}
                        selectOption={name}
                        headerText={language === 'en' ? `Temporal distribution of ${name}` : `${t(name)}को समयिक विवरण`}
                        language={language}
                    />
                )}

                {downloadButton && (
                    <Button
                        title={language === 'en' ? 'Download Chart' : 'चार्ट डाउनलोड गर्नुहोस्'}
                        className={styles.downloadButton}
                        transparent
                        // disabled={pending}
                        onClick={() => handleDownload(downloadProps)}
                        iconName="download"
                    />
                )}
            </div>
            <div className={styles.areaChart} id="areaChart">
                {chartData && (
                    <ResponsiveContainer width={fullScreen.width} height={fullScreen.height}>
                        <AreaChart
                            width={500}
                            height={200}
                            data={chartData}
                            margin={{
                                top: 5,
                                bottom: 45,
                                right: 5,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#db6e51" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#db6e51" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid stroke="#ccc" horizontal vertical={false} />
                            <XAxis tickLine={false} dataKey="date" dy={15} angle={-30} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={CustomizedTick} dx={-10} />
                            <Tooltip content={CustomTooltip} />
                            <Area
                                type="monotone"
                                dataKey={name}
                                stroke="#db6e51"
                                fillOpacity={1}
                                fill="url(#colorUv)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default AreaChartVisual;
