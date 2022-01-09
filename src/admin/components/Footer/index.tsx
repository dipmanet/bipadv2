// / <reference no-default-lib="true"/>

import React, { useState } from 'react';
import styles from './styles.module.scss';
// import Natioanllogo from '../../resources/nationallogo.svg';
// import Gotolinks from '../../resources/gotolinks.svg';

const Footer = () => (
    <>
        <div className={styles.footerMain}>
            <div className={styles.nationalLogo}>
                <img src="" alt="" />
            </div>
            <div className={styles.footerItems}>
                <h1 className={styles.footerMainHead}>
An Integrated Disaster Information Management System
                </h1>
                <p className={styles.footerPara}>
An Integrated Disaster Information Management System is one of the most crucial
components for policymaking, planning, and implementing DRRM activities. However,
in Nepal, disaster data/information is still scattered, insufficient, and not fully
harmonized. On this backdrop, Building Information Platform Against Disaster (BIPAD)
portal, an integrated DIMS, is built by pooling all credible digital and spatial data
that are available within different government bodies, non-governmental organizations,
academic institutions, and research organizations on a single platform. The portal
is built at a time when disaster governance in Nepal is changing on account of the
federal restructuring of the country. The focus of the system is on the bottom-up
approach of data collection, targeting the Provincial and Municipal governments to
engage in verifying and collecting data. BIPAD portal is targeted for Emergency
Operation Centers at National, Provincial, and Municipal tiers of the government,
and Nepal Police, who are the first responder to disaster. Other users of this
system are the line ministries at National and Provincial tiers working in
disaster management division and departments, Nepal Army, Armed Police Force,
non-governmental organizations, research institutions, and the general public.
                </p>
                <div className={styles.govLinks}>
                    <div className={styles.linkImg}>
                        <img src="" alt="" />
                        <a className={styles.footerLinks} href="https://nhfr.mohp.gov.np/" target="_blank" rel="noopener noreferrer">NHFR.MOHP.GOV.NP</a>
                    </div>
                    <div className={styles.linkImg}>
                        <img src="" alt="" />
                        <a className={styles.footerLinks} href="https://bipad.gov.np/np/" target="_blank" rel="noopener noreferrer">BIPAD.GOV.NP</a>
                    </div>
                    <div className={styles.linkImg}>
                        <img src="" alt="" />
                        <a className={styles.footerLinks} href="https://covid19.mohp.gov.np/" target="_blank" rel="noopener noreferrer">COVID19.MOHP.GOV.NP</a>
                    </div>

                </div>
            </div>
        </div>

    </>
);

export default Footer;
