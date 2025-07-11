import React from "react";
import Redux from "redux";
import { connect } from "react-redux";
import { _cs } from "@togglecorp/fujs";

import Switch from "react-input-switch";
import ReduxContext from "#components/ReduxContext";

import Checkbox from "#rsu/../v2/Input/Checkbox";
import DropdownMenu from "#rsca/DropdownMenu";

import {
	setShowProvinceAction,
	setShowDistrictAction,
	setShowMunicipalityAction,
	setShowWardAction,
} from "#actionCreators";
import {
	showProvinceSelector,
	showDistrictSelector,
	showMunicipalitySelector,
	showWardSelector,
	languageSelector,
} from "#selectors";

import LayerButton from "./LayerButton";
import styles from "./styles.module.scss";

interface OwnProps {
	className?: string;
}

interface State {}

interface PropsFromAppState {
	showProvince?: boolean;
	showDistrict?: boolean;
	showMunicipality?: boolean;
	showWard?: boolean;
}

interface PropsFromDispatch {
	setShowProvince: typeof setShowProvinceAction;
	setShowDistrict: typeof setShowDistrictAction;
	setShowMunicipality: typeof setShowMunicipalityAction;
	setShowWard: typeof setShowWardAction;
}

type Props = OwnProps & PropsFromAppState & PropsFromDispatch;

const mapAppStateToComponentProps = (state, props) => ({
	showProvince: showProvinceSelector(state, props),
	showDistrict: showDistrictSelector(state, props),
	showMunicipality: showMunicipalitySelector(state, props),
	showWard: showWardSelector(state, props),
	language: languageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setShowProvince: (params) => dispatch(setShowProvinceAction(params)),
	setShowDistrict: (params) => dispatch(setShowDistrictAction(params)),
	setShowMunicipality: (params) => dispatch(setShowMunicipalityAction(params)),
	setShowWard: (params) => dispatch(setShowWardAction(params)),
});

class LayerSwitch extends React.PureComponent<Props, State> {
	public render() {
		const {
			className,
			setShowProvince,
			setShowDistrict,
			setShowMunicipality,
			setShowWard,

			showProvince,
			showDistrict,
			showMunicipality,
			showWard,
			language: { language },
		} = this.props;

		return (
			<DropdownMenu
				className={_cs(styles.layerSwitch, className)}
				iconName="gridView"
				hideDropdownIcon
				dropdownClassName={styles.container}
				tooltip={
					language === "en" ? "Select administrative boundary" : "प्रशासनिक सीमा चयन गर्नुहोस्"
				}>
				<Switch
					className={styles.switch}
					on
					off={false}
					value={showProvince}
					onChange={(value) => {
						setShowProvince({ value });
					}}
				/>
				{language === "en" ? "Show Province" : "प्रदेश देखाउनुहोस्"}
				<br />

				<Switch
					className={styles.switch}
					on
					off={false}
					value={showDistrict}
					onChange={(value) => {
						setShowDistrict({ value });
					}}
				/>
				{language === "en" ? "Show District" : "जिल्‍ला देखाउनुहोस"}
				<br />

				<Switch
					className={styles.switch}
					on
					off={false}
					value={showMunicipality}
					onChange={(value) => {
						setShowMunicipality({ value });
					}}
				/>
				{language === "en" ? "Show Municipality" : "नगरपालिका देखाउनुहोस"}
				<br />

				<Switch
					className={styles.switch}
					on
					off={false}
					value={showWard}
					onChange={(value) => {
						setShowWard({ value });
					}}
				/>
				{language === "en" ? "Show Ward" : "वडा देखाउनुहोस"}
				<br />
				{/* incase we need checkbox back again */}
				{/* <Checkbox
                            label="Show Province"
                            onChange={(value) => {
                                setShowProvince({ value });
                            }}
                            value={showProvince}
                        /> */}
				{/* <Checkbox
                            label="Show District"
                            onChange={(value) => {
                                setShowDistrict({ value });
                            }}
                            value={showDistrict}
                        /> */}
				{/* <Checkbox
                            label="Show Municipality"
                            onChange={(value) => {
                                setShowMunicipality({ value });
                            }}
                            value={showMunicipality}
                        /> */}
				{/* <Checkbox
                            label="Show Ward"
                            onChange={(value) => {
                                setShowWard({ value });
                            }}
                            value={showWard}
                        /> */}
			</DropdownMenu>
		);
	}
}
LayerSwitch.contextType = ReduxContext;

export default connect(mapAppStateToComponentProps, mapDispatchToProps)(LayerSwitch);
