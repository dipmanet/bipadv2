import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Page from '#components/Page';
import LeftPane from '../LeftPane';
import EarthquakeMap from '../Map/Earthquake';
import PollutionMap from '../Map/Pollution';
import RainMap from '../Map/Rainwatch';
import RiverMap from '../Map/Riverwatch';
import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';
import EarthquakeFilters from '../Filters/Earthquake';
import PollutionFilters from '../Filters/Pollution';
import RainFilters from '../Filters/Rain';
import RiverFilters from '../Filters/River';

import EarthquakeLegend from '../Legends/Earthquake';
import PollutionLegend from '../Legends/Pollution';

import {
    NewProps,
} from '#request';

import { FiltersElement } from '#types';

import { AppState } from '#store/types';

import { setFiltersAction } from '#actionCreators';

import { filtersSelector } from '#selectors';


type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

interface Params {}
interface OwnProps {
    chosenOption: Options;
    handleOptionClick: Function;
}

interface PropsFromDispatch {
    setFilters: typeof setFiltersAction;
}

interface PropsFromState {
    globalFilters: FiltersElement;
}

type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    globalFilters: filtersSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setFilters: params => dispatch(setFiltersAction(params)),
});

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;

interface State {
    data: [];
}

const getFilter = (chosenOption: Options) => {
    if (chosenOption === 'Earthquake') {
        return <EarthquakeFilters />;
    }
    if (chosenOption === 'Pollution') {
        return <PollutionFilters />;
    }
    if (chosenOption === 'Rain') {
        return <RainFilters />;
    }
    if (chosenOption === 'River') {
        return <RiverFilters />;
    }
    return null;
};

const getLegend = (chosenOption: Options) => {
    if (chosenOption === 'Earthquake') {
        return <EarthquakeLegend />;
    }
    if (chosenOption === 'Pollution') {
        return <PollutionLegend />;
    }
    return null;
};
class RegularPage extends React.PureComponent <Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    public componentDidMount() {
        const { setFilters } = this.props;
        const initialFilter = {
            dataDateRange: {
                rangeInDays: 7,
                startDate: undefined,
                endDate: undefined,
            },
            hazard: [],
            region: {},
        };
        setFilters({ filters: initialFilter });
    }

    private setData = (data: []) => {
        this.setState({ data });
    }

    public render() {
        const {
            chosenOption,
            handleOptionClick,
        } = this.props;
        const { data } = this.state;
        const contextProps: DataArchiveContextProps = {
            chosenOption,
            handleOptionClick,
            setData: this.setData,
            data,
        };
        return (
            <DataArchiveContext.Provider value={contextProps}>
                <div className="regularPage">
                    {chosenOption === 'Rain' && (
                        <RainMap
                            data={data}
                            chosenOption={chosenOption}
                        />
                    )}
                    {chosenOption === 'River' && (
                        <RiverMap
                            data={data}
                            chosenOption={chosenOption}
                        />
                    )}
                    {chosenOption === 'Earthquake' && (
                        <EarthquakeMap
                            data={data}
                            chosenOption={chosenOption}
                        />
                    )}
                    {chosenOption === 'Pollution' && (
                        <PollutionMap
                            data={data}
                            chosenOption={chosenOption}
                        />
                    )}
                    <Page
                        hideHazardFilter
                        hideFilter
                        leftContent={(
                            <DataArchiveContext.Provider value={contextProps}>
                                <LeftPane />
                            </DataArchiveContext.Provider>
                        )}
                        rightContent={getFilter(chosenOption)}
                        mainContentContainerClassName="map-legend-container"
                        mainContent={(
                            <DataArchiveContext.Provider value={contextProps}>
                                {getLegend(chosenOption)}
                            </DataArchiveContext.Provider>
                        )}
                    />
                </div>
            </DataArchiveContext.Provider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegularPage);
