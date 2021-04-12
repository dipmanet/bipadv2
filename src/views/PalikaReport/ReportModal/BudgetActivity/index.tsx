import React from 'react';
import { Table } from 'react-bootstrap';
import styles from './styles.scss';

interface Props{

}
const BudgetActivity = (props: Props) => {
    console.log(props);
    return (
        <div className={styles.tabsPageContainer}>
            <Table striped bordered hover size="lg">
                <thead>
                    <tr>
                        <th>Activity Name</th>
                        <th>Fund Type</th>
                        <th>Budget Code</th>
                        <th>Expense Title</th>
                        <th>Amount NRs</th>
                        <th>Remarks</th>
                        <th>Annual Budget NRs</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Some activity</td>
                        <td>Dollar fund</td>
                        <td>112399YT</td>
                        <td>Tea and Coffee</td>
                        <td>1Bn</td>
                        <td>Expensive Tea</td>
                        <td>2Bn</td>
                    </tr>
                    <tr>
                        <td>Some activity</td>
                        <td>Dollar fund</td>
                        <td>112399YT</td>
                        <td>Tea and Coffee</td>
                        <td>1Bn</td>
                        <td>Expensive Tea</td>
                        <td>2Bn</td>
                    </tr>
                    <tr>
                        <td>Some activity</td>
                        <td>Dollar fund</td>
                        <td>112399YT</td>
                        <td>Tea and Coffee</td>
                        <td>1Bn</td>
                        <td>Expensive Tea</td>
                        <td>2Bn</td>
                    </tr>
                    <tr>
                        <td>Some activity</td>
                        <td>Dollar fund</td>
                        <td>112399YT</td>
                        <td>Tea and Coffee</td>
                        <td>1Bn</td>
                        <td>Expensive Tea</td>
                        <td>2Bn</td>
                    </tr>


                </tbody>
            </Table>

        </div>
    );
};

export default BudgetActivity;
