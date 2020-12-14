import React from 'react';
import { _cs } from '@togglecorp/fujs';
import ListView from '#rscv/List/ListView';
import styles from './styles.scss';
import Table from './DetailsComponents/Table';

export default class Details extends React.PureComponent {
    public render() {
        // const { className } = this.props;

        return (
            <div className={styles.details}>
                <div>
                    <h3>About Community Space</h3>
                    <p className={styles.justifiedContent}>
                        During the earthquakes in 2015, the local people in
                        many locations across the country used private and
                        public lands, and other open areas near their houses
                        and communities as temporary shelters. Some of the
                        open areas were also used by relief distribution agencies.
                        IOM Nepal also identified those locations during open spaces
                        identification and mapping survey in five municipalities
                        outside Kathmandu Valley in 2019. Along with identification,
                        the total available flat area, GPS coordinates,
                        attribute details and photographs for each of the
                        location were also collected during the project period.
                        These locations do not fulfill all the criteria required
                        to consider for humanitarian open spaces, however, they
                        can be used during an emergency. The identified locations
                        were broadly categorized as playgrounds, picnic spots and
                        parks, community gathering spots (Chautara, temple, garden,
                        open public land) and periphery of hospitals, schools, public
                        institutions and other public places.
                    </p>
                    <p className={styles.justifiedContent}>
                        As the humanitarian open spaces may not be easily accessible
                        for all scattered communities in the rural areas during a
                        disaster, the school compounds, the periphery of the ward
                        offices, health institutions and various other community buildings
                        premises near the settlement areas have also been considered for
                        its utilization during an emergency.
                    </p>


                </div>
                <div>
                    <h3>Disclaimer</h3>
                    <p className={styles.justifiedContent}>
                        The datasets of community spaces under this module contains only those
                        locations that have been surveyed by International Organization for
                        Migration (IOM) Nepal till date. It includes community spaces of the
                        following locations:
                    </p>
                    <Table />
                </div>
            </div>
        );
    }
}
