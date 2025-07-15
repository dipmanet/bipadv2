import React, { useCallback, useEffect, useRef } from "react";
import { resolve, _cs } from "@togglecorp/fujs";
import { FaramActionElement } from "@togglecorp/faram";

import Spinner from "../../../v2/View/Spinner";
import Icon from "../../General/Icon";

import styles from "./styles.module.scss";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	buttonType?: string;
	className?: string;
	children?: React.ReactNode;
	disabled?: boolean;
	pending?: boolean;
	iconName?: string;
	onClick?: (args: { event: React.MouseEvent<HTMLButtonElement>; params: any }) => void;
	onClickParams?: Record<string, unknown> | (() => any);
	smallHorizontalPadding?: boolean;
	smallVerticalPadding?: boolean;
	transparent?: boolean;
	changeDelay?: number;
}

function Button(props: ButtonProps) {
	const {
		iconName,
		children,
		disabled = false,
		pending = false,
		type = "button",
		buttonType = "button-default",
		className: classNameFromProps = "",
		smallHorizontalPadding = false,
		smallVerticalPadding = false,
		transparent = false,
		onClick = () => {},
		onClickParams,
		changeDelay = 0,
		...otherProps
	} = props;

	const changeTimeoutRef = useRef<number | undefined>();

	useEffect(() => {
		return () => {
			if (changeTimeoutRef.current) {
				clearTimeout(changeTimeoutRef.current);
			}
		};
	}, []);

	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			clearTimeout(changeTimeoutRef.current);
			changeTimeoutRef.current = window.setTimeout(() => {
				onClick({
					event: e,
					params: resolve(onClickParams),
				});
			}, changeDelay);
		},
		[onClick, onClickParams, changeDelay]
	);

	const buttonClassName = _cs(
		classNameFromProps,
		"button",
		styles.button,
		buttonType,
		buttonType && styles[buttonType],
		iconName && children && "with-icon-and-children",
		iconName && children && styles.withIconAndChildren,
		smallHorizontalPadding && "small-horizontal-padding",
		smallHorizontalPadding && styles.smallHorizontalPadding,
		smallVerticalPadding && "small-vertical-padding",
		smallVerticalPadding && styles.smallVerticalPadding,
		transparent && "transparent",
		transparent && styles.transparent
	);

	const iconClassName = _cs("icon", styles.icon);

	return (
		<button
			className={buttonClassName}
			disabled={disabled || pending}
			onClick={handleClick}
			type={type}
			{...otherProps}>
			{pending ? (
				<Spinner className={styles.spinner} size="small" />
			) : (
				<Icon name={iconName} className={iconClassName} />
			)}
			{children}
		</button>
	);
}

export default FaramActionElement(Button);
