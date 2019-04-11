import React from 'react';

import styles from './styles.scss';

export default class AboutUs extends React.PureComponent {
    render() {
        const { className } = this.props;
        return (
            <div
                className={`${styles.aboutUs} ${className}`}
            >
                <div className={styles.disclaimer}>
                    <h3>Disclaimer</h3>
                    <div className={styles.content}>
                        <p>
                            This portal is hosted by National
                            Emergency Operation Centre (NEOC) solely for information
                            purpose only. NEOC disclaims any liability for errors,
                            accuracy of information or suitability of purposes. It
                            makes no warranties, expressed or implied and fitness
                            for particular purposes as to the quality, content,
                            accuracy or completeness of the information or other
                            times contained on the portal. Materials are subject to
                            change without notice. In no event will the NEOC be
                            liable for any loss arising from the use of the
                            information from any of the modules. The boundaries,
                            colors, denominations, and other information shown on
                            any map do not imply any judgment or endorsement on the
                            part of the NEOC or any providers of data, concerning
                            the delimitation or the legal status of any territory
                            or boundaries.In no event will the NEOC be liable for
                            any form of damage arising from the application or
                            misapplication of any maps or materials.
                        </p>
                        <p>
                            The administration team periodically adds
                            changes,improves,or updates the Materials on
                            this Site without notice.
                        </p>
                        <p>
                            This portal also contains link to
                            third-party websites. The linked sites are not underthe
                            control of the NEOC and it is not responsible for the
                            contents of any linked siteor any link contained in a
                            linked site. These links are provided only as
                            aconvenience, and the inclusion of a link does not
                            imply endorsement of the linkedsite by NEOC. Original
                            datasets are licensed under their original terms, which
                            arecontained in the associated layer metadata.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
