import React from "react";
import { _cs } from "@togglecorp/fujs";

import Button from "#rsca/Button";
import Icon from "#rscg/Icon";

import styles from "./styles.module.scss";

interface Props {
	className?: string;
	headerContent: React.ReactNode;
	expandableContent: React.ReactNode;
	headerContentClassName?: string;
	headerClassName?: string;
	expandedClassName?: string;
	expandButtonClassName?: string;
	expandIconClassName?: string;
	expandableContentClassName?: string;
}

interface State {
	isExpanded: boolean;
}

class ExpandableView extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			isExpanded: false,
		};
	}

	private handleButtonClick = () => {
		const { isExpanded: prevIsExpanded } = this.state;
		this.setState({ isExpanded: !prevIsExpanded });
	};

	public render() {
		const {
			className,
			headerContent,
			expandableContent,
			headerContentClassName,
			headerClassName,
			expandedClassName,
			expandButtonClassName,
			expandIconClassName,
			expandableContentClassName,
			infoIconClassName,
			infoTooltip,
		} = this.props;

		const { isExpanded } = this.state;

		return (
			<div
				className={_cs(
					styles.expandableView,
					className,
					isExpanded && styles.expanded,
					isExpanded && expandedClassName
				)}>
				<header className={_cs(styles.header, headerClassName)}>
					<Button
						transparent
						onClick={this.handleButtonClick}
						className={_cs(styles.expandButton, expandButtonClassName)}>
						<div className={_cs(styles.headerContent, headerContentClassName)}>{headerContent}</div>
						<Icon
							title={infoTooltip}
							className={_cs(styles.infoIcon, infoIconClassName)}
							name="infoOutline"
						/>
						<Icon
							className={_cs(styles.expandIcon, expandIconClassName)}
							name={isExpanded ? "chevronUp" : "chevronDown"}
						/>
					</Button>
				</header>
				{isExpanded && (
					<div className={_cs(expandableContentClassName, styles.expandableContent)}>
						{expandableContent}
					</div>
				)}
			</div>
		);
	}
}

export default ExpandableView;
