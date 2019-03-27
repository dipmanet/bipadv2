import React, { Fragment } from 'react';
import Button from '#rsca/Button';

import Wizard from '#rscv/Wizard';
import Modal from '#rscv/Modal';

import styles from './styles.scss';

export default class FirstModal extends React.PureComponent {
    handleNationalLevelClick = () => {
        console.warn('National Level Clicked');
        this.props.setInitialPopupShown({ value: false });
    }

    handleProvincialLevelClick = (id) => {
        console.warn('Provincial Level Clicked', id);
        this.props.setInitialPopupShown({ value: false });
    }

    handleDistrictLevelClick = (id) => {
        console.warn('District Level Clicked', id);
        this.props.setInitialPopupShown({ value: false });
    }

    handleMunicipalLevelClick = (id) => {
        console.warn('Municipal Level Clicked', id);
        this.props.setInitialPopupShown({ value: false });
    }

    renderFirstPage = ({ onJump, onNationalLevelClick }) => (
        <Fragment>
            <div className={styles.areaSelect}>
                <button
                    className={styles.subtype}
                    type="button"
                    onClick={onNationalLevelClick}
                >
                    National Level
                </button>
                <button
                    className={styles.subtype}
                    type="button"
                    onClick={() => onJump(1)}
                >
                    Provincial Level
                </button>
                <button
                    className={styles.subtype}
                    type="button"
                    onClick={() => onJump(2)}
                >
                    District Level
                </button>
                <button
                    className={styles.subtype}
                    type="button"
                    onClick={() => onJump(3)}
                >
                    Municipal Level
                </button>
                {/*
                <div className={styles.subtype}>
                    <h3>National Level</h3>
                </div>
                <div className={styles.subtype}>
                    <h3>Province</h3>
                    <SelectInput
                        keySelector={adminLevelKeySelector}
                        labelSelector={adminLevelLabelSelector}
                        options={provinces}
                        onChange={this.handleProvinceSelect}
                    />
                </div>
                <div className={styles.subtype}>
                    <h3>District</h3>
                    <SelectInput
                        keySelector={adminLevelKeySelector}
                        labelSelector={adminLevelLabelSelector}
                        options={districts}
                        onChange={this.handleDistrictSelect}
                    />
                </div>
                <div className={styles.subtype}>
                    <h3>Municipality</h3>
                    <SelectInput
                        labelSelector={adminLevelLabelSelector}
                        keySelector={adminLevelKeySelector}
                        options={municipalities}
                        onChange={this.handleMunicipalitySelect}
                    />
                </div>
                */}
            </div>
            <div className={styles.disclaimer}>
                <h3>Disclaimer</h3>
                <div className={styles.content}>
                    <p>
                        This portal is hosted by National
                        Emergency Operation Centre (NEOC) solely for information
                        purpose only. NEOC disclaims any liability for errors,
                        accuracy of information or suitability of purposes. It
                        makes no warranties, expressed or implied and fitness
                        for particular purposes as to the quality, content,
                        accuracy or completeness of the information or other
                        times contained on the portal. Materials are subject to
                        change without notice. In no event will the NEOC be
                        liable for any loss arising from the use of the
                        information from any of the modules. The boundaries,
                        colors, denominations, and other information shown on
                        any map do not imply any judgment or endorsement on the
                        part of the NEOC or any providers of data, concerning
                        the delimitation or the legal status of any territory
                        or boundaries.In no event will the NEOC be liable for
                        any form of damage arising from the application or
                        misapplication of any maps or materials.
                    </p>
                    <p>
                        The   administration   team   periodically   adds
                        changes,improves,or updates the Materials on
                        this Site without notice.
                    </p>
                    <p>
                        This portal also contains link to
                        third-party websites. The linked sites are not underthe
                        control of the NEOC and it is not responsible for the
                        contents of any linked siteor any link contained in a
                        linked site. These links are provided only as
                        aconvenience, and the inclusion of a link does not
                        imply endorsement of the linkedsite by NEOC. Original
                        datasets are licensed under their original terms, which
                        arecontained in the associated layer metadata.
                    </p>
                </div>
            </div>
        </Fragment>
    );

    renderProvincePage = ({ onJump, provinces }) => (
        <Fragment>
            <Button
                onClick={() => onJump(0)}
            >
                Back
            </Button>
            <div>Province</div>
        </Fragment>
    )

    renderDistrictPage = ({ onJump, districts }) => (
        <Fragment>
            <Button
                onClick={() => onJump(0)}
            >
                Back
            </Button>
            <div>District</div>
        </Fragment>
    )

    renderMunicipalityPage = ({ onJump, municipalities }) => (
        <Fragment>
            <Button
                onClick={() => onJump(0)}
            >
                Back
            </Button>
            <div>Municipality</div>
        </Fragment>
    )

    render() {
        const {
            provinces,
            districts,
            municipalities,
        } = this.props;

        const FirstPage = this.renderFirstPage;
        const SecondPage = this.renderProvincePage;
        const ThirdPage = this.renderDistrictPage;
        const FourthPage = this.renderMunicipalityPage;

        return (
            <Modal
                closeOnEscape
                // onClose={this.handleSplashScreenModalClose}
                className={styles.splashScreenModal}
            >
                <div className={styles.top}>
                    <h1>Welcome to BIPAD</h1>
                    <h2>Disaster Information Management System (DIMS)</h2>
                    <h3>Please select your area of interest:</h3>
                </div>
                <Wizard
                    className={styles.wizard}
                >
                    <FirstPage
                        onNationalLevelClick={this.handleNationalLevelClick}
                    />
                    <SecondPage
                        provinces={provinces}
                        onProvincialLevelClick={this.handleProvincialLevelClick}
                    />
                    <ThirdPage
                        districts={districts}
                        onDistrictLevelClick={this.handleDistrictLevelClick}
                    />
                    <FourthPage
                        municipalities={municipalities}
                        onMunicipalLevelClick={this.handleMunicipalLevelClick}
                    />
                </Wizard>
            </Modal>
        );
    }
}
