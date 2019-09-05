import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;
}

interface State {
}


export default class CapacityAndResources extends React.PureComponent<Props, State> {
    public render() {
        const {
            className,
        } = this.props;

        return (
            <div className={_cs(styles.capacityAndResources, className)}>
                Capacity &amp; resources
            </div>
        );
    }
}
