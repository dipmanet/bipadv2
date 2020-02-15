import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import ReduxContext from '#components/ReduxContext';

import Checkbox from '#rsu/../v2/Input/Checkbox';
import DropdownMenu from '#rsca/DropdownMenu';

import {
    setShowProvinceAction,
    setShowDistrictAction,
    setShowMunicipalityAction,
    setShowWardAction,
} from '#actionCreators';
import {
    showProvinceSelector,
    showDistrictSelector,
    showMunicipalitySelector,
    showWardSelector,
} from '#selectors';

import LayerButton from './LayerButton';
import styles from './styles.scss';

interface OwnProps {
    className?: string;
}

interface State {
}

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

const mapAppStateToComponentProps = state => ({
    showProvince: showProvinceSelector(state),
    showDistrict: showDistrictSelector(state),
    showMunicipality: showMunicipalitySelector(state),
    showWard: showWardSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setShowProvince: params => dispatch(setShowProvinceAction(params)),
    setShowDistrict: params => dispatch(setShowDistrictAction(params)),
    setShowMunicipality: params => dispatch(setShowMunicipalityAction(params)),
    setShowWard: params => dispatch(setShowWardAction(params)),
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
        } = this.props;

        return (
            <DropdownMenu
                className={_cs(styles.layerSwitch, className)}
                iconName="gridView"
                hideDropdownIcon
                dropdownClassName={styles.container}
            >
                <Checkbox
                    label="Show Province"
                    onChange={(value) => {
                        setShowProvince({ value });
                    }}
                    value={showProvince}
                />
                <Checkbox
                    label="Show District"
                    onChange={(value) => {
                        setShowDistrict({ value });
                    }}
                    value={showDistrict}
                />
                <Checkbox
                    label="Show Municipality"
                    onChange={(value) => {
                        setShowMunicipality({ value });
                    }}
                    value={showMunicipality}
                />
                <Checkbox
                    label="Show Ward"
                    onChange={(value) => {
                        setShowWard({ value });
                    }}
                    value={showWard}
                />
            </DropdownMenu>
        );
    }
}
LayerSwitch.contextType = ReduxContext;

export default connect(mapAppStateToComponentProps, mapDispatchToProps)(LayerSwitch);
