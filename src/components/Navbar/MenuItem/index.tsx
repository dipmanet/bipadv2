import React from "react";
import { _cs } from "@togglecorp/fujs";
import { Translation } from "react-i18next";

import Icon from "#rscg/Icon";
import styles from "./styles.module.scss";
import CustomNavLink from "#components/Common/CustomNavLink";

interface Props {
	className?: string;
	title: string;
	link: string;
	iconName?: string;
	disabled?: boolean;
	titleClassName?: string;
	id?: string;
}

export default class MenuItem extends React.PureComponent<Props> {
	public getTitle = (val: string) => <Translation>{(t) => <span>{t(`${val}`)}</span>}</Translation>;
	private getLinkClassName = () => {
		const { className, disabled } = this.props;

		return _cs(styles.menuItem, className, disabled && styles.disabled);
	};

	public render() {
		const { title, link, iconName, titleClassName, id, disabled } = this.props;

		return (
			<CustomNavLink to={link} disabled={disabled} className={this.getLinkClassName()} id={id}>
				{/* @ts-ignore */}
				<Icon className={styles.icon} name={iconName} />
				<div className={_cs(titleClassName, styles.title)}>{this.getTitle(title)}</div>
			</CustomNavLink>
		);
	}
}
