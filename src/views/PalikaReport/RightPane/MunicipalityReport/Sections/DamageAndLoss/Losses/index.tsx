import React from "react";
import { Table } from "react-bootstrap";
import styles from "./styles.module.scss";

interface Props {}
const Losses = (props: Props) => (
	<div className={styles.tabsPageContainer}>
		<Table striped bordered hover size="md">
			<thead>
				<tr>
					<th>Male</th>
					<th>Female</th>
					<th>Other</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>1</td>
					<td>2064/2065</td>
					<td>Other</td>
				</tr>
				<tr>
					<td>2</td>
					<td>2064/2065</td>
					<td>Other</td>
				</tr>
				<tr>
					<td>3</td>
					<td>2064/2065</td>
					<td>Other</td>
				</tr>
				<tr>
					<td>4</td>
					<td>2064/2065</td>
					<td>Other</td>
				</tr>
				<tr>
					<td>5</td>
					<td>2064/2065</td>
					<td>Other</td>
				</tr>
			</tbody>
		</Table>
	</div>
);

export default Losses;
