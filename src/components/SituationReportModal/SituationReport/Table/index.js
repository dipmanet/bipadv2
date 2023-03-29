/* eslint-disable max-len */
import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import PropTypes from 'prop-types';


import { languageSelector } from '#selectors';
import { AppState } from '#store/types';
import styles from './styles.scss';


const propTypes = {
    className: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array,
    // eslint-disable-next-line react/forbid-prop-types
    aggregatedStat: PropTypes.object,
};

const defaultProps = {
    className: undefined,
    data: [],
    aggregatedStat: {},
};
const mapStateToProps = state => ({
    language: languageSelector(state),
});

class SituationReportTable extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            className,
            data,
            hazardTypes,
            aggregatedStat,
            language: { language },
        } = this.props;
        return (
            <div className={_cs(className,
                styles.situationReportTable)}
            >
                <table
                    className={styles.table}
                    border="1"
                >
                    <Translation>
                        {
                            t => (
                                <thead>
                                    <tr>
                                        <th colSpan="3">{t('Disaster count')}</th>
                                        {data.map(hazardGroup => (
                                            language === 'en'
                                                ? (
                                                    <th>
                                                        {(hazardTypes[hazardGroup.key] || {}).title || ''}
                                                    </th>
                                                )
                                                : (
                                                    <th>
                                                        {(hazardTypes[hazardGroup.key] || {}).titleNe || ''}
                                                    </th>
                                                )
                                        ))}
                                        <th>{t('Total')}</th>
                                    </tr>
                                </thead>
                            )
                        }
                    </Translation>

                    <Translation>
                        {
                            t => (
                                <tbody>

                                    <tr>
                                        <td rowSpan="4">{t('People Loss')}</td>
                                        <td colSpan="2">{t('Death')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.peopleDeathCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.peopleDeathCount}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">{t('Injured')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.peopleInjuredCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.peopleInjuredCount}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">{t('Missing')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.peopleMissingCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.peopleMissingCount}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">{t('Affected')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.peopleAffectedCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.peopleAffectedCount}</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="3">{t('Family Loss')}</td>
                                        <td colSpan="2">{t('Affected')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.familyAffectedCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.familyAffectedCount}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">{t('Relocated')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.familyRelocatedCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.familyRelocatedCount}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">{t('Evacuated')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.familyEvacuatedCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.familyEvacuatedCount}</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="2">{t('Livestock Loss')}</td>
                                        <td colSpan="2">{t('Affected')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.livestockAffectedCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.livestockAffectedCount}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">{t('Destroyed')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.livestockDestroyedCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.livestockDestroyedCount}</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="8">{t('Infrastructure Loss')}</td>
                                        <td rowSpan="4">{t('Destroyed')}</td>
                                        <td>{t('House')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.infrastructureDestroyedHouseCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.infrastructureDestroyedHouseCount}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Bridge')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.infrastructureDestroyedBridgeCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.infrastructureDestroyedBridgeCount}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Road')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.infrastructureDestroyedRoadCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.infrastructureDestroyedRoadCount}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Electricity')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.infrastructureDestroyedElectricityCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.infrastructureDestroyedElectricityCount}</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="4">{t('Affected')}</td>
                                        <td>{t('House')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.infrastructureAffectedHouseCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.infrastructureAffectedHouseCount}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Bridge')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.infrastructureAffectedBridgeCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.infrastructureAffectedBridgeCount}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Road')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.infrastructureAffectedRoadCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.infrastructureAffectedRoadCount}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Electricity')}</td>
                                        {data.map(hazardGroup => (
                                            <td>
                                                {hazardGroup.infrastructureAffectedElectricityCount || 0}
                                            </td>
                                        ))}
                                        <td>{aggregatedStat.infrastructureAffectedElectricityCount}</td>
                                    </tr>
                                </tbody>
                            )
                        }
                    </Translation>

                </table>
            </div>
        );
    }
}
export default connect(mapStateToProps)(SituationReportTable);
