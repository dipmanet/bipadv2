/* eslint-disable max-len */
import React from 'react';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';

import ToggleCommunitySpace from '#resources/images/openspace-images/image8.png';
import MapCommunitySpace from '#resources/images/openspace-images/image19.png';
import ViewDetailCommunitySpace from '#resources/images/openspace-images/image17.png';
import RouteIconCommunitySpace from '#resources/images/openspace-images/image7.png';
import AbstractCommunitySpace from '#resources/images/openspace-images/image3.png';
import MetadataTabCommunitySpace from '#resources/images/openspace-images/image15.png';

export default class HowToUse extends React.PureComponent {
    public render() {
        return (
            <div className={styles.details}>
                <div>
                    <h3>Privileged User</h3>
                </div>
                <div>
                    <h4>How to add Community Spaces?</h4>
                    <span style={{ fontSize: '12px' }}>
                    Note: To add Community Spaces data, first you need to be logged into the system.
                    </span>
                    <ol>
                        <li>
                        On the Capacity and Resource Page, Click on the “ADD RESOURCE” button on the left sidebar.
                        </li>
                        <li>
                        On the Resource Type field, select community space.
                        </li>
                        <li>
                        Enter the title of community space and description on the title and description field respectively.

                        </li>
                        <li>
                        Type the Region of Open Spaces on the region field or choose the location from the map.

                        </li>
                        <li>
                        Scroll down and fill in all the necessary fields of the Basic Info tab, then click on the Save and Continue button.

                        </li>
                        <li>
                        Similarly, fill the necessary field of the Details tab and click on the Save button will add community space.
                        </li>
                    </ol>
                </div>
                <div>
                    <h3>General Public</h3>
                </div>
                <div>
                    <div>
                        <h4>How to view Community Spaces on table?</h4>
                        <ul>
                            <li className={styles.ListWithImage}>
                        1. On the Capacity and Resource Page, Click on the table icon on the side of Community Space.
                                <img src={ToggleCommunitySpace} alt="toggle" />
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4>How to generate a route to Community Space?</h4>
                        <ul>
                            <li className={styles.ListWithImage}>
                            1. On the Capacity and Resource Page, Toggle on the Community Space.
                                <img src={ToggleCommunitySpace} alt="toggle" />
                            </li>
                            <li className={styles.ListWithImage}>
                            2. Click on the Community Spaces displayed over the map.
                                <img src={MapCommunitySpace} alt="toggle" />
                            </li>
                            <li className={styles.ListWithImage}>
                            3. Click on the View Detail button on Popup.
                                <img src={ViewDetailCommunitySpace} alt="toggle" />
                            </li>
                            <li className={styles.ListWithImage}>
                            4. Click on the Route icon on the top right corner of the Community Space modal.
                                <img src={RouteIconCommunitySpace} alt="toggle" />
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4>How to view Abstract and Metadata</h4>
                        <ul>
                            <li className={styles.ListWithImage}>
                            1. On the capacity and Resource page, click on the Info icon on the side of the Community Space toggle, then you will land on the Abstract page.
                                <img src={AbstractCommunitySpace} alt="toggle" />
                            </li>
                            <li className={styles.ListWithImage}>
                            2. Click on the Metadata tab to get all the metadata information.
                                <img src={MetadataTabCommunitySpace} alt="toggle" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>


        );
    }
}
