import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

export default class PrivacyPolicy extends React.PureComponent {
    render() {
        const { className } = this.props;

        return (
            <div className={_cs(styles.about, className)}>
                Privacy Policy
            </div>
        );
    }
}
