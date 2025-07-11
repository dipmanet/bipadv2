/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { MainPageDataContext } from "../../context";
import SelectOptions from "./Options";

interface Props {
	selectFieldValues: {
		optionTitle: string;
		optionValues: string[];
	}[];
	selctFieldCurrentValue: string;
	setSelctFieldCurrentValue: any;
}
const SelectComponent = (props: Props) => {
	const [showOption, setShowOption] = useState(false);
	const optionShowRef = useRef(null);
	const { setSelectFieldValue, setCurrentRechartsItem } = useContext(MainPageDataContext);
	const { selectFieldValues, selctFieldCurrentValue, setSelctFieldCurrentValue } = props;

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (optionShowRef.current && !optionShowRef.current.contains(event.target)) {
				setShowOption(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		// Bind the event listener
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		setCurrentRechartsItem("");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selctFieldCurrentValue]);

	const onSelectClick = () => {
		setShowOption((state) => !state);
	};

	const onOptionClick = (itemVal: string) => {
		setShowOption(false);
		setSelctFieldCurrentValue(itemVal);
		setSelectFieldValue(itemVal);
	};

	return (
		<>
			<div className={styles.selectContainer} ref={optionShowRef}>
				<div className={styles.mainDiv}>
					<div className={styles.selectField} onClick={onSelectClick}>
						<p className={styles.selectItem}>{selctFieldCurrentValue}</p>
						<div className={styles.selectIcon} />
					</div>
				</div>
				{showOption && (
					<div className={styles.mainOptionDiv}>
						{selectFieldValues.map((item) => (
							<SelectOptions
								optionTitle={item.optionTitle}
								optionValues={item.optionValues}
								onOptionClick={onOptionClick}
							/>
						))}
					</div>
				)}
			</div>
		</>
	);
};

export default SelectComponent;
