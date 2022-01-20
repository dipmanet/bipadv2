import React from 'react';
import { connect } from 'react-redux';
import Temperatures from 'src/admin/components/BulletinForm/Temperatures';
// import tempMin from 'src/admin/resources/tempMin.png';
// import tempMax from 'src/admin/resources/tempMax.png';
import styles from './styles.scss';

import {
    bulletinPageSelector,
} from '#selectors';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),

});


const BulletinPDFFooter = (props) => {
    const {
        tempMin,
        tempMax,
        dailySummary,
    } = props.bulletinData;

    return (
        <div className={styles.footerContainer}>
            <div className={styles.dailySummary}>
                <h2>दैनिक बर्षा को सारांश</h2>
                <p>{dailySummary}</p>
            </div>
            {/*
            <div className={styles.temperaturePics}>
                <img src={tempMin} alt="temp min" />
                <img src={tempMax} alt="temp max" />
            </div> */}

            <Temperatures
                hideForm
                minTemp={tempMin}
                maxTemp={tempMax}
            />


            <div className={styles.footer}>
                <h2>दैनिक बुलेटिन सम्भन्धी थप जानकारी का लागि</h2>
                <hr className={styles.horLine} />
                <p>राष्ट्रिय बिपद जोखिम न्युनिकरन तथा व्यवस्थापना प्राधिकरण</p>
                <p>पोस्ट बक्स नम्बर: २१३२१३ </p>
                <p>फोन:  +९७७-१-४४९३८४७, +९७७-१-४४३९४८५ </p>
                <p>ई-मेल : info@bipad.gov.np</p>
            </div>

        </div>
    );
};

export default connect(mapStateToProps)(
    // createConnectedRequestCoordinator<ReduxProps>()(
    // createRequestClient(requests)(
    BulletinPDFFooter,
    // ),
    // ),
);
