/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-plusplus */
import React, { useEffect } from 'react';
import { Translation } from 'react-i18next';
import { _cs } from '@togglecorp/fujs';
import FormattedDate from '#rscv/FormattedDate';
import Cloak from '#components/Cloak';
import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import Loading from '#components/Loading';
import styles from './styles.scss';
import AddInventoryForm from '../AddInventoryForm';

const ModalButton = modalize(Button);
const TableDataList = ({ population, literacy,
    householdSummary, ageGroup,
    selectedCategory, language, inventoryList, onUpdate, disable,
    onDelete, resourceId, clusterList, categoryList, unitList,
    organizationList, stockOutList, stockInList,
    itemList, hazard }) => {
    const idToTitle = (array, id, lang) => {
        const data = array.length && array.find(item => item.id === id);
        const selectedData = id && array.length ? lang === 'en' ? data.title : data.titleNe || data.title : '-';
        return selectedData;
    };
    return (
        <>
            <Loading pending={disable} />
            <Translation>
                {
                    t => (
                        <div
                            style={{
                                overflow: 'auto',
                                marginTop: '20px',
                                borderLeft: '1px solid #ddd',
                                borderRight: '1px solid #ddd',
                                height: '90%',
                            }}
                        >
                            {selectedCategory === 1 ? (
                                <table className={_cs(styles.contacts,
                                    language === 'np' && styles.languageFont)}
                                >
                                    <thead>

                                        <tr>
                                            <th colSpan="10" scope="colgroup" style={{ textAlign: 'center' }}>{t('Items')}</th>

                                            <th rowSpan="2">Quantity</th>
                                            <th rowSpan="2">Organization</th>
                                            <th rowSpan="2">Description</th>
                                        </tr>

                                        <tr>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Unit</th>
                                            <th>Description</th>
                                            <th>Dimension</th>
                                            <th>Occupancy</th>
                                            <th>Code</th>
                                            <th>Clusters</th>
                                            <th>Category</th>
                                            <th>Hazards</th>


                                            {/* <th>Remarks</th> */}

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventoryList.map(data => (
                                            <tr key={data.id}>
                                                <td>
                                                    <a href={data.item.image} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={data.item.image}
                                                            alt="item-pic"
                                                            style={{

                                                                height: '120px',
                                                                width: '120px',
                                                                objectFit: 'contain',
                                                            }}
                                                        />
                                                    </a>
                                                    {/* {data.item.image || '-'} */}
                                                </td>
                                                <td>{language === 'en' ? data.item.title : data.item.titleNe || '-'}</td>
                                                <td>{language === 'en' ? data.item.unit || '-' : data.item.unitNp || '-'}</td>
                                                <td>{data.item.shortDescription || '-'}</td>
                                                <td>{data.item.dimension || '-'}</td>
                                                <td>{data.item.occupency || '-'}</td>
                                                <td>{data.item.code || '-'}</td>
                                                <td>
                                                    {' '}
                                                    {data.item.clusters.map((d, index) => `${idToTitle(clusterList,
                                                        d, language)}${data.item.clusters.length - 1 === index ? '' : ' , '}`)}
                                                </td>
                                                <td>
                                                    {data.item.categories
                                                        .map((d, index) => `${idToTitle(categoryList,
                                                            d, language)}${data.item.categories.length - 1 === index ? '' : ' , '}`)}
                                                </td>

                                                <td>
                                                    {data.item.hazards.map((d, index) => `${idToTitle(hazard,
                                                        d, language)}${data.item.hazards.length - 1 === index ? '' : ' , '}`)}
                                                    {' '}

                                                </td>
                                                <td>{data.quantity || '-'}</td>
                                                <td>{data.organization.length ? data.organization : '-'}</td>
                                                <td>{data.description || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : ''}

                            {selectedCategory === 2 ? (
                                <table className={_cs(styles.contacts,
                                    language === 'np' && styles.languageFont)}
                                >
                                    <thead>

                                        <tr>
                                            <th>Item</th>
                                            <th>Rate</th>
                                            <th>Quantity</th>
                                            <th>Organization</th>
                                            <th>Entry Date</th>
                                            <th>Expire Date</th>


                                            <th>Brand Registration Number</th>


                                            <th>Reference Number</th>
                                            <th>Remarks</th>

                                            <th>Attachment</th>

                                            {/* <th>Transfered to resource</th> */}


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockInList.map(item => (
                                            <tr key={item.id}>
                                                <td>{idToTitle(itemList, item.item, language)}</td>
                                                <td>{item.rate}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    {item.organization
                                                        .map((d, index) => `${idToTitle(organizationList,
                                                            d, language)}
                                                                    ${item.organization.length - 1 === index ? '' : ' , '}`)}
                                                </td>
                                                <td>{item.date}</td>
                                                <td>{item.expiryDate}</td>


                                                <td>{item.brandRegistrationNumber}</td>
                                                <td>{item.referenceNumber}</td>
                                                <td>{item.remarks}</td>
                                                <td>
                                                    <a href={item.file} download>
                                                        Download
                                                    </a>

                                                </td>

                                                {/* <td>
                                                    {idToTitle(itemList, item.transferedToResource,
                                                        language)}

                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : ''}
                            {selectedCategory === 3 ? (
                                <table className={_cs(styles.contacts,
                                    language === 'np' && styles.languageFont)}
                                >
                                    <thead>

                                        <tr>

                                            <th>Item</th>
                                            <th>Rate</th>
                                            <th>Quantity</th>
                                            <th>Organization</th>
                                            <th>Entry Date</th>
                                            <th>Expire Date</th>


                                            <th>Brand Registration Number</th>


                                            <th>Reference Number</th>
                                            <th>Remarks</th>

                                            <th>Attachment</th>

                                            {/* <th>Transfered to resource</th> */}


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockOutList.map(item => (
                                            <tr key={item.id}>

                                                <td>{idToTitle(itemList, item.item, language)}</td>
                                                <td>{item.rate}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    {item.organization
                                                        .map((d, index) => `${idToTitle(organizationList,
                                                            d, language)}
                                                                    ${item.organization.length - 1 === index ? '' : ' , '}`)}
                                                </td>
                                                <td>{item.date}</td>
                                                <td>{item.expiryDate}</td>


                                                <td>{item.brandRegistrationNumber}</td>
                                                <td>{item.referenceNumber}</td>
                                                <td>{item.remarks}</td>
                                                <td>
                                                    <a href={item.file} download>
                                                        Download
                                                    </a>

                                                </td>


                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : ''}
                            {selectedCategory === 4 ? (
                                <table className={_cs(styles.contacts,
                                    language === 'np' && styles.languageFont)}
                                >
                                    <thead>

                                        <tr>

                                            <th>Title</th>
                                            <th>Short Name</th>
                                            <th>description</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {organizationList.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.longName}</td>
                                                <td>{item.shortName}</td>
                                                <td>{item.description}</td>

                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            ) : ''}
                            {selectedCategory === 5 ? (
                                <table className={_cs(styles.contacts,
                                    language === 'np' && styles.languageFont)}
                                >
                                    <thead>

                                        <tr>

                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Unit</th>
                                            <th>Description</th>
                                            <th>Dimension</th>
                                            <th>Occupancy</th>
                                            <th>Code</th>
                                            <th>Clusters</th>
                                            <th>Category</th>
                                            <th>Hazards</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemList.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <a href={item.image} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={item.image}
                                                            alt="item-pic"
                                                            style={{

                                                                height: '120px',
                                                                width: '120px',
                                                                objectFit: 'contain',
                                                            }}
                                                        />
                                                    </a>
                                                    {' '}
                                                </td>
                                                <td>{language === 'en' ? item.title : item.titleNe || item.title}</td>
                                                <td>
                                                    {idToTitle(unitList,
                                                        item.unitLink, language)}

                                                </td>
                                                <td>{item.shortDescription}</td>
                                                <td>{item.dimension}</td>
                                                <td>{item.occupency}</td>
                                                <td>{item.code}</td>
                                                <td>
                                                    {' '}
                                                    {item.clusters.map((d, index) => `${idToTitle(clusterList,
                                                        d, language)}${item.clusters.length - 1 === index ? '' : ' , '}`)}
                                                </td>
                                                <td>
                                                    {item.categories
                                                        .map((d, index) => `${idToTitle(categoryList,
                                                            d, language)}${item.categories.length - 1 === index ? '' : ' , '}`)}
                                                </td>

                                                <td>
                                                    {item.hazards.map((d, index) => `${idToTitle(hazard,
                                                        d, language)}${item.hazards.length - 1 === index ? '' : ' , '}`)}
                                                    {' '}

                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            ) : ''}
                            {selectedCategory === 6 ? (
                                <table className={_cs(styles.contacts,
                                    language === 'np' && styles.languageFont)}
                                >
                                    <thead>

                                        <tr>
                                            <th>Title</th>
                                            <th>Description</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {unitList.map(item => (
                                            <tr key={item.id}>
                                                <td>{language === 'en' ? item.title : item.titleNe || item.title}</td>
                                                <td>{item.description}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : ''}
                            {selectedCategory === 7 ? (
                                <table className={_cs(styles.contacts,
                                    language === 'np' && styles.languageFont)}
                                >
                                    <thead>

                                        <tr>
                                            <th>Title</th>
                                            <th>Description</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoryList.map(item => (
                                            <tr key={item.id}>
                                                <td>{language === 'en' ? item.title : item.titleNe || item.title}</td>
                                                <td>{item.description}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : ''}
                            {selectedCategory === 8 ? (
                                <table className={_cs(styles.contacts,
                                    language === 'np' && styles.languageFont)}
                                >
                                    <thead>
                                        <tr>
                                            {/* {literacy.map(item => (

                                            <th scope="col" key={item.key}>{item.label}</th>

                                        ))} */}
                                            <th>Title</th>
                                            <th>Description</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {literacy.map(item => (

                                        <td key={item.key}>{item.value}</td>

                                    ))} */}
                                        {clusterList.map(item => (
                                            <tr key={item.id}>
                                                <td>{language === 'en' ? item.title : item.titleNe || item.title}</td>
                                                <td>{item.description}</td>

                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            ) : ''}
                        </div>


                    )
                }
            </Translation>

        </>
    );
};

export default TableDataList;
