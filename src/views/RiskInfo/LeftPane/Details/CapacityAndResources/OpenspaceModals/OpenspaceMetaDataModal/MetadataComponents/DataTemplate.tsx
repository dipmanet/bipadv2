import React from "react";
import { Table } from "semantic-ui-react";
import styles from "./styles.module.scss";

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
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>2</Table.Cell>
								<Table.Cell>Province</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>3</Table.Cell>
								<Table.Cell>OID</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>4</Table.Cell>
								<Table.Cell>District</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>5</Table.Cell>
								<Table.Cell>Municipality</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>6</Table.Cell>
								<Table.Cell>HLCIT_MUN</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>7</Table.Cell>
								<Table.Cell>Ward</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>8</Table.Cell>
								<Table.Cell>Address</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>9</Table.Cell>
								<Table.Cell>Coordinates, Elevation</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>10</Table.Cell>
								<Table.Cell>Longitude</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>11</Table.Cell>
								<Table.Cell>Latitude</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>12</Table.Cell>
								<Table.Cell>Elevation</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>13</Table.Cell>
								<Table.Cell>Total Area</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>14</Table.Cell>
								<Table.Cell>Usable-2013</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>15</Table.Cell>
								<Table.Cell>Usable Open Space Area</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>16</Table.Cell>
								<Table.Cell>Area Changed</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>17</Table.Cell>
								<Table.Cell>Capacity</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>18</Table.Cell>
								<Table.Cell>Suggested Use</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>19</Table.Cell>
								<Table.Cell>Current Land Use</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>20</Table.Cell>
								<Table.Cell>Catchment Area</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>21</Table.Cell>
								<Table.Cell>Access to Site</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>22</Table.Cell>
								<Table.Cell>Ownership</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>23</Table.Cell>
								<Table.Cell>Special features</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>24</Table.Cell>
								<Table.Cell>WASH Facilities_YN</Table.Cell>
								<Table.Cell>Boolean(Yes/No)</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>25</Table.Cell>
								<Table.Cell>WASH Facilities</Table.Cell>
								<Table.Cell>Boolean(Yes/No)</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>26</Table.Cell>
								<Table.Cell>Internet_YN</Table.Cell>
								<Table.Cell>Boolean(Yes/No)</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>27</Table.Cell>
								<Table.Cell>Internet</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>28</Table.Cell>
								<Table.Cell>Boundary Wall_YN</Table.Cell>
								<Table.Cell>Boolean(Yes/No)</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>29</Table.Cell>
								<Table.Cell>Boundary Wall</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>30</Table.Cell>
								<Table.Cell>Electricity Line_YN</Table.Cell>
								<Table.Cell>Boolean(Yes/No)</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>31</Table.Cell>
								<Table.Cell>Trees and Vegetation_YN</Table.Cell>
								<Table.Cell>Boolean(Yes/No)</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>32</Table.Cell>
								<Table.Cell>Trees and Vegetation</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>33</Table.Cell>
								<Table.Cell>Health Facilities</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>34</Table.Cell>
								<Table.Cell>Market</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>35</Table.Cell>
								<Table.Cell>Security</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>36</Table.Cell>
								<Table.Cell>Helipad</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>37</Table.Cell>
								<Table.Cell>Educational Infrastructures</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>38</Table.Cell>
								<Table.Cell>Issues</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>39</Table.Cell>
								<Table.Cell>Description</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>40</Table.Cell>
								<Table.Cell>Change_Remarks</Table.Cell>
								<Table.Cell>String</Table.Cell>
							</Table.Row>
							<Table.Row>
								{" "}
								<Table.Cell>41</Table.Cell>
								<Table.Cell>Perimeter</Table.Cell>
								<Table.Cell>Number</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</div>
			</div>
		);
	}
}
