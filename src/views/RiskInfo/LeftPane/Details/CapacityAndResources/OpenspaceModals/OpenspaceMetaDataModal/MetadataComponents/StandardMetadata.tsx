/* eslint-disable max-len */
import React from 'react';
import { Table } from 'semantic-ui-react';
import styles from './styles.scss';
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
                            Humanitarian Open Spaces
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
                            Nepal is prone to a multitude of disasters that cause loss of lives, property and infrastructure. Considering Nepal&apos;s high vulnerability to various natural disasters, International Organization for Migration (IOM) Nepal prioritized strenthening emergency preparedness and response at federal, provincial and local levels of governments. The Nepal earthquakes in 2015 also brought a realization of the need for open spaces for displaced populations to use in the event of a disaster. Disaster preparedness at a community level is crucial and identifiying critical resources such as open spaces can be one of the first initiatives to accommodate displaced and the affected ones during emergencies. In this context, identification of humanitarian open spaces is one of the disaster response initiatives carried out by IOM Nepal at local level. The data on humanitarian open spaces identified and surveyed by the IOM in different parts of Nepal are integrated to the Building Information Platform Against Disaster (BIPAD) for dissemination to wider group of audiences including federal, provincial and local governments, humanitarian agencies, local community and other relevant stakeholders. The data on open spaces for humanitarian assistance include high-resolution orthophoto maps, location data, accomodation capacity and details on the availability of critical facilities and infrastructures such as WASH, road access, schools, hospitals and security in the vicinity of each identified open space.

                            Open spaces for humanitarian purposes are identified with the aim to strengthen emergency preparedness and to provide initial respone planning framework for local governments and humanitarian agencies to provide life saving assistance to the displaced populations before, during and in the aftermath of a disaster and also to those in immediate need of support in times of crisis.
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitle}>
                            Purpose
                        </Table.HeaderCell>
                        <Table.Cell>
                            The purpose of open space data integration to BIPAD is to document all the details of identified and surveyed open spaces comprehensively. The open space data documented and stored in such a digital platform is for dissemination of open space information for evidence-based decision support to government agencies, humanitarian agencies, relevant stakeholders and the community during a disaster or in an emergency.
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell className={styles.headerTitle}>
                            Descriptive Keyword
                        </Table.HeaderCell>
                        <Table.Cell className={styles.endItem}>
                            Humanitarian open spaces, critical facilities and infrastructures, general environment checklist, GIS orthophoto maps, community spaces
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
