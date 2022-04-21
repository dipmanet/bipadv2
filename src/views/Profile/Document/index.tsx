import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    _cs,
    doesObjectHaveNoData,
    listToMap,
} from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import modalize from '#rscg/Modalize';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import Button from '#rsca/Button';
import AccentButton from '#rsca/Button/AccentButton';
import FormattedDate from '#rscv/FormattedDate';
import Icon from '#rscg/Icon';
import ListView from '#rscv/List/ListView';
import SelectInput from '#rsci/SelectInput';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import { checkSameRegionPermission } from '#utils/common';
import documentIcon from '#resources/icons/file-document.svg';

import Loading from '#components/Loading';
import Cloak from '#components/Cloak';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { TitleContext, Profile } from '#components/TitleContext';

import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';

import {
    regionSelector,
    regionNameSelector,
    languageSelector,
    userSelector,
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

const ModalButton = modalize(Button);
const AccentModalButton = modalize(AccentButton);

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
    { id: 'national', title: 'national', titleNe: 'राष्ट्रिय' },
    { id: 'province', title: 'province', titleNe: 'प्रान्त' },
    { id: 'district', title: 'district', titleNe: 'जिल्‍ला' },
    { id: 'municipality', title: 'municipality', titleNe: 'नगरपालिका' },
];

type ReduxProps = ComponentProps & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    region: regionSelector(state),
    regionName: regionNameSelector(state),
    language: languageSelector(state),
    user: userSelector(state),
});
const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    documentsGetRequest: {
        url: '/document/',
        method: methods.GET,
        onMount: true,
        query: ({ params }) => ({
            province: params && params.province,
            district: params && params.district,
            municipality: params && params.municipality,
        }),
        onSuccess: ({ response, params }) => {
            if (params && params.output) {
                params.output(response.results);
            }
        },

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
    const { document, onUpdate, onDelete, disabled, user, regions } = props;

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
    const filterPermissionGranted = checkSameRegionPermission(user, regions);
    return (
        <div className={styles.documentDetails}>
            <div className={styles.documentIcon}>
                <ScalableVectorGraphics
                    className={styles.svg}
                    src={documentIcon}
                />
            </div>
            <Translation>
                {
                    t => (
                        <div className={styles.details}>
                            <header className={styles.header}>
                                <h3 className={styles.heading}>
                                    { title }
                                </h3>
                                <div className={styles.actions}>
                                    {filterPermissionGranted
                                        ? (
                                            <>
                                                <Cloak hiddenIf={p => !p.change_document}>
                                                    <ModalButton
                                                        className={styles.editButton}
                                                        iconName="edit"
                                                        transparent
                                                        modal={(
                                                            <AddDocumentForm
                                                                value={document}
                                                                onUpdate={onUpdate}
                                                            />
                                                        )}
                                                        disabled={disabled}
                                                    >
                                                        {t('Edit')}
                                                    </ModalButton>
                                                </Cloak>
                                                <Cloak hiddenIf={p => !p.delete_document}>
                                                    <DangerConfirmButton
                                                        className={styles.deleteButton}
                                                        confirmationMessage={t('Are you sure you want to delete this document?')}
                                                        disabled={disabled}
                                                        iconName="delete"
                                                        onClick={handleDelete}
                                                        transparent
                                                    >
                                                        {t('Delete')}
                                                    </DangerConfirmButton>
                                                </Cloak>

                                            </>
                                        ) : ''}
                                    <a
                                        className={styles.downloadLink}
                                        href={file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Icon
                                            className={styles.downloadIcon}
                                            name="download"
                                        />
                                        <div className={styles.text}>
                                            {t('Download')}
                                        </div>
                                    </a>
                                </div>
                            </header>
                            <div className={styles.content}>
                                <DetailItem
                                    label={t('Date of publication')}
                                    value={(
                                        <FormattedDate
                                            value={publishedDate}
                                            mode="yyyy-MM-dd"
                                        />
                                    )}
                                />
                                <DetailItem
                                    label={t('Region')}
                                    value={region}
                                />
                                <DetailItem
                                    label={t('Category')}
                                    value={categoryName}
                                />
                            </div>
                        </div>
                    )
                }
            </Translation>

        </div>
    );
};
const keySelector = (d: DocumentItem) => d.id;
const categoryKeySelector = (d: DocumentCategory) => d.id;
const categoryLabelSelector = (d: DocumentCategory, language) => (language === 'en' ? d.title : d.titleNe);
const regionKeySelector = (d: RegionOption) => d.id;
const regionLabelSelector = (d: RegionOption, language) => (language === 'en' ? d.title : d.titleNe);

class Document extends React.PureComponent<Props, State> {
    public static contextType = TitleContext;

    public constructor(props: Props) {
        super(props);
        this.state = {
            documents: [],
        };
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
        user: this.props.user,
        regions: this.props.region,
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

        // if (!doesObjectHaveNoData(region)) {
        //     const { adminLevel, geoarea } = region;
        //     if (adminLevel === 1) {
        //         filtered = documents.filter(d => d.province === geoarea);
        //     }
        //     if (adminLevel === 2) {
        //         filtered = documents.filter(d => d.district === geoarea);
        //     }
        //     if (adminLevel === 3) {
        //         filtered = documents.filter(d => d.municipality === geoarea);
        //     }
        // }

        if (selectedCategory) {
            filtered = filtered.filter(document => document.category === selectedCategory);
        }
        if (selectedRegion) {
            filtered = filtered.filter(document => document.region === selectedRegion);
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

    private handleResults=(data) => {
        this.setState({
            documents: data,
        });
    }

    public componentDidUpdate(prevProps, prevState, snapshot) {
        const { region,
            requests: {
                documentsGetRequest,
            } } = this.props;
        if (prevProps.region !== region) {
            documentsGetRequest.do({

                province: region.adminLevel === 1 ? region.geoarea : '',
                district: region.adminLevel === 2 ? region.geoarea : '',
                municipality: region.adminLevel === 3 ? region.geoarea : '',
                output: this.handleResults,

            });
        }
    }

    public render() {
        const {
            className,
            requests,
            requests: {
                documentsGetRequest,
            },
            user,
            region,
            language: { language },

        } = this.props;

        const {
            selectedCategory,
            selectedRegion,
            documents,
        } = this.state;


        // const documents = getResults(requests, 'documentsGetRequest');
        documentsGetRequest.setDefaultParams({

            province: region.adminLevel === 1 ? region.geoarea : '',
            district: region.adminLevel === 2 ? region.geoarea : '',
            municipality: region.adminLevel === 3 ? region.geoarea : '',
            output: this.handleResults,

        });


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

        const { setProfile } = this.context;

        if (setProfile) {
            setProfile((prevProfile: Profile) => {
                if (prevProfile.mainModule !== 'Document') {
                    return { ...prevProfile, mainModule: 'Document' };
                }
                return prevProfile;
            });
        }

        console.log(documentCategories, 'test');

        return (
            <Translation>
                {
                    t => (
                        <div className={_cs(className, styles.documents)}>
                            <Loading pending={pending} />
                            <CommonMap sourceKey="profile-document" />

                            <header className={styles.header}>

                                <h2 className={styles.heading}>
                                    {t('Documents')}
                                </h2>
                                <Cloak hiddenIf={p => !p.add_document}>
                                    <AccentModalButton
                                        transparent
                                        iconName="add"
                                        modal={(
                                            <AddDocumentForm
                                                onUpdate={this.handleUpdate}
                                            />
                                        )}
                                    >
                                        {t('New document')}
                                    </AccentModalButton>
                                </Cloak>


                            </header>

                            <div className={styles.filters}>

                                <SelectInput
                                    className={styles.categorySelectInput}
                                    label={t('Category')}
                                    onChange={this.handleCategorySelection}
                                    value={selectedCategory}
                                    options={documentCategories}
                                    showHintAndError={false}
                                    keySelector={categoryKeySelector}
                                    labelSelector={d => categoryLabelSelector(d, language)}
                                />
                                <SelectInput
                                    className={styles.regionSelectInput}
                                    label={t('Region')}
                                    onChange={this.handleRegionSelection}
                                    value={selectedRegion}
                                    options={regionOptions}
                                    showHintAndError={false}
                                    keySelector={regionKeySelector}
                                    labelSelector={d => regionLabelSelector(d, language)}
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
                    )
                }
            </Translation>
        );
    }
}

export default connect(mapStateToProps)(
    createRequestClient(requestOptions)(
        Document,
    ),
);
