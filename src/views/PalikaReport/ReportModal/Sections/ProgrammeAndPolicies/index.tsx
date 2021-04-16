import React from 'react';
import { Table } from 'react-bootstrap';

interface Props{

}

const ProgramPolicies = (props: Props) => {
    console.log('props', props);
    return (
        <>
            <h2>Bipad Sambandhi Niyam Aain ra Nirdeshika</h2>
            <Table striped bordered hover size="md">
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Name</th>
                        <th>Approval Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Nabanit ji</td>
                        <td>Policy Points</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Nabanit ji</td>
                        <td>Policy Points</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Nabanit ji</td>
                        <td>Policy Points</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Nabanit ji</td>
                        <td>Policy Points</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Nabanit ji</td>
                        <td>Policy Points</td>
                    </tr>

                </tbody>
            </Table>

        </>
    );
};

export default ProgramPolicies;
