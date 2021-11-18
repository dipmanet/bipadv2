/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    Label,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
// import NavButtons from '#views/VizRisk/Common/NavButtons';
import Hexagon from 'react-hexagon';


import CriticalInfraLegends from '../Legends/CriticalInfraLegends';
import NavButtons from '../Components/NavButtons';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import TempIcon from '#resources/icons/Temp.svg';
import TempMin from '../../Common/Icons/TempMin.svg';
import AvgRainFall from '#resources/icons/RainFall.svg';
import ElevationIcon from '#resources/icons/ElevationFromSea.svg';

import styles from './styles.scss';
import VRLegend from '../Components/VRLegend/index';
import DemoGraphicsLegends from '../Legends/DemographicsLegends/index';
import LandslideLegend from '../Legends/LandslideLegend/index';
import { renderLegendPopulaion,
    CustomTooltip,
    populationCustomTooltip,
    getChartData,
    getArrforDesc,
    renderLegend,
    landCoverCustomTooltip,
    urbanCustomTooltip } from '../Functions/index';
import TempChart from '../Charts/TempChart.tsx';
import LandCoverChart from '../Charts/LandCoverChart.tsx';
import PopulationChart from '../Charts/PopulationChart.tsx';
import LandCoverLegends from '../Legends/LandCoverLegends/index';
import DemographicsPopInfo from '../Components/DemographicsPopInfo';
import FloodHistoryLegends from '../Legends/FloodHazardLegends';
import FloodDepthLegends from '#views/VizRisk/Common/Legends/FloodDepthLegend';
import PopulationDensityLegends from '../Legends/PopulationDensityLegend';
import BuildingChart from '../Charts/Buildingchart';
import DateTime from '../Components/Clock/index.tsx';

interface State {
    showInfo: boolean;
}

interface Props {}
interface ComponentProps {}

function Leftpane(props) {
    const {
        introHtml,
        handleLegendClicked,
        handleNext,
        handlePrev,
        disableNavLeftBtn,
        disableNavRightBtn,
        pagenumber,
        totalPages,
        pending,
        leftElement,
        legendElement,
        handleIncidentItemClick,
        handleIncidentChange,
        incidentDetailsData,
        cI,
        tempData,
        tempChartData,
        landCoverData,
        populationData,
        urbanData,
        criticalElement,
        handleCriticalInfra,
        handlePopulationChange,
        handleMultipeLegendClicked,
        multipleLegendItem,
        clickedArr,
        clickedHazardItem,
        handleMultipleHazardLayer,
        exposureElement,
        handleExposure,
        hazardLegendClicked,
        exposureElementArr,
        active,
        setActivePage,
        populationDensityRange,
        hazardLegendClickedArr,
        setfloodLayer,
        buildingsChartData,
        landCoverDataInKm,
        realTimeData,
		 page1Legend1InroHtml,
		 page1Legend2InroHtml,
		  page1Legend3InroHtml,
		  page3Legend1InroHtml,
		  page3Legend2InroHtml,
		  page3Legend3InroHtml,
		  page3Legend4InroHtml,
		  page4Legend1InroHtml,
		  page4Legend2InroHtml,
		  page4Legend3InroHtml,
		  legentItemDisabled,

    } = props;
    console.log('real data in leftpane', realTimeData);


    const [fullhazardTitle, setfullhazardTitle] = useState([]);
    const [nonZeroArr, setnonZeroArr] = useState([]);
    const [chartData, setchartData] = useState([]);
    const [cIChartData, setcIChartData] = useState([]);
    const [cITypeName, setcITypeName] = useState([]);
    const [incidentColor, setincidentColor] = useState([]);
    const [currentDate, setcurrentDate] = useState();


    const exposureElements = [
        'Critical Infrastructure',
        'Population Density',
        'Landcover',
        'Building Footprint',
    ];


    useEffect(() => {
        const {
            incidentList,
            incidentFilterYear,
            clickedItem,
            handleIncidentChange,
            cI,
            handlePopulationChange,
        } = props;

        if (incidentList) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            setchartData(getChartData(clickedItem, incidentFilterYear, incidentList));
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            setnonZeroArr(getArrforDesc(clickedItem, chartData, incidentList));
            setfullhazardTitle([
                ...new Set(
                    incidentList.features.map(item => item.properties.hazardTitle),
                ),
            ]);
            setincidentColor([...new Set(incidentList.features.map(
                item => item.properties.hazardColor,
            ))]);
        }
        if (cI) {
            const categoriesCriticalArr = [
                ...new Set(cI.map(item => item.resourceType)),
            ];
            setcITypeName(categoriesCriticalArr);
            setcIChartData(
                categoriesCriticalArr.map(item => ({
                    name: item.charAt(0).toUpperCase() + item.slice(1),
                    // total cI
                    value: cI.filter(ci => ci.resourceType === item).length,
                })),
            );
        }
    }, []);

    const { clickedItem, incidentFilterYear } = props;

    useEffect(() => {
        const {
            incidentList,
            incidentFilterYear,
            getIncidentData,
            clickedItem,
            handleIncidentChange,
            cI,
        } = props;
        if (incidentFilterYear) {
            getIncidentData(incidentFilterYear, clickedItem);

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            setchartData(getChartData(clickedItem, incidentFilterYear, incidentList));
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            setnonZeroArr(getArrforDesc(clickedItem, chartData, incidentList));
        }
        if (clickedItem) {
            getIncidentData(incidentFilterYear, clickedItem);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            setchartData(getChartData(clickedItem, incidentFilterYear, incidentList));
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            setnonZeroArr(getArrforDesc(clickedItem, chartData, incidentList));
        }
    }, [
        setchartData,
        setnonZeroArr,
        setcIChartData,
        clickedItem,
        incidentFilterYear,
    ]);

    const getDescription = () => {
        const { clickedItem } = props;
        if (clickedItem === 'all') {
            if (nonZeroArr.length > 0) {
                return nonZeroArr.map((item, i) => {
                    if (
                        i === nonZeroArr.length - 1
            && i === 0
            && chartData.filter(n => n.name === item)[0].Total !== 0
                    ) {
                        return ` ${item} `;
                    }
                    if (
                        i !== nonZeroArr.length - 1
            && i === 0
            && chartData.filter(n => n.name === item)[0].Total !== 0
                    ) {
                        return ` ${item} `;
                    }
                    if (
                        i === nonZeroArr.length - 1
            && chartData.filter(n => n.name === item)[0].Total !== 0
                    ) {
                        return ` and ${item} `;
                    }
                    if (
                        i !== nonZeroArr.length - 1

            && chartData.filter(n => n.name === item)[0].Total !== 0
                    ) {
                        return `, ${item} `;
                    }
                    return '';
                });
            }
        } else {
            return ` of ${clickedItem} `;
        }
        return '';
    };

    const firstpageLegendItems = ['Admin Boundary', 'Landcover', 'Population By Ward'];
    const hazardIncidentLegendName = ['Flood Hazard', 'Landslide Hazard', 'Seismic Hazard'];

    return (
        <>
            <div className={styles.vrSideBar}>
                <div className={styles.leftTopBar} />
                <div
                    style={{ textAlign: 'initial' }}
                    className={styles.mainIntroHtmlFromAPI}
                    dangerouslySetInnerHTML={{
                        __html: introHtml,
                    }}
                />

                {leftElement === 0 && legendElement === 'Admin Boundary' && (
                    <>
                        <div
                            style={{ textAlign: 'initial' }}
                            dangerouslySetInnerHTML={{
                                __html: page1Legend1InroHtml,
                            }}
                        />
                        <div className={styles.iconRow}>
                            <div className={styles.infoIconsContainer}>
                                <div className={styles.descriptionCotainer}>
                                    <div className={styles.iconTitleDate}>
									Recorderd Time:
                                        {'  '}
                                        {realTimeData !== undefined ? realTimeData.recordedDate.slice(0, 19) : 'Nodata'}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={styles.iconRow}>
                            <div className={styles.infoIconsContainer}>
                                <ScalableVectorGraphics
                                    className={styles.infoIconMax}
                                    src={TempIcon}
                                />
                                <div className={styles.descriptionCotainer}>
                                    <div className={styles.iconTitle}>

                                        {realTimeData !== undefined ? realTimeData.currentTemp : '- ' }
                                    </div>
                                    <div className={styles.iconText}>Current</div>
                                </div>
                            </div>
                            <div className={styles.infoIconsContainer}>
                                <ScalableVectorGraphics
                                    className={styles.infoIconMax}
                                    src={TempIcon}
                                />
                                <div className={styles.descriptionCotainer}>
                                    <div className={styles.iconTitle}>

                                        {realTimeData !== undefined ? realTimeData.maximumTemp : '- '}
℃
                                    </div>
                                    <div className={styles.iconText}>Maximum</div>
                                </div>
                            </div>
                            <div className={styles.infoIconsContainer}>
                                <ScalableVectorGraphics
                                    className={styles.infoIconMin}
                                    src={TempMin}
                                />
                                <div className={styles.descriptionCotainer}>
                                    <div className={styles.iconTitle}>
                                        {' '}
                                        {realTimeData !== undefined ? realTimeData.minimumTemp : '- '}
℃
                                    </div>
                                    <div className={styles.iconText}>Minimum</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.iconRow}>
                            <div className={styles.infoIconsContainer}>
                                <ScalableVectorGraphics
                                    className={styles.infoIcon}
                                    src={AvgRainFall}
                                />
                                <div className={styles.descriptionCotainer}>
                                    <div className={styles.iconTitle}>
                                        {' '}
                                        {realTimeData !== undefined ? realTimeData.rainfall : '- '}
                                        {' '}
mm
                                    </div>
                                    <div className={styles.iconText}>Daily Rainfall</div>
                                </div>
                            </div>
                            <div className={styles.infoIconsContainer}>
                                <ScalableVectorGraphics
                                    className={styles.infoIcon}
                                    src={AvgRainFall}
                                />
                                <div className={styles.descriptionCotainer}>
                                    <div className={styles.iconTitle}>
                                        {' '}
                                        {tempData.map(rainfall => rainfall.rainfall)}
                                        {' '}
mm
                                    </div>
                                    <div className={styles.iconText}>Annual Rainfall</div>
                                </div>
                            </div>

                        </div>

                        <div className={styles.climateChart}>
                            <p
                                style={{
                                    marginBottom: '0px',
                                    marginTop: '30px',
                                    fontWeight: 'bold',
                                    fontSize: '22px',
                                }}
                            >
                Temperature
                            </p>
                            <TempChart
                                tempChartData={tempChartData}
                                renderLegend={renderLegend}
                                CustomTooltip={CustomTooltip}
                            />
                        </div>
                    </>
                )}

                {leftElement === 0 && legendElement === 'Landcover' && (
                    <>
                        <div
                            style={{ textAlign: 'initial' }}
                            dangerouslySetInnerHTML={{
                                __html: page1Legend2InroHtml,
                            }}
                        />

                        <p
                            style={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                fontSize: '21px',
                                margin: '15px',
                            }}
                        >
              Coverage (%)
                        </p>
                        <LandCoverChart
                            landCoverData={landCoverData}
                            landCoverCustomTooltip={landCoverCustomTooltip}

                        />
                    </>
                )}
                {leftElement === 0 && legendElement === 'Population By Ward' && (
                    <>
                        <div
                            style={{ textAlign: 'initial' }}
                            dangerouslySetInnerHTML={{
                                __html: page1Legend3InroHtml,
                            }}
                        />
                        <DemographicsPopInfo populationData={populationData} />
                        <div className={styles.chartContainer}>
                            <PopulationChart
                                populationCustomTooltip={populationCustomTooltip}
                                populationData={populationData}
                                renderLegendPopulaion={renderLegendPopulaion}
                            />
                            <DemoGraphicsLegends demographicsData={populationData} />

                        </div>
                    </>
                )}

                {/* Legend Section */}
                {leftElement === 0 && (
                    <VRLegend>
                        <div className={(disableNavLeftBtn || disableNavRightBtn
						|| legentItemDisabled)
							 ? styles.incidentsLegendsContainerDisabled : styles.incidentsLegendsContainer}
                        >
                            {firstpageLegendItems.length > 0
                && firstpageLegendItems.map(
                	item => (
                        <div
                            className={styles.hazardItemContainer}
                            key={item}
                        >
                            <button
                                key={item}
                                type="button"
                                className={
                					legendElement === item
                						? styles.legendBtnSelected
                						: styles.legendBtn
                				}
                                onClick={() => handleLegendClicked(item)}
                                disabled={disableNavLeftBtn || disableNavRightBtn
									|| legentItemDisabled}
                            >
                                <Hexagon
                                    style={{
                						stroke: '#fff',
                						strokeWidth: 50,
                						fill: legendElement === item ? 'white' : '#036ef0',
                					}}
                                    className={styles.educationHexagon}
                                />
                                {item}
                            </button>
                        </div>
                	),
                )}
                        </div>
                    </VRLegend>
                )}

                {leftElement === 1 && (
                    <>
                        <h1>Past Disaster Incidents</h1>
                        {chartData.length > 0 && (
                            <p>
                                 In the year
                                {' '}
                                {incidentFilterYear}
                                {' '}
                                , total
                                {' '}
                                {
                                    chartData.reduce((a, b) => ({
                                        value: a.value + b.value || 0,
                                    })).value
                                }
                                {' '}
                                 incidents
                                {' '}
                                {nonZeroArr.length > 0 ? ' of ' : ''}
                                {getDescription()}
                                 have been reported in Butwal Sub Metropolitian. These incidents
                                 have caused
                                {' '}
                                {incidentDetailsData.peopleDeathCount}
                                {' '}
                                deaths and
                                {' '}
                                {incidentDetailsData.infrastructureDestroyedHouseCount}
                                {' '}
                                houses were destroyed.
                            </p>
                        )}

                        <ResponsiveContainer
                            className={styles.respContainer}
                            width="100%"
                            height={'75%'}
                        >
                            <BarChart
                                width={250}
                                height={700}
                                data={chartData}
                                layout="vertical"
                                margin={{ left: 15, right: 45 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number">
                                    <Label
                                        value="No. of incidents"
                                        offset={0}
                                        position="insideBottom"
                                        style={{
                                            textAnchor: 'middle',
                                            fill: 'rgba(255, 255, 255, 0.87)',
                                        }}
                                    />
                                </XAxis>
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fill: '#94bdcf' }}
                                />
                                <Tooltip
                                    content={landCoverCustomTooltip}
                                    cursor={{ fill: '#1c333f' }}
                                />
                                <Bar
                                    dataKey="value"
                                    barSize={15}
                                    fill="rgb(0,219,95)"
                                    tick={{ fill: '#94bdcf' }}
                                    radius={[0, 15, 15, 0]}
                                >

                                    {chartData.map((entry, index) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                )}

                {leftElement === 1 && (
                    <>

                        <VRLegend>
                            <div className={styles.incidentsLegendsContainer}>
                                <div className={styles.hazardItemContainer}>
                                    <button
                                        type="button"
                                        className={
                                            clickedItem === 'all'
                                                ? styles.legendBtnSelected
                                                : styles.legendBtn
                                        }
                                        onClick={() => handleIncidentItemClick('all')}
                                    >
                                        <Hexagon
                                            style={{
                                                stroke: '#fff',
                                                strokeWidth: 50,
                                                fill: clickedItem === 'all' ? '#ffffff' : '#036ef0',
                                            }}
                                            className={styles.educationHexagon}
                                        />
                    Showing All
                                    </button>
                                </div>
                            </div>

                            {fullhazardTitle.length > 0
                && fullhazardTitle.map(item => (
                    <div className={styles.incidentsLegendsContainer} key={item}>
                        <div className={styles.hazardItemContainer}>
                            <button
                                key={item}
                                type="button"
                                className={
                					clickedItem === item
                						? styles.legendBtnSelected
                						: styles.legendBtn
                				}
                                onClick={() => handleIncidentItemClick(item)}
                            >
                                <Hexagon
                                    style={{
                						stroke: '#fff',
                						strokeWidth: 50,
                						fill: legendElement === item ? 'white' : '#036ef0',
                					}}
                                    className={styles.educationHexagon}
                                />
                                {item}
                            </button>
                        </div>
                    </div>
                ))}
                        </VRLegend>

                        {/* <LandslideLegend /> */}
                    </>
                )}

                {leftElement === 2 && (
                    <>
                        {[page3Legend1InroHtml, page3Legend2InroHtml,
						 page3Legend3InroHtml, page3Legend4InroHtml].map((item, i) => (
                            <div key={item}>
                                {clickedArr[i] === 1 && (
                                    <div
                                        style={{ textAlign: 'initial' }}
                                        className={styles.mainIntroHtmlFromAPI}
                                        dangerouslySetInnerHTML={{
                                            __html: item,
                                        }}
                                    />
                                )}
                            </div>
                        ))}

                        <ResponsiveContainer
                            className={styles.respContainer}
                            width="100%"
                            height={'60%'}
                        >
                            <BarChart
                                width={200}
                                height={1000}
                                data={cIChartData}
                                layout="vertical"
                                margin={{ left: 15, right: 45, bottom: 25 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number">
                                    <Label
                                        value="Critical Infrastructures"
                                        offset={0}
                                        position="insideBottom"
                                        style={{
                                            textAnchor: 'middle',
                                            fill: 'rgba(255, 255, 255, 0.87)',
                                        }}
                                    />
                                </XAxis>
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fill: '#94bdcf' }}
                                />
                                <Tooltip
                                    content={landCoverCustomTooltip}
                                    cursor={{ fill: '#1c333f' }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="rgb(0,219,95)"
                                    barSize={15}
                                    tick={{ fill: '#94bdcf' }}
                                    radius={[0, 15, 15, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <CriticalInfraLegends
                            clickedArr={clickedArr}
                            exposureElementArr={exposureElementArr}
                            cITypeName={cITypeName}
                            right
                            hide={false}
                            handleCritical={handleCriticalInfra}
                            criticalFlood={criticalElement}
                            leftElement={leftElement}

                        />
                        {(leftElement === 2 && clickedArr[2] === 1) && (
                            <>
                                <LandCoverChart
                                    landCoverData={landCoverDataInKm}
                                    landCoverCustomTooltip={landCoverCustomTooltip}
                                />
                            </>

                        ) }
                        {(leftElement === 2 && clickedArr[3] === 1) && (
                            <>
                                <BuildingChart
                                    buildingsChartData={buildingsChartData}
                                    buildingToolTip={landCoverCustomTooltip}
                                />
                            </>

                        ) }

                        <VRLegend>
                            { exposureElements.map((item, i) => (
                                <div
                                    className={legentItemDisabled
                                        ? styles.incidentsLegendsContainer3Disabled
								 : styles.incidentsLegendsContainer3}
                                    key={item}
                                >
                                    <div className={styles.hazardItemContainer3}>
                                        <button
                                            key={item}
                                            type="button"
                                            className={
                                                clickedArr[i] === 1
                                                    ? styles.legendBtnSelected3
                                                    : styles.legendBtn3
                                            }
                                            onClick={() => handleMultipeLegendClicked(item, i)}
                                            disabled={legentItemDisabled}
                                        >
                                            <Hexagon
                                                style={{
                                                    innerHeight: 80,
                                                    stroke: '#FFFFFF',
                                                    strokeWidth: 30,
                                                    fill:
													clickedArr[i] === 1 ? 'white' : 'transparent',
                                                }}
                                                className={styles.educationHexagon3}
                                            />
                                            {item}
                                        </button>
                                    </div>
                                </div>

                            ))}
                        </VRLegend>
                    </>
                )}

                {((leftElement === 2 && clickedArr[2] === 1)
				  || (leftElement === 3 && exposureElementArr[2] === 1) || (leftElement === 0 && legendElement === 'Landcover'))
				  && (
				               <LandCoverLegends
				          leftElement={leftElement}
				          clickedArr={clickedArr}
				          exposureElementArr={exposureElementArr}
				               />
				  )
				  }
                {leftElement === 3 && (
                    <>
                        {[page4Legend1InroHtml, page4Legend2InroHtml,
						 page4Legend3InroHtml].map((item, i) => (
                            <div key={Math.random()}>
                                {hazardLegendClickedArr[i] === 1 && (
                                    <div

                                        className={styles.mainIntroHtmlFromAPI}
                                        style={{ textAlign: 'initial' }}
                                        dangerouslySetInnerHTML={{
                                            __html: item,
                                        }}
                                    />
                                )}
                            </div>

                        ))}
                        <CriticalInfraLegends
                            exposureElementArr={exposureElementArr}
                            clickedArr={clickedArr}
                            cITypeName={cITypeName}
                            right
                            hide={false}
                            handleCritical={handleCriticalInfra}
                            criticalFlood={criticalElement}
                            leftElement={leftElement}

                        />
                        <VRLegend>
                            <h4
                                className={styles.hazardElementHeaderStyle}
                                style={{ opacity: '0.5', fontWeight: '700' }}
                            >
                HAZARD LAYERS
                            </h4>
                            {hazardIncidentLegendName.length > 0
                && hazardIncidentLegendName.map(
                	(item, i) => (
                        <div
                            className={legentItemDisabled
                                ? styles.incidentsLegendsContainer3Disabled
						 : styles.incidentsLegendsContainer3}
                            key={item}
                        >
                            <div className={styles.hazardItemContainer3}>
                                <button
                                    key={item}
                                    type="button"
                                    className={
                						hazardLegendClicked[i] === 1
                							? styles.legendBtnSelected3
                							: styles.legendBtn3
                					}
                                    onClick={() => handleMultipleHazardLayer(item, i)}
                                    disabled={legentItemDisabled}
                                >
                                    <Hexagon
                                        style={{
                							innerHeight: 80,
                							stroke: '#FFFFFF',
                							strokeWidth: 30,
                							fill:
											hazardLegendClicked[i] === 1
											    ? 'white'
											    : 'transparent',
                						}}
                                        className={styles.educationHexagon3}
                                    />
                                    {item}
                                </button>
                            </div>
                        </div>
                	),
                )}
                            <h4
                                className={styles.hazardElementHeaderStyle}
                                style={{ opacity: '0.5', fontWeight: '700' }}
                            >
                EXPOSURE ELEMENTS
                            </h4>
                            {hazardIncidentLegendName.length > 0
                && [
                	'Population Density',
                	'Critical Infrastructure',
                	'Landcover',
                	'Building Footprint',
                ].map((item, i) => (
                    <div
                        className={legentItemDisabled
                            ? styles.incidentsLegendsContainer3Disabled
				 : styles.incidentsLegendsContainer3}
                        key={item}
                    >
                        <div className={styles.hazardItemContainer3}>
                            <button
                                key={item}
                                type="button"
                                className={
                					exposureElementArr[i] === 1
                						? styles.legendBtnSelected3
                						: styles.legendBtn3
                				}
                                onClick={() => handleExposure(item, i)}
                                disabled={legentItemDisabled}
                            >
                                <Hexagon
                                    style={{
                						innerHeight: 80,
                						stroke: '#FFFFFF',
                						strokeWidth: 30,
                						fill:
										exposureElementArr[i] === 1 ? 'white' : 'transparent',
                					}}
                                    className={styles.educationHexagon3}
                                />
                                {item}
                            </button>
                        </div>
                    </div>
                ))}
                        </VRLegend>
                        <FloodHistoryLegends
                            hazardLegendClickedArr={hazardLegendClickedArr}
                            setfloodLayer={setfloodLayer}
                        />
                        {hazardLegendClickedArr[0] === 1 && (

                            <FloodDepthLegends />
                        )}

                    </>
                )}
                {((leftElement === 2 && clickedArr[1] === 1)
				  || (leftElement === 3 && exposureElementArr[0] === 1))
				  && (
				      <PopulationDensityLegends
				          populationDensityRange={populationDensityRange}
				          leftElement={leftElement}
				          exposureElementArr={exposureElementArr}
				      />
				  )}

                {leftElement === 4 && (
                    <>
                        <ResponsiveContainer width={'100%'} height={400}>
                            <LineChart
                                width={500}
                                height={370}
                                data={urbanData}
                                margin={{ left: 15, right: 45, bottom: 25 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" fill="#0c2432" />
                                <XAxis dataKey="year">
                                    <Label value="Year ------->" offset={0} position="insideBottom" fill="white" />
                                </XAxis>
                                <YAxis>
                                    <Label value="Population ------>" angle={-90} position="insideLeft" fill="white" />
                                </YAxis>
                                <Tooltip
                                    content={urbanCustomTooltip}
                                    cursor={{ fill: '#1c333f' }}
                                />
                                {/* <Legend margin={{ top: 14, left: 14,
									 bottom: 14, right: 14 }} /> */}
                                <Line
                                    type="monotone"
                                    dataKey="pop"
                                    stroke="#036ef0 "
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <VRLegend>
                            {hazardIncidentLegendName.length > 0
                && ['Landcover Change'].map(item => (
                    <div className={styles.incidentsLegendsContainer3} key={item}>
                        <div className={styles.hazardItemContainer3}>
                            <button
                                key={item}
                                type="button"
                                className={styles.legendBtnSelected3}
                                onClick={() => handleLegendClicked(item)}
                            >
                                <Hexagon
                                    style={{
                						innerHeight: 80,
                						stroke: '#FFFFFF',
                						strokeWidth: 30,
                						fill: '#036ef0 ',
                					}}
                                    className={styles.educationHexagon3}
                                />
                                {item}
                            </button>
                        </div>
                    </div>
                ))}
                        </VRLegend>
                    </>
                )}
                <div className={styles.leftBottomBar}>
                    <NavButtons
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        disableNavLeftBtn={disableNavLeftBtn}
                        disableNavRightBtn={disableNavRightBtn}
                        pagenumber={pagenumber}
                        totalPages={totalPages}
                        pending={pending}
                        leftElement={leftElement}
                        setActivePage={setActivePage}
                        active={active}
                    />
                </div>
            </div>

        </>
    );
}

export default Leftpane;
