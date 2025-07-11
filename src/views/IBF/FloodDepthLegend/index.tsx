import React from "react";
// import Hexagon from 'react-hexagon';
import styles from "./styles.module.scss";

// interface ComponentProps {}

// type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
// type Props = NewProps<ReduxProps, Params>;

const FloodHistoryLegends = () => (
	// const [activeRasterLayer, setActiveRasterLayer] = useState('5');

	// const [showExposedAll, setShowExposedAll] = useState(true);
	// const [showExposedSchool, setShowExposedSchool] = useState(false);
	// const [showExposedBuilding, setShowExposedBuilding] = useState(false);
	// const [showRoads, setShowExposedRoads] = useState(false);
	// const [showCanals, setShowExposedCanals] = useState(false);
	// const [showSafeShelter, setShowSafeShelter] = useState(false);
	// const [showFloodElements, setshowFloodElements] = useState(true);

	// const [showReturnPeriods, setshowReturnPeriods] = useState(false);
	// const {
	//     handleFloodChange,
	//     handleExposedElementChange,
	//     handleChisapani,
	//     showCriticalElements,
	// } = props;

	// const resetExposedLayers = () => {
	//     setShowExposedAll(false);
	//     setShowExposedSchool(false);
	//     setShowExposedBuilding(false);
	//     setShowExposedRoads(false);
	//     setShowExposedCanals(false);
	//     setShowSafeShelter(false);
	// };
	// const handleChisapaniBtn = () => {
	//     handleChisapani();
	// };
	// const handleExposedClick = (layer) => {
	//     handleExposedElementChange(layer);

	//     if (layer === 'all') {
	//         resetExposedLayers();
	//         setShowExposedAll(true);
	//     }
	//     if (layer === 'school') {
	//         resetExposedLayers();
	//         setShowExposedSchool(true);
	//     }

	//     if (layer === 'roads') {
	//         resetExposedLayers();
	//         setShowExposedRoads(true);
	//     }
	//     if (layer === 'building') {
	//         resetExposedLayers();
	//         setShowExposedBuilding(true);
	//     }
	//     if (layer === 'canals') {
	//         resetExposedLayers();
	//         setShowExposedCanals(true);
	//     }
	//     if (layer === 'safeshelters') {
	//         resetExposedLayers();
	//         setShowSafeShelter(true);
	//     }
	// };
	// const handleLegendBtnClick = (layer) => {
	//     handleFloodChange(layer);
	//     setActiveRasterLayer(layer);
	// };

	// const handleFloodtoggle = () => {
	//     setshowFloodElements(!showCriticalElements);
	// };
	<>
		<div className={styles.floodDepthContainer}>
			<div className={styles.label}>
				<h3>Flood depth </h3>
			</div>
			<div className={styles.floodDepth}>
				<div className={styles.floodIndicator1}>{"> 2m"}</div>
				<div className={styles.floodText}>High</div>
			</div>
			<div className={styles.floodDepth}>
				<div className={styles.floodIndicator2}>{"1m - 2m"}</div>
				<div className={styles.floodText}>Med</div>
			</div>
			<div className={styles.floodDepth}>
				<div className={styles.floodIndicator3}>{"< 1m"}</div>
				<div className={styles.floodText}>Low</div>
			</div>
		</div>
	</>
);
export default FloodHistoryLegends;
