/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable css-modules/no-undef-class */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import Source from "#resources/icons/IbfSource.svg";
import Button from "../Components/CollapsableButton";
import SSource from "../Components/SSource";
import style from "./styles.module.scss";

interface Props {
	handleWidthToggle: (bool: boolean) => void;
}

const SourceCon = ({ handleWidthToggle }: Props) => {
	const [toggle, setToggle] = useState(false);

	return (
		<div>
			<Button
				btnClassName={style.sourceBtn}
				btnName={"Source"}
				btnIcon={Source}
				setToggleBtn={setToggle}
				toggleBtn={toggle}
				handleWidth={handleWidthToggle}
			/>
			<SSource
				sourceClassName={style.sourceModal}
				setToggleSource={setToggle}
				toggleSource={toggle}
				handleWidth={handleWidthToggle}
			/>
		</div>
	);
};

export default SourceCon;
