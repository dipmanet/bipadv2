import React from 'react';
import { Table } from 'semantic-ui-react';
import styles from './styles.scss';

export default class MetaData extends React.PureComponent {
    public render() {
        return (
            <div className={styles.template}>
                <h3>
                    Environment Checklist.(Each open space has a EIA table. )
                </h3>
                <div className={styles.templateTable}>
                    <Table fixed collapsing>
                        <Table.Body>

                            <Table.Row>
                                <Table.Cell>1</Table.Cell>
                                <Table.Cell>Name</Table.Cell>
                                <Table.Cell>Tundikhel</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>2</Table.Cell>

                                <Table.Cell>Municipality</Table.Cell>
                                <Table.Cell>Bhimeshwor municipality</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>3</Table.Cell>

                                <Table.Cell>Is it a protected area?</Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>4</Table.Cell>

                                <Table.Cell>
                                    Is it a buffer zone of a protected area?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>5</Table.Cell>

                                <Table.Cell>
                                    Is it a cultural heritage site?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>6</Table.Cell>
                                <Table.Cell>Densely populated area?</Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>7</Table.Cell>


                                <Table.Cell>
                                    Special area for protection of biodiversity?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>8</Table.Cell>

                                <Table.Cell>
                                    Will the project cause increase in peak and
                                    flows? (Including from temporary or
                                    permanent water)
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>9</Table.Cell>

                                <Table.Cell>
                                    Will project require temporary or permanent
                                    support facilities?
                                </Table.Cell>
                                <Table.Cell>Yes</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>10</Table.Cell>

                                <Table.Cell>
                                    Are ecosystems related to project fragile or
                                    degraded?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>11</Table.Cell>

                                <Table.Cell>
                                    Will project cause impairment of ecological
                                    opportunities?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>12</Table.Cell>

                                <Table.Cell>
                                    Will project cause air, soil or water
                                    pollution?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>13</Table.Cell>

                                <Table.Cell>Municipality</Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>14</Table.Cell>

                                <Table.Cell>
                                    Will project cause increased waste
                                    production?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>15</Table.Cell>

                                <Table.Cell>
                                    Will project cause hazardous waste
                                    production?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>16</Table.Cell>

                                <Table.Cell>
                                    Will project cause threat to local
                                    ecosystems due to invasive species?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>17</Table.Cell>

                                <Table.Cell>
                                    Will project cause greenhouse gas emissions?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>18</Table.Cell>

                                <Table.Cell>
                                    Will project cause use of pesticides?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>19</Table.Cell>

                                <Table.Cell>
                                    Does the project encourage the use of
                                    environmentally friendly technologies?
                                </Table.Cell>
                                <Table.Cell>Yes</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>20</Table.Cell>

                                <Table.Cell>
                                    Other environmental issues, e.g. noise and
                                    traffic?
                                </Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
        );
    }
}
