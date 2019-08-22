import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import Legend from '#rscz/Legend';

import {
    hazardTypesSelector,
} from '#selectors';

const propTypes = {
    className: PropTypes.string,
    hazardTypes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    filteredHazardTypes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: undefined,
    filteredHazardTypes: undefined,
};

const legendKeySelector = d => d.title;
const legendColorSelector = d => d.color;
const legendLabelSelector = d => d.title;

class HazardsLegend extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    render() {
        const {
            className,
            itemClassName,
            hazardTypes,
            filteredHazardTypes,
            ...otherProps
        } = this.props;

        const hazardItems = filteredHazardTypes || Object.values(hazardTypes);

        return (
            <Legend
                className={className}
                data={hazardItems}
                itemClassName={itemClassName}
                keySelector={legendKeySelector}
                labelSelector={legendLabelSelector}
                colorSelector={legendColorSelector}
                emptyComponent={null}
                {...otherProps}
            />
        );
    }
}

const mapStateToProps = state => ({
    hazardTypes: hazardTypesSelector(state),
});

export default connect(mapStateToProps)(HazardsLegend);
