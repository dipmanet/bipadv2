import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    _cs,
    doesObjectHaveNoData,
    listToMap,
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
    documentCategoryGetRequest: {
        url: '/document-category/',
        method: methods.GET,
        onMount: true,
    },
};

interface DocumentProps {
    document: DocumentItem;
}

const DetailItem = ({
    label,
    value,
}) => (
    <div className={styles.detailItem}>
        <div className={styles.label}>
            { label }
        </div>
        <div className={styles.value}>
            { value }
        </div>
    </div>
);

const DocumentRenderer = (props: DocumentProps) => {
    const { document } = props;

    const {
        title,
        region,
        file,
        publishedDate,
        category,
    } = document;

    return (
        <div className={styles.documentDetails}>
            <header className={styles.header}>
                <h3 className={styles.heading}>
                    { title }
                </h3>
                <div className={styles.actions}>
                    <a
                        className={styles.downloadLink}
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
            </header>
            <div className={styles.details}>
                <DetailItem
                    label="Date of publication"
                    value={(
                        <FormattedDate
                            value={publishedDate}
                            mode="yyyy-MM-dd"
                        />
                    )}
                />
                <DetailItem
                    label="Region"
                    value={region}
                />
                <DetailItem
                    label="Category"
                    value={category}
                />
            </div>
        </div>
    );
};
const keySelector = (d: DocumentItem) => d.id;
class Document extends React.PureComponent<Props> {
    private getCategoryExpandedDocuments = memoize((documents, documentCategories) => {
        const documentCategoryMap = listToMap(documentCategories, d => d.id, d => d.title);
        return documents.map(d => ({ ...d, category: documentCategoryMap[d.category] }));
    })

    private rendererParams = (_: string, data: DocumentItem) => ({ document: data })

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
        const documentCategories = getResults(requests, 'documentCategoryGetRequest');
        const expandedDocuments = this.getCategoryExpandedDocuments(documents, documentCategories);

        const filteredDocuments = this.getFilteredDocuments(expandedDocuments, region);
        const pending = isAnyRequestPending(requests);
        return (
            <div className={_cs(className, styles.documents)}>
                <Loading pending={pending} />
                <header className={styles.header}>
                    <h2 className={styles.heading}>
                        Documents
                    </h2>
                </header>
                <ListView
                    className={styles.content}
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
