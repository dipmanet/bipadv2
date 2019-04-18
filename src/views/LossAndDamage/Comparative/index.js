import PropTypes from 'prop-types';
import React from 'react';

import Map from '../Map';

const propTypes = {
};

const defaultProps = {
};

export default class Comparative extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            leftPaneExpanded: true,
            rightPaneExpanded: true,
        };
    }

    render() {
        const {
            className,
            mapping,
            geoareas,
            metricName,
            metric,
            maxValue,
            lossAndDamageList,
        } = this.props;

        const {
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.state;

        return (
            <Map
                lossAndDamageList={lossAndDamageList}
                leftPaneExpanded={leftPaneExpanded}
                rightPaneExpanded={rightPaneExpanded}
                mapping={mapping}
                maxValue={maxValue}
                metric={metric}
                metricName={metricName}
                geoareas={geoareas}
            />
        );
    }
}
