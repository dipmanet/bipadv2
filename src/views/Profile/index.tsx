import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import AccentButton from '#rsca/Button/AccentButton';
import Icon from '#rscg/Icon';
import modalize from '#rscg/Modalize';
import Page from '#components/Page';
import DisasterProfile from './DisasterProfile';
import ProjectsProfile from './ProjectsProfile';
import Indicator from './Indicator';
import Contact from './Contact';
import Document from './Document';

import styles from './styles.scss';

type TabKeys = 'summary' | 'projectsProfile' | 'contact' | 'document';

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

    private handleDocumentButtonClick = () => {
        this.setState({ activeView: 'document' });
    }

    public render() {
        const { activeView } = this.state;

        return (
            <Page
                leftContentContainerClassName={styles.leftContentContainer}
                hideHazardFilter
                hideDataRangeFilter
                leftContent={(
                    <>
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
                                        <Translation>
                                            {
                                                t => (
                                                    <div className={styles.text}>
                                                        {t('Summary')}
                                                    </div>
                                                )
                                            }
                                        </Translation>

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
                                    <Translation>
                                        {
                                            t => (
                                                <div className={styles.text}>
                                                    {t('Projects')}
                                                </div>
                                            )
                                        }
                                    </Translation>

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
                                        <Translation>
                                            {
                                                t => (
                                                    <div className={styles.text}>
                                                        {t('Contacts')}
                                                    </div>
                                                )
                                            }
                                        </Translation>

                                    </div>
                                </div>
                                <div
                                    className={_cs(styles.tab, activeView === 'document' && styles.active)}
                                    onClick={this.handleDocumentButtonClick}
                                    role="presentation"
                                >
                                    <Icon
                                        className={styles.visualizationIcon}
                                        name="document"
                                    />
                                    <div className={styles.title}>
                                        <div className={_cs(styles.icon, styles.incidentIcon)} />
                                        <Translation>
                                            {
                                                t => (
                                                    <div className={styles.text}>
                                                        {t('Document')}
                                                    </div>
                                                )
                                            }
                                        </Translation>

                                    </div>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <Translation>
                                    {
                                        t => (
                                            <IndicatorButton
                                                transparent
                                                modal={(
                                                    <Indicator />
                                                )}
                                            >
                                                {t('Indicators')}
                                            </IndicatorButton>
                                        ) }
                                </Translation>

                            </div>
                        </header>
                        {activeView === 'summary' && (
                            <DisasterProfile
                                className={styles.view}
                            />
                        )}
                        {activeView === 'projectsProfile' && (
                            <ProjectsProfile
                                className={styles.view}
                            />
                        )}
                        {activeView === 'contact' && (
                            <Contact
                                className={styles.view}
                            />
                        )}
                        {activeView === 'document' && (
                            <Document
                                className={styles.view}
                            />
                        )}
                    </>
                )}
            />
        );
    }
}
