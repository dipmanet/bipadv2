/* eslint-disable max-len */
import React from 'react';
import { Table } from 'semantic-ui-react';
import styles from '../../OpenspaceMetaDataModal/MetadataComponents/styles.scss';
// import './table.css';
import 'semantic-ui-css/components/table.min.css';


export default class StandardMetadata extends React.PureComponent {
    public render() {
        return (
            <div className={styles.standardTable} id="metadata-openspace">
                <Table celled structured>
                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitle}>
                            Dataset title
                        </Table.HeaderCell>
                        <Table.Cell>
                        Community Spaces
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitle}>
                            Dataset Creation Date
                        </Table.HeaderCell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitle}>
                            Abstract
                        </Table.HeaderCell>
                        <Table.Cell>
                            <p className={styles.justifiedContent}>Nepal is extensively diverse in geography and has varied landscapes. Human settlements in rural areas can be found in the terraced hillsides, nearby the rivers, mountains or in the plains. With such villages or settlement clusters in varied topography, it is not practical for the people to find open spaces which are defined and identified as per the international sphere standards and which are at a distance from the settlement during a disaster. In this context, it is important that the selection of open spaces be contextualized as per the geography, area, population and settlement patters of the region. Moreover, during the disasters, people often tend to use the open locations which are near to their houses and communities.</p>
                            <p className={styles.justifiedContent}>During the 2015 earthquakes, the local people in several locations across the country used private and public lands nearby their communities as temporary shelters. Some open areas were also used by various relief distribution agencies. In a view of this, IOM Nepal also identified those locations during the humanitarian open spaces identification and mapping survey in 2019. These identified locations do not fulfill the international standards required to consider for humanitarian open spaces, however, they can be used during an emergency. These locations are termed as community spaces and broadly categorized as playgrounds, parks, picnic spots, community gathering spots and periphery of hospitals, schools, public institutions and other public places depending on the current land use practice of the respective local communities.</p>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitle}>
                            Purpose
                        </Table.HeaderCell>
                        <Table.Cell>
                            <p className={styles.justifiedContent}>
                        The purpose of community spaces data integration to BIPAD is to document generic details of identified community spaces. The community spaces data documented and stored in a digital platform is for the dissemination of data on such community locations for evidence based decision support to the local governments, humanitarian agencies, relevant stakeholders and the community in the event of a disaster.
                            </p>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitle}>
                            Descriptive Keyword
                        </Table.HeaderCell>
                        <Table.Cell className={styles.endItem}>
                        Community spaces, playgrounds, picnic spots, parks, communtiy gathering spots, periphery of schools, public institutions and other public places
                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitleGroup}>
                            Metadata Record Info
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Language
                        </Table.Cell>
                        <Table.Cell>
                            English
                        </Table.Cell>

                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Charset
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Hierarchy Level
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Date
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Standard name
                        </Table.Cell>
                        <Table.Cell className={styles.endItem}>

                        </Table.Cell>
                    </Table.Row>


                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitleGroup}>
                            Contact
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Name
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>

                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Organization Name
                        </Table.Cell>
                        <Table.Cell>
                            International Organization for Migration (IOM) Nepal
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Position name
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Role
                        </Table.Cell>
                        <Table.Cell>
                            Encourage cooperation and the delivery of services to Nepal, the country of origin, transit and the destination of migration.
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Email
                        </Table.Cell>
                        <Table.Cell className={styles.endItem}>
                            iomnepal@iom.int
                        </Table.Cell>
                    </Table.Row>


                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitleGroup}>
                            Identification Info
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Data Type
                        </Table.Cell>
                        <Table.Cell>
                            Vector Datasets (Location of open spaces represented as point and polygons)
                        </Table.Cell>

                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Status
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Charset
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Topic Category
                        </Table.Cell>
                        <Table.Cell>
                            Open spaces for disaster preparedness
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Spatial Representation Type
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Spatial Resolution Equivalent Scale
                        </Table.Cell>
                        <Table.Cell className={styles.endItem}>

                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitleGroup}>
                            Point of Contact
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Name
                        </Table.Cell>
                        <Table.Cell>
                            Dipina Sharma
                        </Table.Cell>

                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Organisation Name
                        </Table.Cell>
                        <Table.Cell>
                            International Organization for Migration (IOM)
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Position Name
                        </Table.Cell>
                        <Table.Cell>
                            National Project Officer
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Role
                        </Table.Cell>
                        <Table.Cell className={styles.endItem}>

                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitleGroup}>
                            Geographic Extent
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Geographic Extent East
                        </Table.Cell>
                        <Table.Cell>
                            86.065065
                        </Table.Cell>

                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Geographic Extent West
                        </Table.Cell>
                        <Table.Cell>
                            83.246019
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Geographic Extent North
                        </Table.Cell>
                        <Table.Cell>
                            28.281328
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Geographic Extent South
                        </Table.Cell>
                        <Table.Cell className={styles.endItem}>
                            27.637947
                        </Table.Cell>
                    </Table.Row>


                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitleGroup}>
                            Resource Maintenance Information
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Maintenance and update frequency
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>

                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            User Defined Maintenance Frequency
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Date of Next Update
                        </Table.Cell>
                        <Table.Cell className={styles.endItem}>

                        </Table.Cell>
                    </Table.Row>


                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitleGroup}>
                            Legal Constraints
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Use Limitation
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>

                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Access Constraints
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Use Constraints
                        </Table.Cell>
                        <Table.Cell className={styles.endItem}>

                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitleGroup}>
                            Reference System Information
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Name
                        </Table.Cell>
                        <Table.Cell>
                            WGS 1984
                        </Table.Cell>

                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Code
                        </Table.Cell>
                        <Table.Cell className={styles.endItem}>
                            EPSG: 3246
                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitleGroup}>
                            Data Quality Info
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Hierarchy level
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>

                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Statement
                        </Table.Cell>
                        <Table.Cell className={styles.endItem}>

                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitleGroup}>
                            Distributor Info
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Individual Name
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>

                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Organization Name
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Position name
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Email
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Role
                        </Table.Cell>
                        <Table.Cell>

                        </Table.Cell>
                    </Table.Row>

                </Table>
            </div>
        );
    }
}
