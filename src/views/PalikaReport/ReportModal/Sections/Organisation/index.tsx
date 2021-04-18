import React from 'react';
import { Table } from 'react-bootstrap';
import styles from './styles.scss';

interface Props{

}
const Organisation = (props: Props) => {
    console.log(props);
    return (
        <div className={styles.tabsPageContainer}>
            <p>
                <strong>
                DRR related organizations in Municipal Government
                </strong>
            </p>
            <Table striped bordered hover size="md">
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Organisation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Some organisation</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Some organisation</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Some organisation</td>
                    </tr>
                </tbody>
            </Table>

        </div>
    );
};

export default Organisation;
