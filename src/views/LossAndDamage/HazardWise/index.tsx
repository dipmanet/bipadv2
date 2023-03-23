/* eslint-disable arrow-parens */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import React, { useRef, useState } from 'react';
import { ResponsiveContainer, Tooltip, Treemap } from 'recharts';
import { Translation, useTranslation } from 'react-i18next';
import { _cs } from '@togglecorp/fujs';
import Button from '#rsca/Button';
import styles from './styles.scss';
import { returnValueByDropdown, formatNumeralAccLang } from '../utils/utils';
import { HazardDetail, Summary } from './types';
import { ContainerSize, TooltipInterface } from '../Barchart/types';
import FullScreenIcon from '../FullScreen';
import { handleDownload } from '../Barchart/util';

interface HazardWiseProps {
    selectOption: {
        name: string;
        key: string;
    };
    data: {
        [key: string]: {
            hazardDetail: HazardDetail;
            summary: Summary;
        };
    };
    handleSaveClick: (id: string, fileName: string) => void;
    downloadButton?: boolean | undefined;
    fullScreenMode?: boolean;
}

const HazardWise = (props: HazardWiseProps) => {
    const { selectOption, data, handleSaveClick, downloadButton, fullScreenMode, language } = props;
    const { t } = useTranslation();
    const treeMapRef = useRef<HTMLDivElement>(null);
    const [fullScreen, setFullScreen] = useState<ContainerSize>({ width: '100%', height: 300 });

    const setFullScreenHeightWidth = (width: string, height: string | number) => {
        setFullScreen({ width, height });
    };

    function exitHandler() {
        if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            setFullScreen({ width: '100%', height: 300 });
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

    const hazardWiseData = Object.entries(data)
        .map((item) => {
            const obj = {
                name: language === 'en' ? item[1].hazardDetail.title : item[1].hazardDetail.titleNe,
                value: item[1].summary[selectOption.key],
                icon: item[1].hazardDetail.icon,
            };
            return obj;
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    const barColors = [
        '#d4543d',
        '#d76047',
        '#d96c54',
        '#dd7860',
        '#e49077',
        '#e79c83',
        '#e69c83',
        '#edb49a',
        '#f0c0a6',
        '#f3ccb1',
        '#f7d8bf',
        '#f6d8bf',
    ];

    const CustomizedContent = (prop: any) => {
        const { root, depth, x, y, width, height, index, colors, name, value, icon } = prop;
        return (
            <g>
                <rect
                    id={name}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                        fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : 'none',
                        stroke: '#FFFFFF',
                        strokeWidth: 2.5 / (depth + 1e-10),
                        strokeOpacity: 1 / (depth + 1e-10),
                    }}
                />
                {depth === 1 ? (
                    <>
                        <text
                            x={x + width / 7}
                            y={y + height / 5}
                            textAnchor="top"
                            style={{ fill: '#FFFFFF', stroke: '#FFFFFF' }}
                            fontWeight={'100'}
                            fontSize={(height + width) / 28}
                        >
                            {height + width > 150 ? name : ''}
                        </text>
                        <text
                            x={x + width / 7}
                            y={y === 0 ? y + height / 3 : y + height / 2.5}
                            textAnchor="top"
                            style={{ fill: '#FFFFFF', stroke: '#FFFFFF' }}
                            fontSize={(height + width) / 20}
                            fontWeight={'300'}
                        >
                            {height + width > 150 ? formatNumeralAccLang(value, language) : ''}
                        </text>
                        <foreignObject
                            width={height + width <= 150 ? '15px' : (height + width) / 14}
                            height={height + width <= 150 ? '15px' : (height + width) / 14}
                            x={x + width / 8}
                            y={height + width <= 150 ? y + height / 7 : y + height / 1.5}
                        >
                            <img
                                width={height + width <= 150 ? '15px' : (height + width) / 14}
                                height={height + width <= 150 ? '15px' : (height + width) / 14}
                                src={icon}
                                alt={name}
                                style={{ filter: 'brightness(0) invert(1)' }}
                            />
                        </foreignObject>
                    </>
                ) : null}
            </g>
        );
    };

    const TreeMapTooltip = ({ active, payload }: TooltipInterface) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0].payload;
            return <p className={styles.label}>{`${name}: ${value}`}</p>;
        }
        return null;
    };

    function treemapHighlight(name: string, fill: string | null) {
        if (treeMapRef.current) {
            const responsiveContainer = treeMapRef.current.getElementsByClassName('recharts-responsive-container')[0];
            const rechartsWrapper = responsiveContainer.getElementsByClassName('recharts-wrapper');
            const svgRecharts = rechartsWrapper[0].children[0];
            const Gtag = svgRecharts.getElementById(name);
            Gtag.style.fill = fill || '#BCBCBC';
        }
    }

    const onMouseEnter = ({ name }: { name: string }) => {
        treemapHighlight(name, null);
    };

    const onMouseLeave = ({ name, fill }: { name: string; fill: string }) => {
        treemapHighlight(name, fill);
    };

    const downloadProps = {
        domElement: 'treemap',
        selectOption: selectOption.name,
        headerText: language === 'en'
            ? `Hazard-wise distribution of ${selectOption.name}`
            : `प्रकोप अनुसार ${t(selectOption.name)}को  विवरण`,
        fileName: 'Tree Map',
        height: 50,
        width: 0,
    };

    return (
        <div className={_cs(styles.wrapper, language === 'np' && styles.languageNp)}>
            <div className={styles.hazardHead}>
                <Translation>
                    {(k) => (
                        <p className={styles.hazardText}>
                            {language === 'en'
                                ? `Hazard-wise distribution of ${selectOption.name}`
                                : `प्रकोप अनुसार ${k(selectOption.name)}को विवरण`}
                        </p>
                    )}
                </Translation>

                {fullScreenMode && (
                    <FullScreenIcon
                        domElement="treemap"
                        setFullScreenHeightWidth={setFullScreenHeightWidth}
                        selectOption={selectOption.name}
                        headerText={language === 'en'
                            ? `Hazard-wise distribution of ${selectOption.name}`
                            : `प्रकोप अनुसार ${t(selectOption.name)}को विवरण`}
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
            <div id="treemap" ref={treeMapRef} className={styles.treeMap}>
                {hazardWiseData.length > 0 && (
                    <ResponsiveContainer height={fullScreen.height} width={fullScreen.width}>
                        <Treemap
                            width={400}
                            height={300}
                            data={hazardWiseData}
                            dataKey="value"
                            stroke="#FFFFFF"
                            fill={barColors.map((item) => item)[1]}
                            content={<CustomizedContent colors={barColors} />}
                            aspectRatio={4 / 3}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        >
                            <Tooltip content={<TreeMapTooltip />} />
                        </Treemap>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default HazardWise;
