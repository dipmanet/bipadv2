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
                    <h3>A repeat of the 2017 flood in 2022 would inundate</h3>
                    <p>1500 Building</p>
                    <p>27,719 km of roads</p>
                    <p>2.98 sq.km of agricultural land</p>
                </div>
            </div>
        </div>
    );
};


export default LeftpaneSlide5;
