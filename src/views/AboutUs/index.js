import React from 'react';
import { _cs } from '@togglecorp/fujs';

import MultiViewContainer from '#rscv/MultiViewContainer';
import FixedTabs from '#rscv/FixedTabs';

import Page from '#components/Page';

import About from './About';
import PrivacyPolicy from './PrivacyPolicy';
import Metadata from './Metadata';
import Disclaimer from './Disclaimer';
import Manual from './Manual';

import styles from './styles.scss';

export default class AboutUs extends React.PureComponent {
    constructor(props) {
        super(props);

        this.tabs = {
            about: 'About',
            privacyPolicy: 'Privacy policy',
            metadata: 'Metadata',
            disclaimer: 'Disclaimer',
            manual: 'Manual',
        };

        const rendererParams = () => ({ className: styles.content });

        this.views = {
            about: {
                component: About,
                rendererParams,
            },
            privacyPolicy: {
                component: PrivacyPolicy,
                rendererParams,
            },
            metadata: {
                component: Metadata,
                rendererParams,
            },
            disclaimer: {
                component: Disclaimer,
                rendererParams,
            },
            manual: {
                component: Manual,
                rendererParams,
            },
        };
    }

    render() {
        const { className } = this.props;

        return (
            <Page
                leftContent={null}
                mainContentClassName={_cs(styles.aboutUs, className)}
                hideMap
                mainContent={(
                    <div className={styles.content}>
                        <FixedTabs
                            className={styles.tabs}
                            tabs={this.tabs}
                            useHash
                            onHashChange={this.handleHashChange}
                        />
                        <MultiViewContainer
                            views={this.views}
                            useHash
                        />
                    </div>
                )}
            />
        );
    }
}
