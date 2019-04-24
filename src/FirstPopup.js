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
    <div className={styles.firstPage}>
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
    </div>
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
            <div className={styles.selectionPage}>
                <header className={styles.selectionPageHeader}>
                    <h3>Select one of the {title}</h3>
                    <div className={styles.bottomContainer}>
                        <TextInput
                            className={styles.searchInput}
                            label="Search"
                            onChange={this.handleSearch}
                            value={filterText}
                        />
                        <Button
                            className={styles.button}
                            onClick={() => onJump(0)}
                        >
                            Cancel
                        </Button>
                    </div>
                </header>
                <ListView
                    className={styles.selectionPageList}
                    keySelector={keySelector}
                    data={this.filter(data, filterText)}
                    renderer={Block}
                    rendererParams={this.rendererParams}
                />
            </div>
        );
    }
}

// eslint-disable-next-line react/no-multi-comp
export default class FirstPopup extends React.PureComponent {
    handleNationalLevelClick = () => {
        this.props.setRegion({
            region: {
                adminLevel: undefined,
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
