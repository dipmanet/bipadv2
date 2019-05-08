import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

export default class About extends React.PureComponent {
    render() {
        const { className } = this.props;

        return (
            <div className={_cs(styles.about, className)}>
                About
            </div>
        );
    }
}
