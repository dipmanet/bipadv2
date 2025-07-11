/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useEffect } from "react";
import { Translation } from "react-i18next";
import { _cs } from "@togglecorp/fujs";
import styles from "./styles.module.scss";

const TableDataList = ({
	population,
	literacy,
	householdSummary,
	ageGroup,
	selectedCategory,
	language,
}) => (
	<>
		<Translation>
			{(t) => (
				<div
					style={{
						overflow: "auto",
						marginTop: "20px",
						borderLeft: "1px solid #ddd",
						borderRight: "1px solid #ddd",
					}}>
					{selectedCategory === 1 ? (
						<table className={_cs(styles.contacts, language === "np" && styles.languageFont)}>
							<thead>
								<tr>
									<th colSpan="5" scope="colgroup" style={{ textAlign: "center" }}>
										{t("Population")}
									</th>
								</tr>
								<tr>
									{householdSummary.map((item) => (
										<th scope="col" key={item.key}>
											{item.label}
										</th>
									))}
									{population.map((data) => (
										<th scope="col" key={data.key}>
											{data.label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{householdSummary.map((item) => (
									<td key={item.key}>{item.value}</td>
								))}
								{population.map((data) => (
									<td key={data.key}>{data.value}</td>
								))}
							</tbody>
						</table>
					) : (
						""
					)}
					{selectedCategory === 2 ? (
						<table className={_cs(styles.contacts, language === "np" && styles.languageFont)}>
							<thead>
								<tr>
									<th colSpan="4" scope="colgroup" style={{ textAlign: "center" }}>
										{t("Population By Age Group")}
									</th>
								</tr>
								<tr>
									<th scope="col">{t("Age Group")}</th>
									<th scope="col">{t("Male")}</th>
									<th scope="col">{t("Female")}</th>
									<th scope="col">{t("Others")}</th>
								</tr>
							</thead>
							<tbody>
								{ageGroup.map((data) => (
									<tr key={data.key}>
										<td>{data.label}</td>
										<td>{data.male}</td>
										<td>{data.female}</td>
										<td>{data.other ? data.other : "-"}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						""
					)}
					{selectedCategory === 3 ? (
						<table className={_cs(styles.contacts, language === "np" && styles.languageFont)}>
							<thead>
								<tr>
									<th colSpan={literacy.length} scope="colgroup" style={{ textAlign: "center" }}>
										{t("Literacy Rate")}
									</th>
								</tr>
								<tr>
									{literacy.map((item) => (
										<th scope="col" key={item.key}>
											{item.label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{literacy.map((item) => (
									<td key={item.key}>{item.value}</td>
								))}
							</tbody>
						</table>
					) : (
						""
					)}
				</div>
			)}
		</Translation>
	</>
);

export default TableDataList;
