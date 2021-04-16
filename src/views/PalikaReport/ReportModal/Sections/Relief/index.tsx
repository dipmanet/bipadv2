import React from 'react';
import { Table } from 'react-bootstrap';
import styles from './styles.scss';

interface Props{

}
const Relief = (props: Props) => {
    console.log(props);
    return (
        <div className={styles.tabsPageContainer}>
            <p><strong>Relief Data</strong></p>
            <Table striped bordered hover size="md">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>FISCAL YEAR</th>
                        <th>TOTAL Relief NRS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>2064/2065</td>
                        <td>Policy Points</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>2064/2065</td>
                        <td>Policy Points</td>
                    </tr>

                </tbody>
            </Table>

        </div>
    );
};

export default Relief;
