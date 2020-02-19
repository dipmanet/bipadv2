import React from 'react';
import { _cs } from '@togglecorp/fujs';

import LoadingAnimation from '#rscv/LoadingAnimation';
import List from '#rscv/List';

import Icon from '#rscg/Icon';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import ManualIcon from '#resources/images/manualicon.png';
import styles from './styles.scss';

interface OwnProps {
    className?: string;
}

interface Params {
}

type Props = NewProps<OwnProps, Params>;

interface ManualElement {
    id: number;
    title: string;
    description?: string;
    file: string;
    image?: string;
}

interface ManualResponse {
    results: ManualElement[];
}

const ManualItem = ({ data, className }: {
    className?: string;
    data: ManualElement;
}) => (
    <a
        href={data.file}
        className={_cs(className, styles.manualItem)}
        download
        target="_blank"
        rel="noopener noreferrer"
        title="Click to download"
    >
        <div className={styles.left}>
            <img
                src={data.image || ManualIcon}
                alt="M"
                className={styles.image}
            />
        </div>
        <div className={styles.right}>
            <div className={styles.title}>
                { data.title }
            </div>
            { data.description && (
                <div className={styles.description}>
                    { data.description }
                </div>
            )}
        </div>
    </a>
);

const manualItemKeySelector = (d: ManualElement) => d.id;
const manualItemRendererParams = (_: string, m: ManualElement) => ({ data: m });

const manualItemEmptyList: ManualElement[] = [];

const requests: { [key: string]: ClientAttributes<Props, Params> } = {
    manualListRequest: {
        url: '/manual/',
        method: methods.GET,
        onMount: true,
    },
};

class Manual extends React.PureComponent<Props> {
    public render() {
        const {
            requests: {
                manualListRequest: {
                    pending,
                    response = {},
                },
            },
            className,
        } = this.props;

        const { results = manualItemEmptyList } = response as ManualResponse;

        return (
            <div className={_cs(className, styles.manual)}>
                { pending && <LoadingAnimation /> }
                <List
                    data={results}
                    renderer={ManualItem}
                    rendererParams={manualItemRendererParams}
                    keySelector={manualItemKeySelector}
                />
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requests)(Manual),
);
