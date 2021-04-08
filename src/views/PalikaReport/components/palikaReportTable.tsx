import React from 'react';
import styles from './styles.scss';


const PalikaReportTable = () => (
    <div>
        {/* <h1>Responsive Table Example</h1> */}
        <div className={styles.palikaTable}>
            <table>
                <tbody>
                    <tr>
                        <th>Province</th>
                        <th>District</th>
                        <th>Municipality</th>
                        <th>Fiscal Year</th>
                        <th>Disaster Budget (Nrs)</th>
                        <th>Other Budget (Nrs)</th>
                        <th>Total Budget (Nrs)</th>

                    </tr>
                    <tr>
                        <td>Bagmati</td>
                        <td>Kathmandu</td>
                        <td>Kathmandu</td>
                        <td>2064/065</td>
                        <td>565982</td>
                        <td>365985</td>
                        <td>56598426532</td>

                    </tr>
                    <tr>
                        <td>Bagmati</td>
                        <td>Kathmandu</td>
                        <td>Kathmandu</td>
                        <td>2064/065</td>
                        <td>565982</td>
                        <td>365985</td>
                        <td>56598426532</td>
                    </tr>
                    <tr>
                        <td>Bagmati</td>
                        <td>Kathmandu</td>
                        <td>Kathmandu</td>
                        <td>2064/065</td>
                        <td>565982</td>
                        <td>365985</td>
                        <td>56598426532</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


);

export default PalikaReportTable;
