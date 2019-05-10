import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

const metadataList = [
    {
        title: 'General',
        data: [
            ['Date of receipt', ''],
            ['Abstract', 'The incident reports data have been harvested from DRR portal. The initial data collection is conducted by Nepal Police. The data sent by Nepal police is then verified by NEOC and uoloaded in the DRR Portal. The data from DRR portal are connected through API.'],
            ['Purpose', 'To facilitate Disaster information, communication and response through BIPAD portal.'],
            ['Descriptive keyword', 'Incidents, Response'],
        ],
    },
    {
        title: 'Metadata record info',
        data: [
            ['Language', 'English'],
            ['Charset', 'UTF-8'],
            ['Hierarchy level', 'Ward level'],
            ['Date', ''],
            ['Standard name', ''],
        ],
    },
    {
        title: 'Contact',
        data: [
            ['Name', 'NEOC'],
            ['Organization name', 'National Emergency Operation Center'],
            ['Position name', ''],
            ['Role', ''],
            ['Email', 'neoc@moha.gov.np'],
        ],
    },
    {
        title: 'Indentification info',
        data: [
            ['Title', 'Incidents'],
            ['Date', ''],
            ['Date type', ''],
            ['Abstract', 'The incident reports data have been harvested from DRR portal. The initial data collection is conducted by Nepal Police. The data sent by Nepal police is then verified by NEOC and uoloaded in the DRR Portal. The data from DRR portal are connected through API.'],
            ['Purpose', 'To facilitate Disaster information, communication and response through BIPAD portal.'],
            ['Status', ''],
            ['Charset', 'UTF-8'],
            ['Topic category', ''],
            ['Spatial representation type', ''],
            ['Spacital resolution equivalent scale', ''],
        ],
    },
    {
        title: 'Point of contact',
        data: [
            ['Name', 'NEOC'],
            ['Organization name', 'National Emergency Operation Center'],
            ['Position name', ''],
            ['Role', ''],
        ],
    },
    {
        title: 'Geographic extent',
        data: [
            ['Geographic Extent', ''],
            ['Geographic Extent East', ''],
            ['Geographic Extent West', ''],
            ['Geographic Extent North', ''],
            ['Geographic Extent South', ''],
        ],
    },
    {
        title: 'Resource Maintenance Information',
        data: [
            ['Maintenance and update frequency', ''],
            ['User Defined Maintenance Frequency', ''],
            ['Date of Next Update', ''],
        ],
    },
    {
        title: 'Legal Constraints',
        data: [
            ['Use Limitation', ''],
            ['Access Constraints', ''],
            ['Use Constraints', ''],
        ],
    },
    {
        title: 'Reference System Information',
        data: [
            ['Code', ''],
        ],
    },
    {
        title: 'Data Quality Info',
        data: [
            ['Hierarchy level', ''],
            ['Statement', ''],
        ],
    },
    {
        title: 'Distributor Info',
        data: [
            ['Individual Name', ''],
            ['Organization Name', ''],
            ['Position name', ''],
            ['Email', ''],
            ['Role', ''],
        ],
    },
];

export default class Metadata extends React.PureComponent {
    render() {
        const { className } = this.props;

        return (
            <div className={_cs(styles.metadataList, className)}>
                { metadataList.map((metadata) => {
                    const {
                        data,
                        title,
                    } = metadata;

                    return (
                        <div
                            key={title}
                            className={styles.metadataItem}
                        >
                            <h2 className={styles.heading}>{ title }</h2>
                            { data.map(d => (
                                <div
                                    key={d[0]}
                                    className={styles.row}
                                >
                                    <div className={styles.key}>{d[0]}</div>
                                    <div className={styles.value}>{d[1]}</div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    }
}
