import React from 'react';
import { Table } from 'semantic-ui-react';
import styles from './styles.scss';
// import './table.css';
import 'semantic-ui-css/components/table.min.css';


export default class MetaData extends React.PureComponent {
    public render() {
        return (
            <div className={styles.mainTAble} id="metadata-openspace">
                <Table celled structured>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell rowSpan="2">
                                Category
                            </Table.HeaderCell>
                            {/* <Table.HeaderCell rowSpan="1">SN</Table.HeaderCell> */}
                            <Table.HeaderCell rowSpan="2">
                                District Name
                            </Table.HeaderCell>
                            <Table.HeaderCell rowSpan="2">
                                Municipality/Local Unit
                            </Table.HeaderCell>
                            <Table.HeaderCell rowSpan="1">
                                No of Open Spaces
                            </Table.HeaderCell>
                            <Table.HeaderCell rowSpan="2">
                                Remarks/Data Source
                            </Table.HeaderCell>
                            <Table.HeaderCell rowSpan="2">
                                Data Source
                            </Table.HeaderCell>
                            <Table.HeaderCell rowSpan="1">
                                Total
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell rowSpan="7">
                                Open Spaces in Kathmandu Valley
                            </Table.Cell>
                            {/* <Table.Cell>1</Table.Cell> */}
                            <Table.Cell textAlign="right">Kathmandu</Table.Cell>
                            <Table.Cell textAlign="right">
                                Kathmandu Metropolitan City
                            </Table.Cell>
                            <Table.Cell textAlign="right"> 34</Table.Cell>
                            <Table.Cell textAlign="right">
                                Kathmandu Valley
                            </Table.Cell>
                            <Table.Cell>2013,2019 Survey</Table.Cell>
                            <Table.Cell rowSpan="7">83</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 1</Table.Cell> */}
                            <Table.Cell textAlign="right">Kathmandu</Table.Cell>
                            <Table.Cell textAlign="center">
                                Gokarneshwor Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">1</Table.Cell>
                            <Table.Cell textAlign="right">
                                Kathmandu Valley
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                2013,2019 Survey
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 1</Table.Cell> */}
                            <Table.Cell textAlign="right">Kathmandu</Table.Cell>
                            <Table.Cell textAlign="center">
                                Kirtipur Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">6</Table.Cell>
                            <Table.Cell textAlign="right">
                                Kathmandu Valley
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                2013,2019 Survey
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 2</Table.Cell> */}
                            <Table.Cell textAlign="right">Bhaktapur</Table.Cell>
                            <Table.Cell textAlign="center">
                                Bhaktapur Municipality City
                            </Table.Cell>
                            <Table.Cell textAlign="right">19</Table.Cell>
                            <Table.Cell textAlign="right">
                                Kathmandu Valley
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                2013,2019 Survey
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 3</Table.Cell> */}
                            <Table.Cell textAlign="right">Lalitpur</Table.Cell>
                            <Table.Cell textAlign="center">
                                Lalitpur Metropolitan City
                            </Table.Cell>
                            <Table.Cell textAlign="right">21</Table.Cell>
                            <Table.Cell textAlign="right">
                                Kathmandu Valley
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                2013,2019 Survey
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 1</Table.Cell> */}
                            <Table.Cell textAlign="right">Kathmandu</Table.Cell>
                            <Table.Cell textAlign="center">
                                Nagarjun Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">1</Table.Cell>
                            <Table.Cell textAlign="right">
                                Kathmandu Valley
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                2013,2019 Survey
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 1</Table.Cell> */}
                            <Table.Cell textAlign="right">Kathmandu</Table.Cell>
                            <Table.Cell textAlign="center">
                                Tokha Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">1</Table.Cell>
                            <Table.Cell textAlign="right">
                                Kathmandu Valley
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                2013,2019 Survey
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell rowSpan="5">Open Spaces Outside Kathmandu Valley</Table.Cell>
                            {/* <Table.Cell>4</Table.Cell> */}
                            <Table.Cell textAlign="right">Gorkha</Table.Cell>
                            <Table.Cell textAlign="center">
                                Gorkha Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">11</Table.Cell>
                            <Table.Cell textAlign="right">2019 Survey-</Table.Cell>
                            <Table.Cell textAlign="right">IOM 2019 Survey</Table.Cell>
                            <Table.Cell rowSpan="5">31</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 5</Table.Cell> */}
                            <Table.Cell textAlign="right">Dolakha</Table.Cell>
                            <Table.Cell textAlign="center">
                                Bhimeshwor Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">4</Table.Cell>
                            <Table.Cell textAlign="right">
                                2020 Survey
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                IOM 2019 Survey
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 6</Table.Cell> */}
                            <Table.Cell textAlign="right">
                                Sindupalchowk
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                Chautara Sangachowkgadhi Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">6</Table.Cell>
                            <Table.Cell textAlign="right">
                                2021 Survey-
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                IOM 2019 Survey
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            {/* <Table.Cell> 7</Table.Cell> */}
                            <Table.Cell textAlign="right">Rasuwa</Table.Cell>
                            <Table.Cell textAlign="center">
                                Gosainkunda Rural Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">5</Table.Cell>
                            <Table.Cell textAlign="right">
                                2022 Survey-
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                IOM 2019 Survey
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            {/* <Table.Cell> 8</Table.Cell> */}
                            <Table.Cell textAlign="right">Dhading</Table.Cell>
                            <Table.Cell textAlign="center">
                                Neelakantha Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">5</Table.Cell>
                            <Table.Cell textAlign="right">
                                2023 Survey-
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                IOM 2019 Survey
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell rowSpan="5">
                                Open Space Datasets from Western Region
                            </Table.Cell>
                            {/* <Table.Cell>9</Table.Cell> */}
                            <Table.Cell textAlign="right">Kaski</Table.Cell>
                            <Table.Cell textAlign="right">
                                Pokhara Metropolitan City
                            </Table.Cell>
                            <Table.Cell textAlign="right">17</Table.Cell>
                            <Table.Cell textAlign="right">
                                {' '}
                                5 cities of Western Region
                            </Table.Cell>
                            <Table.Cell>2018-West Survey</Table.Cell>
                            <Table.Cell rowSpan="5">40</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 10</Table.Cell> */}
                            <Table.Cell textAlign="right">Baglung</Table.Cell>
                            <Table.Cell textAlign="center">
                                Baglung Bazar Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">5</Table.Cell>
                            <Table.Cell textAlign="right">
                                6 cities of Western Region
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                2018-West Survey
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 11</Table.Cell> */}
                            <Table.Cell textAlign="right">Palpa</Table.Cell>
                            <Table.Cell textAlign="center">
                                Tansen Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">9</Table.Cell>
                            <Table.Cell textAlign="right">
                                7 cities of Western Region
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                2018-West Survey
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 12</Table.Cell> */}
                            <Table.Cell textAlign="right">Syangja</Table.Cell>
                            <Table.Cell textAlign="center">
                                Putali Bazar Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">6</Table.Cell>
                            <Table.Cell textAlign="right">
                                8 cities of Western Region
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                2018-West Survey
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            {/* <Table.Cell> 13</Table.Cell> */}
                            <Table.Cell textAlign="right">Gulmi</Table.Cell>
                            <Table.Cell textAlign="center">
                                Resunga Municipality
                            </Table.Cell>
                            <Table.Cell textAlign="right">3</Table.Cell>
                            <Table.Cell textAlign="right">
                                9 cities of Western Region
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                2018-West Survey
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        );
    }
}
