import React from "react";
import Icon from "#rscg/Icon";
import styles from "./styles.module.scss";

interface Props {
	handleBuildingClick: (e: boolean) => void;
	handleSearchTerm: (e: any) => void;
	searchTerm: string;
}

const SearchBox = (props: Props) => {
	const { handleBuildingClick, handleSearchTerm, searchTerm } = props;

	return (
		<div className={styles.searchBox}>
			<button
				type="button"
				onClick={() => handleBuildingClick(false)}
				className={styles.searchbutton}>
				<Icon name="search" className={styles.searchIcon} />
			</button>
			<input
				type="text"
				value={searchTerm}
				onChange={handleSearchTerm}
				placeholder={"Enter House Id"}
			/>
		</div>
	);
};

export default SearchBox;
