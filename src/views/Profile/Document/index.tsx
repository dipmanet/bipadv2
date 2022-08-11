/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-nested-ternary */
/* eslint-disable css-modules/no-undef-class */
/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { _cs, doesObjectHaveNoData, listToMap } from '@togglecorp/fujs';

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
import { checkSameRegionPermission, convertDateAccToLanguage } from '#utils/common';
import documentIcon from '#resources/icons/file-document.svg';
import tableView from '../../../resources/icons/list-view.svg';
import listView from '../../../resources/icons/category-view.svg';
import dateCalender from '../../../resources/icons/date-calender.svg';
import Loading from '#components/Loading';
import Cloak from '#components/Cloak';
import downloadCloud from '../../../resources/icons/download-cloud.svg';
import bookIcon from '#resources/icons/Book-icon.svg';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { TitleContext, Profile } from '#components/TitleContext';

import { getResults, isAnyRequestPending } from '#utils/request';

import {
    regionSelector,
    regionNameSelector,
    languageSelector,
    userSelector,
} from '#selectors';

import { AppState } from '#store/types';

import { Region, DocumentCategory, DocumentItem } from '#store/atom/page/types';

import CommonMap from '#components/CommonMap';

import AddDocumentForm from './AddDocumentForm';
import phoneContactLogo from '../../../resources/icons/phone-contact.svg';
import Eye from '../../../resources/icons/eye.svg';
import DownloadIcon from '../../../resources/icons/downloadIcon.svg';
import emailContactLogo from '../../../resources/icons/email-logo.svg';
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
    titleNe: string;
}


const regionOptions: RegionOption[] = [
    { id: 'national', title: 'national', titleNe: 'राष्ट्रिय' },
    { id: 'province', title: 'province', titleNe: 'प्रदेश' },
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
let expandedDocuments = [];
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
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
    </div>
);

const DocumentRenderer = (props: DocumentProps) => {
    const { document, onUpdate, onDelete, disabled, handleEditDeleteButtonClick, className } = props;

    const { id } = document;

    const handleDelete = () => {
        onDelete(id);
        handleEditDeleteButtonClick(undefined);
    };

    return (
        <div className={_cs(className, styles.documentDetails)}>

            <div className={styles.details}>
                <header id={styles.head} className={styles.header}>

                    <div className={styles.actions}>

                        <Translation>
                            {
                                t => (
                                    <>
                                        <Cloak hiddenIf={p => !p.change_document}>
                                            <ModalButton
                                                id="popup-edit"
                                                className={styles.editButton}
                                                iconName="edit"
                                                transparent
                                                modal={
                                                    <AddDocumentForm handleEditDeleteButtonClick={handleEditDeleteButtonClick} value={document} onUpdate={onUpdate} />
                                                }
                                                disabled={disabled}
                                            >
                                                {t('Edit')}
                                            </ModalButton>
                                        </Cloak>
                                        <Cloak hiddenIf={p => !p.delete_document}>
                                            <DangerConfirmButton
                                                id="popup-delete"
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
                                )
                            }
                        </Translation>


                    </div>
                </header>

            </div>
        </div>
    );
};
const keySelector = (d: DocumentItem) => d.id;
const categoryKeySelector = (d: DocumentCategory) => d.id;
const categoryLabelSelector = (d: DocumentCategory, language) => (language === 'en' ? d.title : d.titleNe);
const regionKeySelector = (d: RegionOption) => d.id;
const regionLabelSelector = (d: RegionOption, language) => (language === 'en' ? d.title : d.titleNe);

const CategorycolourListArray = [
    {
        name: 'Act',
        color: 'green',
    },
    {
        name: 'Laws',
        color: 'blue',
    },
    {
        name: 'Regulations',
        color: '#710682',
    },
    {
        name: 'Reports',
        color: '#A8D2DF',
    },
    {
        name: 'Publications',
        color: '#F39C33',
    },
    {
        name: 'Response Plans',
        color: '#F4544D',
    },
    {
        name: 'Frameworks',
        color: '#B8A0B9',
    },
    {
        name: 'Decisions by CCMC',
        color: '#53AEC3',
    },
    {
        name: 'Decisions by GoN',
        color: '#994A32',
    },
    {
        name: 'Decisions by CC-HLT (Coronavirus Control High-level Task)',
        color: '#C44F7D',
    },
    {
        name: 'Situation Reports',
        color: '#F3C412',
    },
    {
        name: 'Guidelines',
        color: '#F74F45',
    },
    {
        name: 'Press Releases',
        color: '#BCBABB',
    },
];


let splittedData = [];
class Document extends React.PureComponent<Props, State> {
    public static contextType = TitleContext;

    // sortButtonDescending: any;

    public constructor(props: Props) {
        super(props);
        this.state = {
            documents: [],
            enableListView: true,
            sortData: [],
            searchActivated: false,
            selectedSortList: '',
            sortButtonAscending: undefined,
            searchKeyword: '',
            selectedContactFromLabelListId: undefined,
            splitData: [],
            clickedColumn: '',
            mainColumnIndex: undefined,
            EditDeleteDivIndex: undefined,

        };
    }

    private getCategoryExpandedDocuments = memoize(
        (documents: DocumentItem[], documentCategories: DocumentCategory[]) => {
            const documentCategoryMap = listToMap(
                documentCategories,
                d => d.id,
                d => d.title,
            );

            return documents.map((d: DocumentItem) => ({
                ...d,
                categoryName: documentCategoryMap[d.category],
            }));
        },
    );

    private rendererParams = (_: string, data: DocumentItem) => ({
        user: this.props.user,
        regions: this.props.region,
        document: data,
        onUpdate: this.handleUpdate,
        onDelete: this.handleDelete,
        disabled: this.props.requests.documentDeleteRequest.pending,
    });

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
            filtered = filtered.filter(
                document => document.category === selectedCategory,
            );
        }
        if (selectedRegion) {
            filtered = filtered.filter(
                document => document.region === selectedRegion,
            );
        }

        return filtered;
    };

    private handleUpdate = () => {
        this.props.requests.documentsGetRequest.do();
    };

    private handleDelete = (id: number) => {
        this.props.requests.documentDeleteRequest.do({
            documentId: id,
        });
    };

    private handleCategorySelection = (category: number) => {
        this.setState({
            selectedCategory: category,
        });
    };

    private handleRegionSelection = (region: string) => {
        this.setState({
            selectedRegion: region,
        });
    };

    private handleResults = (data) => {
        this.setState({
            documents: data,
            searchActivated: false,
            searchKeyword: '',
            selectedContactFromLabelListId: false,

        });
    };

    public componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            region,
            requests: { documentsGetRequest },
        } = this.props;
        if (prevProps.region !== region) {
            documentsGetRequest.do({
                province: region.adminLevel === 1 ? region.geoarea : '',
                district: region.adminLevel === 2 ? region.geoarea : '',
                municipality: region.adminLevel === 3 ? region.geoarea : '',
                output: this.handleResults,
            });
        }
    }

    private sortButtonDescending = (keyword) => {
        const { sortData } = this.state;
        this.setState({ searchActivated: true });
        let data = [];
        if (sortData.length) {
            data = sortData.sort((a, b) => {
                if (a[keyword] < b[keyword]) return 1;
                if (a[keyword] > b[keyword]) return -1;
                return 0;
            });
        } else {
            data = expandedDocuments.sort((a, b) => {
                if (a[keyword] < b[keyword]) return 1;
                if (a[keyword] > b[keyword]) return -1;
                return 0;
            });
        }


        this.setState({
            sortData: data,
            sortButtonAscending: false,
            selectedSortList: keyword,
        });
    }

    private sortButtonAscending = (keyword) => {
        const { sortData } = this.state;
        this.setState({ searchActivated: true });
        let data = [];
        if (sortData.length) {
            data = sortData.sort((a, b) => {
                if (a[keyword] < b[keyword]) return -1;
                if (a[keyword] > b[keyword]) return 1;
                return 0;
            });
        } else {
            data = expandedDocuments.sort((a, b) => {
                if (a[keyword] < b[keyword]) return -1;
                if (a[keyword] > b[keyword]) return 1;
                return 0;
            });
        }

        this.setState({
            sortData: data,
            sortButtonAscending: true,
            selectedSortList: keyword,
        });
    }

    private SortButton = (tableHeaderName) => {
        const { sortButtonAscending, selectedSortList } = this.state;

        return sortButtonAscending === undefined ? (
            <button
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                type="button"
                onClick={() => this.sortButtonAscending(tableHeaderName)}
            >
                <Icon className={styles.visualizationIcon} name="sort" />
            </button>
        ) // eslint-disable-next-line no-nested-ternary
            : selectedSortList === tableHeaderName ? (
                !sortButtonAscending ? (
                    <button
                        type="button"
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        onClick={() => this.sortButtonAscending(tableHeaderName)}
                    >
                        <Icon className={styles.visualizationIcon} name="sortAscending" />
                    </button>
                ) : (
                    <button
                        type="button"
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        onClick={() => this.sortButtonDescending(tableHeaderName)}
                    >
                        <Icon className={styles.visualizationIcon} name="sortDescending" />
                    </button>
                )
            ) : (
                <button
                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                    type="button"
                    onClick={() => this.sortButtonDescending(tableHeaderName)}
                >
                    <Icon className={styles.visualizationIcon} name="sort" />
                </button>
            );
    };

    private handleSearch = (value) => {
        this.setState({ searchActivated: true, searchKeyword: value });
        const { sortData } = this.state;
        if (value === '' || value === null) {
            this.setState({
                sortData: expandedDocuments,
            });
        } else {
            const filteredData = expandedDocuments.filter((item, i) => (
                item.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
            ));


            this.setState({ sortData: filteredData });
        }
    }

    private colourForCategory = (data) => {
        const colorValue = CategorycolourListArray.find(item => item.name === data);
        return ({
            backgroundColor: colorValue && colorValue.color ? colorValue.color : '',
            borderRadius: '15px',
            width: 'fit-content',
            // padding: '6px',
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '2px',
            paddingBottom: '2px',
            // width: 'auto',
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            // borderRadius: '15px',
            whiteSpace: 'nowrap',
            color: 'white',
            maxWidth: '75px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',

        });
    }

    private listComponent = () => {
        const { splitData, sortData, mainColumnIndex, clickedColumn, searchKeyword, searchActivated, selectedContactFromLabelListId } = this.state;
        const { user, region, requests: {
            documentDeleteRequest: {
                pending,
            },
        }, language: { language } } = this.props;
        // const nepaliMonth = [{ id: '01', month: 'Baisakh' },
        // { id: '02', month: 'Jestha' },
        // { id: '03', month: 'Ashad' },
        // { id: '04', month: 'Shrawn' },
        // { id: '05', month: 'Bhadra' },
        // { id: '06', month: 'Ashoj' },
        // { id: '07', month: 'Kartik' },
        // { id: '08', month: 'Mangsir' },
        // { id: '09', month: 'Poush' },
        // { id: '10', month: 'Magh' },
        // { id: '11', month: 'Falgun' },
        // { id: '12', month: 'Chaitra' },
        // ];

        const handleClick = (id, selectedColumn, mainIndex) => {
            if (selectedContactFromLabelListId === id) {
                this.setState({ selectedContactFromLabelListId: null, clickedColumn: '', mainColumnIndex: undefined });
            } else {
                this.setState({
                    selectedContactFromLabelListId: id,
                    mainColumnIndex: mainIndex,
                    clickedColumn: selectedColumn,
                });
            }


            // map.flyTo({ center: coordinates, zoom: 15 });
        };


        const splitingValue = searchKeyword ? sortData : expandedDocuments;
        splittedData = [];
        let ind = 0;
        for (let i = 0; i <= splitingValue.length; i++) {
            const isNullValue = splitingValue.slice(ind, ind + 3);


            if (isNullValue.length) {
                splittedData.push(splitingValue.slice(ind, ind + 3));


                ind += 3;
            }
        }
        splittedData = Array.from(new Set(splittedData.map(JSON.stringify)), JSON.parse);
        const dataList = splittedData.length && splittedData.map((item) => {
            const individualItem = item.map((d) => {
                // const splittedDate = d.publishedDate && d.publishedDate.split('-');
                // `${splittedDate[2]} ${nepaliMonthConverted} ${splittedDate[0]}`

                // const nepaliMonthConverted = splittedDate && nepaliMonth.find(m => m.id === splittedDate[1]).month;
                const listViewDate = d.publishedDate ? convertDateAccToLanguage(d.publishedDate, language) : 'Unavailable';
                return ({
                    ...d,
                    listViewDate,

                });
            });
            return individualItem;
        });
        splittedData = dataList;
        const filterPermissionGranted = checkSameRegionPermission(user, region);
        return (

            splittedData.length
                ? splittedData.map((item, i) => (
                    <Translation>
                        {
                            t => (
                                <div key={i} style={{ display: 'flex', width: '100%', height: '220px', marginBottom: '40px' }}>

                                    <div
                                        className={i > mainColumnIndex ? clickedColumn === 'col1' ? _cs(styles.extraMargin) : styles.normalMargin : styles.normalMargin}
                                        style={{ width: '33.33%' }}
                                    >
                                        {item.map((data, idx) => (
                                            <div key={idx}>
                                                {idx === 0 ? (
                                                    <div


                                                        className={data.id === selectedContactFromLabelListId ? _cs(styles.active, styles.col1Div) : styles.col1Div}

                                                    >

                                                        <div
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => handleClick(data.id, 'col1', i)}
                                                            onKeyDown={undefined}
                                                        >
                                                            <div className="col1" style={{ display: 'flex', padding: '10px', minHeight: '120px', justifyContent: 'space-between' }}>
                                                                <div style={{ paddingRight: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                                    <h4 style={{ wordBreak: 'break-word' }}>{data.title}</h4>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <div style={{ fontWeight: 'bold' }}>
                                                                            <ScalableVectorGraphics
                                                                                className={styles.icon}
                                                                                src={dateCalender}
                                                                            />
                                                                        </div>
                                                                        <div style={{ marginLeft: '2px' }}>
                                                                            {' '}
                                                                            {data.listViewDate}
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div style={{ height: '60px', display: 'flex', borderRadius: '5px', width: '60px', backgroundColor: '#F2F2F2' }}>
                                                                    <ScalableVectorGraphics
                                                                        className={styles.iconTitle}
                                                                        src={bookIcon}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col1" style={{ borderTop: '1px solid #e1e1e1', padding: '10px' }}>
                                                                <div style={{ display: 'flex' }}>
                                                                    <div style={{ fontWeight: 'bold' }}>
                                                                        {t('Region')}
                                                                        :
                                                                    </div>
                                                                    <div style={{ marginLeft: '2px' }}>
                                                                        {' '}
                                                                        {data.region}
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex' }}>
                                                                    <div style={{ fontWeight: 'bold' }}>
                                                                        {t('Published By')}
                                                                        :
                                                                    </div>
                                                                    <div style={{ marginLeft: '2px' }}>{data.publishedBy ? data.publishedBy : '-'}</div>
                                                                </div>
                                                            </div>

                                                            <div className={data.id === selectedContactFromLabelListId ? styles.description : styles.hideDiv}>
                                                                {data.description
                                                                    ? (
                                                                        <p>
                                                                            {data.description}
                                                                        </p>
                                                                    ) : <p style={{ display: 'flex', justifyContent: 'center' }}>{t('No Description Available')}</p>}
                                                            </div>
                                                        </div>
                                                        <div className={styles.footer}>
                                                            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                                                <div style={{ fontWeight: 'bold' }}>
                                                                    {t('Category')}
                                                                    :
                                                                </div>
                                                                <div className={styles.categoryName} style={this.colourForCategory(data.categoryName)}>
                                                                    {data.categoryName}
                                                                    <div className={styles.tableTooltip}>
                                                                        {data.categoryName}

                                                                    </div>
                                                                    {/* <span className={styles.tooltiptext}>{data.categoryName}</span> */}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <a
                                                                    className={styles.downloadLink}
                                                                    href={data.file}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title={t('Download')}
                                                                >
                                                                    <ScalableVectorGraphics
                                                                        className={styles.icon}
                                                                        src={downloadCloud}
                                                                    />
                                                                </a>
                                                                {filterPermissionGranted
                                                                    ? (
                                                                        <>
                                                                            {' '}
                                                                            <Cloak hiddenIf={p => !p.change_document}>
                                                                                <ModalButton
                                                                                    id="popup-edit"
                                                                                    className={styles.editButtonListView}
                                                                                    iconName="edit"
                                                                                    transparent
                                                                                    title={t('Edit')}
                                                                                    modal={
                                                                                        <AddDocumentForm value={data} onUpdate={this.handleUpdate} />
                                                                                    }
                                                                                    disabled={pending}
                                                                                />
                                                                            </Cloak>
                                                                            <Cloak hiddenIf={p => !p.delete_document}>
                                                                                <DangerConfirmButton
                                                                                    id="popup-delete"
                                                                                    className={styles.deleteButtonListView}
                                                                                    confirmationMessage={t('Are you sure you want to delete this document?')}
                                                                                    disabled={pending}
                                                                                    iconName="delete"
                                                                                    onClick={() => this.handleDelete(data.id)}
                                                                                    transparent
                                                                                    title={t('Delete')}
                                                                                />
                                                                            </Cloak>

                                                                        </>
                                                                    )
                                                                    : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        className={i > mainColumnIndex ? clickedColumn === 'col2' ? _cs(styles.extraMargin) : styles.normalMargin : styles.normalMargin}
                                        style={{ width: '33.33%' }}
                                    >
                                        {item.map((data, idx) => (
                                            <div key={idx}>
                                                {idx === 1 ? (
                                                    <div
                                                        className={data.id === selectedContactFromLabelListId ? _cs(styles.active, styles.col2Div) : styles.col2Div}


                                                    >
                                                        <div
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => handleClick(data.id, 'col2', i)}
                                                            onKeyDown={undefined}
                                                        >
                                                            <div className="col1" style={{ display: 'flex', padding: '10px', minHeight: '120px', justifyContent: 'space-between' }}>
                                                                <div style={{ paddingRight: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                                    <h4 style={{ wordBreak: 'break-word' }}>{data.title}</h4>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <div style={{ fontWeight: 'bold' }}>
                                                                            <ScalableVectorGraphics
                                                                                className={styles.icon}
                                                                                src={dateCalender}
                                                                            />
                                                                        </div>
                                                                        <div style={{ marginLeft: '2px' }}>
                                                                            {' '}
                                                                            {data.listViewDate}
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div style={{ height: '60px', display: 'flex', borderRadius: '5px', width: '60px', backgroundColor: '#F2F2F2' }}>
                                                                    <ScalableVectorGraphics
                                                                        className={styles.iconTitle}
                                                                        src={bookIcon}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col1" style={{ borderTop: '1px solid #e1e1e1', padding: '10px' }}>
                                                                <div style={{ display: 'flex' }}>
                                                                    <div style={{ fontWeight: 'bold' }}>
                                                                        {t('Region')}
                                                                        :
                                                                    </div>
                                                                    <div style={{ marginLeft: '2px' }}>
                                                                        {' '}
                                                                        {data.region}
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex' }}>
                                                                    <div style={{ fontWeight: 'bold' }}>
                                                                        {t('Published By')}
                                                                        :
                                                                    </div>
                                                                    <div style={{ marginLeft: '2px' }}>
                                                                        {' '}
                                                                        {data.publishedBy ? data.publishedBy : '-'}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className={data.id === selectedContactFromLabelListId ? styles.description : styles.hideDiv}>
                                                                {data.description
                                                                    ? (
                                                                        <p>
                                                                            {data.description}
                                                                        </p>
                                                                    ) : <p style={{ display: 'flex', justifyContent: 'center' }}>{t('No Description Available')}</p>}
                                                            </div>
                                                        </div>
                                                        <div className={styles.footer}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div style={{ fontWeight: 'bold' }}>
                                                                    {t('Category')}
                                                                    :
                                                                </div>
                                                                <div className={styles.categoryName} style={this.colourForCategory(data.categoryName)}>
                                                                    {data.categoryName}
                                                                    <div className={styles.tableTooltip}>
                                                                        {data.categoryName}

                                                                    </div>
                                                                    {/* <span className={styles.tooltiptext}>{data.categoryName}</span> */}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <a
                                                                    className={styles.downloadLink}
                                                                    href={data.file}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title={t('Download')}
                                                                >
                                                                    <ScalableVectorGraphics
                                                                        className={styles.icon}
                                                                        src={downloadCloud}
                                                                    />
                                                                </a>
                                                                {filterPermissionGranted
                                                                    ? (
                                                                        <>
                                                                            {' '}
                                                                            <Cloak hiddenIf={p => !p.change_document}>
                                                                                <ModalButton
                                                                                    id="popup-edit"
                                                                                    className={styles.editButtonListView}
                                                                                    iconName="edit"
                                                                                    transparent
                                                                                    title={t('Edit')}
                                                                                    modal={
                                                                                        <AddDocumentForm value={data} onUpdate={this.handleUpdate} />
                                                                                    }
                                                                                    disabled={pending}
                                                                                />
                                                                            </Cloak>
                                                                            <Cloak hiddenIf={p => !p.delete_document}>
                                                                                <DangerConfirmButton
                                                                                    id="popup-delete"
                                                                                    className={styles.deleteButtonListView}
                                                                                    confirmationMessage={t('Are you sure you want to delete this document?')}
                                                                                    disabled={pending}
                                                                                    iconName="delete"
                                                                                    onClick={() => this.handleDelete(data.id)}
                                                                                    transparent
                                                                                    title={t('Delete')}
                                                                                />
                                                                            </Cloak>

                                                                        </>
                                                                    )
                                                                    : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        className={i > mainColumnIndex ? clickedColumn === 'col3' ? _cs(styles.extraMargin) : styles.normalMargin : styles.normalMargin}
                                        style={{ width: '33.33%' }}
                                    >
                                        {item.map((data, idx) => (
                                            <div key={idx}>
                                                {idx === 2 ? (
                                                    <div
                                                        className={data.id === selectedContactFromLabelListId ? _cs(styles.active, styles.col3Div) : styles.col3Div}

                                                    >
                                                        <div

                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => handleClick(data.id, 'col3', i)}
                                                            onKeyDown={undefined}
                                                        >
                                                            <div className="col1" style={{ display: 'flex', padding: '10px', minHeight: '120px', justifyContent: 'space-between' }}>
                                                                <div style={{ paddingRight: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                                    <h4 style={{ wordBreak: 'break-word' }}>{data.title}</h4>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <div style={{ fontWeight: 'bold' }}>
                                                                            <ScalableVectorGraphics
                                                                                className={styles.icon}
                                                                                src={dateCalender}
                                                                            />
                                                                        </div>
                                                                        <div style={{ marginLeft: '2px' }}>
                                                                            {' '}
                                                                            {data.listViewDate}
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div style={{ height: '60px', display: 'flex', borderRadius: '5px', width: '60px', backgroundColor: '#F2F2F2' }}>
                                                                    <ScalableVectorGraphics
                                                                        className={styles.iconTitle}
                                                                        src={bookIcon}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col1" style={{ borderTop: '1px solid #e1e1e1', padding: '10px' }}>
                                                                <div style={{ display: 'flex' }}>
                                                                    <div style={{ fontWeight: 'bold' }}>
                                                                        {t('Region')}
                                                                        :
                                                                        {' '}
                                                                    </div>
                                                                    <div style={{ marginLeft: '2px' }}>
                                                                        {' '}
                                                                        {data.region}
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex' }}>
                                                                    <div style={{ fontWeight: 'bold' }}>
                                                                        {t('Published By')}
                                                                        :
                                                                        {' '}
                                                                    </div>
                                                                    <div style={{ marginLeft: '2px' }}>
                                                                        {' '}
                                                                        {data.publishedBy ? data.publishedBy : '-'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={data.id === selectedContactFromLabelListId ? styles.description : styles.hideDiv}>
                                                                {data.description
                                                                    ? (
                                                                        <p>
                                                                            {data.description}
                                                                        </p>
                                                                    ) : <p style={{ display: 'flex', justifyContent: 'center' }}>{t('No Description Available')}</p>}
                                                            </div>
                                                        </div>
                                                        <div className={styles.footer}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div style={{ fontWeight: 'bold' }}>
                                                                    {t('Category')}
                                                                    :
                                                                </div>
                                                                <div className={styles.categoryName} style={this.colourForCategory(data.categoryName)}>
                                                                    {data.categoryName}
                                                                    <div className={styles.tableTooltip}>
                                                                        {data.categoryName}

                                                                    </div>
                                                                    {/* <span className={styles.tooltiptext}>{data.categoryName}</span> */}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <a
                                                                    className={styles.downloadLink}
                                                                    href={data.file}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title={t('Download')}

                                                                >
                                                                    <ScalableVectorGraphics
                                                                        className={styles.icon}
                                                                        src={downloadCloud}
                                                                    />
                                                                </a>
                                                                {filterPermissionGranted
                                                                    ? (
                                                                        <>
                                                                            {' '}
                                                                            <Cloak hiddenIf={p => !p.change_document}>
                                                                                <ModalButton
                                                                                    id="popup-edit"
                                                                                    className={styles.editButtonListView}
                                                                                    iconName="edit"
                                                                                    transparent
                                                                                    title={t('Edit')}
                                                                                    modal={
                                                                                        <AddDocumentForm value={data} onUpdate={this.handleUpdate} />
                                                                                    }
                                                                                    disabled={pending}
                                                                                />
                                                                            </Cloak>
                                                                            <Cloak hiddenIf={p => !p.delete_document}>
                                                                                <DangerConfirmButton
                                                                                    id="popup-delete"
                                                                                    className={styles.deleteButtonListView}
                                                                                    confirmationMessage={t('Are you sure you want to delete this document?')}
                                                                                    disabled={pending}
                                                                                    iconName="delete"
                                                                                    onClick={() => this.handleDelete(data.id)}
                                                                                    transparent
                                                                                    title={t('Delete')}
                                                                                />
                                                                            </Cloak>

                                                                        </>
                                                                    )
                                                                    : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    </Translation>

                )) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        No Data Available
                        <div />
                    </div>
                )


        );
    }


    private tableComponent = () => {
        const {
            isSortByOrdering,
            contactList,
            sortData,
            sortButtonAscending,
            searchActivated,
            selectedSortList,
            searchKeyword,
            EditDeleteDivIndex,
        } = this.state;
        const { user, region, requests: {
            documentDeleteRequest: {
                pending,
            },
        }, language: { language } } = this.props;
        const splitingValue = searchKeyword ? sortData : expandedDocuments;
        const handleEditDeleteOption = (e) => {
            if (e.target.id === 'popup-edit' || e.target.id === 'popup-delete') {
                document.removeEventListener('mousedown', handleEditDeleteOption);
                return;
            }

            this.setState({ EditDeleteDivIndex: undefined });
        };
        const handleEditDeleteButtonClick = (e, i) => {
            document.addEventListener('mousedown', handleEditDeleteOption);
            if (EditDeleteDivIndex === i) {
                this.setState({ EditDeleteDivIndex: undefined });
            } else {
                this.setState({ EditDeleteDivIndex: i });
            }
        };


        const filterPermissionGranted = checkSameRegionPermission(user, region);

        return (
            <Translation>
                {
                    t => (
                        <div style={{ overflow: 'auto', padding: '20px', paddingTop: '0px' }}>
                            <table className={styles.contacts}>
                                <thead>
                                    <tr style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                                        <th>{t('S/N')}</th>
                                        <th>
                                            <div style={{ display: 'flex' }}>
                                                {t('Name')}
                                                {this.SortButton('title')}
                                            </div>
                                        </th>
                                        <th>
                                            <div style={{ display: 'flex' }}>
                                                {t('Category')}
                                                {this.SortButton('categoryName')}
                                            </div>
                                        </th>
                                        <th>
                                            <div style={{ display: 'flex' }}>
                                                {t('Region')}
                                                {this.SortButton('region')}
                                            </div>
                                        </th>
                                        {/* <th>Organization</th> */}
                                        <th>{t('Published by')}</th>
                                        <th>
                                            <div style={{ display: 'flex' }}>
                                                {t('Published on')}
                                                {this.SortButton('publishedDate')}
                                            </div>
                                        </th>
                                        <th>{t('Action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchActivated ? (
                                        !splitingValue.length ? (
                                            <tr>
                                                <td />
                                                <td />
                                                <td />
                                                <td>{t('No Data Available')}</td>
                                                <td />
                                                <td />
                                                <td />
                                            </tr>
                                        ) : (
                                            splitingValue.map((item, i) => (
                                                <tr key={item.id}>
                                                    <td>{i + 1}</td>
                                                    <td>{item.title}</td>
                                                    <td style={{ position: 'relative' }}>
                                                        {/* <div className={styles.tableCategory} style={this.colourForCategory(item.categoryName)}>
												{item.categoryName}
												<div className={styles.tableTooltip}>
													{item.categoryName}

												</div>
											</div> */}
                                                        {item.categoryName}
                                                    </td>
                                                    <td>{item.region}</td>
                                                    <td>{item.publishedBy ? item.publishedBy : '-'}</td>
                                                    <td>{convertDateAccToLanguage(item.publishedDate, language)}</td>
                                                    <td>

                                                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                                            <a
                                                                className={styles.downloadLink}
                                                                href={item.file}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title="Download"
                                                                style={{ marginRight: '5px' }}
                                                            >
                                                                <ScalableVectorGraphics
                                                                    className={styles.icon}
                                                                    src={DownloadIcon}
                                                                />
                                                            </a>
                                                            {filterPermissionGranted
                                                                ? (
                                                                    <>
                                                                        {' '}
                                                                        <Cloak hiddenIf={p => !p.change_document}>
                                                                            <ModalButton
                                                                                id="popup-edit"
                                                                                className={styles.editButtonListView}
                                                                                iconName="edit"
                                                                                transparent
                                                                                title="Edit"
                                                                                modal={
                                                                                    <AddDocumentForm value={item} onUpdate={this.handleUpdate} />
                                                                                }
                                                                                disabled={pending}
                                                                            />
                                                                        </Cloak>
                                                                        <Cloak hiddenIf={p => !p.delete_document}>
                                                                            <DangerConfirmButton
                                                                                id="popup-delete"
                                                                                className={styles.deleteButtonListView}
                                                                                confirmationMessage={t('"Are you sure you want to delete this document?"')}
                                                                                disabled={pending}
                                                                                iconName="delete"
                                                                                onClick={() => this.handleDelete(item.id)}
                                                                                transparent
                                                                                title={t('Delete')}
                                                                            />
                                                                        </Cloak>

                                                                    </>
                                                                )
                                                                : ''}
                                                            {/* {filterPermissionGranted
													? (
														<button
															type="button"
															style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
															onClick={e => handleEditDeleteButtonClick(e, i)}
															title="Edit/Delete"
														>
															<ScalableVectorGraphics
																className={styles.icon}
																src={Eye}
															/>
														</button>
													)
													: ''}

												{EditDeleteDivIndex === i
													? (
														<div id={styles.pol}>
															<DocumentRenderer
																className={styles.documentRenderer}
																document={item}

																onUpdate={this.handleUpdate}
																onDelete={this.handleDelete}
																disabled={pending}
																handleEditDeleteButtonClick={handleEditDeleteButtonClick}
															/>
														</div>
													) : ''} */}


                                                        </div>
                                                    </td>

                                                </tr>
                                            ))
                                        )
                                    ) : splitingValue.length ? (
                                        splitingValue.map((item, i) => (
                                            <tr key={item.id}>
                                                <td>{i + 1}</td>
                                                <td>{item.title}</td>
                                                <td style={{ position: 'relative' }}>
                                                    {/* <div className={styles.tableCategory} style={this.colourForCategory(item.categoryName)}>
											{item.categoryName}
											<div className={styles.tableTooltip}>
												{item.categoryName}

											</div>
										</div> */}
                                                    {item.categoryName}
                                                </td>
                                                <td>{item.region}</td>
                                                <td>{item.publishedBy ? item.publishedBy : '-'}</td>
                                                <td>{convertDateAccToLanguage(item.publishedDate, language)}</td>
                                                <td>

                                                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>

                                                        <a
                                                            className={styles.downloadLink}
                                                            href={item.file}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Download"
                                                            style={{ marginRight: '5px' }}
                                                        >
                                                            <ScalableVectorGraphics
                                                                className={styles.icon}
                                                                src={DownloadIcon}
                                                            />
                                                        </a>

                                                        {filterPermissionGranted
                                                            ? (
                                                                <>
                                                                    {' '}
                                                                    <Cloak hiddenIf={p => !p.change_document}>
                                                                        <ModalButton
                                                                            id="popup-edit"
                                                                            className={styles.editButtonListView}
                                                                            iconName="edit"
                                                                            transparent
                                                                            title={t('Edit')}
                                                                            modal={
                                                                                <AddDocumentForm value={item} onUpdate={this.handleUpdate} />
                                                                            }
                                                                            disabled={pending}
                                                                        />
                                                                    </Cloak>
                                                                    <Cloak hiddenIf={p => !p.delete_document}>
                                                                        <DangerConfirmButton
                                                                            id="popup-delete"
                                                                            className={styles.deleteButtonListView}
                                                                            confirmationMessage={t('Are you sure you want to delete this document?')}
                                                                            disabled={pending}
                                                                            iconName="delete"
                                                                            onClick={() => this.handleDelete(item.id)}
                                                                            transparent
                                                                            title={t('Delete')}
                                                                        />
                                                                    </Cloak>

                                                                </>
                                                            )
                                                            : ''}

                                                        {/* {filterPermissionGranted
												? (
													<button
														type="button"
														style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
														onClick={e => handleEditDeleteButtonClick(e, i)}
														title="Edit/Delete"
													>
														<ScalableVectorGraphics
															className={styles.icon}
															src={Eye}
														/>
													</button>
												)
												: ''}

											{EditDeleteDivIndex === i
												? (
													<div id={styles.pol}>
														<DocumentRenderer
															className={styles.documentRenderer}
															document={item}

															onUpdate={this.handleUpdate}
															onDelete={this.handleDelete}
															disabled={pending}
															handleEditDeleteButtonClick={handleEditDeleteButtonClick}
														/>
													</div>
												) : ''} */}
                                                    </div>
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td />
                                            <td />
                                            <td />
                                            <td>{t('No Data Available')}</td>
                                            <td />
                                            <td />
                                            <td />
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )
                }
            </Translation>

        );
    };

    public render() {
        const {
            className,
            requests,
            requests: { documentsGetRequest },
            user,
            region,
        } = this.props;

        const { selectedCategory, selectedRegion, searchKeyword,
            documents, enableListView, clickedColumn } = this.state;

        // const documents = getResults(requests, 'documentsGetRequest');
        documentsGetRequest.setDefaultParams({
            province: region.adminLevel === 1 ? region.geoarea : '',
            district: region.adminLevel === 2 ? region.geoarea : '',
            municipality: region.adminLevel === 3 ? region.geoarea : '',
            output: this.handleResults,
        });

        const documentCategories = getResults(
            requests,
            'documentCategoryGetRequest',
        );

        const filteredDocuments = this.getFilteredDocuments(
            documents,
            region,
            selectedCategory,
            selectedRegion,
        );

        expandedDocuments = this.getCategoryExpandedDocuments(
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
        return (
            <Translation>
                {
                    t => (
                        <div className={_cs(className, styles.documents)}>
                            <Loading pending={pending} />
                            <CommonMap sourceKey="profile-document" />
                            <header className={styles.header}>
                                <input
                                    className={styles.search}
                                    name="search"
                                    type="text"
                                    placeholder={t('SEARCH BY TITLE')}
                                    value={searchKeyword}
                                    onChange={e => this.handleSearch(e.target.value)}
                                />
                                <div
                                    style={{ marginLeft: '10px', marginRight: '10px', display: 'flex' }}
                                >
                                    <Button
                                        className={styles.SelectTableButton}
                                        onClick={() => this.setState({ enableListView: !enableListView })}
                                        disabled={!expandedDocuments.length}
                                        title={enableListView ? 'Table View' : 'List View'}
                                    >
                                        <div key={enableListView}>
                                            <ScalableVectorGraphics
                                                className={styles.iconDataView}
                                                src={enableListView ? tableView : listView}
                                            />
                                        </div>
                                    </Button>
                                    <Cloak hiddenIf={p => !p.add_document}>
                                        <AccentModalButton
                                            transparent
                                            iconName="add"
                                            modal={<AddDocumentForm onUpdate={this.handleUpdate} />}
                                        >
                                            {t('New document')}
                                        </AccentModalButton>
                                    </Cloak>
                                </div>
                            </header>
                            {/* <div className={styles.filters}>
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
				</div> */}
                            {/* <ListView
					className={styles.content}
					data={expandedDocuments}
					renderer={DocumentRenderer}
					keySelector={keySelector}
					rendererParams={this.rendererParams}
				/> */}

                            {enableListView ? this.listComponent() : this.tableComponent()}
                        </div>
                    )
                }
            </Translation>

        );
    }
}

export default connect(mapStateToProps)(
    createRequestClient(requestOptions)(Document),
);
