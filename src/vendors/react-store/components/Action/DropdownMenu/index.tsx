import PropTypes from "prop-types";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { _cs } from "@togglecorp/fujs";

import Icon from "../../General/Icon";
import { calcFloatPositionInMainWindow } from "../../../utils/bounds";
import FloatingContainer from "../../View/FloatingContainer";

import styles from "./styles.module.scss";

const noOp = () => {};

/**
 * Iconleft is the name of ionicon in left of title button
 * showDropdown shows chevron on right of title button
 * */
const propTypes = {
	className: PropTypes.string,

	/**
	 * child elements
	 */
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,

	iconName: PropTypes.string,

	hideDropdownIcon: PropTypes.bool,

	leftComponent: PropTypes.node,

	title: PropTypes.string,

	dropdownClassName: PropTypes.string,

	dropdownIcon: PropTypes.string,
	dropdownIconClassName: PropTypes.string,

	onClick: PropTypes.func,

	closeOnClick: PropTypes.bool,

	tooltip: PropTypes.string,
};

const defaultProps = {
	className: "",
	iconName: undefined,
	leftComponent: undefined,
	hideDropdownIcon: false,
	title: undefined,
	dropdownClassName: "",
	dropdownIcon: "chevronDown",
	dropdownIconClassName: "",
	onClick: noOp,
	closeOnClick: false,
	tooltip: undefined,
};

function DropdownMenu(props) {
	const {
		className: classNameFromProps,
		children,
		iconName,
		hideDropdownIcon,
		leftComponent,
		title,
		dropdownClassName,
		dropdownIcon,
		dropdownIconClassName,
		onClick,
		closeOnClick,
		tooltip,
	} = props;

	const [showDropdown, setShowDropdown] = useState(false);
	const containerRef = useRef(null);
	const dropdownContainerRef = useRef(null);
	const boundingClientRectRef = useRef({});

	// Equivalent to componentDidMount and componentWillUnmount
	useEffect(() => {
		function handleWindowClick() {
			setTimeout(() => {
				if (closeOnClick && showDropdown) {
					setShowDropdown(false);
				}
			}, 0);
		}

		window.addEventListener("click", handleWindowClick);
		return () => {
			window.removeEventListener("click", handleWindowClick);
		};
	}, [closeOnClick, showDropdown]);

	const handleDropdownClick = useCallback(
		(e) => {
			e.stopPropagation();

			if (containerRef.current) {
				boundingClientRectRef.current = containerRef.current.getBoundingClientRect();
			}

			setShowDropdown((oldShowDropdown) => {
				const newShowDropdown = !oldShowDropdown;
				onClick(newShowDropdown, e);
				return newShowDropdown;
			});
		},
		[onClick]
	);

	const handleDropdownContainerBlur = useCallback(() => {
		setShowDropdown(false);
	}, []);

	const handleCloseFromChildren = useCallback(() => {
		setShowDropdown(false);
	}, []);

	const handleDropdownContainerInvalidate = useCallback(() => {
		const dropdownContainer = dropdownContainerRef.current;
		if (!dropdownContainer) {
			return {};
		}

		const contentRect = dropdownContainer?.getBoundingClientRect();
		let parentRect = boundingClientRectRef.current;

		if (containerRef.current) {
			parentRect = containerRef.current?.getBoundingClientRect();
		}

		const optionsContainerPosition = calcFloatPositionInMainWindow({
			parentRect,
			contentRect,
		});
		return optionsContainerPosition;
	}, []);

	const renderDropdownButton = () => {
		const leftIconClassName = _cs("left-icon", styles.leftIcon);

		const className = _cs(
			"dropdown-button",
			styles.dropdownButton,
			(leftComponent || iconName) && styles.hasLeft
		);

		const titleClassName = _cs("title", styles.title);

		const iconClassName = _cs("dropdown-icon", styles.dropdownIcon, dropdownIconClassName);

		return (
			<button onClick={handleDropdownClick} className={className} type="button">
				{iconName && <Icon className={leftIconClassName} name={iconName} />}
				{leftComponent}
				{title && <span className={titleClassName}>{title}</span>}
				{!hideDropdownIcon && <Icon className={iconClassName} name={dropdownIcon} />}
			</button>
		);
	};

	const renderDropdownContainer = () => {
		const className = _cs(dropdownClassName, "dropdown-container", styles.dropdownContainer);

		let modifiedChildren = children;

		if (React.Children.count(children) === 1 && React.isValidElement(children)) {
			const newProps = { closeModal: handleCloseFromChildren };
			modifiedChildren = React.cloneElement(children, newProps);
		}

		return (
			<FloatingContainer
				ref={dropdownContainerRef}
				className={className}
				onBlur={handleDropdownContainerBlur}
				parent={containerRef.current}
				onInvalidate={handleDropdownContainerInvalidate}>
				{modifiedChildren}
			</FloatingContainer>
		);
	};

	const className = _cs(
		classNameFromProps,
		"dropdown-menu",
		styles.dropdownMenu,
		showDropdown && "active",
		showDropdown && styles.active
	);

	return (
		<div ref={containerRef} className={className} title={tooltip}>
			{renderDropdownButton()}
			{showDropdown && renderDropdownContainer()}
		</div>
	);
}

DropdownMenu.propTypes = propTypes;
DropdownMenu.defaultProps = defaultProps;

export default DropdownMenu;
