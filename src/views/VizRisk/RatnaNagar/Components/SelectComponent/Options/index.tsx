import React from "react";
import styles from "./styles.module.scss";

interface Props {
	optionValues: string[];
	optionTitle?: string;
	onOptionClick: (item: string) => void;
}
const SelectOptions = (props: Props) => {
	const { optionTitle, optionValues, onOptionClick } = props;
	return (
		<div className={styles.optionDiv}>
			{!!optionTitle && (
				<div
					style={{
						color: "white",
						fontSize: 16,
					}}
					className={styles.optionTitle}>
					{optionTitle}
				</div>
			)}
			{optionValues.map((item) => (
				<div
					role="button"
					tabIndex={-1}
					onKeyDown={() => onOptionClick(item)}
					className={styles.optionField}
					onClick={() => onOptionClick(item)}
					key={item}>
					<div className={styles.optionName}>{item}</div>
				</div>
			))}
			{/* {
                !!optionTitle
                && <div className={styles.lineDecorator} />
            } */}
		</div>
	);
};

export default SelectOptions;
