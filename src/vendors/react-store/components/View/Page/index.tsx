import PropTypes from "prop-types";
import React from "react";
import { _cs } from "@togglecorp/fujs";

import styles from "./styles.module.scss";

const propTypes = {
	className: PropTypes.string,
	headerClassName: PropTypes.string,
	mainContentClassName: PropTypes.string,
	sidebarClassName: PropTypes.string,
	footerClassName: PropTypes.string,
	header: PropTypes.node,
	mainContent: PropTypes.node,
	sidebar: PropTypes.node,
	footer: PropTypes.node,
	containerRef: PropTypes.object, // eslint-disable-line react/forbid-prop-types
	headerAboveSidebar: PropTypes.bool,
};

const defaultProps = {
	headerAboveSidebar: false,
	className: "",
	headerClassName: "",
	mainContentClassName: "",
	sidebarClassName: "",
	footerClassName: "",
	header: null,
	mainContent: null,
	sidebar: null,
	footer: null,
	containerRef: undefined,
};

export default class Page extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	render() {
		const {
			className,
			header,
			headerClassName,
			mainContent,
			mainContentClassName,
			sidebar,
			sidebarClassName,
			footer,
			footerClassName,
			containerRef,
			headerAboveSidebar,
		} = this.props;

		if (sidebar) {
			if (headerAboveSidebar) {
				return (
					<div className={_cs(className, styles.pageWithHeaderAboveSidebar)} ref={containerRef}>
						<header className={_cs(headerClassName, styles.header)}>{header}</header>
						<div className={styles.content}>
							<aside className={_cs(sidebarClassName, styles.sidebar)}>{sidebar}</aside>
							{mainContent && (
								<main className={_cs(mainContentClassName, styles.mainContent)}>{mainContent}</main>
							)}
							{footer && <footer className={_cs(footerClassName, styles.footer)}>{footer}</footer>}
						</div>
					</div>
				);
			}

			return (
				<div className={_cs(className, styles.pageWithSidebar)} ref={containerRef}>
					<aside className={_cs(sidebarClassName, styles.sidebar)}>{sidebar}</aside>
					<div className={styles.content}>
						{header && <header className={_cs(headerClassName, styles.header)}>{header}</header>}
						{mainContent && (
							<main className={_cs(mainContentClassName, styles.mainContent)}>{mainContent}</main>
						)}
						{footer && <footer className={_cs(footerClassName, styles.footer)}>{footer}</footer>}
					</div>
				</div>
			);
		}

		return (
			<div className={_cs(className, styles.page)} ref={containerRef}>
				{header && <header className={_cs(headerClassName, styles.header)}>{header}</header>}
				{mainContent && (
					<main className={_cs(mainContentClassName, styles.mainContent)}>{mainContent}</main>
				)}
				{footer && <footer className={_cs(footerClassName, styles.footer)}>{footer}</footer>}
			</div>
		);
	}
}
