import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { _cs } from "@togglecorp/fujs";
import styles from "#components/Navbar/MenuItem/styles.module.scss";

interface CustomNavLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
	to: string;
	disabled?: boolean;
	children: React.ReactNode;
	className?: string;
	activeClassName?: string;
	disabledClassName?: string;
}

const CustomNavLink: React.FC<CustomNavLinkProps> = ({
	to,
	disabled,
	children,
	className,
	activeClassName = styles.active,
	disabledClassName = styles.disabled,
	...rest
}) => {
	const location = useLocation();
	const navigate = useNavigate();

	const isActive = location.pathname === to;

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (disabled) {
			e.preventDefault();
			return;
		}
		e.preventDefault();
		navigate(to);
	};

	return (
		<Link
			to={disabled ? "#" : to}
			className={_cs(
				styles.menuItem,
				className,
				isActive && activeClassName,
				disabled && disabledClassName
			)}
			onClick={handleClick}
			{...rest}>
			{children}
		</Link>
	);
};

export default CustomNavLink;
