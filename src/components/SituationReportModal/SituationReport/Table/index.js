import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';

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

export default class SituationReportTable extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            className,
            data,
            hazardTypes,
            aggregatedStat,
        } = this.props;

        return (
            <div className={_cs(className, styles.situationReportTable)}>
                <table
                    className={styles.table}
                    border="1"
                >
                    <thead>
                        <tr>
                            <th colSpan="3">Disaster count</th>
                            {data.map(hazardGroup => (
                                <th>
                                    {(hazardTypes[hazardGroup.key] || {}).title || ''}
                                </th>
                            ))}
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowSpan="4">People Loss</td>
                            <td colSpan="2">Death</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.peopleDeathCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.peopleDeathCount}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Injured</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.peopleInjuredCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.peopleInjuredCount}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Missing</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.peopleMissingCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.peopleMissingCount}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Affected</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.peopleAffectedCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.peopleAffectedCount}</td>
                        </tr>
                        <tr>
                            <td rowSpan="3">Family Loss</td>
                            <td colSpan="2">Affected</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.familyAffectedCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.familyAffectedCount}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Relocated</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.familyRelocatedCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.familyRelocatedCount}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Evacuated</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.familyEvacuatedCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.familyEvacuatedCount}</td>
                        </tr>
                        <tr>
                            <td rowSpan="2">Livestock Loss</td>
                            <td colSpan="2">Affected</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.livestockAffectedCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.livestockAffectedCount}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Destroyed</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.livestockDestroyedCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.livestockDestroyedCount}</td>
                        </tr>
                        <tr>
                            <td rowSpan="8">Infrastructure Loss</td>
                            <td rowSpan="4">Destroyed</td>
                            <td>House</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.infrastructureDestroyedHouseCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.infrastructureDestroyedHouseCount}</td>
                        </tr>
                        <tr>
                            <td>Bridge</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.infrastructureDestroyedBridgeCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.infrastructureDestroyedBridgeCount}</td>
                        </tr>
                        <tr>
                            <td>Road</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.infrastructureDestroyedRoadCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.infrastructureDestroyedRoadCount}</td>
                        </tr>
                        <tr>
                            <td>Electricity</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.infrastructureDestroyedElectricityCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.infrastructureDestroyedElectricityCount}</td>
                        </tr>
                        <tr>
                            <td rowSpan="4">Affected</td>
                            <td>House</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.infrastructureAffectedHouseCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.infrastructureAffectedHouseCount}</td>
                        </tr>
                        <tr>
                            <td>Bridge</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.infrastructureAffectedBridgeCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.infrastructureAffectedBridgeCount}</td>
                        </tr>
                        <tr>
                            <td>Road</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.infrastructureAffectedRoadCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.infrastructureAffectedRoadCount}</td>
                        </tr>
                        <tr>
                            <td>Electricity</td>
                            {data.map(hazardGroup => (
                                <td>
                                    {hazardGroup.infrastructureAffectedElectricityCount || 0}
                                </td>
                            ))}
                            <td>{aggregatedStat.infrastructureAffectedElectricityCount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
