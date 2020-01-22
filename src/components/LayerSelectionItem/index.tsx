import React from 'react';
import Switch from 'react-input-switch';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;
}

class LayerSelectionItem extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            onChange,
            value,
            title,
            shortDescription,
            longDescription,
        } = this.props;

        return (
            <div className={_cs(className, styles.layerSelectionItem)}>
                <div className={styles.header}>
                    <div className={styles.left}>
                        <Switch
                            on
                            off={false}
                            value
                        />
                    </div>
                    <div className={styles.right}>
                        { title }
                    </div>
                </div>
            </div>
        );
    }
}

export default LayerSelectionItem;
