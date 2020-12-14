/* eslint-disable max-len */
import React from 'react';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';

import CapacityResourcesImg from '#resources/images/openspace-images/capacity-and-resources.png';
import ToggleOpenspace from '#resources/images/openspace-images/image6.png';
import PlottedOpenspace from '#resources/images/openspace-images/image16.png';
import TableOpenspace from '#resources/images/openspace-images/image2.png';
import MapOpenspace from '#resources/images/openspace-images/image1.png';
import ViewDetailOpenspace from '#resources/images/openspace-images/image4.png';
import RouteIconOpenspace from '#resources/images/openspace-images/image9.png';
import AbstractOpenspace from '#resources/images/openspace-images/image18.png';
import MetadataTab from '#resources/images/openspace-images/image10.png';
import LegendOpenspace from '#resources/images/openspace-images/image11.png';
import DroneImageOpenspace from '#resources/images/openspace-images/image12.png';
import TooltipOpenspace from '#resources/images/openspace-images/image14.png';

export default class HowToUse extends React.PureComponent {
    public render() {
        return (
            <div className={styles.details}>
                <div>
                    <h3>Privileged User</h3>
                    <h4>How to add Open Spaces?</h4>
                    <span style={{ fontSize: '12px' }}>
                        Note: To add Open Spaces data, first you need to be logged into the system.
                    </span>
                    <ol>
                        <li>
                            On the Capacity and Resource Page,
                            Click on the “ADD RESOURCE” button on the left sidebar.
                        </li>
                        <li>
                            On the Resource Type field, select Open Spaces.
                        </li>
                        <li>
                            Enter the title of Open Spaces and description on
                            the title and description field respectively.
                        </li>
                        <li>
                            Type the Region of Open Spaces on the region
                            field or choose the location from the map.
                        </li>
                        <li>
                            Scroll down and fill in all the necessary
                            fields of the Basic Info tab, then click on the Save and Continue button.
                        </li>
                        <li>
                            Similarly, fill in the necessary field of the Details tab and click on the Save and Continue button.
                        </li>
                        <li>
                            On the Suggested Use Tab, choose the item by clicking on
                            the checkbox.
                        </li>
                        <li>
                            On the Amenities tab, choose the amenities with
                             the help of a switch and you can also add the amenities description on the note field below each amenities.
                        </li>
                        <li>
                            Environment Checklist selection is similar to that of amenities.
                        </li>
                        <li>
                            On the Media tab, you can upload the images or photos
                            of Open Spaces by clicking on choose files. Clicking on the save button will successfully add the Open Spaces.
                        </li>
                    </ol>
                </div>
                <div>
                    <h3>
                        General Public
                    </h3>
                    <h4>How to view Open Spaces on map and view details?</h4>
                    <ol>
                        <li className={styles.ListWithImage}>
                        1. Open Capacity & Resources.
                            <img src={CapacityResourcesImg} alt="capacity and resource" />
                        </li>
                        <li className={styles.ListWithImage}>
                        2. Toggle Open Spaces on.
                            <img src={ToggleOpenspace} alt="capacity and resource" />
                        </li>
                        <li className={styles.ListWithImage}>
                        3. Open Spaces will be plotted on the map. Now you can zoom in to the desired Open Spaces and click on it to view the details.
                            <img src={PlottedOpenspace} alt="capacity and resource" />
                        </li>
                    </ol>
                </div>
                <div>
                    <h4>How to view Open Spaces on Table?</h4>
                    <ul>
                        <li className={styles.ListWithImage}>
                    1. On the Capacity and Resource Page, Click on the table icon on the side of Humanitarian Open Spaces.
                            <img src={TableOpenspace} alt="capacity and resource" />
                        </li>
                    </ul>
                </div>

                <div>
                    <h4>How to generate a route to Open Spaces?</h4>
                    <ul>
                        <li className={styles.ListWithImage}>
                        1. On the Capacity and Resource Page, Toggle on the Humanitarians Open Spaces.
                            <img src={ToggleOpenspace} alt="capacity and resource" />
                        </li>
                        <li className={styles.ListWithImage}>
                        2. Click on the Open Spaces displayed over the map.
                            <img src={MapOpenspace} alt="capacity and resource" />
                        </li>

                        <li className={styles.ListWithImage}>
                        3. Click on the View Detail button on Popup.
                            <img src={ViewDetailOpenspace} alt="capacity and resource" />
                        </li>

                        <li className={styles.ListWithImage}>
                        4. Click on the Route icon on the top right corner of the Open Spaces modal.
                            <img src={RouteIconOpenspace} alt="capacity and resource" />
                        </li>

                    </ul>
                </div>

                <div>
                    <h4>How to view Abstract and Metadata?</h4>
                    <ul>
                        <li className={styles.ListWithImage}>
                        1. On the Capacity and Resource page, click on the Info icon on the side of the Humanitarian Open Spaces toggle, then you will land on the Abstract page.
                            <img src={AbstractOpenspace} alt="capacity and resource" />
                        </li>
                        <li className={styles.ListWithImage}>
                        2. Click on the Metadata tab to get all the metadata information.
                            <img src={MetadataTab} alt="capacity and resource" />
                        </li>
                    </ul>
                </div>

                <div>
                    <h4>How to view drone image of Open Spaces?</h4>
                    <ul>
                        <li className={styles.ListWithImage}>
                        1. On the Capacity and Resource Page, Toggle on the Humanitarians Open Spaces.
                            <img src={ToggleOpenspace} alt="toggle" />
                        </li>
                        <li className={styles.ListWithImage}>
                        2. Click on the Open Spaces displayed over the map.
                            <img src={MapOpenspace} alt="map" />
                        </li>
                        <li className={styles.ListWithImage}>
                        3. You will see a Drone image checkbox under Layer Control.
                            <img src={LegendOpenspace} alt="map" />
                        </li>
                        <li className={styles.ListWithImage}>
                        4. Tick the Drone image checkbox, then the drone image on a map over the Open Spaces will be displayed.
                            <img src={DroneImageOpenspace} alt="map" />
                        </li>
                    </ul>
                </div>

                <div>
                    <h4>How to view Open Spaces on map and view details?</h4>
                    <ul style={{ listStyleType: 'none' }}>
                        <li className={styles.ListWithImage}>
                        1. On the Capacity and Resource page, Toggling on the Humanitarians Open Spaces will display the open space, and it’s a cluster on the map if it&apos;s too close.
                            <img src={MapOpenspace} alt="toggle" />
                        </li>
                        <li className={styles.ListWithImage}>2. Clicking on the cluster will split the Open Spaces.</li>
                        <li className={styles.ListWithImage}>
                        3. Click on split Open Spaces will display the popup with some detail of Open Spaces.
                            <img src={TooltipOpenspace} alt="map" />
                        </li>
                        <li className={styles.ListWithImage}>
                        4. Clicking on the View Detail button on the Open Spaces popup will display all the details of Open Spaces.
                            <img src={ViewDetailOpenspace} alt="map" />
                        </li>
                        <li className={styles.ListWithImage}>
                        5. Tick the Drone image checkbox, then the drone image on a map over the Open Spaces will be displayed.
                            <img src={DroneImageOpenspace} alt="map" />
                        </li>
                    </ul>
                </div>
            </div>

        );
    }
}
