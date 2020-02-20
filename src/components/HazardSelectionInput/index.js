import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { FaramInputElement } from '@togglecorp/faram';
import { _cs, compareString } from '@togglecorp/fujs';

import { hazardIcons } from '#resources/data';
import MultiListSelection from '#components/MultiListSelection';

import {
    hazardTypeListSelector,
    hazardTypesSelector,
} from '#selectors';

import styles from './styles.scss';

const propTypes = {
    hazardTypeList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

const hazardTypeLabelSelector = d => d.title;
const hazardTypeTitleSelector = d => d.description;
const hazardTypeKeySelector = d => d.id;
const hazardTypeIconSelector = d => d.icon || hazardIcons.unknown;

const compareHazard = (a, b) => compareString(
    hazardTypeLabelSelector(a),
    hazardTypeLabelSelector(b),
);

class HazardSelectionInput extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.artificialInputValue = [];
        this.naturalInputValue = [];
    }

    getGroupedHazardTypeValues = (hazardTypeValues = []) => {
        const { hazardTypes } = this.props;

        const groupedHazardTypes = {
            natural: [],
            artificial: [],
        };

        hazardTypeValues.forEach((hazardKey) => {
            const hazardType = hazardTypes[hazardKey];

            if (!groupedHazardTypes[hazardType.type]) {
                console.warn('Unknown hazard type', hazardType.type);
            } else {
                groupedHazardTypes[hazardType.type].push(hazardType.id);
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
        const {
            className,
            hazardTypeList,
            value,
        } = this.props;

        const groupedHazardTypes = this.getGroupedHazardTypes(hazardTypeList);
        const groupedValues = this.getGroupedHazardTypeValues(value);

        return (
            <div className={_cs(className, styles.hazardSelectionInput)}>
                <MultiListSelection
                    className={styles.naturalHazardSelectionInput}
                    titleSelector={hazardTypeTitleSelector}
                    keySelector={hazardTypeKeySelector}
                    labelSelector={hazardTypeLabelSelector}
                    iconSelector={hazardTypeIconSelector}
                    label="Natural"
                    options={groupedHazardTypes.natural}
                    value={groupedValues.natural}
                    onChange={this.handleNaturalInputChange}
                />
                <MultiListSelection
                    className={styles.artificialHazardSelectionInput}
                    keySelector={hazardTypeKeySelector}
                    labelSelector={hazardTypeLabelSelector}
                    iconSelector={hazardTypeIconSelector}
                    label="Non-natural"
                    options={groupedHazardTypes.artificial}
                    value={groupedValues.artificial}
                    onChange={this.handleArtificialInputChange}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    hazardTypeList: hazardTypeListSelector(state),
    hazardTypes: hazardTypesSelector(state),
});

export default FaramInputElement(connect(
    mapStateToProps,
)(HazardSelectionInput));
