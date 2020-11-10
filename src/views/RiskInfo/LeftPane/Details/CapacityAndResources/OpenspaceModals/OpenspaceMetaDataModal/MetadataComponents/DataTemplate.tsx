import React from 'react';
import { Table } from 'semantic-ui-react';
import styles from './styles.scss';

export default class MetaData extends React.PureComponent {
    public render() {
        return (
            <div className={styles.template}>
                <h3>Open Spaces Data Template </h3>
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
                                <Table.Cell>Province</Table.Cell>
                                <Table.Cell>3</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>3</Table.Cell>
                                <Table.Cell>District</Table.Cell>
                                <Table.Cell>Dolakha</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>4</Table.Cell>
                                <Table.Cell>Municipality</Table.Cell>
                                <Table.Cell>Bhimeshwor municipality</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>5</Table.Cell>
                                <Table.Cell>Ward</Table.Cell>
                                <Table.Cell>3</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>6</Table.Cell>
                                <Table.Cell>Address</Table.Cell>
                                <Table.Cell />
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>7</Table.Cell>
                                <Table.Cell>Coordinates, Elevation</Table.Cell>
                                <Table.Cell>
                                    27.669587°, 86.049398°, 1990
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>8</Table.Cell>
                                <Table.Cell>Longitude</Table.Cell>
                                <Table.Cell>86.049398</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>9</Table.Cell>
                                <Table.Cell>Latitude</Table.Cell>
                                <Table.Cell>27.669587</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>10</Table.Cell>
                                <Table.Cell>Elevation</Table.Cell>
                                <Table.Cell>1990</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>11</Table.Cell>
                                <Table.Cell>Total Area</Table.Cell>
                                <Table.Cell>10,758</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>12</Table.Cell>
                                <Table.Cell>Usable Open Space Area</Table.Cell>
                                <Table.Cell>7,970</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>13</Table.Cell>
                                <Table.Cell>Capacity</Table.Cell>
                                <Table.Cell>2,277</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>14</Table.Cell>
                                <Table.Cell>Current Land Use</Table.Cell>
                                <Table.Cell>Multi-purpose ground</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>15</Table.Cell>
                                <Table.Cell>Catchment Area</Table.Cell>
                                <Table.Cell>
                                    Charikot Bazar, Gautam Tole, Pakha Tole
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>16</Table.Cell>
                                <Table.Cell>Access to Site</Table.Cell>
                                <Table.Cell>Blacktopped road</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>17</Table.Cell>
                                <Table.Cell>Ownership</Table.Cell>
                                <Table.Cell>Government of Nepal</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>18</Table.Cell>
                                <Table.Cell>Special features</Table.Cell>
                                <Table.Cell>
                                    Major sports ground of Dolakha district
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>19</Table.Cell>
                                <Table.Cell>WASH Facilities_YN</Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>20</Table.Cell>
                                <Table.Cell>WASH Facilities</Table.Cell>
                                <Table.Cell />
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>21</Table.Cell>
                                <Table.Cell>Internet_YN</Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>22</Table.Cell>
                                <Table.Cell>Internet</Table.Cell>
                                <Table.Cell />
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>23</Table.Cell>
                                <Table.Cell>Boundary Wall_YN</Table.Cell>
                                <Table.Cell>Yes</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>24</Table.Cell>
                                <Table.Cell>Boundary Wall</Table.Cell>
                                <Table.Cell>Fence on one side</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>25</Table.Cell>
                                <Table.Cell>Electricity Line</Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>26</Table.Cell>
                                <Table.Cell>Trees and Vegetation_YN</Table.Cell>
                                <Table.Cell>No</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>27</Table.Cell>
                                <Table.Cell>Trees and Vegetation</Table.Cell>
                                <Table.Cell />
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>28</Table.Cell>
                                <Table.Cell>Health Facilities</Table.Cell>
                                <Table.Cell>
                                    Samudayik Hospital Pvt. Ltd., Chhorolpa
                                    Hospital Pvt. Ltd., Primary Health Centre
                                    within 250 m, Charikot PHC
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>29</Table.Cell>
                                <Table.Cell>Market</Table.Cell>
                                <Table.Cell>Charikot bazar</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>30</Table.Cell>
                                <Table.Cell>Security</Table.Cell>
                                <Table.Cell>
                                    District Police Office (50 m south), APF (50
                                    m east), Nepal Army, Police Station
                                    Satdobato
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>31</Table.Cell>
                                <Table.Cell>Helipad</Table.Cell>
                                <Table.Cell>Army helipad (500 m)</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>32</Table.Cell>
                                <Table.Cell>
                                    Educational Infrastructures
                                </Table.Cell>
                                <Table.Cell>
                                    Pashupati Kanya School (300 m),
                                    Gaurishankhar Campus (500 m), Seto Gurans
                                    Bal Batika, Tripura Glorious Academy, Shree
                                    Darfe Devisthan Pra. Bi.
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>33</Table.Cell>
                                <Table.Cell>Issues</Table.Cell>
                                <Table.Cell>
                                    Proper management of open space with basic
                                    WASH facility and boundary wall around the
                                    site
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>34</Table.Cell>
                                <Table.Cell>Description</Table.Cell>
                                <Table.Cell />
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>35</Table.Cell>
                                <Table.Cell>Change_Remarks</Table.Cell>
                                <Table.Cell />
                            </Table.Row>
                            <Table.Row>
                                {' '}
                                <Table.Cell>36</Table.Cell>
                                <Table.Cell>Perimeter</Table.Cell>
                                <Table.Cell />
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
        );
    }
}
