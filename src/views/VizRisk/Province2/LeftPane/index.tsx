/* eslint-disable react/no-danger */
/* eslint-disable max-len */
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
    urbanCustomTooltip, parseStringToNumber, cITooltip, pastDisasterCustomTooltip } from '../Functions/index';
import TempChart from '../Charts/TempChart.tsx';
import LandCoverChart from '../Charts/LandCoverChart.tsx';
import PopulationChart from '../Charts/PopulationChart.tsx';
import LandCoverLegends from '../Legends/LandCoverLegends/index';
import DemographicsPopInfo from '../Components/DemographicsPopInfo';
import VRLegendHazard from '../Components/VRLegendHazard/index';
import VRLegendFatality from '../Components/VRLegendFatality';
import VRLegendTemp from '../Components/VRLegendTemp';
import VRLegendPre from '../Components/VRLegendPre';
import DRRCountBox from '../Components/DRRCountBox/index';


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
        clickedFatalityInfraDamage,
        handleFatalityInfraLayer,
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
		  CIState,

    } = props;


    const [fullhazardTitle, setfullhazardTitle] = useState([]);
    const [nonZeroArr, setnonZeroArr] = useState([]);
    const [chartData, setchartData] = useState([]);
    const [cIChartData, setcIChartData] = useState([]);
    const [cITypeName, setcITypeName] = useState([]);
    const [incidentColor, setincidentColor] = useState([]);
    const [currentDate, setcurrentDate] = useState();


    const temperatureRefPeriod = [
        'Reference Period(1981-2010)',
        'Medium Term(2016-2045)',
        'Long Term(2036-2065)',
    ];
    const precipationRefPeriod = [
        'Reference Period(1981-2010)',
        'Medium Term(2016-2045)',
        'Long Term(2036-2065)',
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
    console.log('ci chart data', cIChartData);

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
        if (clickedItem) {
            getIncidentData(incidentFilterYear, clickedItem);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            setchartData(getChartData(clickedItem, incidentFilterYear, incidentList));
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            setnonZeroArr(getArrforDesc(clickedItem, chartData, incidentList));
        }
    }, [
        setcIChartData,
    ]);
    console.log('nonZero Arr is ', nonZeroArr, chartData);

    const getDescription = () => {
        const { clickedItem } = props;
        if (clickedItem === 'all') {
            if (nonZeroArr.length > 0) {
                return nonZeroArr.map((item, i) => {
                    if (
                        i === nonZeroArr.length - 1
                            && i === 0 && chartData.map(item => item.value)[0] !== 0
                            // && chartData.filter(n => n.name === item)[0]
                            && chartData.filter(n => n.name === item)[0].value !== 0) {
                        return ` ${item} `;
                    }
                    if (
                        i === 0
                            // && chartData.filter(n => n.name === item)[0]
                            && chartData.filter(n => n.name === item)[0].value !== 0) {
                        return ` ${item} ,`;
                    }
                    if (
                        i !== nonZeroArr.length - 1
                            && i === 0
                            // && chartData.filter(n => n.name === item)[0]
                            && chartData.filter(n => n.name === item)[0].value !== 0) {
                        return ` ${item} `;
                    }
                    if (
                        i === nonZeroArr.length - 1
                            // && chartData.filter(n => n.name === item)[0]
                            && chartData.filter(n => n.name === item)[0].value !== 0) {
                        return ` and ${item} `;
                    }
                    if (
                        i === 1
                            // && chartData.filter(n => n.name === item)[0]
                            && chartData.filter(n => n.name === item)[0].value !== 0) {
                        return ` ${item} `;
                    }
                    if (
                        i !== 0 && i !== nonZeroArr.length - 1 && i > 2
                            // && chartData.filter(n => n.name === item)[0]
                            && chartData.filter(n => n.name === item)[0].value !== 0) {
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

    const currentAverageTemp = (tempInString) => {
        let numb;
        if (tempInString) {
            numb = tempInString.match(/\d/g);
        }
        console.log('sep', numb);

        if (numb && numb.length === 2) {
            const firstNum = parseInt(numb[0], 10);
            const secondNum = parseInt(numb[1], 10);
            return (firstNum + secondNum) / 2;
        }
        if (numb && numb.length === 3) {
            const firstNum = parseInt(numb[0], 10);
            const secondNum = numb[1];
            const thirdNum = numb[2];
            return (firstNum + parseInt((secondNum + thirdNum), 10)) / 2;
        }
        if (numb && numb.length === 4) {
            const firstNum = numb[0];
            const secondNum = numb[1];
            const thirdNum = numb[2];
            const fourthNum = numb[3];
            return (parseInt((firstNum + secondNum), 10) + parseInt((thirdNum + fourthNum), 10)) / 2;
        }
        return '';
    };


    const firstpageLegendItems = ['Adminstrative Map', 'Landcover', 'Population By Ward'];
    const hazardIncidentLegendName = ['Flood Hazard', 'Landslide Hazard'];
    console.log('chartData is ', chartData);

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

                {leftElement === 0 && legendElement === 'Adminstrative Map' && (
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
                                        {realTimeData !== undefined ? realTimeData.recordedDate.slice(0, 10) : 'Nodata'}
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

                                        {realTimeData !== undefined ? currentAverageTemp(realTimeData.currentTemp) : '- ' }
℃
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
                                    className={styles.infoIconMax}
                                    src={TempIcon}
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
                                        { tempData && parseStringToNumber(tempData.filter(rainfall => rainfall.rainfall).map(item => item.rainfall)[0])}
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
                        />
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
                        <h1>Damage and Loss Profile</h1>
                        {chartData.length > 0 && (
                            <p>
                               Lorem ipsum dolor sit, amet consectetur adipisicing elit.
							    Corporis itaque quibusdam dolore vero quia quis vitae! Expedita
								 adipisci animi recusandae velit error sit vitae eveniet?
                            </p>
                        )}
                    </>
                )}


                {((leftElement === 3 && exposureElementArr[2] === 1) || (leftElement === 0 && legendElement === 'Landcover'))
				  && (
				               <LandCoverLegends
				          leftElement={leftElement}
				          clickedArr={clickedArr}
				          exposureElementArr={exposureElementArr}
				               />
				  )
				  }

                {leftElement === 3 && (
                    <VRLegendFatality>
					 {hazardIncidentLegendName.length > 0
		 && ['Human Poverty Index', 'Human Development Index'].map(
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
							 className={clickedFatalityInfraDamage === item ? styles.legendBtnSelected3 : styles.legendBtn3}
							 disabled={legentItemDisabled}
						 >
							 <Hexagon
								 style={{
									 innerHeight: 80,
									 stroke: '#FFFFFF',
									 strokeWidth: 30,
									 fill: 'transparent',
								 }}
								 className={styles.educationHexagon3}
							 />
							 {item}
						 </button>
					 </div>
				 </div>
			 ),
		 )}
                    </VRLegendFatality>
                )}
                {leftElement === 6 && (
                    <CriticalInfraLegends
                        exposureElementArr={exposureElementArr}
                        clickedArr={clickedArr}
                        cITypeName={cITypeName}
                        right
                        hide={false}
                        handleCritical={handleCriticalInfra}
                        criticalFlood={criticalElement}
                        leftElement={leftElement}
                        CIState={CIState}
                    />
                )}
				         {(leftElement === 6) && (
                    <>
                        <ResponsiveContainer
                            className={styles.respContainer}
                            width="100%"
                            height={'90%'}
                        >
                            <BarChart
                                width={200}
                                height={1000}
                                data={cIChartData}
                                layout="vertical"
                                margin={{ left: 15, right: 45, bottom: 25 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tick={{ fill: '#94bdcf' }}>
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
                                    content={cITooltip}
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
                    </>
                ) }
                {leftElement === 1 && (
                    <>
                        <VRLegendHazard>
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
                                    className={clickedHazardItem === item ? styles.legendBtnSelected3 : styles.legendBtn3}
                                    onClick={() => handleMultipleHazardLayer(item, i)}
                                >
                                    <Hexagon
                                        style={{
                							innerHeight: 80,
                							stroke: '#FFFFFF',
                							strokeWidth: 30,
                							fill: clickedHazardItem === item ? 'white' : 'transparent',
                						}}
                                        className={styles.educationHexagon3}
                                    />
                                    {item}
                                </button>
                            </div>
                        </div>
                	),
                )}
                        </VRLegendHazard>

                        <VRLegendFatality>
                            {hazardIncidentLegendName.length > 0
                && ['Fatality', 'Infrastructure Damage'].map(
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
                                    className={clickedFatalityInfraDamage === item ? styles.legendBtnSelected3 : styles.legendBtn3}
                                    onClick={() => handleFatalityInfraLayer(item, i)}
                                    disabled={legentItemDisabled}
                                >
                                    <Hexagon
                                        style={{
                							innerHeight: 80,
                							stroke: '#FFFFFF',
                							strokeWidth: 30,
                							fill: clickedFatalityInfraDamage === item ? 'white' : 'transparent',
                						}}
                                        className={styles.educationHexagon3}
                                    />
                                    {item}
                                </button>
                            </div>
                        </div>
                	),
                )}
                        </VRLegendFatality>
                    </>
                )}

                {leftElement === 5 && (
                    <>
                        <VRLegendTemp>
                            <h4
                                className={styles.hazardElementHeaderStyle}
                                style={{ opacity: '0.5', fontWeight: '700' }}
                            >
                PRECIPITATION
                            </h4>
                            {precipationRefPeriod.length > 0
                && precipationRefPeriod.map(
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
                                    className={clickedHazardItem === item ? styles.legendBtnSelected3 : styles.legendBtn3}
                                >
                                    <Hexagon
                                        style={{
                							innerHeight: 80,
                							stroke: '#FFFFFF',
                							strokeWidth: 30,
                							fill: clickedHazardItem === item ? 'white' : 'transparent',
                						}}
                                        className={styles.educationHexagon3}
                                    />
                                    {item}
                                </button>
                            </div>
                        </div>
                	),
                )}
                        </VRLegendTemp>
                        <VRLegendPre>
                            <h4
                                className={styles.hazardElementHeaderStyle}
                                style={{ opacity: '0.5', fontWeight: '700' }}
                            >
                TEMPERTAURE
                            </h4>
                            {temperatureRefPeriod.length > 0
                && temperatureRefPeriod.map(
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
                                    className={clickedHazardItem === item ? styles.legendBtnSelected3 : styles.legendBtn3}
                                >
                                    <Hexagon
                                        style={{
                							innerHeight: 80,
                							stroke: '#FFFFFF',
                							strokeWidth: 30,
                							fill: clickedHazardItem === item ? 'white' : 'transparent',
                						}}
                                        className={styles.educationHexagon3}
                                    />
                                    {item}
                                </button>
                            </div>
                        </div>
                	),
                )}
                        </VRLegendPre>
                    </>
                )}

                {leftElement === 7 && <DRRCountBox />}
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
