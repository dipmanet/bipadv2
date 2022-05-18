/* eslint-disable max-len */
import React, { useContext } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';

import styles from './styles.scss';

const LeftpaneSlide5 = () => {
    const {
        keyValueHtmlData,
    } = useContext(MainPageDataContext);

    const htmlData = keyValueHtmlData && keyValueHtmlData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page5_htmldata_301_3_35_35007',
    )[0];


    return (
        <div className={styles.vrSideBar}>
            <div className="mainTitleDiv">
                {htmlData && htmlData.value && (
                    ReactHtmlParser(htmlData.value)

                )}
                <div>
                    <h3 style={{ fontSize: 16 }}>A repeat of the 2017 flood in 2022 would inundate</h3>
                    <p>
                        {' '}
                        <span style={{ fontSize: 20, fontWeight: 'bold' }}>1500 </span>
                        {' '}
                        Building
                    </p>
                    <p>
                        {' '}
                        <span style={{ fontSize: 20, fontWeight: 'bold' }}> 27,719</span>
                        {' '}
                        km of roads
                    </p>
                    <p>
                        <span style={{ fontSize: 20, fontWeight: 'bold' }}>2.98 sq.km</span>
                        {' '}
                        of agricultural land
                    </p>
                </div>
                <p><em>Source: WPP, OpenSteetMap</em></p>
            </div>
        </div>
    );
};


export default LeftpaneSlide5;
