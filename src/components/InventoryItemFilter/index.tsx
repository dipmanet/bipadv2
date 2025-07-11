import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
// import { FaramInputElement } from '@togglecorp/faram';
import SelectInput from "#rsci/SelectInput";
import Faram from "@togglecorp/faram";
import { riverStationsSelector } from "#selectors";
import { RiverStation } from "#types";
import { compose } from "redux";
import { createRequestClient, methods } from "@togglecorp/react-rest-request";
import { MultiResponse } from "#store/atom/response/types";
import MultiSelectInput from "#rsci/MultiSelectInput";
import styles from "./styles.module.scss";

interface Props {
	onChange: Function;
	value: string[];
	stations: RiverStation[];
}

const basinKeySelector = (r: BasinData) => r.id;
const BasinLabelSelector = (r: BasinData) => r.title;

const basinData = [
	{ id: "1", title: "Babai" },
	{ id: "2", title: "Bagmati" },
	{ id: "3", title: "Kankai" },
	{ id: "4", title: "Karnali" },
	{ id: "5", title: "Koshi" },
	{ id: "6", title: "Mahakali" },
	{ id: "7", title: "Narayani" },
	{ id: "8", title: "West Rapti" },
];

const mapStateToProps = (state: AppState) => ({
	riverStations: riverStationsSelector(state),
});

const InventoryItemsFilter = (props: Props) => {
	const { onChange: onChangeFromProps, value, onChange, filterList: filterListData } = props;

	const [filterList, setFilterList] = useState([]);
	const [selectedBasin, setSelectedBasin] = useState(
		value && Object.keys(value).length > 0 && value.id
	);

	const handleBasinChange = (basinId: number) => {
		onChange(basinId);
		setSelectedBasin(basinId);
		// const basin = basinData.filter(s => s.id === basinId)[0];
		// onChangeFromProps(basin || {});
	};
	useEffect(() => {
		if (props.invertoryItemList.length) {
			const data = props.invertoryItemList.map((i) => ({
				id: i.id,
				title: props.language === "en" ? i.title : i.titleNe,
			}));
			setFilterList(data);
			setSelectedBasin(filterListData);
		}
	}, [filterListData, props.invertoryItemList, props.language]);

	return (
		<div className={styles.basinSelector}>
			{/* <SelectInput
                className={styles.basinInput}

                label="Basin Name"
                options={filterList}
                keySelector={basinKeySelector}
                labelSelector={BasinLabelSelector}
                value={selectedBasin}
                onChange={handleBasinChange}
                placeholder="All Basins"
                autoFocus
            /> */}

			<MultiSelectInput
				className={styles.basinInput}
				label={props.language === "en" ? "Item" : "वस्तु"}
				options={filterList}
				keySelector={basinKeySelector}
				labelSelector={BasinLabelSelector}
				value={selectedBasin}
				onChange={handleBasinChange}
				placeholder={props.language === "en" ? "Select Options" : "विकल्पहरू चयन गर्नुहोस्"}
				autoFocus
			/>
		</div>
	);
};

// export default connect(mapStateToProps, undefined)(FaramInputElement(InventoryItemsFilter));
export default compose(connect(mapStateToProps, null), createRequestClient())(InventoryItemsFilter);
