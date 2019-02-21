import React from 'react';
import PropTypes from 'prop-types';

import Page from '#components/Page';

const propTypes = {
};

const defaultProps = {
};

export default class Incidents extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const {
            incidentId,
        } = this.props;

        return (
            <Page
                leftContent={
                    <div>
                        Response
                    </div>
                }
            />
        );
    }
}
