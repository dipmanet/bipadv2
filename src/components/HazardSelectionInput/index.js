import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { FaramInputElement } from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

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
    // iconSelector: PropTypes.func,
    // keySelector: PropTypes.func,
    // labelSelector: PropTypes.func,
    // options: PropTypes.array,
    // showLabel: PropTypes.bool,
    // value: PropTypes.array,
};

const defaultProps = {
    labelSelector: d => d.label,
    keySelector: d => d.key,
    iconSelector: d => d.icon,
    showLabel: true,
    options: [],
    value: [],
    className: '',
};

const hazardTypeLabelSelector = d => d.title;
const hazardTypeKeySelector = d => d.id;
const hazardTypeIconSelector = d => hazardIcons[d.id];

class HazardSelectionInput extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.artificialInputValue = [];
        this.naturalInputValue = [];
    }

    getGroupedHazardTypeValues = (hazardTypeValues) => {
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

    getGroupedHazardTypes = (hazardList) => {
        const groupedHazardTypes = {
            natural: [],
            artificial: [],
        };

        hazardList.forEach((hazard, i) => {
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
                    keySelector={hazardTypeKeySelector}
                    labelSelector={hazardTypeLabelSelector}
                    iconSelector={hazardTypeIconSelector}
                    label="Natural hazards"
                    options={groupedHazardTypes.natural}
                    value={groupedValues.natural}
                    onChange={this.handleNaturalInputChange}
                />
                <MultiListSelection
                    className={styles.artificialHazardSelectionInput}
                    keySelector={hazardTypeKeySelector}
                    labelSelector={hazardTypeLabelSelector}
                    iconSelector={hazardTypeIconSelector}
                    label="Artificial hazards"
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
