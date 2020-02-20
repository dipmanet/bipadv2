import React from 'react';
import { _cs } from '@togglecorp/fujs';

import AccentButton from '#rsca/Button/AccentButton';
import Icon from '#rscg/Icon';
import modalize from '#rscg/Modalize';

import Page from '#components/Page';
import DisasterProfile from './DisasterProfile';
import ProjectsProfile from './ProjectsProfile';
import Indicator from './Indicator';
import Contact from './Contact';

import styles from './styles.scss';

type TabKeys = 'summary' | 'projectsProfile' | 'contact';

interface Props {
}

interface State {
    activeView: TabKeys;
}

const IndicatorButton = modalize(AccentButton);

export default class Profile extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeView: 'summary',
        };
    }

    private handleSummaryButtonClick = () => {
        this.setState({ activeView: 'summary' });
    }

    private handleProjectButtonClick = () => {
        this.setState({ activeView: 'projectsProfile' });
    }

    private handleContactButtonClick = () => {
        this.setState({ activeView: 'contact' });
    }

    public render() {
        const { activeView } = this.state;

        return (
            <Page
                leftContentContainerClassName={styles.leftContentContainer}
                leftContent={(
                    <div>
                        <header className={styles.header}>
                            <div className={styles.tabs}>
                                <div
                                    className={_cs(styles.tab, activeView === 'summary' && styles.active)}
                                    onClick={this.handleSummaryButtonClick}
                                    role="presentation"
                                >
                                    <Icon
                                        className={styles.visualizationIcon}
                                        name="bars"
                                    />
                                    <div className={styles.title}>
                                        <div className={_cs(styles.icon, styles.incidentIcon)} />
                                        <div className={styles.text}>
                                            Summary
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={_cs(styles.tab, activeView === 'projectsProfile' && styles.active)}
                                    role="presentation"
                                    onClick={this.handleProjectButtonClick}
                                >
                                    <Icon
                                        className={styles.visualizationIcon}
                                        name="briefcase"
                                    />
                                    <div className={styles.text}>
                                        Projects
                                    </div>
                                </div>
                                <div
                                    className={_cs(styles.tab, activeView === 'contact' && styles.active)}
                                    onClick={this.handleContactButtonClick}
                                    role="presentation"
                                >
                                    <Icon
                                        className={styles.visualizationIcon}
                                        name="contacts"
                                    />
                                    <div className={styles.title}>
                                        <div className={_cs(styles.icon, styles.incidentIcon)} />
                                        <div className={styles.text}>
                                            Contacts
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <IndicatorButton
                                    transparent
                                    modal={(
                                        <Indicator />
                                    )}
                                >
                                    Indicators
                                </IndicatorButton>
                            </div>
                        </header>
                        {activeView === 'summary' && (
                            <DisasterProfile
                                className={styles.profile}
                            />
                        )}
                        {activeView === 'projectsProfile' && (
                            <ProjectsProfile
                                className={styles.profile}
                            />
                        )}
                        {activeView === 'contact' && (
                            <Contact
                                className={styles.profile}
                            />
                        )}
                    </div>
                )}
            />
        );
    }
}

/*

                    <>
                        <ScrollTabs
                            className={_cs(styles.tabs)}
                            tabs={tabs}
                            useHash
                        >
                        </ScrollTabs>
                        <MultiViewContainer
                            views={this.views}
                            useHash
                        />
                    </>
*/
