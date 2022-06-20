/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import Loader from 'react-loader';
import {
    ClientAttributes,
    createConnectedRequestCoordinator,
    createRequestClient, methods,
} from '#request';
// import Loading from '#components/Loading';
// import Icon from '#rscg/Icon';
// import Page from '#components/Page';
// import Button from '#rsca/Button';
// import Rajapur from './Rajapur';
// import Gulariya from './Gulariya';
// import Tikapur from './Tikapur';
// import Dhangadi from './Dhangadi';
// import Butwal from './Butwal';
// import Barabise from './BarabiseLandslide';
// import Bhotekoshi from './BhotekoshiLandslide';
// import Panchpokhari from './Panchpokhari';
// import Jugal from './Jugal';
// import ProvinceTwo from './Province2';
// import Karnali from './Karnali';
// import Ratnanagar from './RatnaNagar';
import styles from './styles.scss';
import Map from './LandingPage/Map';
import Page from '#components/Page';
import LayerToggle from './LandingPage/Components/LayerToggle';
import ThemeSelector from './LandingPage/Components/ThemeSelector';
import LabelSearch from './LandingPage/Components/LabelSearch';
import SelectComponent from './RatnaNagar/Components/SelectComponent';


const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    vizRiskThemeIdRequest: {
        url: '/vizrisk-theme/',
        method: methods.GET,
        onSuccess: ({ params, response }) => {
            const { results: vizRiskId = [] } = response as Response;
            console.log('vizrisk-results', vizRiskId);
        },
        onMount: true,
    },
};

interface Props { }
const themes = ['Select VisRisk Theme', 'Flood Exposure', 'Landslide Exposure', 'Multi-hazard Exposure'];

const VizRiskMainPage = (props: Props) => {
    const [vizRiskId, setvizRiskId] = useState([]);
    const [selctFieldCurrentValue, setselctFieldCurrentValue] = useState('');
    const [pendingMainPage, setpendingMainPage] = useState<boolean>(true);
    const [vzLabel, setVzLabel] = useState('municipality');

    const { requests:
        {
            vizRiskThemeIdRequest,

        } } = props;

    useEffect(() => {
        if (pendingMainPage) {
            if (vizRiskId.length > 0) {
                setpendingMainPage(false);
            }
        }
    }, [pendingMainPage, vizRiskId.length]);

    vizRiskThemeIdRequest.setDefaultParams({ setvizRiskId });

    console.log('vizRiskId', vizRiskId);

    return (
        <div className={styles.mainVzContainer}>
            <Page
                hideFilter
                hideMap
            />
            <Map vzLabel={vzLabel} />
            <LayerToggle setVzLabel={setVzLabel} vzLabel={vzLabel} />
            <ThemeSelector
                selectFieldValues={themes}
                selctFieldCurrentValue={selctFieldCurrentValue}
                setselctFieldCurrentValue={setselctFieldCurrentValue}
            />
            <LabelSearch />
        </div>
    );
};

export default compose(
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(VizRiskMainPage);
