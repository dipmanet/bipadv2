import React from 'react';
import PropTypes from 'prop-types';

import groupIcon from '#resources/icons/group.svg';
import { _cs } from '@togglecorp/fujs';

import ResourceItem from '../ResourceItem';
import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

export default class Volunteer extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const {
            className,
            data,
        } = this.props;

        return (
            <ResourceItem
                className={_cs(className, styles.resource)}
                heading="Volunteers"
                data={data}
                icon={groupIcon}
            />
        );
    }
}

