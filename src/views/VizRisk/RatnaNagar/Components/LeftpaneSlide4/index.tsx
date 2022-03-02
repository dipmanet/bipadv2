/* eslint-disable css-modules/no-unused-class */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import CommonBarChart from '../Charts/Barcharts';
import StackChart from '../Charts/StackChart';
import Factors from '../Factors';
import SelectComponent from '../SelectComponent';
import styles from './styles.scss';

const LeftpaneSlide4 = () => {
    const munName = 'Ratnanagar Municipality';
    const factorScore = 3;
    const scoreSattus = 'Low';

    const stackBarChartTitle = 'HAZARD OF HOUSEHOLDS';

    const data = [
        {
            'Very High': 5,
		  High: 30,
		  Medium: 10,
		  Low: 20,
		  'Very Low': 35,
        },
	  ];

	  const barTitle = 'DISTRIBUTION OF HOUSEHOLD BY FAMILY SIZE';
	  const barData = [
        {
		  name: 'Page A',
		  'Number of Household': 4000,
        },
        {
		  name: 'Page B',
		  'Number of Household': 1398,
        },
        {
		  name: 'Page C',
		  'Number of Household': 2000,
        },
        {
		  name: 'Page D',
		  'Number of Household': 2780,
        },
        {
		  name: 'Page E',
		  'Number of Household': 1890,
        },
	  ];
    return (
        <div className={styles.vrSideBar}>
            <h1>Exposure</h1>
            <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

            </p>
            <Factors
                municipalityName={munName}
                factorScore={factorScore}
                scoreStatus={scoreSattus}
            />
            <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

            </p>
            <StackChart
                stackBarChartTitle={stackBarChartTitle}
                data={data}
            />
            <p>
			    The value of individual households is
                calculated based on the scoring of the
                selected indicators. The indicators used to
                quantify hazard are
            </p>
            <SelectComponent />
            <CommonBarChart barTitle={barTitle} barData={barData} />
        </div>
    );
};


export default LeftpaneSlide4;
