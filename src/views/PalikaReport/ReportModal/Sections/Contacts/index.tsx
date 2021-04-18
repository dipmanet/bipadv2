import React from 'react';
import { Table } from 'react-bootstrap';

import styles from './styles.scss';

interface Props{

}

const Contacts = (props: Props) => {
    console.log(props);

    const handleDataSave = () => {
        props.updateTab();
    };
    return (
        <div className={styles.tabsPageContainer}>
            <p><strong>Members Contact Info</strong></p>
            <Table striped bordered hover size="md">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
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
                </tbody>
            </Table>
            <button
                type="button"
                onClick={handleDataSave}
                className={styles.savebtn}
            >
                Save and Proceed
            </button>
        </div>
    );
};

export default Contacts;
