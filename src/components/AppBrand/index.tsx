import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import styles from './styles.scss';

interface Props {
    className?: string;
    regionName: string;
}

class AppBrand extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            regionName,
        } = this.props;

        return (
            <div className={_cs(className, styles.appBrand)}>
                <div className={styles.logo}>
                    <div className={styles.left} />
                    <div className={styles.right}>
                        <Translation>
                            {
                                t => (
                                    <h1 className={styles.title}>
                                        {t('BIPAD')}
                                    </h1>
                                )
                            }
                        </Translation>

                    </div>
                </div>
                <div className={styles.regionNameContainer}>
                    <h2
                        className={styles.regionName}
                        title={regionName}
                    >
                        { regionName }
                    </h2>
                </div>
            </div>
        );
    }
}

export default AppBrand;
