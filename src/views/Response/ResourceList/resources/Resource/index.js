import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';
import ListView from '#rscv/List/ListView';
import DistanceOutput from '#components/DistanceOutput';

import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const ResourceElement = (d) => {
    const {
        className,
        title,
        distance,
    } = d;

    return (
        <div className={_cs(styles.resource, className)}>
            <div className={styles.title}>
                { title }
            </div>
            <DistanceOutput
                value={distance}
            />
        </div>
    );
};

export default class Resource extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

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
                    keySelector={d => d.pk}
                />
            </div>
        );
    }
}
