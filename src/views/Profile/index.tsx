import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';

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
import {
    userSelector,

    carKeysSelector,
} from '#selectors';

import {
    setCarKeysAction,
} from '#actionCreators';

const mapStateToProps = (state: AppState): PropsFromState => ({
    carKeys: carKeysSelector(state),
});

type TabKeys = 'summary' | 'projectsProfile' | 'contact' | 'document';

interface Props {
}

interface State {
    activeView: TabKeys;
}

const IndicatorButton = modalize(AccentButton);

class Profile extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeView: 'summary',
        };
    }

    public componentDidMount() {
        if (this.props.carKeys && this.props.carKeys === 'contact');
        this.setState({ activeView: 'contact' });
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
                                        <div className={styles.text}>
                                            Document
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
export default connect(mapStateToProps, undefined)(Profile);
