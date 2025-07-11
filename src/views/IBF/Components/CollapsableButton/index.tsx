/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable @typescript-eslint/indent */
import React, { useRef } from "react";
import { _cs } from "@togglecorp/fujs";
import styles from "./styles.module.scss";

interface Props {
	btnClassName: string;
	btnName: string;
	btnIcon: any;
	setToggleBtn: React.Dispatch<React.SetStateAction<boolean>>;
	toggleBtn: boolean;
	handleWidth: (bool: boolean) => void;
}

const CollapsableButton = ({
	btnClassName,
	btnName,
	btnIcon,
	setToggleBtn,
	toggleBtn,
	handleWidth,
}: Props) => {
	const positionTrackRef = useRef<HTMLButtonElement>(null);
	return (
		<button
			type="button"
			ref={positionTrackRef}
			className={_cs(styles.btn, btnClassName, toggleBtn ? styles.visible : styles.hidden)}
			onClick={() => {
				setToggleBtn(false);
				handleWidth(false);
			}}>
			<div className={styles.btnContent}>
				<img className={styles.icon} src={btnIcon} alt={btnName} />
				<span className={styles.tag}>{btnName}</span>
			</div>
		</button>
	);
};
export default CollapsableButton;
