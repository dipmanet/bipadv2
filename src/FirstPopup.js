import React, { Fragment } from 'react';
import { caseInsensitiveSubmatch } from '@togglecorp/fujs';
import memoize from 'memoize-one';
import Button from '#rsca/Button';

import TextInput from '#rsci/TextInput';
import ListView from '#rscv/List/ListView';
import Wizard from '#rscv/Wizard';
import Modal from '#rscv/Modal';

import styles from './styles.scss';

const keySelector = item => item.id;

const Block = ({ onClick, children }) => (
    <button
        className={styles.subtype}
        type="button"
        onClick={onClick}
    >
        {children}
    </button>
);

const FirstPage = ({ onJump, onClick }) => (
    <Fragment>
        <h3>Please select your area of interest:</h3>
        <div className={styles.areaSelect}>
            <Block onClick={onClick}>
                National Level
            </Block>
            <Block onClick={() => onJump(1)}>
                Provincial Level
            </Block>
            <Block onClick={() => onJump(2)}>
                District Level
            </Block>
            <Block onClick={() => onJump(3)}>
                Municipal Level
            </Block>
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

class SelectionPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
        };
    }

    filter = memoize((data = [], searchText = '') => (
        data.filter(datum => caseInsensitiveSubmatch(datum.title, searchText))
    ))

    handleSearch = (value) => {
        this.setState({ filterText: value });
    }

    rendererParams = (key, data) => ({
        // FIXME: this onClick is bad
        onClick: () => this.props.onClick(key),
        children: data.title,
    });

    render() {
        const { onJump, title, data, onClick } = this.props;
        const { filterText } = this.state;

        return (
            <Fragment>
                <h3>Select one of the {title}</h3>
                <div>
                    <TextInput
                        label="Search"
                        onChange={this.handleSearch}
                        value={filterText}
                    />
                    <Button
                        onClick={() => onJump(0)}
                    >
                        Cancel
                    </Button>
                    <ListView
                        keySelector={keySelector}
                        data={this.filter(data, filterText)}
                        renderer={Block}
                        rendererParams={this.rendererParams}
                    />
                </div>
            </Fragment>
        );
    }
}

// eslint-disable-next-line react/no-multi-comp
export default class FirstPopup extends React.PureComponent {
    handleNationalLevelClick = () => {
        this.props.setRegion({
            region: {
                adminLevel: 1,
                geoarea: undefined,
            },
        });
        this.props.setInitialPopupShown({ value: false });
    }

    handleProvincialLevelClick = (id) => {
        this.props.setRegion({
            region: {
                adminLevel: 1,
                geoarea: id,
            },
        });
        this.props.setInitialPopupShown({ value: false });
    }

    handleDistrictLevelClick = (id) => {
        this.props.setRegion({
            region: {
                adminLevel: 2,
                geoarea: id,
            },
        });
        this.props.setInitialPopupShown({ value: false });
    }

    handleMunicipalLevelClick = (id) => {
        this.props.setRegion({
            region: {
                adminLevel: 3,
                geoarea: id,
            },
        });
        this.props.setInitialPopupShown({ value: false });
    }

    render() {
        const {
            provinces,
            districts,
            municipalities,
        } = this.props;

        return (
            <Modal
                closeOnEscape
                // onClose={this.handleSplashScreenModalClose}
                className={styles.splashScreenModal}
            >
                <div className={styles.top}>
                    <h1>Welcome to BIPAD</h1>
                    <h2>Disaster Information Management System (DIMS)</h2>
                </div>
                <Wizard
                    className={styles.wizard}
                >
                    <FirstPage
                        onClick={this.handleNationalLevelClick}
                    />
                    <SelectionPage
                        title="Province"
                        data={provinces}
                        onClick={this.handleProvincialLevelClick}
                    />
                    <SelectionPage
                        title="District"
                        data={districts}
                        onClick={this.handleDistrictLevelClick}
                    />
                    <SelectionPage
                        title="Municipality"
                        data={municipalities}
                        onClick={this.handleMunicipalLevelClick}
                    />
                </Wizard>
            </Modal>
        );
    }
}
