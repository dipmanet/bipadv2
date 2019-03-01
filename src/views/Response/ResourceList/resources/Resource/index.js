import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';
import ListView from '#rscv/List/ListView';
import DistanceOutput from '#components/DistanceOutput';

import ResourceElement from './ResourceItem';
import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

export default class Resource extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    static keySelector = d => d.title;

    getResourceElementRendererParams = (_, d) => d

    render() {
        const {
            heading,
            data,
            className,
            icon,
        } = this.props;

        return (
            <div className={_cs(className, styles.resources)}>
                <div className={styles.header}>
                    <img
                        className={styles.icon}
                        src={icon}
                        alt={heading}
                    />
                    <h2 className={styles.heading}>
                        {heading}
                    </h2>
                </div>
                <ListView
                    className={styles.content}
                    data={data}
                    renderer={ResourceElement}
                    rendererParams={this.getResourceElementRendererParams}
                    keySelector={Resource.keySelector}
                />
            </div>
        );
    }
}
