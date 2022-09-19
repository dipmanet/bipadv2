import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';

import { Translation } from 'react-i18next';

import Message from '#rscv/Message';
import VirtualizedListView from '#rscv/VirtualizedListView';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import modalize from '#rscg/Modalize';

import Icon from '#rscg/Icon';
import AccentButton from '#rsca/Button/AccentButton';
import Button from '#rsca/Button';
import DangerButton from '#rsca/Button/DangerButton';

import { getHazardColor } from '#utils/domain';
import { groupList, convertDateAccToLanguage } from '#utils/common';
import Cloak from '#components/Cloak';
import DateRangeInfo from '#components/DateRangeInfo';

import EventItem from './EventItem';
import AlertItem from './AlertItem';
import Visualizations from './Visualizations';
import AddAlertForm from './AddAlertForm';
import AddEventForm from './AddEventForm';
import AlertTable from './AlertTable';
import { languageSelector } from '#selectors';


import {
    pastDaysToDateRange,
} from '#utils/transformations';

import styles from './styles.scss';

const propTypes = {
    alertList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    eventList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    hazardTypes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
    dateRange: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    // language: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
const defaultProps = {
    alertList: [],
    eventList: [],
    hazardTypes: {},
    dateRange: undefined,
    className: undefined,
    // language: { language: 'en' },
};

const mapStateToProps = state => ({
    language: languageSelector(state),
});

const AlertTableModalButton = modalize(Button);

const alertKeySelector = d => d.id;
const eventKeySelector = d => d.id;

const AlertEmptyComponent = () => (
    <Translation>
        {
            t => (
                <div className={styles.alertEmpty}>
                    {t('There are no alerts at the moment.')}
                </div>
            )
        }
    </Translation>
);

const AlertTableEmptyComponent = () => (
    <Message>
        <AlertEmptyComponent />
    </Message>
);
const EventEmptyComponent = () => (
    <div className={styles.eventEmpty}>
        <Translation>
            {
                t => <span>{t('There are no major events at the moment.')}</span>
            }
        </Translation>
    </div>
);


const AlertTableModal = ({
    closeModal,
    alertList,
    language,
}) => (
    <Modal className={_cs(styles.alertTableModal,
        language === 'np' && styles.languageFont)}
    >
        <Translation>
            {
                t => (
                    <ModalHeader
                        title={t('Alerts')}
                        rightComponent={(
                            <DangerButton
                                transparent
                                iconName="close"
                                onClick={closeModal}
                                title="Close Modal"
                            />
                        )}
                    />
                )
            }
        </Translation>

        <ModalBody className={styles.body}>
            <AlertTable
                className={styles.table}
                alertList={alertList}
                emptyComponent={AlertTableEmptyComponent}
            />
        </ModalBody>
    </Modal>
);

// const mapStateToProps = state => ({
//     language: languageSelector(state),
// });
// const mapDispatchToProps = dispatch => ({
//     setLanguage: params => dispatch(setLanguageAction(params)),
// });


class LeftPane extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showAddAlertModal: false,
            showAddEventModal: false,
            activeView: 'alerts',
        };
    }

    getAlertRendererParams = (_, d) => ({
        alert: d,
        hazardTypes: this.props.hazardTypes,
        recentDay: this.props.recentDay,
        onEditButtonClick: this.handleAlertEditButtonClick,
        onDeleteButtonClick: this.props.onDeleteAlertButtonClick,
        onHover: this.props.onAlertHover,
        isHovered: this.props.hoveredAlertId === d.id,
        className: styles.alertItem,
    });

    getEventRendererParams = (_, d) => ({
        event: d,
        hazardTypes: this.props.hazardTypes,
        onEditButtonClick: this.handleEventEditButtonClick,
        onDeleteButtonClick: this.props.onDeleteEventButtonClick,
        onHover: this.props.onEventHover,
        isHovered: this.props.hoveredEventId === d.id,
        className: styles.eventItem,
    });

    groupByHazard = memoize((alerts, hazards) => {
        const freqList = groupList(
            alerts,
            alert => alert.hazard,
        );

        const alertFreq = freqList.map(item => ({
            label: (hazards[item.key] || {}).title,
            value: item.value.length,
        }));

        const alertColor = freqList.map(item => getHazardColor(hazards, item.key));

        return {
            alertFreq,
            alertColor,
        };
    });

    handleAlertEditButtonClick = (alert) => {
        this.setState({
            showAddAlertModal: true,
            alertToEdit: alert,
        });
    }

    handleAddAlertButtonClick = () => {
        this.setState({
            showAddAlertModal: true,
            alertToEdit: undefined,
        });
    }

    handleAddAlertModalCloseButtonClick = () => {
        this.setState({
            showAddAlertModal: false,
            alertToEdit: undefined,
        });
    }

    handleAlertFormRequestSuccess = (response) => {
        this.setState({
            showAddAlertModal: false,
            alertToEdit: undefined,
        });

        const { onAlertChange } = this.props;
        onAlertChange(response);
    }

    handleEventEditButtonClick = (event) => {
        this.setState({
            showAddEventModal: true,
            eventToEdit: event,
        });
    }

    handleAddEventButtonClick = () => {
        this.setState({
            showAddEventModal: true,
            eventToEdit: undefined,
        });
    }

    handleAddEventModalCloseButtonClick = () => {
        this.setState({
            showAddEventModal: false,
            eventToEdit: undefined,
        });
    }

    handleEventFormRequestSuccess = (response) => {
        this.setState({
            showAddEventModal: false,
            eventToEdit: undefined,
        });

        const { onEventChange } = this.props;
        onEventChange(response);
    }

    handleAlertsButtonClick = () => {
        this.setState({ activeView: 'alerts' });
    }

    handleEventsButtonClick = () => {
        this.setState({ activeView: 'events' });
    }

    handleVisualizationsButtonClick = () => {
        this.setState({ activeView: 'visualizations' });
    }

    render() {
        const {
            className,
            alertList,
            eventList,
            hazardTypes,
            dateRange,
            language: { language },
        } = this.props;
        const {
            showAddAlertModal,
            showAddEventModal,
            alertToEdit,
            eventToEdit,
            activeView,
        } = this.state;

        const { rangeInDays } = dateRange;
        let startDate;
        let endDate;
        if (rangeInDays !== 'custom') {
            ({ startDate, endDate } = pastDaysToDateRange(rangeInDays, language));
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


                <div className={_cs(styles.sourceDetails, 'source-tour')}>


                    <div className={styles.infoIconContainer}>
                        <Icon
                            className={styles.infoIcon}
                            name="info"
                        />
                    </div>
                    <div className={styles.label}>
                        <Translation>
                            {
                                t => <span>{t('Data source')}</span>
                            }
                        </Translation>
                    </div>
                    <div className={styles.value}>
                        <div className={styles.source}>
                            <div className={styles.text}>
                                <Translation>
                                    {
                                        t => <span>{t('Realtime Module')}</span>
                                    }
                                </Translation>

                            </div>
                            {/* <a
                                className={styles.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                href="http://drrportal.gov.np"
                            >
                                <Icon
                                    name="externalLink"
                                />
                            </a> */}
                        </div>
                    </div>
                </div>
                <header className={styles.header}>
                    <div className={styles.tabs}>
                        <div
                            className={_cs(styles.tab, activeView === 'alerts' && styles.active, 'alert-tour')}
                            onClick={this.handleAlertsButtonClick}
                            role="presentation"
                        >
                            <div className={styles.value}>
                                {alertList.length}
                            </div>
                            <div className={styles.title}>
                                <div className={_cs(styles.icon, styles.alertIcon)} />
                                <div className={styles.text}>
                                    <Translation>
                                        {
                                            t => <span>{t('Alerts')}</span>
                                        }
                                    </Translation>
                                </div>
                            </div>
                        </div>
                        <div
                            className={_cs(styles.tab, activeView === 'events' && styles.active)}
                            onClick={this.handleEventsButtonClick}
                            role="presentation"
                        >
                            <div className={styles.value}>
                                {eventList.length}
                            </div>
                            <div className={styles.title}>
                                <div className={_cs(styles.icon, styles.eventIcon)} />
                                <div className={styles.text}>
                                    <Translation>
                                        {
                                            t => <span>{t('Events')}</span>
                                        }
                                    </Translation>
                                </div>
                            </div>
                        </div>
                        <div
                            className={_cs(styles.tab, activeView === 'visualizations' && styles.active, 'visualization-tour')}
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
                        {activeView === 'alerts' && (
                            <Cloak hiddenIf={p => !p.add_alert}>
                                <AccentButton
                                    className={styles.addAlertButton}
                                    onClick={this.handleAddAlertButtonClick}
                                    iconName="add"
                                    transparent
                                >
                                    <Translation>
                                        {
                                            t => <span>{t('New alert')}</span>
                                        }
                                    </Translation>

                                </AccentButton>
                            </Cloak>
                        )}
                        {activeView === 'events' && (
                            <Cloak hiddenIf={p => !p.add_event}>
                                <AccentButton
                                    className={styles.addEventButton}
                                    onClick={this.handleAddEventButtonClick}
                                    iconName="add"
                                    transparent
                                >
                                    <Translation>
                                        {
                                            t => <span>{t('New event')}</span>
                                        }
                                    </Translation>
                                </AccentButton>
                            </Cloak>
                        )}
                        <AlertTableModalButton
                            title="Show data in tabular format"
                            className={_cs(styles.showTableButton, 'tabular-data-tour')}
                            iconName="table"
                            transparent
                            modal={(
                                <AlertTableModal
                                    alertList={alertList}
                                    language={language}
                                />
                            )}
                        />
                    </div>
                </header>
                <div className={styles.content}>
                    {activeView === 'visualizations' && (
                        <Visualizations
                            hazardTypes={hazardTypes}
                            className={styles.alertVisualizations}
                            alertList={alertList}
                        />
                    )}
                    {activeView === 'alerts' && (
                        <div className={styles.alertList}>
                            <VirtualizedListView
                                className={styles.content}
                                data={alertList}
                                renderer={AlertItem}
                                rendererParams={this.getAlertRendererParams}
                                keySelector={alertKeySelector}
                                emptyComponent={AlertEmptyComponent}
                            />
                        </div>
                    )}
                    {activeView === 'events' && (
                        <div className={styles.eventList}>
                            <VirtualizedListView
                                className={styles.content}
                                data={eventList}
                                renderer={EventItem}
                                rendererParams={this.getEventRendererParams}
                                keySelector={eventKeySelector}
                                emptyComponent={EventEmptyComponent}
                            />
                        </div>
                    )}
                </div>
                {showAddAlertModal && (
                    <AddAlertForm
                        data={alertToEdit}
                        onCloseButtonClick={this.handleAddAlertModalCloseButtonClick}
                        onRequestSuccess={this.handleAlertFormRequestSuccess}
                    />
                )}
                {showAddEventModal && (
                    <AddEventForm
                        data={eventToEdit}
                        onCloseButtonClick={this.handleAddEventModalCloseButtonClick}
                        onRequestSuccess={this.handleEventFormRequestSuccess}
                    />
                )}
            </div>
        );
    }
}
export default connect(mapStateToProps)(LeftPane);
