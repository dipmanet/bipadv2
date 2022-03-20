import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Legend from '#rscz/Legend';

import {
    hazardTypesSelector, languageSelector,
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

// const legendLabelSelector = (d, language) => {
//     if (language && language.language === 'en') {
//         return d.titleEn;
//     }
//     if (language && language.language === 'np') {
//         return d.titleNe;
//     }
//     return d.title;
// };
const legendLabelSelector = d => d.title;
const legendColorSelector = d => d.color;
const legendKeySelector = d => d.title;

class HazardsLegend extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    render() {
        const {
            className,
            hazardTypes,
            filteredHazardTypes,
            language,
            ...otherProps
        } = this.props;

        const hazardItems = filteredHazardTypes || Object.values(hazardTypes);

        return (
            <Legend
                className={className}
                data={hazardItems}
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
    language: languageSelector(state),
});

export default connect(mapStateToProps)(HazardsLegend);
