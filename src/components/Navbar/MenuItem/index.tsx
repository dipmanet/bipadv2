import React from "react";
import { Link } from "@reach/router";
import { _cs } from "@togglecorp/fujs";
import { Translation } from "react-i18next";

import Icon from "#rscg/Icon";

import styles from "./styles.module.scss";

interface Props {
	className?: string;
	title: string;
	link: string;
	iconName?: string;
	disabled?: boolean;
	titleClassName?: string;
	id?: string;
}

interface State {}

export default class MenuItem extends React.PureComponent<Props, State> {
	public getTitle = (val: string) => <Translation>{(t) => <span>{t(`${val}`)}</span>}</Translation>;

	private getProps = ({ isCurrent }: { isCurrent: boolean }) => {
		const { className, disabled } = this.props;

		return {
			className: _cs(
				className,
				styles.menuItem,
				isCurrent && styles.active,
				disabled && styles.disabled
			),
		};
	};

	public render() {
		const { title, link, iconName, titleClassName, id } = this.props;

		return (
			<Link to={link} getProps={this.getProps} title={title} id={id}>
				<Icon className={styles.icon} name={iconName} />
				<div className={_cs(titleClassName, styles.title)}>{this.getTitle(title)}</div>
			</Link>
		);
	}
}
