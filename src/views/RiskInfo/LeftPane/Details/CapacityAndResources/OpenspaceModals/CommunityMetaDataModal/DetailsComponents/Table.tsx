import React from "react";
import { Table } from "semantic-ui-react";
import styles from "./styles.module.scss";
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
							<Table.Cell textAlign="left">Gorkha</Table.Cell>
							<Table.Cell textAlign="left">Gorkha Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 74</Table.Cell>
							<Table.Cell textAlign="left">2019 Field Survey, IOM</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Dolakha</Table.Cell>
							<Table.Cell textAlign="left">Bhimeshwor Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 18</Table.Cell>
							<Table.Cell textAlign="left">2019 Field Survey, IOM</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Sindhupalchowk</Table.Cell>
							<Table.Cell textAlign="left">Chautara Sangachowkgadhi Municipality</Table.Cell>
							<Table.Cell textAlign="left">37 </Table.Cell>
							<Table.Cell textAlign="left">2019 Field Survey, IOM</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Rasuwa</Table.Cell>
							<Table.Cell textAlign="left">Gosainkunda Rural Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 12</Table.Cell>
							<Table.Cell textAlign="left">2019 Field Survey, IOM</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell textAlign="left">Dhading</Table.Cell>
							<Table.Cell textAlign="left">Neelakantha Municipality</Table.Cell>
							<Table.Cell textAlign="left"> 51</Table.Cell>
							<Table.Cell textAlign="left">2019 Field Survey, IOM</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
			</div>
		);
	}
}
