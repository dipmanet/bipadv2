import React from 'react';

import Page from '#components/Page';
import CommonMap from '#components/CommonMap';

import LeftPane from './LeftPane';
import Filter from './Filter';

import styles from './styles.scss';

export default class RiskInfo extends React.PureComponent {
    render() {
        const { className } = this.props;
        return (
            <Page
                className={styles.riskInfo}
                leftContentClassName={styles.left}
                leftContent={<LeftPane />}
                rightContentClassName={styles.right}
                rightContent={<Filter />}
                mainContent={
                    <CommonMap />
                }
            />
        );
    }
}
