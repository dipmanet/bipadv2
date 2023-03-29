import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import {
    _cs,
    compareDate,
} from '@togglecorp/fujs';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';


import {
    patchIncidentActionIP,
    setIncidentActionIP,
} from '#actionCreators';
import Cloak from '#components/Cloak';
import DateRangeInfo from '#components/DateRangeInfo';
import LossDetails from '#components/LossDetails';
import Button from '#rsca/Button';
import AccentButton from '#rsca/Button/AccentButton';
import Icon from '#rscg/Icon';
import modalize from '#rscg/Modalize';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import {
    hazardTypesSelector, languageSelector,
} from '#selectors';
import { convertDateAccToLanguage } from '#utils/common';
import { calculateCategorizedSeverity, calculateSeverity, severityScaleFactor } from '#utils/domain';
import {
    pastDaysToDateRange,
} from '#utils/transformations';
import styles from './styles.scss';
import Visualizations from './Visualizations';
import IncidentTable from './TabularView';
import IncidentListView from './ListView';
import AddIncidentForm from './AddIncidentForm';

const AccentModalButton = modalize(AccentButton);
const ModalButton = modalize(Button);

const IncidentTableModal = ({
    closeModal,
    incidentList,
}) => (
    <Translation>
        {
            t => (
                <Modal className={styles.incidentTableModal}>
                    <ModalHeader
                        title={t('Incidents')}
                        rightComponent={(
                            <Button
                                iconName="close"
                                onClick={closeModal}
                                transparent
                            />
                        )}
                    />
                    <ModalBody className={styles.body}>
                        <IncidentTable
                            className={styles.table}
                            incidentList={incidentList}
                        />
                    </ModalBody>
                </Modal>
            )
        }
    </Translation>

);

const propTypes = {
    className: PropTypes.string,
    hazardTypes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    incidentList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    setIncident: PropTypes.func.isRequired,
    patchIncident: PropTypes.func.isRequired,
    onIncidentHover: PropTypes.func.isRequired,
    recentDay: PropTypes.number.isRequired,
    hoveredIncidentId: PropTypes.number,
    dateRange: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: undefined,
    hoveredIncidentId: undefined,
    dateRange: undefined,
};

const mapDispatchToProps = dispatch => ({
    patchIncident: params => dispatch(patchIncidentActionIP(params)),
    setIncident: params => dispatch(setIncidentActionIP(params)),
});

class LeftPane extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showVisualizations: false,
            lossServerId: undefined,
            incidentServerId: undefined,
            activeView: 'incidents',
        };
    }

    getMappedIncidentList = memoize((incidentList) => {
        const newIncidentList = incidentList.map(incident => ({
            ...incident,
            severity: calculateCategorizedSeverity(
                calculateSeverity(incident.loss, severityScaleFactor),
            ),
        })).sort((a, b) => compareDate(b.incidentOn, a.incidentOn));

        return newIncidentList;
    });

    handleToggleVisualizationButtonClick = () => {
        const { showVisualizations } = this.state;

        this.setState({
            showVisualizations: !showVisualizations,
        });
    }

    handleIncidentEdit = (incident) => {
        const { setIncident } = this.props;

        setIncident({ incident });
        this.setState({
            incidentServerId: incident.id,
        });
    }

    handleLossEdit = (loss, incident) => {
        const { patchIncident } = this.props;

        patchIncident({
            incident: {
                loss,
            },
            incidentId: incident.id,
        });

        this.setState({
            lossServerId: loss.id,
        });
    }

    handleIncidentsButtonClick = () => {
        this.setState({ activeView: 'incidents' });
    }

    handleVisualizationsButtonClick = () => {
        this.setState({ activeView: 'visualizations' });
    }

    render() {
        const {
            className,
            incidentList: incidentListFromProps,
            hazardTypes,
            recentDay,
            onIncidentHover,
            hoveredIncidentId,
            dateRange,
            language: { language },
        } = this.props;

        const {
            lossServerId,
            incidentServerId,
            activeView,
        } = this.state;

        const incidentList = this.getMappedIncidentList(incidentListFromProps);
        const { rangeInDays } = dateRange;
        let startDate;
        let endDate;
        if (rangeInDays !== 'custom') {
            ({ startDate, endDate } = pastDaysToDateRange(rangeInDays));
        } else {
            ({ startDate, endDate } = dateRange);
        }

        return (
            <div className={_cs(className, styles.leftPane)}>
                <DateRangeInfo
                    className={styles.dateRange}
                    startDate={convertDateAccToLanguage(startDate, language)}
                    endDate={convertDateAccToLanguage(endDate, language)}
                />
                <div className={styles.sourceDetails}>
                    <div className={styles.infoIconContainer}>
                        <Icon
                            className={styles.infoIcon}
                            name="info"
                        />
                    </div>
                    <div className={styles.label}>
                        <Translation>
                            {
                                t => <span>{t('Data sources')}</span>
                            }
                        </Translation>
                        :
                    </div>
                    <div className={styles.value}>
                        <div className={styles.source}>
                            <Translation>
                                {
                                    t => <span>{t('Nepal Police')}</span>
                                }
                            </Translation>

                        </div>
                        <div className={styles.source}>
                            <div className={styles.text}>
                                <Translation>
                                    {
                                        t => <span>{t('DRR Portal')}</span>
                                    }
                                </Translation>

                            </div>
                            <a
                                className={styles.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                href="http://drrportal.gov.np"
                            >
                                <Icon
                                    name="externalLink"
                                />
                            </a>
                        </div>
                    </div>
                </div>
                <LossDetails
                    className={styles.lossDetails}
                    data={incidentList}
                    hideIncidentCount
                />
                <header className={styles.header}>
                    <div className={styles.tabs}>
                        <div
                            className={_cs(styles.tab, activeView === 'incidents' && styles.active)}
                            onClick={this.handleIncidentsButtonClick}
                            role="presentation"
                        >
                            <div className={styles.value}>
                                {incidentList.length}
                            </div>
                            <div className={styles.title}>
                                <div className={_cs(styles.icon, styles.incidentIcon)} />
                                <div className={styles.text}>
                                    <Translation>
                                        {
                                            t => <span>{t('Incidents')}</span>
                                        }
                                    </Translation>

                                </div>
                            </div>
                        </div>
                        <div
                            className={_cs(styles.tab, activeView === 'visualizations' && styles.active)}
                            role="presentation"
                            onClick={this.handleVisualizationsButtonClick}
                        >
                            <Icon
                                className={styles.visualizationIcon}
                                name="bars"
                            />
                            <div className={styles.text}>
                                <Translation>
                                    {
                                        t => <span>{t('Visualizations')}</span>
                                    }
                                </Translation>
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <Cloak hiddenIf={p => !p.add_incident}>
                            <AccentModalButton
                                className={styles.addIncidentButton}
                                iconName="add"
                                title="Add new incident"
                                transparent
                                modal={(
                                    <AddIncidentForm
                                        lossServerId={lossServerId}
                                        incidentServerId={incidentServerId}
                                        onIncidentChange={this.handleIncidentEdit}
                                        onLossChange={this.handleLossEdit}
                                    />
                                )}
                            >
                                <Translation>
                                    {
                                        t => <span>{t('New incident')}</span>
                                    }
                                </Translation>

                            </AccentModalButton>
                        </Cloak>
                        <ModalButton
                            title="Show data in tabular format"
                            className={styles.showTableButton}
                            iconName="table"
                            transparent
                            modal={(
                                <IncidentTableModal
                                    incidentList={incidentList}
                                />
                            )}
                        />
                    </div>
                </header>
                {activeView === 'incidents' && (
                    <IncidentListView
                        onIncidentHover={onIncidentHover}
                        hoveredIncidentId={hoveredIncidentId}
                        hazardTypes={hazardTypes}
                        className={styles.content}
                        incidentList={incidentList}
                        recentDay={recentDay}
                    />
                )}
                {activeView === 'visualizations' && (
                    <Visualizations
                        className={styles.content}
                        incidentList={incidentList}
                        hazardTypes={hazardTypes}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    hazardTypes: hazardTypesSelector(state),
    language: languageSelector(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftPane);
