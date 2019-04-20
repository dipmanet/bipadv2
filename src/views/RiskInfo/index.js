import React from 'react';

import Page from '#components/Page';

import styles from './styles.scss';

// eslint-disable-next-line react/prefer-stateless-function
export default class RiskInfo extends React.PureComponent {
    render() {
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
