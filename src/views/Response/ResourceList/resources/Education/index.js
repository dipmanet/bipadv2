import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';
import educationIcon from '#resources/icons/Education.svg';

import Resource from '../Resource';
import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

export default class Hospital extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const {
            className,
            data,
        } = this.props;

        return (
            <Resource
                className={_cs(className, styles.resource)}
                heading="Education"
                icon={educationIcon}
                data={data}
            />
        );
    }
}

