import React, { useEffect, useRef } from "react";
import styles from "./styles.module.scss";

const InfoBox = (props: {
	show?: any;
	message?: any;
	onClickOutside?: any;
	children: JSX.Element;
}) => {
	const ref = useRef(null);
	const { onClickOutside } = props;

	useEffect(() => {
		const handleClickOutside = (event: { target: any }) => {
			if (ref.current && !ref.current.contains(event.target)) {
				onClickOutside && onClickOutside();
			}
		};
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [onClickOutside]);

	if (!props.show) {
		return null;
	}

	return (
		<div ref={ref} className={styles.infoBox} id="12">
			{props.children}
		</div>
	);
};

export default InfoBox;
