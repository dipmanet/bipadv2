import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    methods,
    NewProps,
    ClientAttributes,
    createRequestClient,
} from '@togglecorp/react-rest-request';

import RiskDescription from '#components/RiskDescription';
import Loading from '#components/Loading';

import { description } from './description.json';
import Map from './Map';

import { LayerWithGroup, LayerGroup } from '#store/atom/page/types';
import {
    RiskData,
} from '#types';

import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';

import styles from './styles.scss';


interface OwnProps {
    className?: string;
    layerList: LayerWithGroup[];
    layerGroupList: LayerGroup[];
}
interface Params {
}

interface State {
    selectedLayerId: number | undefined;
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params>} = {
    riskGetRequest: {
        url: '/earthquake-riskscore/',
        method: methods.GET,
        onMount: true,
    },
};

type Props = NewProps<OwnProps, Params>

class Risk extends React.PureComponent<Props, State> {
    public render() {
        const {
            className,
            requests,
        } = this.props;

        const pending = isAnyRequestPending(requests);
        const riskData = getResults(requests, 'riskGetRequest') as RiskData[];

        return (
            <>
                <Loading pending={pending} />
                <div className={_cs(styles.risk, className)}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Durham Earthquake
                        </h4>
                        <RiskDescription
                            className={styles.description}
                            text={description}
                        />
                    </header>
                    <Map
                        data={riskData}
                    />
                </div>
            </>
        );
    }
}

export default createRequestClient(requestOptions)(Risk);
