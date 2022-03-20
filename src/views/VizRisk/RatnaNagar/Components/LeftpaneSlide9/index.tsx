/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import React from 'react';
import SankeyChart from '../Charts/SankeyChart';
import styles from './styles.scss';

const LeftpaneSlide9 = () => {
    const data0 = {
        nodes: [
		  {
                name: 'Visit',
		  },
		  {
                name: 'Direct-Favourite',
		  },
		  {
                name: 'Page-Click',
		  },
		  {
                name: 'Detail-Favourite',
		  },
		  {
                name: 'Lost',
		  },
        ],
        links: [
		  {
                source: 0,
                target: 1,
                value: 3728.3,
		  },
		  {
                source: 0,
                target: 2,
                value: 354170,
		  },
		  {
                source: 2,
                target: 3,
                value: 62429,
		  },
		  {
                source: 2,
                target: 4,
                value: 291741,
		  },
        ],
	  };

    return (


        <div className={styles.vrSideBar}>
            <h1>Risk</h1>
            <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

            </p>
            <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

            </p>
            <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

            </p>
            <SankeyChart />
        </div>
    );
};


export default LeftpaneSlide9;
