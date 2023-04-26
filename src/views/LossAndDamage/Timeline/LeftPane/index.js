import React from 'react';
import { _cs } from '@togglecorp/fujs';
import PropTypes from 'prop-types';

import LossDetails from '#components/LossDetails';
import Visualizations from './Visualizations';

import styles from './styles.scss';



const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: undefined,
};

const emptyList = [];

export default class LeftPane extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    render() {
        const {
            className,
            lossAndDamageList = emptyList,
            pending,
            rightPaneExpanded,
        } = this.props;

        return (
            <div className={_cs(styles.leftPane, className)}>
                <LossDetails
                    data={lossAndDamageList}
                    minDate={this.props.minDate}
                />
                { !pending && (
                    <Visualizations
                        lossAndDamageList={lossAndDamageList}
                    />
                ) }
            </div>
        );
    }
}
