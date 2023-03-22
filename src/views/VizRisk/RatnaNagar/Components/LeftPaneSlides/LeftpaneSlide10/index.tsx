import React, { useContext } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';
import styles from './styles.scss';

const LeftpaneSlide10 = () => {
    const {
        keyValueHtmlData,
    } = useContext(MainPageDataContext);

    const htmlData = keyValueHtmlData && keyValueHtmlData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page10_htmldata_301_3_35_35007',
    )[0];

    return (
        <div className={styles.vrSideBar}>
            <div className={styles.vrSideBarContents}>
                <h1>Risk Assessment</h1>
                <div style={{ width: '100%', height: '1px', backgroundColor: 'white', marginTop: '15px' }} />
                {htmlData && htmlData.value && (
                    ReactHtmlParser(htmlData.value)

                )}
            </div>
        </div>
    );
};


export default LeftpaneSlide10;
