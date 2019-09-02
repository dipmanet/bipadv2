import React from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import DropdownMenu from '#rsca/DropdownMenu';
import ListView from '#rscv/List/ListView';

import { mapStylesSelector } from '#selectors';
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

type Props = OwnProps & PropsFromAppState;

const mapStateToProps = (state: AppState) => ({
    mapStyles: mapStylesSelector(state),
});

const layerKeySelector = (d: MapStyle) => d.name;

class LayerSwitch extends React.PureComponent<Props, State> {
    private getLayerButtonRendererParams = (_: string, layer: MapStyle) => ({
        ...layer,
    })

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

export default connect(mapStateToProps)(LayerSwitch);
