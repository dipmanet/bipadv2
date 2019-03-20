import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

const propTypes = {
    start: PropTypes.number,
    end: PropTypes.number,
    progress: PropTypes.number,
};

const defaultProps = {
    start: 0,
    end: 0,
    progress: 0,
};


export default class Seekbar extends React.PureComponent {
    render() {
        const {
            className,
            progress: progressFromProps,
            start: startFromProps,
            end: endFromProps,
        } = this.props;

        // const progress = Math.min(100, Math.max(0, progressFromProps));
        const start = Math.min(100, Math.max(0, startFromProps));
        const end = Math.min(100, Math.max(0, endFromProps));

        return (
            <div className={_cs(className, styles.seekbar)}>
                <div
                    style={{
                        left: `${start}%`,
                        width: `${end - start}%`,
                        // width: `${progress}%`,
                    }}
                    className={styles.progress}
                />
            </div>
        );
    }
}
