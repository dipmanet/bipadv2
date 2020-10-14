import React from 'react';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';

export default class Details extends React.PureComponent {
    public render() {
        // const { className } = this.props;

        return (
            <div className={styles.details}>
                <div>
                    <h3>Abstract</h3>
                    <p>
                        The data represents open spaces for humanitarian
                        purposes which are selected in consultation with a
                        multitude of stakeholders including local communities,
                        humanitarian agencies, local disaster risk management
                        committees, ward presidents and security forces, among
                        others.
                    </p>
                    <p>
                        All these open spaces were identified and mapped with
                        the aim to strengthen emergency preparedness and to
                        provide the initial response planning framework for the
                        local governments and partner agencies to be able to
                        have a starting point from which to provide life-saving
                        assistance to those in immediate need including the
                        displaced population.
                    </p>
                    <p>
                        The identification and mapping of these open spaces
                        considered five major criterias:
                    </p>
                    <ul>
                        <li>Accessibility</li>
                        <li>Security</li>
                        <li>Access to resources and water</li>
                        <li>Land availability and topography</li>
                        <li>Environmental Concerns</li>
                        <li>Size</li>
                    </ul>
                </div>
                <div>
                    <h3>Disclaimer</h3>
                    <p>
                        The open space datasets under this section contains only
                        those locations that have been surveyed by IOM till
                        date. It includes open spaces of following locations :
                    </p>
                    <ul>
                        <li>Kathmandu</li>
                        <li>Lalitpur</li>
                        <li>Bhaktapur</li>
                        <li>Gorkha</li>
                        <li>Dolakha</li>
                        <li>Sindhupalchowk</li>
                        <li>Rasuwa</li>
                        <li>Dhading</li>
                        <li>Kaski</li>
                        <li>Baglung</li>
                        <li>Palpa</li>
                        <li>Syangja</li>
                        <li>Gulmi</li>
                    </ul>
                </div>
            </div>
        );
    }
}
