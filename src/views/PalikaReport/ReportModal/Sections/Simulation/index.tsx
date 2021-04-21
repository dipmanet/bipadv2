import React from 'react';
import { Table } from 'react-bootstrap';
import NextPrevBtns from '../../NextPrevBtns';

import styles from './styles.scss';

interface Props{

}

const Simulation = (props: Props) => {
    console.log(props);
    const handleDataSave = () => {
        props.updateTab();
    };

    return (
        <div className={styles.tabsPageContainer}>
            <h2>Bipad Simulation at the Municipality</h2>

            <h1>Work in Progress</h1>
            {/* <Table striped bordered hover size="md">
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Date</th>
                        <th>Simulation Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>22/22/22</td>
                        <td>Mobile</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>11/11/11</td>
                        <td>Mobile</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>11/11/11</td>
                        <td>Mobile</td>
                    </tr>
                </tbody>
            </Table> */}


            <NextPrevBtns
                handlePrevClick={props.handlePrevClick}
                handleNextClick={props.handleNextClick}
            />
        </div>
    );
};

export default Simulation;
