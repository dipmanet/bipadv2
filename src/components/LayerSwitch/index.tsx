import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import DropdownMenu from '#rsca/DropdownMenu';
import ListView from '#rscv/List/ListView';

import { mapStylesSelector } from '#selectors';
import { setMapStyleAction } from '#actionCreators';

import { AppState } from '#store/types';

import LayerButton from './LayerButton';
import styles from './styles.scss';

interface OwnProps {
    className?: string;
}

interface State {
}

interface MapStyle {
    name: string;
    color: string;
}

interface PropsFromAppState {
    mapStyles: MapStyle[];
}

interface PropsFromDispatch {
    setMapStyles: typeof setMapStyleAction;
}

type Props = OwnProps & PropsFromAppState & PropsFromDispatch;

const mapStateToProps = (state: AppState) => ({
    mapStyles: mapStylesSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setMapStyle: params => dispatch(setMapStyleAction(params)),
});

const layerKeySelector = (d: MapStyle) => d.name;

class LayerSwitch extends React.PureComponent<Props, State> {
    private getLayerButtonRendererParams = (_: string, layer: MapStyle) => ({
        onClick: this.handleLayerButtonClick,
        ...layer,
    })

    private handleLayerButtonClick = (style: string) => {
        const { setMapStyle } = this.props;
        setMapStyle(style);
    }

    public render() {
        const {
            className,
            mapStyles,
        } = this.props;

        return (
            <DropdownMenu
                className={_cs(styles.layerSwitch, className)}
                iconName="layers"
                hideDropdownIcon
            >
                <ListView
                    data={mapStyles}
                    keySelector={layerKeySelector}
                    renderer={LayerButton}
                    rendererParams={this.getLayerButtonRendererParams}
                />
            </DropdownMenu>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayerSwitch);
