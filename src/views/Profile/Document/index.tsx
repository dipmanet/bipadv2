import React from 'react';
import { connect } from 'react-redux';
import {
    _cs,
    doesObjectHaveNoData,
} from '@togglecorp/fujs';

import FormattedDate from '#rscv/FormattedDate';
import Icon from '#rscg/Icon';
import Loading from '#components/Loading';
import ListView from '#rscv/List/ListView';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';

import {
    regionSelector,
    regionNameSelector,
} from '#selectors';

import {
    AppState,
} from '#store/types';

import {
    Region,
} from '#store/atom/page/types';

import styles from './styles.scss';

interface ComponentProps {
    className?: string;
}

interface Params {
}

interface PropsFromState {
    regionName: string;
    region: Region;
}

interface DocumentItem {
    id: number;
    title: string;
    region: string;
    file: string;
    publishedDate: string;
    category: number;
    province: number;
    district: number;
    municipality: number;
    event: number;
}

type ReduxProps = ComponentProps & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    region: regionSelector(state),
    regionName: regionNameSelector(state),
});
const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    documentsGetRequest: {
        url: '/document/',
        method: methods.GET,
        onMount: true,
    },
};

interface DocumentProps {
    document: DocumentItem;
}
const DocumentRenderer = (props: DocumentProps) => {
    const {
        document,
    } = props;

    const {
        title,
        region,
        file,
        publishedDate,
        category,
    } = document;

    return (
        <div className={styles.item}>
            <div className={styles.title}>
                { title }
            </div>
            <div className={styles.title}>
                { region }
            </div>
            <div className={styles.title}>
                { category }
            </div>
            <FormattedDate
                value={publishedDate}
                mode="yyyy-MM-dd"
            />
            <a
                className={styles.download}
                href={file}
            >
                <Icon
                    className={styles.icon}
                    name="download"
                />
                <div className={styles.text}>
                    Download
                </div>
            </a>
        </div>
    );
};
const keySelector = (d: DocumentItem) => d.id;
class Document extends React.PureComponent<Props> {
    private rendererParams = (_: string, data: DocumentItem) => ({ document: data });

    private getFilteredDocuments = (documents: DocumentItem[], region: Region) => {
        if (!doesObjectHaveNoData(region)) {
            const { adminLevel, geoarea } = region;
            if (adminLevel === 1) {
                return documents.filter(d => d.province === geoarea);
            }
            if (adminLevel === 2) {
                return documents.filter(d => d.district === geoarea);
            }
            if (adminLevel === 3) {
                return documents.filter(d => d.municipality === geoarea);
            }
        }
        return documents;
    }

    public render() {
        const {
            className,
            requests,
            region,
        } = this.props;

        const documents = getResults(requests, 'documentsGetRequest');
        const filteredDocuments = this.getFilteredDocuments(documents, region);
        const pending = isAnyRequestPending(requests);
        return (
            <div className={_cs(className, styles.document)}>
                <Loading pending={pending} />
                <header className={styles.header}>
                    <h3 className={styles.heading}>
                        Documents
                    </h3>
                </header>
                <ListView
                    className={styles.info}
                    data={filteredDocuments}
                    renderer={DocumentRenderer}
                    keySelector={keySelector}
                    rendererParams={this.rendererParams}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(
    createRequestClient(requestOptions)(
        Document,
    ),
);
