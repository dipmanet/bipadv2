/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable indent */
/* eslint-disable no-tabs */
import React, { useContext } from 'react';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Button from '#rsca/Button';
import Bbox from '#resources/icons/bbox.svg';
import SortableListView from '#rscv/SortableListView';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import LayerLegend from '#components/LayerLegend';

import OpacityInput from '#components/OpacityInput';

import styles from './styles.scss';
import { MapChildContext } from '#re-map/context';

interface Props {
	className?: string;
}

interface State {
	showOpacityInput: boolean;
	showLegend: boolean;
}
const ActiveLayer = ({
	className,
	layer,
	onRemoveButtonClick,
	onOpacityChange,
	showLegend,
	showOpacityInput,
}) => {
	const { map } = useContext(MapChildContext);
	console.log('all layers', layer);
	let uniqueId;

	const zoomToBbox = () => {
		if (map) {
			if (!layer && !layer.bbox) return;
			map.fitBounds(layer.bbox);
		}
	};
	return (
		<div className={styles.activeLayer}>
			<header className={styles.header}>
				<h4 className={styles.heading}>
					{layer.fullName || layer.title}
				</h4>
				<Button
					transparent
					className={styles.removeLayerButton}
					iconName="close"
					onClick={() => onRemoveButtonClick(layer)}
				/>

				{
					layer && layer.bbox && layer.bbox.length > 0
					&& (
						<img
							src={Bbox}
							alt=""
							className={styles.bboxIcon}
							onClick={zoomToBbox}
							role="button"
						/>
					)
				}

			</header>
			<div className={styles.content}>
				{showOpacityInput && (
					<OpacityInput
						className={styles.opacityInput}
						value={layer.opacity}
						onChange={(key, value) => onOpacityChange(layer, value)}
					/>
				)}
				{showLegend && (
					<LayerLegend
						layer={layer}
					/>
				)}
			</div>
		</div>
	);
};

class ActiveLayers extends React.PureComponent<Props, State> {
	public state = {
		showLegend: true,
		showOpacityInput: true,
	}


	private handleRemoveButtonClick = (layer) => {
		const { removeLayer } = this.context;
		removeLayer(layer.id);
	}

	private handleOpacityChange = (layer, opacity) => {
		const { addLayer } = this.context;
		addLayer({
			...layer,
			opacity,
		});
	}

	private handleToggleLegendVisibilityButtonClick = () => {
		this.setState(
			({ showLegend }) => ({ showLegend: !showLegend }),
		);
	}

	private handleToggleOpacityInputVisibilityButtonClick = () => {
		this.setState(
			({ showOpacityInput }) => ({ showOpacityInput: !showOpacityInput }),
		);
	}

	private getRendererParams = (key, layer) => ({
		layer,
		onRemoveButtonClick: this.handleRemoveButtonClick,
		onOpacityChange: this.handleOpacityChange,
		showOpacityInput: this.state.showOpacityInput,
		showLegend: this.state.showLegend,
	})

	private getData = memoize(data => (
		[...data].reverse()
	))

	private handleChange = (data) => {
		const { setLayers } = this.context;
		setLayers([...data].reverse());
	}

	public render() {
		const { className } = this.props;
		const {
			activeLayers,
		} = this.context;

		const {
			showLegend,
			showOpacityInput,
		} = this.state;

		const data = this.getData(activeLayers);

		if (!data || data.length === 0) {
			return null;
		}

		return (
			<div className={_cs(styles.activeLayers, className)}>
				<header className={styles.header}>
					<h3 className={styles.heading}>
						Active layers
					</h3>
					<div className={styles.actions}>
						<Button
							title="Toggle opacity input visibility"
							transparent
							onClick={this.handleToggleOpacityInputVisibilityButtonClick}
							className={_cs(
								styles.toggleOpacityInputVisibilityButton,
								showOpacityInput && styles.active,
							)}
							iconName="contrast"
						/>
						<Button
							title="Toggle legend visiblity"
							transparent
							onClick={this.handleToggleLegendVisibilityButtonClick}
							className={_cs(
								styles.toggleLegendVisibilityButton,
								showLegend && styles.active,
							)}
							iconName="list"
						/>
					</div>
				</header>
				<SortableListView
					dragHandleClassName={styles.dragHandle}
					className={styles.content}
					itemClassName={styles.activeLayerContainer}
					data={data}
					renderer={ActiveLayer}
					rendererParams={this.getRendererParams}
					keySelector={d => String(d.id)}
					onChange={this.handleChange}
				/>
			</div>
		);
	}
}

ActiveLayers.contextType = RiskInfoLayerContext;

export default ActiveLayers;
