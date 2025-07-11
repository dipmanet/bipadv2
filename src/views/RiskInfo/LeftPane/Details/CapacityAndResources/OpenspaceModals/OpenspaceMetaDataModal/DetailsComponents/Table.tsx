import React from "react";
import { Table } from "semantic-ui-react";
import styles from "./styles.module.scss";
// import './table.css';
import "semantic-ui-css/components/table.min.css";

export default class MetaData extends React.PureComponent {
	public render() {
		return (
			<div className={styles.mainTAble} id="metadata-openspace">
				<Table celled structured>
					<Table.Header>
						<Table.Row>
							{/* <Table.HeaderCell rowSpan="1">SN</Table.HeaderCell> */}
							<Table.HeaderCell rowSpan="2">District Name</Table.HeaderCell>
							<Table.HeaderCell rowSpan="2">Municipality/Local Unit</Table.HeaderCell>
							<Table.HeaderCell rowSpan="2">No of Open Spaces</Table.HeaderCell>
							<Table.HeaderCell rowSpan="2">Data Source</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						<Table.Row>
							<Table.Cell textAlign="left">Kathmandu</Table.Cell>
							<Table.Cell textAlign="left">Kathmandu Metropolitan City</Table.Cell>
							<Table.Cell textAlign="left"> 34</Table.Cell>
							<Table.Cell textAlign="left">Update Survey, 2019</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Kathmandu</Table.Cell>
							<Table.Cell textAlign="left">Gokarneshwor Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 1</Table.Cell>
							<Table.Cell textAlign="left">Update Survey, 2019</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Kathmandu</Table.Cell>
							<Table.Cell textAlign="left">Kirtipur Municipality</Table.Cell>
							<Table.Cell textAlign="left">6 </Table.Cell>
							<Table.Cell textAlign="left">Update Survey, 2019</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Bhaktapur</Table.Cell>
							<Table.Cell textAlign="left">Bhaktapur Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 19</Table.Cell>
							<Table.Cell textAlign="left">Update Survey, 2019</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Lalitpur</Table.Cell>
							<Table.Cell textAlign="left">Lalitpur Metropolitan City</Table.Cell>
							<Table.Cell textAlign="left"> 21</Table.Cell>
							<Table.Cell textAlign="left">Update Survey, 2019</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Kathmandu</Table.Cell>
							<Table.Cell textAlign="left">Nagarjun Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 1</Table.Cell>
							<Table.Cell textAlign="left">Update Survey, 2019</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Kathmandu</Table.Cell>
							<Table.Cell textAlign="left">Tokha Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 1</Table.Cell>
							<Table.Cell textAlign="left">Update Survey, 2019</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Gorkha</Table.Cell>
							<Table.Cell textAlign="left">Gorkha Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 11</Table.Cell>
							<Table.Cell textAlign="left">Field Survey 2019, IOM</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Dolakha</Table.Cell>
							<Table.Cell textAlign="left">Bhimeshwor Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 5</Table.Cell>
							<Table.Cell textAlign="left">Field Survey 2019, IOM</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Sindhupalchowk</Table.Cell>
							<Table.Cell textAlign="left">Chautara Sangachowkgadhi Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 6</Table.Cell>
							<Table.Cell textAlign="left">Field Survey 2019, IOM</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Rasuwa</Table.Cell>
							<Table.Cell textAlign="left">Gosainkunda Rural Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 5</Table.Cell>
							<Table.Cell textAlign="left">Field Survey 2019, IOM</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Dhading</Table.Cell>
							<Table.Cell textAlign="left">Neelakantha Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 5</Table.Cell>
							<Table.Cell textAlign="left">Field Survey 2019, IOM</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Kaski</Table.Cell>
							<Table.Cell textAlign="left">Pokhara Metropolitan City</Table.Cell>
							<Table.Cell textAlign="left"> 17</Table.Cell>
							<Table.Cell textAlign="left">2018-West Survey</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Baglung</Table.Cell>
							<Table.Cell textAlign="left">Baglung Bazar Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 5</Table.Cell>
							<Table.Cell textAlign="left">2018-West Survey</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Palpa</Table.Cell>
							<Table.Cell textAlign="left">Tansen Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 9</Table.Cell>
							<Table.Cell textAlign="left">2018-West Survey</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Syangja</Table.Cell>
							<Table.Cell textAlign="left">Putali Bazar Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 6</Table.Cell>
							<Table.Cell textAlign="left">2018-West Survey</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Gulmi</Table.Cell>
							<Table.Cell textAlign="left">Resunga Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 3</Table.Cell>
							<Table.Cell textAlign="left">2018-West Survey</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
			</div>
		);
	}
}
