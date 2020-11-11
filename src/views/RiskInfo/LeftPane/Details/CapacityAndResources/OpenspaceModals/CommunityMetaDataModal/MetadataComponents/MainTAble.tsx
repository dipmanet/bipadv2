import React from 'react';
import { Table } from 'semantic-ui-react';
import styles from './styles.scss';

export default class MetaData extends React.PureComponent {
    public render() {
        return (
            <div className={styles.mainTAble} id="main-table">
                <Table celled structured>
                    <Table.Header>
                        <Table.Row>
                            {/* <Table.HeaderCell rowSpan="1" textAlign="right">
                                SN
                            </Table.HeaderCell> */}
                            <Table.HeaderCell rowSpan="2" textAlign="right">
                                Palika
                            </Table.HeaderCell>
                            <Table.HeaderCell rowSpan="2" textAlign="right">
                                Humanitarian Open Spaces
                            </Table.HeaderCell>
                            <Table.HeaderCell rowSpan="1" textAlign="right">
                                Community spaces /Other Locations
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            {/* <Table.Cell> 1</Table.Cell> */}
                            <Table.Cell textAlign="right">
                                Bhimeshwor
                            </Table.Cell>
                            <Table.Cell textAlign="right">4</Table.Cell>
                            <Table.Cell textAlign="right">17</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 2</Table.Cell> */}
                            <Table.Cell textAlign="right">
                                Chautara Sangachowkgadhi
                            </Table.Cell>
                            <Table.Cell textAlign="right">6</Table.Cell>
                            <Table.Cell textAlign="right">37</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 3</Table.Cell> */}
                            <Table.Cell textAlign="right">
                                Neelakantha
                            </Table.Cell>
                            <Table.Cell textAlign="right">5</Table.Cell>
                            <Table.Cell textAlign="right">51</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 4</Table.Cell> */}
                            <Table.Cell textAlign="right">Gorkha</Table.Cell>
                            <Table.Cell textAlign="right">11</Table.Cell>
                            <Table.Cell textAlign="right">74</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 5</Table.Cell> */}
                            <Table.Cell textAlign="right">
                                Gosainkunda
                            </Table.Cell>
                            <Table.Cell textAlign="right">5</Table.Cell>
                            <Table.Cell textAlign="right">12</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        );
    }
}
