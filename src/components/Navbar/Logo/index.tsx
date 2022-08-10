import React from 'react';
import { Router } from '@reach/router';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import { routeSettings, iconNames } from '#constants';
import RegionOutput from '#components/RegionOutput';

import styles from './styles.scss';

interface Props {
    className?: string;
}

interface State {
}

const Title = ({ title }: {
    title: string;
}) => (
    <div className={styles.pageTitle}>
        {title}
    </div>
);

const titles = routeSettings.map(props => (
    <Title
        key={props.name}
        {...props}
    />
));


export default class Logo extends React.PureComponent<Props, State> {
    public render() {
        const {
            className,
        } = this.props;

        return (
            <div className={_cs(styles.logo, className)}>
                <div className={styles.brandName}>
                    <div className={styles.left} />
                    <Translation>
                        {
                            t => (
                                <div className={styles.right}>
                                    {t('Bipad')}
                                </div>
                            )
                        }
                    </Translation>

                </div>
                <RegionOutput
                    className={styles.region}
                />
                <Router className={styles.currentPage}>
                    {titles}
                </Router>
            </div>
        );
    }
}
