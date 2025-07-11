import React from "react";
import { connect } from "react-redux";

import { Table } from "semantic-ui-react";

import { AppState } from "#store/types";
import { districtsSelector, municipalitiesSelector, provincesSelector } from "#selectors";

import { ProvinceElement, DistrictElement, MunicipalityElement } from "#types";
import styles from "./styles.module.scss";

interface OwnProps {
	allData: AllData;
}

interface AllData {
	title: string;
	province: number;
	oid: string;
	hlcitMunicipalty: string;
	ward: string;
	address: string;
	district: string;
	municipality: string;
	usableArea: string;
	usable2013: string;
	areaChange: string;
	totalArea: string;
	ownership: string;
	specialFeature: string;
	accessToSite: string;
	elevation: string;
	catchmentArea: string;
	currentLandUse: string;
	changeRemarks: string;
	issue: string;
	description: string;
	perimeter: string;
}

interface Rows {
	name: number;
	title: string;
	value: any;
}

interface PropsFromState {
	provinceList: ProvinceElement[];
	districtList: DistrictElement[];
	municipalityList: MunicipalityElement[];
}

type Props = PropsFromState & OwnProps;

function createData(name: number, title: string, value: string) {
	return { name, title, value };
}

const mapStateToProps = (state: AppState): PropsFromState => ({
	provinceList: provincesSelector(state),
	districtList: districtsSelector(state),
	municipalityList: municipalitiesSelector(state),
});

const TableComponent: React.FC<Props> = (props: Props) => {
	const { allData, provinceList, districtList, municipalityList } = props;
	let provinceName;
	let districtName;
	let municipalityName;
	if (allData.province) {
		provinceName = provinceList.find((province) => province.id === allData.province);
	}
	if (allData.district) {
		districtName = districtList.find((district) => district.id === allData.district);
	}
	if (allData.municipality) {
		municipalityName = municipalityList.find((muni) => muni.id === allData.municipality);
	}

	let coordinatesString;
	if (allData.point) {
		if (allData.point.coordinates) {
			coordinatesString = allData.point.coordinates;
		}
	}
	const rows = [
		createData(1, "Name of OpenSpace", allData.title),
		createData(2, "Province", provinceName ? provinceName.title : "N/A"),
		createData(6, "OID", allData.oid || "N/A"),
		createData(3, "District", districtName ? districtName.title : "N/A"),
		createData(4, "Municipality", municipalityName ? municipalityName.title : "N/A"),
		createData(6, "HlCIT-MUN", allData.hlcitMunicipalty),
		createData(6, "Ward", allData.ward),
		createData(6, "Address", allData.address),
		createData(6, "Coordinates, Elevation", JSON.stringify(coordinatesString)),
		createData(6, "Longitude", coordinatesString && coordinatesString[0]),
		createData(6, "Latitude", coordinatesString && coordinatesString[1]),
		createData(11, "Elevation", allData.elevation),
		createData(6, "Total Area", allData.totalArea),
		createData(7, "Usable-2013", allData.usableAreaSecond),
		createData(7, "Usable Open Space Area", allData.usableArea),
		createData(7, " Area Change", allData.areaChange),
		createData(7, "Usable Area", allData.usableArea),
		createData(5, "Capacity", (allData.usableArea / 3.5).toFixed(0)),
		createData(7, "Suggested Use", allData.suggestedUse),
		createData(7, "Current Land Use", allData.currentLandUse),
		createData(7, "Catchment Area", allData.catchmentArea),
		createData(10, "Access to Site", allData.accessToSite),
		createData(8, "Ownership", allData.ownership),
		createData(9, "Special Features", allData.specialFeature),
		createData(7, "Issues", allData.issue),
		createData(7, "Description", allData.description),
		createData(7, "Change_Remarks", allData.changeRemarks),
		createData(7, "Perimeter", allData.perimeter),
	];
	return (
		<div className={styles.tableContent}>
			<Table celled color="grey">
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell className={styles.tableHead}>SN</Table.HeaderCell>
						<Table.HeaderCell className={styles.tableHead}>Title</Table.HeaderCell>
						<Table.HeaderCell className={styles.tableHead}>Value</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{rows &&
						rows.map((row, i) => (
							<Table.Row>
								<Table.Cell>{i + 1}</Table.Cell>
								<Table.Cell>{row.title}</Table.Cell>
								<Table.Cell>{row.value}</Table.Cell>
							</Table.Row>
						))}
				</Table.Body>
			</Table>
		</div>
	);
};

export default connect(mapStateToProps)(TableComponent);
