import React from 'react';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';
import MainTable from './DetailsComponents/Table.tsx';

export default class Details extends React.PureComponent {
    public render() {
        // const { className } = this.props;

        return (
            <div className={styles.details}>
                <div>
                    <h3>About Humanitarian Open Space</h3>
                    <p className={styles.justifiedContent}>
                        Humanitarian open spaces are identified and mapped with the aim to
                        strengthen emergency preparedness and to provide the initial response
                        planning framework for the local governments and partner agencies to be
                        able to have a starting point from which to provide life-saving assistance
                        to those in immediate need including the displaced population. One of the
                        lessons learned from past disasters is the vital role of pre-identified
                        open spaces that can be utilized for safe and secure refuge and relief
                        distribution during and after disasters. Other core services that
                        can be provided and utilized in open spaces include:
                    </p>
                    <ul>
                        <li>Safe refuge for the most vulnerable displaced populations</li>
                        <li>Medical and health care facilities</li>
                        <li>Logistical hub for disaster response and relief item distribution</li>
                        <li>WASH facilities</li>
                        <li>Gender and disability inclusion</li>
                        <li>
                            Community meeting and recreational space during normal
                            (pre-disaster) conditions
                        </li>
                    </ul>
                </div>
                <div>
                    <h3>Criterias</h3>
                    <p className={styles.justifiedContent}>
                        Open spaces for humanitarian purposes are selected in consultation
                        with a multitude of stakeholders including local communities,
                        humanitarian agencies, local disaster risk management committees,
                        ward presidents, security forces among others.Open spaces failing
                        to meet the below criteria may cause further distress to the disaster
                        affected and displaced population. Identification of flat and large
                        open spaces in the hilly terrain of Nepal is itself a challenge,
                        however, the following criteria are considered for identifying open
                        spaces for humanitarian purposes and providing refuge to displaced
                        population.
                    </p>
                    <p className={styles.justifiedContent}>
                        <b>1. Accessibility: </b>
                        It is critical in the selection phase that
                        the open spaces are accessible in all seasons. The accessibility
                        criterion also entails the mobility of displaced populations,
                        supply of goods and services, access to critical services
                        such as hospitals and schools, as well as access to livelihoods.
                    </p>
                    <p className={styles.justifiedContent}>
                        <b>  2. Security: </b>
                       In high density camps security is likely to become
                        a key issue. Existing security features in the open space is
                        therefore considered in the selection phase. Exposure to natural
                         and man-made hazards are considered, thus open spaces located
                         in flood prone areas or close to industrial areas are avoided.
                         Health conditions are also considered this way, this open space
                         located in Malaria zones and cholera high risk areas are avoided.
                         The security criterion also includes evacuation routes to and
                         from the open space.
                    </p>

                    <p className={styles.justifiedContent}>
                        <b>  3. Access to resources and water: </b>
                         This criterion ensures that
                        the open space has access to resources and water. Water needs
                        to be available in enough quantities in all seasons, taking into
                        consideration the level of water during the dry season, as well
                        as the basic needs of the displaced population which is calculated
                        to 7.5-15 litres per person per day.
                    </p>

                    <p className={styles.justifiedContent}>
                        <b>4. Land availability and topography: </b>
                        As per the Sphere Standard,
                        the minimum surface area per person is 35-45 square metres. This
                        criterion considers the possibility to expand the area, and open
                        spaces located in a gently sloped area of maximum 1-5 degrees is
                        accepted. This criterion omits open spaces that are in areas prone
                        to becoming waterlogged and marshy during the rainy season. Moreover,
                        open spaces that are excessively rocky should be avoided due to
                        hampering toilet or camp construction.
                    </p>

                    <p className={styles.justifiedContent}>
                        <b>5. Environmental concerns: </b>
                        This criterion considers open spaces
                        with enough ground cover as suitable for setting up camps as the
                        vegetation provides shade, protects from soil erosion and reduces
                        dust. The negative impacts of turning open spaces into camp settings
                        are also considered in the selection process. Therefore, a general
                        environmental checklist is filled out during the selection process.
                    </p>

                    <p className={styles.justifiedContent}>
                        <b> 6. Size: </b>
                        The size criterion considers the size and area per capita
                        of the open space as important factors when planning for camps. The
                        minimum standards in disaster response as per the Sphere Standards
                        include spaces that should be utilized for accommodation, cooking,
                        hygiene, agriculture and schools. The total area required for all
                        camp functions is 45 square metres per person. While this should
                        remain the objective for camp density, it is important that the
                        humanitarian community is prepared for a higher influx of displaced
                        population immediately following the disaster. The covered living
                        area is 3.5 square metres per person.
                    </p>


                </div>
                <div>
                    <h3>Disclaimer</h3>
                    <p className={styles.justifiedContent}>
                        The datasets of Humanitarian Open Space under this module contains
                        only those locations that have been surveyed by International
                        Organization for Migration (IOM) Nepal till date. It includes
                        open spaces of the following locations:
                    </p>
                    <MainTable />

                </div>
            </div>
        );
    }
}
