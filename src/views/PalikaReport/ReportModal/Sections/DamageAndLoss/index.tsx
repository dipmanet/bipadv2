import React from 'react';
import { Table } from 'react-bootstrap';
import styles from './styles.scss';

interface Props{

}
const DamageAndLoss = (props: Props) => {
    console.log(props);
    return (
        <div className={styles.tabsPageContainer}>
            <Table striped bordered hover size="md">
                <thead>
                    <tr>
                        <th>No of Incidents</th>
                        <th>People Death</th>
                        <th>Estimated Loss</th>
                        <th>Infrastructures Destroyed</th>
                        <th>Livestock Destroyed</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                    </tr>
                </tbody>
            </Table>

        </div>
    );
};

export default DamageAndLoss;
