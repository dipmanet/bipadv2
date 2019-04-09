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
                mainContentClassName={styles.main}
                mainContent={
                    <iframe
                        title="Risk information"
                        src="http://139.59.67.104:8004/risk_profile/mappage"
                    />
                }
            />
        );
    }
}
