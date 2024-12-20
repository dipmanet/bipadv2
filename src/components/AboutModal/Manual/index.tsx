import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import LoadingAnimation from '#rscv/LoadingAnimation';
import List from '#rscv/List';
import {
    arrayGroupBy,
} from '#utils/common';

import Icon from '#rscg/Icon';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import Message from '#rscv/Message';

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

const isEmpty = (obj: {}) => Object.keys(obj).length === 0;

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

        // grouping by year and removing undefined year values
        const yearWiseList = arrayGroupBy(results, 'year');
        delete yearWiseList[`${undefined}`];
        // previous logic
        /* return (
            <div className={_cs(className, styles.manual)}>
                { pending && <LoadingAnimation /> }
                <List
                    data={results}
                    renderer={ManualItem}
                    rendererParams={manualItemRendererParams}
                    keySelector={manualItemKeySelector}
                />
            </div>
        ); */

        // new logic
        if (isEmpty(yearWiseList)) {
            return (
                <div
                    className={styles.message}
                >
                    <Translation>
                        {
                            t => (
                                <Message>
                                    {t('No Publications to display')}
                                </Message>
                            )
                        }
                    </Translation>

                </div>
            );
        }
        return (
            <div className={_cs(className, styles.manual)}>
                { pending && <LoadingAnimation /> }
                {Object.keys(yearWiseList).sort((a, b) => b - a).map((key) => {
                    const orderedManauals = yearWiseList[key]
                        .sort((a, b) => (a.order < b.order ? -1 : 1));
                    return (
                        <div key={key} className={styles.item}>
                            <div className={styles.header}>{key}</div>
                            <List
                                data={orderedManauals}
                                renderer={ManualItem}
                                rendererParams={manualItemRendererParams}
                                keySelector={manualItemKeySelector}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requests)(Manual),
);
