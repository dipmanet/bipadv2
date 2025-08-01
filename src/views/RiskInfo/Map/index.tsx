/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable react/no-array-index-key */

/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

/* eslint-disable @typescript-eslint/indent */

import React from "react";
import { connect } from "react-redux";

import Loader from "react-loader";
import { getRasterTile, getBuildingFootprint, getFeatureInfo } from "#utils/domain";

import MapSource from "#re-map/MapSource";
import MapLayer from "#re-map/MapSource/MapLayer";
import MapState from "#re-map/MapSource/MapState";
import MapTooltip from "#re-map/MapTooltip";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	ClientAttributes,
	methods,
} from "#request";
import RiskInfoLayerContext from "#components/RiskInfoLayerContext";
import { mapSources, mapStyles } from "#constants";

import CommonMap from "#components/CommonMap";
import Modal from "#rscv/Modal";
import ModalHeader from "#rscv/Modal/Header";
import ModalBody from "#rscv/Modal/Body";
import DangerButton from "#rsca/Button/DangerButton";
import PrimaryButton from "#rsca/Button/PrimaryButton";
import { OpenSeaDragonViewer } from "../OpenSeaDragonImageViewer";
import styles from "./styles.module.scss";
import LandslideToolTip from "./Tooltips/RiskInfo/Landslide";

interface Props {}

interface State {
	feature: any;
	hoverLngLat: any;
}

const sourceLayerByAdminLevel = {
	municipality: mapSources.nepal.layers.municipality,
	district: mapSources.nepal.layers.district,
	ward: mapSources.nepal.layers.ward,
};

const linePaintByAdminLevel = {
	municipality: mapStyles.municipality.choroplethOutline,
	district: mapStyles.district.choroplethOutline,
	ward: mapStyles.ward.choroplethOutline,
};

const tooltipOptions = {
	closeOnClick: false,
	closeButton: false,
	offset: 8,
};
const rasterTooltipOptions = {
	closeOnClick: true,
	closeButton: false,
	offset: 8,
};

let rasterLayers = [];

let choroplethLayers = [];

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	FeatureGetNotes: {
		url: "/keyvalue-html/",
		method: methods.GET,
		onMount: false,
		query: ({ params }) => params && { key: params.key },
		onSuccess: ({ response, params }) => {
			// params.responseData(response);
			if (params) {
				params.results(response.results);
			}
		},
	},
};

class RiskInfoMap extends React.PureComponent<Props, State> {
	public constructor(props) {
		super(props);
		this.myRef = React.createRef();
	}

	public state = {
		feature: undefined,
		hoverLngLat: undefined,
		isModalOpen: false,
		clickedButton: 1,
		loadedImages: [],
		selectedImage: "",
		selectedMunicipalityName: "",
		loader: true,
		notesResult: "",
		topLayer: "",
		topChoroPlethLayer: "",
	};

	private handleCloseModal = () => {
		const { loadedImages } = this.state;

		this.setState({
			isModalOpen: false,
			selectedImage: loadedImages[0].landslideInventoryEnglishFilename,
			clickedButton: 1,
			notesResult: "",
		});
	};

	private handleClick = (feature, lngLat) => {
		const { activeLayers, setClimateChangeSelectedDistrict } = this.context;

		setClimateChangeSelectedDistrict(feature);
		const municipalityAvailableForOpenseadragon = !!(feature && feature.state.value);
		if (
			activeLayers[activeLayers.length - 1].type === "choropleth" &&
			municipalityAvailableForOpenseadragon &&
			choroplethLayers[choroplethLayers.length - 1].layername ===
				"durham_post_monsoon_2020_landslide_map" &&
			feature &&
			feature.state.value === 1
		) {
			const municipalityName = `${feature.properties.title_en} ${feature.properties.type}`;
			this.setState({
				selectedMunicipalityName: municipalityName,
			});

			this.setState({
				feature,
				hoverLngLat: lngLat,
				isModalOpen: true,
				loader: true,
			});

			const imagesLoaded = choroplethLayers[choroplethLayers.length - 1].data.filter(
				(item) => item.municipality === feature.id
			);

			this.setState({
				loadedImages: imagesLoaded,
				selectedImage: imagesLoaded[0].landslideInventoryEnglishFilename,
			});
		}
	};

	public getRasterLayer = () =>
		[
			`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
			"&version=1.1.1",
			"&service=WMS",
			"&request=GetMap",
			"&layers=MappingExtent_DurhamLandslide",
			"&tiled=true",
			"&width=256",
			"&height=256",
			"&srs=EPSG:3857",
			"&bbox={bbox-epsg-3857}",
			"&transparent=true",
			"&format=image/png",
		].join("");

	private handleMouseEnter = (feature, lngLat) => {
		this.setState({
			feature,
			hoverLngLat: lngLat,
		});
	};

	private handleMouseLeave = () => {
		this.setState({
			feature: undefined,
			hoverLngLat: undefined,
		});
	};

	private handleAlertClose = () => {
		const { closeTooltip, mapDataOnClick } = this.context;
		closeTooltip(undefined);
	};

	private notesResults = (data) => {
		this.setState({
			notesResult: data[0].value,
			loader: false,
		});
	};

	private handleNotes = (buttonId) => {
		const {
			requests: { FeatureGetNotes },
		} = this.props;
		this.setState({
			clickedButton: buttonId,
			loader: true,
		});

		if (buttonId === 8) {
			FeatureGetNotes.do({
				key: "durham_landslide_maps_note_eng",
				results: this.notesResults,
			});
		}
		if (buttonId === 7) {
			FeatureGetNotes.do({
				key: "durham_landslide_maps_note_nep",
				results: this.notesResults,
			});
		}
	};

	private handleClickModalButton = (buttonId) => {
		const { loadedImages } = this.state;
		this.setState({
			loader: true,
		});
		this.setState({
			clickedButton: buttonId,
		});
		if (buttonId === 1) {
			this.setState({
				selectedImage: loadedImages[0].landslideInventoryEnglishFilename,
				notesResult: "",
			});
		} else if (buttonId === 2) {
			this.setState({
				selectedImage: loadedImages[0].landslideInventoryNepaliFilename,
				notesResult: "",
			});
		} else if (buttonId === 3) {
			this.setState({
				selectedImage: loadedImages[0].landslideRunoutEnglishFilename,
				notesResult: "",
			});
		} else if (buttonId === 4) {
			this.setState({
				selectedImage: loadedImages[0].landslideRunoutNepaliFilename,
				notesResult: "",
			});
		} else if (buttonId === 5) {
			this.setState({
				selectedImage: loadedImages[0].landslideSusceptibilityEnglishFilename,
				notesResult: "",
			});
		} else {
			this.setState({
				selectedImage: loadedImages[0].landslideSusceptibilityNepaliFilename,
				notesResult: "",
			});
		}
	};

	public render() {
		const {
			feature,
			hoverLngLat,
			isModalOpen,
			clickedButton,
			selectedImage,
			selectedMunicipalityName,
			loader,
			notesResult,
			topLayer,
			topChoroPlethLayer,
		} = this.state;

		const { activeLayers, LoadingTooltip, tooltipLatlng, mapClickedResponse } = this.context;

		const municipalityAvailableForOpenseadragon = !!(feature && feature.state.value);

		rasterLayers = activeLayers.filter((d) => d.type === "raster");
		choroplethLayers = activeLayers.filter((d) => d.type === "choropleth");
		const isJsonDataPresent =
			rasterLayers.length &&
			Object.keys(rasterLayers[rasterLayers.length - 1]).find((item) => item === "jsonData");
		const JsonDataPresent = rasterLayers.length && rasterLayers[rasterLayers.length - 1].jsonData;

		const tooltipKeys =
			JsonDataPresent !== undefined &&
			JsonDataPresent !== 0 &&
			JsonDataPresent.map((item) => item.label);
		const responseDataKeys = mapClickedResponse ? Object.keys(mapClickedResponse) : [];

		const tooltipData =
			responseDataKeys.length && mapClickedResponse.features.map((item) => item.properties)[0];

		const tooltipValues =
			JsonDataPresent !== undefined &&
			JsonDataPresent !== 0 &&
			tooltipData !== undefined &&
			tooltipData !== 0 &&
			JsonDataPresent.map((item) => tooltipData[item.key]);

		return (
			<>
				{activeLayers.length &&
				activeLayers[activeLayers.length - 1].group &&
				activeLayers[activeLayers.length - 1].group.title === "Landslide Polygon" ? (
					<>
						<MapSource
							key="douram-1"
							sourceKey="douram-layer"
							sourceOptions={{
								type: "raster",
								tiles: [this.getRasterLayer()],
								tileSize: 256,
							}}>
							<MapLayer
								layerKey="douram-layer01"
								layerOptions={{
									type: "raster",
									paint: {
										"raster-opacity": 0.8,
									},
								}}
							/>
						</MapSource>
					</>
				) : (
					""
				)}

				{rasterLayers.map((layer) => (
					<MapSource
						key={layer.id}
						sourceKey={layer.layername}
						sourceOptions={{
							type: "raster",
							tiles: [getRasterTile(layer)],
							tileSize: 256,
						}}>
						<MapLayer
							layerKey="raster-layer"
							layerOptions={{
								type: "raster",
								paint: {
									"raster-opacity": layer.opacity,
								},
							}}
							// onClick={this.handleAlertClick()}
						/>

						{activeLayers[activeLayers.length - 1].type === "raster" &&
						rasterLayers.length &&
						isJsonDataPresent !== undefined
							? tooltipLatlng && (
									<MapTooltip
										coordinates={tooltipLatlng}
										tooltipOptions={rasterTooltipOptions}
										onHide={this.handleAlertClose}>
										<div className={styles.landslideTooltip}>
											<div className={styles.header}>
												<h4>{layer.title}</h4>
											</div>
											{LoadingTooltip ? (
												<div className={styles.noData}>Loading...</div>
											) : responseDataKeys.length && mapClickedResponse.features.length ? (
												<div className={styles.content}>
													{/* <table style={{ width: '100%' }} className={styles.tooltipTable}>
                                                    {tooltipKeys.map((item, i) => (
                                                        <tr key={i}>
                                                            <td style={{ width: '50%' }}>{item}</td>
                                                            <td style={{ width: '50%' }}>{tooltipValues[i]}</td>
                                                        </tr>
                                                    ))}
                                                </table> */}
													{tooltipKeys.map((item, i) => (
														<div
															key={i}
															style={{ width: "100%", display: "flex", padding: "10px" }}>
															<span style={{ width: "50%" }}>{item}</span>
															<span style={{ width: "50%" }}>{tooltipValues[i]}</span>
														</div>
													))}
													{/* <div>
                                                    {tooltipKeys.map((item, i) => <div key={i}>{item}</div>)}
                                                </div>
                                                <div>
                                                    {tooltipValues.map((item, i) => <div key={i}>{item}</div>)}
                                                </div> */}
												</div>
											) : (
												<div className={styles.noData}>No Data</div>
											)}
										</div>
									</MapTooltip>
							  )
							: ""}
					</MapSource>
				))}
				{isModalOpen ? (
					<Modal className={styles.openseadragon}>
						<ModalHeader
							className={styles.header}
							title={selectedMunicipalityName}
							rightComponent={
								<DangerButton
									transparent
									iconName="close"
									onClick={this.handleCloseModal}
									title="Close Modal"
								/>
							}
						/>
						<ModalBody className={styles.modalBody}>
							<div className={styles.imageViewer}>
								<div className={styles.leftPane}>
									<div className={styles.municipalityName}>
										<h4 style={{ marginRight: "5px" }}>Notes:</h4>
										<PrimaryButton
											type="button"
											className={
												clickedButton === 7 ? styles.notesButtonActive : styles.notesButton
											}
											onClick={() => this.handleNotes(7)}>
											Nep
										</PrimaryButton>
										<PrimaryButton
											type="button"
											className={
												clickedButton === 8 ? styles.notesButtonActive : styles.notesButton
											}
											onClick={() => this.handleNotes(8)}>
											Eng
										</PrimaryButton>
										{/* <div className={clickedButton === 1 ? styles.selectedAgreeBtn : styles.agreeBtn} style={{ color: 'white', cursor: 'pointer', backgroundColor: 'green', paddingLeft: '5px', paddingRight: '5px' }} defaultValue="7">Nep</div>
                                            <div className={clickedButton === 1 ? styles.selectedAgreeBtn : styles.agreeBtn} style={{ color: 'white', cursor: 'pointer', backgroundColor: 'blue', paddingLeft: '5px', paddingRight: '5px' }} defaultValue="8" onClick={e => console.log(e.target.value)} role="button">Eng</div> */}
									</div>

									<div className={styles.buttons}>
										<PrimaryButton
											type="button"
											className={clickedButton === 1 ? styles.selectedAgreeBtn : styles.agreeBtn}
											onClick={() => this.handleClickModalButton(1)}>
											Landslide Inventory English
										</PrimaryButton>
										<PrimaryButton
											type="button"
											className={clickedButton === 2 ? styles.selectedAgreeBtn : styles.agreeBtn}
											onClick={() => this.handleClickModalButton(2)}>
											Landslide Inventory Nepali
										</PrimaryButton>
										<PrimaryButton
											type="button"
											className={clickedButton === 3 ? styles.selectedAgreeBtn : styles.agreeBtn}
											onClick={() => this.handleClickModalButton(3)}>
											Landslide Runout English
										</PrimaryButton>
										<PrimaryButton
											type="button"
											className={clickedButton === 4 ? styles.selectedAgreeBtn : styles.agreeBtn}
											onClick={() => this.handleClickModalButton(4)}>
											Landslide Runout Nepali
										</PrimaryButton>
										<PrimaryButton
											type="button"
											className={clickedButton === 5 ? styles.selectedAgreeBtn : styles.agreeBtn}
											onClick={() => this.handleClickModalButton(5)}>
											Landslide Susceptibility English
										</PrimaryButton>
										<PrimaryButton
											type="button"
											className={clickedButton === 6 ? styles.selectedAgreeBtn : styles.agreeBtn}
											onClick={() => this.handleClickModalButton(6)}>
											Landslide Susceptibility Nepali
										</PrimaryButton>
									</div>
								</div>
								<div className={styles.rightPane}>
									{(clickedButton === 7 || clickedButton === 8) && loader ? (
										<Loader />
									) : notesResult ? (
										<div dangerouslySetInnerHTML={{ __html: notesResult }} />
									) : (
										// <div>{ notesResult }</div>
										<OpenSeaDragonViewer selectedImage={selectedImage} loadLoader={loader} />
									)}
								</div>
							</div>
						</ModalBody>
					</Modal>
				) : (
					""
				)}

				<CommonMap sourceKey="risk-infoz">
					{choroplethLayers.map((layer, i) => (
						<MapSource
							key={layer.id}
							sourceKey={layer.layername}
							sourceOptions={{
								type: "vector",
								url: mapSources.nepal.url,
							}}>
							<MapLayer
								layerKey="choropleth-layer"
								layerOptions={{
									type: "fill",
									"source-layer": sourceLayerByAdminLevel[layer.adminLevel],
									paint: {
										...layer.paint,
										"fill-opacity": layer.paint["fill-opacity"].map((val) =>
											typeof val === "number" ? val * layer.opacity : val
										),
									},
								}}
								// onClick={layer.onClick ? layer.onClick : undefined}
								onClick={layer.tooltipRenderer ? this.handleClick : undefined}
								onMouseEnter={layer.tooltipRenderer ? this.handleMouseEnter : undefined}
								onMouseLeave={layer.tooltipRenderer ? this.handleMouseLeave : undefined}
							/>
							<MapLayer
								layerKey="choropleth-layer-outline"
								layerOptions={{
									"source-layer": sourceLayerByAdminLevel[layer.adminLevel],
									type: "line",
									paint: linePaintByAdminLevel.municipality,
								}}
							/>

							<MapState
								attributes={layer.mapState}
								attributeKey="value"
								sourceLayer={sourceLayerByAdminLevel[layer.adminLevel]}
							/>

							{activeLayers[activeLayers.length - 1].type === "choropleth" &&
								layer.tooltipRenderer &&
								hoverLngLat &&
								feature &&
								feature.source === layer.layername &&
								municipalityAvailableForOpenseadragon && (
									<MapTooltip
										coordinates={hoverLngLat}
										// trackPointer
										tooltipOptions={tooltipOptions}>
										<layer.tooltipRenderer feature={feature} layer={layer} />
									</MapTooltip>
								)}
						</MapSource>
					))}
				</CommonMap>
			</>
		);
	}
}

RiskInfoMap.contextType = RiskInfoLayerContext;
export default createRequestClient(requests)(RiskInfoMap);
