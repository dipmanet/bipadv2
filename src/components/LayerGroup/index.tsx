import React from "react";
import { _cs } from "@togglecorp/fujs";

import { connect } from "react-redux";
import Button from "#rsca/Button";

import DefaultLayerSelection from "#components/LayerSelection";
import LayerDetailModalButton from "#components/LayerDetailModalButton";
import { LayerHierarchy } from "#types";

import { languageSelector } from "#selectors";
import styles from "./styles.module.scss";

interface Props {
	className?: string;
	data: LayerHierarchy;
	layerSelection?: React.ReactNode;
	layerSelectionItem?: React.ReactNode;
}

interface State {
	isContentShown: boolean;
}

const mapStateToProps = (state) => ({
	language: languageSelector(state),
});
class LayerGroup extends React.PureComponent<Props, State> {
	public state = {
		isContentShown: false,
	};

	private handleShowContentButtonClick = (event: { stopPropagation: () => void }) => {
		event.stopPropagation();
		this.setState(({ isContentShown }) => ({ isContentShown: !isContentShown }));
	};

	public render() {
		const {
			data,
			className,
			layerSelection: LayerSelection = DefaultLayerSelection,
			layerSelectionItem,
			language: { language },
		} = this.props;

		const { isContentShown } = this.state;

		if (!data.children) {
			return null;
		}

		return (
			<div className={_cs(styles.layerGroup, className)}>
				<div
					className={styles.clickableArea}
					role="button"
					tabIndex={0}
					onKeyPress={this.handleShowContentButtonClick}
					onClick={this.handleShowContentButtonClick}>
					<header className={styles.header}>
						<h3 className={styles.title}>
							{language === "en"
								? data.title
								: data.titleNe === undefined
								? data.title
								: data.titleNe}
						</h3>
						{(data.longDescription || data.metadata) && (
							<div className={styles.actions}>
								<LayerDetailModalButton layer={data} className={styles.infoButton} />
								{/*
                            <Button
                                title="Show data (currently not available)"
                                className={styles.showDataButton}
                                transparent
                                iconName="table"
                                disabled
                            />
                            */}
							</div>
						)}
						<Button
							transparent
							className={styles.showContentButton}
							iconName={isContentShown ? "chevronUp" : "chevronDown"}
							onClick={this.handleShowContentButtonClick}
						/>
					</header>
					{data.shortDescription && (
						<div className={styles.shortDescription}>
							{language === "en"
								? data.shortDescription
								: data.shortDescriptionNe === undefined
								? data.shortDescription
								: data.shortDescriptionNe}
						</div>
					)}
				</div>
				{isContentShown && (
					<div className={styles.content}>
						{data.children.length !== 0 && (
							<LayerSelection
								layerList={data.children as LayerHierarchy[]}
								layerSelectionItem={layerSelectionItem}
							/>
						)}
					</div>
				)}
			</div>
		);
	}
}

export default connect(mapStateToProps)(LayerGroup);
