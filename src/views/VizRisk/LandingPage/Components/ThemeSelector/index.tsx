import React, { useEffect } from "react";
import styles from "./styles.module.scss";

interface Props {
	selectFieldValue: any[];
	selctFieldCurrentValue: string;
	setSelctFieldCurrentValue: React.Dispatch<React.SetStateAction<string>>;
	disabled: boolean;
}

const SelectComponent = (props: Props) => {
	const [disable, setDisable] = React.useState(false);
	const { selectFieldValue, selctFieldCurrentValue, setSelctFieldCurrentValue, disabled } = props;
	const title = "Select By Themes";

	const checkDisable = () => {
		if (disabled) {
			return null;
		}
		if (disable) {
			return true;
		}
	};

	return (
		<div className={styles.theme}>
			<select
				className={styles.mainSelect}
				value={selctFieldCurrentValue}
				// defaultValue={'Select By Themes'}
				onChange={(e) => setSelctFieldCurrentValue(e.target.value)}
				onClick={() => setDisable(true)}>
				<option className={styles.mainOptions} disabled={checkDisable}>
					{title}
				</option>
				{selectFieldValue.map((item) => (
					<option className={styles.mainOptions} key={`select-${item}`} value={item}>
						{item}
					</option>
				))}
			</select>
		</div>
	);
};
export default SelectComponent;
