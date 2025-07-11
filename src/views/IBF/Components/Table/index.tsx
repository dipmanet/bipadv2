/* eslint-disable react/no-array-index-key */
import React from "react";

import { _cs } from "@togglecorp/fujs";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
import style from "./styles.module.scss";

const Table = ({ theadData, tbodyData }: any) => {
	tbodyData.sort((a, b) => {
		const munA = a[0].toLowerCase();
		const munB = b[0].toLowerCase();

		if (munA < munB) {
			return -1;
		}
		if (munA > munB) {
			return 1;
		}
		return 0;
	});
	return (
		<table className={style.federalTable}>
			<thead className={style.fedHead}>
				<tr className={style.fedRow}>
					{theadData.map((h, index) => (
						<TableHeader key={index} item={h} />
					))}
				</tr>
			</thead>
			<tbody className={style.fedBody}>
				{tbodyData.map((item, index) => (
					<TableRow key={index} data={item} />
				))}
			</tbody>
		</table>
	);
};

export default Table;
