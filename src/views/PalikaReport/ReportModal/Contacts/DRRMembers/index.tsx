import React from 'react';
import { Table } from 'react-bootstrap';

import styles from '../styles.scss';

interface Props{

}

const DRRMembers = (props: Props) => {
    console.log(props);
    return (
        <div className={styles.tabsPageContainer}>
            <h1>DRR Members</h1>
            <Table striped bordered hover size="md">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Education</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Name</td>
                        <td>Mobile</td>
                        <td>Email</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Name</td>
                        <td>Mobile</td>
                        <td>Email</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Name</td>
                        <td>Mobile</td>
                        <td>Email</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Name</td>
                        <td>Mobile</td>
                        <td>Email</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
};

export default DRRMembers;
