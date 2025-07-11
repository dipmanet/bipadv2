import React from "react";
import { Table } from "semantic-ui-react";
import styles from "./styles.module.scss";

export default class MetaData extends React.PureComponent {
	public render() {
		return (
			<div className={styles.mainTAble} id="main-table">
				<div className={styles.template}>
					<h3>Community Spaces Data Template </h3>
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
									<Table.Cell>Image</Table.Cell>
									<Table.Cell>File</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>3</Table.Cell>
									<Table.Cell>Ward No</Table.Cell>
									<Table.Cell>Number</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>4</Table.Cell>
									<Table.Cell>Current Land Use/Category</Table.Cell>
									<Table.Cell>String</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>5</Table.Cell>
									<Table.Cell>Coordinates, Elevation</Table.Cell>
									<Table.Cell>String</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>6</Table.Cell>
									<Table.Cell>Longitude</Table.Cell>
									<Table.Cell>Number</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>7</Table.Cell>
									<Table.Cell>Latitude</Table.Cell>
									<Table.Cell>Number</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>8</Table.Cell>
									<Table.Cell>Elevation</Table.Cell>
									<Table.Cell>Number</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>9</Table.Cell>
									<Table.Cell>Description</Table.Cell>
									<Table.Cell>String</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>10</Table.Cell>
									<Table.Cell>Remarks</Table.Cell>
									<Table.Cell>String</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>
					</div>
				</div>
			</div>
		);
	}
}
