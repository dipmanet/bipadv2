import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { FaramInputElement } from '@togglecorp/faram';
import { _cs, compareNumber } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import { hazardIcons } from '#resources/data';
import MultiListSelection from '#components/MultiListSelection';
import PageContext from '#components/PageContext';
import {
    hazardTypeListSelector,
    hazardTypesSelector,
    languageSelector,
} from '#selectors';

import styles from './styles.scss';

const propTypes = {
    hazardTypeList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};


const hazardTypeTitleSelector = d => d.description;
const hazardTypeKeySelector = d => d.id;
const hazardTypeIconSelector = d => d.icon || hazardIcons.unknown;
const hazardTypeOrderSelector = d => d.order;

// const compareHazard = (a, b) => compareString(
//     this.hazardTypeLabelSelector(a),
//     this.hazardTypeLabelSelector(b),
// );

const compareHazard = (a, b) => compareNumber(
    hazardTypeOrderSelector(a),
    hazardTypeOrderSelector(b),
);

class HazardSelectionInput extends React.PureComponent {
    static contextType = PageContext;

    static propTypes = propTypes;

    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.artificialInputValue = [];
        this.naturalInputValue = [];
    }

    hazardTypeLabelSelector = (d) => {
        const { language: { language } } = this.props;

        if (language === 'en') {
            return d.title;
        }
        return d.titleNe;
    };

    getGroupedHazardTypeValues = (hazardTypeValues = []) => {
        const { hazardTypes } = this.props;

        const groupedHazardTypes = {
            natural: [],
            artificial: [],
        };

        hazardTypeValues.forEach((hazardKey) => {
            const hazardType = hazardTypes[hazardKey];

            if (hazardType) {
                if (!groupedHazardTypes[hazardType.type]) {
                    console.warn('Unknown hazard type', hazardType.type);
                } else {
                    groupedHazardTypes[hazardType.type].push(hazardType.id);
                }
            }
        });

        return groupedHazardTypes;
    }

    getGroupedHazardTypes = (hazardList = []) => {
        const groupedHazardTypes = {
            natural: [],
            artificial: [],
        };

        // NOTE: sort hazards
        const sortedHazardList = [...hazardList].sort(compareHazard);
        sortedHazardList.forEach((hazard) => {
            if (!groupedHazardTypes[hazard.type]) {
                console.warn('Unknown hazard type', hazard.type);
            } else {
                groupedHazardTypes[hazard.type].push(hazard);
            }
        });

        return groupedHazardTypes;
    }

    handleNaturalInputChange = (inputValue) => {
        this.naturalInputValue = inputValue;
        this.handleInputChange();
    }

    handleArtificialInputChange = (inputValue) => {
        this.artificialInputValue = inputValue;
        this.handleInputChange();
    }

    handleInputChange = () => {
        const { onChange } = this.props;
        const newValue = [
            ...this.naturalInputValue,
            ...this.artificialInputValue,
        ];

        onChange(newValue);
    }

    render() {
        const { activeRouteDetails: { name: activePage } } = this.context;
        const {
            className,
            hazardTypeList,
            value,
        } = this.props;


        const dashboardHazadTypeList = hazardTypeList.filter(item => item.title === 'Flood'
            || item.title === 'Forest Fire'
            || item.title === 'Heavy Rainfall'
            || item.title === 'Environmental pollution'
            || item.title === 'Earthquake');

        let groupedHazardTypes;
        let groupedValues;


        if (activePage === 'dashboard') {
            groupedHazardTypes = this.getGroupedHazardTypes(dashboardHazadTypeList);
            groupedValues = this.getGroupedHazardTypeValues(value);
        } else {
            groupedHazardTypes = this.getGroupedHazardTypes(hazardTypeList);
            groupedValues = this.getGroupedHazardTypeValues(value);
        }
        const withoutFire = [...groupedHazardTypes.natural].filter(item => item.title !== 'Fire');

        return (
            <div className={_cs(className, styles.hazardSelectionInput)}>
                {activePage === 'dashboard' ? (
                    <Translation>
                        {
                            t => (
                                <MultiListSelection
                                    className={styles.naturalHazardSelectionInput}
                                    titleSelector={hazardTypeTitleSelector}
                                    keySelector={hazardTypeKeySelector}
                                    labelSelector={this.hazardTypeLabelSelector}
                                    iconSelector={hazardTypeIconSelector}
                                    label={t('Natural')}
                                    options={withoutFire}
                                    value={groupedValues.natural}
                                    onChange={this.handleNaturalInputChange}
                                />
                            )
                        }
                    </Translation>
                ) : (
                    <Translation>
                        {
                            t => (

                                <MultiListSelection
                                    className={styles.naturalHazardSelectionInput}
                                    titleSelector={hazardTypeTitleSelector}
                                    keySelector={hazardTypeKeySelector}
                                    labelSelector={this.hazardTypeLabelSelector}
                                    iconSelector={hazardTypeIconSelector}
                                    label={t('Natural')}
                                    options={groupedHazardTypes.natural}
                                    value={groupedValues.natural}
                                    onChange={this.handleNaturalInputChange}
                                />
                            )
                        }
                    </Translation>
                )

                }
                <Translation>
                    {
                        t => (
                            <MultiListSelection
                                className={styles.artificialHazardSelectionInput}
                                keySelector={hazardTypeKeySelector}
                                labelSelector={this.hazardTypeLabelSelector}
                                iconSelector={hazardTypeIconSelector}
                                label={t('Non-natural')}
                                options={groupedHazardTypes.artificial}
                                value={groupedValues.artificial}
                                onChange={this.handleArtificialInputChange}
                            />

                        )
                    }
                </Translation>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    hazardTypeList: hazardTypeListSelector(state),
    hazardTypes: hazardTypesSelector(state),
    language: languageSelector(state),
});

export default FaramInputElement(connect(
    mapStateToProps,
)(HazardSelectionInput));
