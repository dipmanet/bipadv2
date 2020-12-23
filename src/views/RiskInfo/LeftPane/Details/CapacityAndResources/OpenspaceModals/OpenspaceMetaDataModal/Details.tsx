/* eslint-disable max-len */
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
                    Open spaces are identified and mapped with the aim to strengthen emergency preparedness and to provide the initial response planning framework for local governments and partner agencies. This gives a starting point from which to provide life-saving assistance to those in immediate need of support, including displaced populations.
                    </p>
                    <p className={styles.justifiedContent}>
                    The importance of identifying and mapping open spaces for preparedness and risk reduction is also reflected in the National Policy for Disaster Risk Reduction 2018 for Nepal.
                    </p>
                    <p className={styles.justifiedContent}>
                        IOM has been supporting the Government of Nepal with the identification, mapping and protection of open spaces to be used for humanitarian purposes since 2013.
                    </p>
                </div>
                <div>
                    <h3>Open Space Selection Criteria</h3>
                    <p className={styles.justifiedContent}>
                    There are six criteria that IOM Nepal has applied in the open-space selection process. Open spaces that fail to fulfill these criteria may cause further distress to disaster affected and displaced populations. The criteria are as follows:

                    </p>
                    <p className={styles.justifiedContent}>
                        <b>1. Accessibility: </b>
                        It is critical in the selection phase that the open spaces are accessible in all seasons. The accessibility criterion also entails the mobility of displaced populations, supply of goods and services, access to critical services such as hospitals and schools, as well as access to livelihoods.
                    </p>
                    <p className={styles.justifiedContent}>
                        <b>  2. Security: </b>
                        In high density camps security is likely to become a key issue. Existing security features in the open space is therefore considered in the selection phase. Exposure to natural and man-made hazards are considered, thus open spaces located in flood prone areas or close to industrial areas are avoided. Health conditions are also considered this way, the open spaces located in Malaria zones and cholera high risk areas are avoided. The security criterion also includes evacuation routes to and from the open space.
                    </p>

                    <p className={styles.justifiedContent}>
                        <b>  3. Access to resources and water: </b>
                        This criterion ensures that the open space has access to resources and water. Water needs to be available in sufficient quantities in all seasons, taking into consideration the level of water during the dry season, as well as the basic needs of the displaced population which is calculated to 7.5-15 litres per person per day.
                    </p>

                    <p className={styles.justifiedContent}>
                        <b>4. Land availability and topography: </b>
                        As per the Sphere Standard, the minimum surface area per person is 35-45 m2. This criterion considers the possibility to expand the area, and open spaces located in a gently sloped area of maximum 1-5° is accepted. This criterion omits open spaces that are located in areas prone to becoming water logged and marshy during the rainy season. Moreover, open spaces that are excessively rocky should be avoided due to hampering toilet or camp construction.
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
                    The datasets of open spaces under this module contain only those locations that have been surveyed by the International Organization for Migration (IOM) Nepal till date. It includes open spaces of the following locations:

                    </p>
                    <MainTable />

                </div>
            </div>
        );
    }
}
