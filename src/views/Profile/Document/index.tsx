import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    _cs,
    doesObjectHaveNoData,
    listToMap,
} from '@togglecorp/fujs';

import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import FormattedDate from '#rscv/FormattedDate';
import Icon from '#rscg/Icon';
import Loading from '#components/Loading';
import ListView from '#rscv/List/ListView';
import SelectInput from '#rsci/SelectInput';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

import documentIcon from '#resources/icons/file-document.svg';

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
    DocumentCategory,
    DocumentItem,
} from '#store/atom/page/types';

import CommonMap from '#components/CommonMap';

import AddDocumentForm from './AddDocumentForm';

import styles from './styles.scss';

const ModalPrimaryButton = modalize(PrimaryButton);

interface ComponentProps {
    className?: string;
}

interface Params {
    documentId?: number;
}

interface State {
    selectedCategory?: number;
    selectedRegion?: string;
}

interface PropsFromState {
    regionName: string;
    region: Region;
}

interface RegionOption {
    id: string;
    title: string;
}

const regionOptions: RegionOption[] = [
    { id: 'national', title: 'national' },
    { id: 'province', title: 'province' },
    { id: 'district', title: 'district' },
    { id: 'municipality', title: 'municipality' },
];

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
    documentDeleteRequest: {
        url: ({ params }) => `/document/${params && params.documentId}`,
        method: methods.DELETE,
        // onMount: true,
        onSuccess: ({ props }) => {
            props.requests.documentsGetRequest.do();
        },
    },
};

interface DocumentProps {
    document: DocumentItem & { categoryName?: string };
    onUpdate: () => void;
    onDelete: (id: number) => void;
    disabled?: boolean;
}

const DetailItem = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
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
    const { document, onUpdate, onDelete, disabled } = props;

    const {
        id,
        title,
        region,
        file,
        publishedDate,
        categoryName,
    } = document;

    const handleDelete = () => {
        onDelete(id);
    };

    return (
        <div className={styles.documentDetails}>
            <div className={styles.documentIcon}>
                <ScalableVectorGraphics
                    className={styles.svg}
                    src={documentIcon}
                />
            </div>
            <div className={styles.details}>
                <header className={styles.header}>
                    <h3 className={styles.heading}>
                        { title }
                    </h3>
                    <div className={styles.actions}>
                        <ModalPrimaryButton
                            modal={(
                                <AddDocumentForm
                                    value={document}
                                    onUpdate={onUpdate}
                                />
                            )}
                            disabled={disabled}
                        >
                            Edit
                        </ModalPrimaryButton>
                        <Button
                            onClick={handleDelete}
                            disabled={disabled}
                        >
                            Delete
                        </Button>
                        <a
                            className={styles.downloadLink}
                            href={file}
                        >
                            <Icon
                                className={styles.downloadIcon}
                                name="download"
                            />
                            <div className={styles.text}>
                                Download
                            </div>
                        </a>
                    </div>
                </header>
                <div className={styles.content}>
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
                        value={categoryName}
                    />
                </div>
            </div>
        </div>
    );
};

const keySelector = (d: DocumentItem) => d.id;
const categoryKeySelector = (d: DocumentCategory) => d.id;
const categoryLabelSelector = (d: DocumentCategory) => d.title;
const regionKeySelector = (d: RegionOption) => d.id;
const regionLabelSelector = (d: RegionOption) => d.title;

class Document extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private getCategoryExpandedDocuments = memoize((
        documents: DocumentItem[],
        documentCategories: DocumentCategory[],
    ) => {
        const documentCategoryMap = listToMap(
            documentCategories,
            d => d.id,
            d => d.title,
        );

        return documents
            .map((d: DocumentItem) => ({ ...d, categoryName: documentCategoryMap[d.category] }));
    })

    private rendererParams = (_: string, data: DocumentItem) => ({
        document: data,
        onUpdate: this.handleUpdate,
        onDelete: this.handleDelete,
        disabled: this.props.requests.documentDeleteRequest.pending,
    })

    private getFilteredDocuments = (
        documents: DocumentItem[],
        region: Region,
        selectedCategory?: number,
        selectedRegion?: string,
    ) => {
        let filtered = documents;
        if (!doesObjectHaveNoData(region)) {
            const { adminLevel, geoarea } = region;
            if (adminLevel === 1) {
                filtered = documents.filter(d => d.province === geoarea);
            }
            if (adminLevel === 2) {
                filtered = documents.filter(d => d.district === geoarea);
            }
            if (adminLevel === 3) {
                filtered = documents.filter(d => d.municipality === geoarea);
            }
        }
        if (selectedCategory) {
            filtered = filtered.filter(document => document.category === selectedCategory);
        }
        if (selectedRegion) {
            filtered = filtered.filter(document => document.region === region);
        }

        return filtered;
    }

    private handleUpdate = () => {
        this.props.requests.documentsGetRequest.do();
    }

    private handleDelete = (id: number) => {
        this.props.requests.documentDeleteRequest.do({
            documentId: id,
        });
    }

    private handleCategorySelection = (category: number) => {
        this.setState({
            selectedCategory: category,
        });
    }

    private handleRegionSelection = (region: string) => {
        this.setState({
            selectedRegion: region,
        });
    }

    public render() {
        const {
            className,
            requests,
            region,
        } = this.props;

        const {
            selectedCategory,
            selectedRegion,
        } = this.state;

        const documents = getResults(requests, 'documentsGetRequest');
        const documentCategories = getResults(requests, 'documentCategoryGetRequest');

        const filteredDocuments = this.getFilteredDocuments(
            documents,
            region,
            selectedCategory,
            selectedRegion,
        );

        const expandedDocuments = this.getCategoryExpandedDocuments(
            filteredDocuments,
            documentCategories,
        );

        const pending = isAnyRequestPending(requests);

        return (
            <div className={_cs(className, styles.documents)}>
                <Loading pending={pending} />
                <CommonMap sourceKey="profile-document" />
                <header className={styles.header}>
                    <h2 className={styles.heading}>
                        Documents
                    </h2>
                    <ModalPrimaryButton
                        modal={(
                            <AddDocumentForm
                                onUpdate={this.handleUpdate}
                            />
                        )}
                    >
                        Add
                    </ModalPrimaryButton>
                </header>
                <div className={styles.filters}>
                    <SelectInput
                        className={styles.categorySelectInput}
                        label="category"
                        onChange={this.handleCategorySelection}
                        value={selectedCategory}
                        options={documentCategories}
                        showHintAndError={false}
                        keySelector={categoryKeySelector}
                        labelSelector={categoryLabelSelector}
                    />
                    <SelectInput
                        className={styles.regionSelectInput}
                        label="region"
                        onChange={this.handleRegionSelection}
                        value={selectedRegion}
                        options={regionOptions}
                        showHintAndError={false}
                        keySelector={regionKeySelector}
                        labelSelector={regionLabelSelector}
                    />
                </div>
                <ListView
                    className={styles.content}
                    data={expandedDocuments}
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
