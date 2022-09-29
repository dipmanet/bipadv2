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
    onDelete, resourceId, clusterList, categoryList, unitList, itemList }) => (
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
                                        <th>Category</th>
                                        <th>Clusters</th>
                                        <th>Hazards</th>


                                        {/* <th>Remarks</th> */}

                                    </tr>
                                </thead>
                                <tbody>
                                    {inventoryList.map(data => (
                                        <tr key={data.id}>
                                            <td>{data.item.image || '-'}</td>
                                            <td>{language === 'en' ? data.item.title : data.item.titleNe || '-'}</td>
                                            <td>{language === 'en' ? data.item.unit || '-' : data.item.unitNp || '-'}</td>
                                            <td>{data.item.shortDescription || '-'}</td>
                                            <td>{data.item.dimension || '-'}</td>
                                            <td>{data.item.occupency || '-'}</td>
                                            <td>{data.item.code || '-'}</td>
                                            <td>{data.item.categories.length ? data.item.categories : '-'}</td>
                                            <td>{data.item.clusters.length ? data.item.clusters : '-'}</td>
                                            <td>{data.item.hazards.length ? data.item.hazards : '-'}</td>
                                            <td>{data.quantity || '-'}</td>
                                            <td>{data.organization.length ? data.organization : '-'}</td>
                                            <td>{data.description || '-'}</td>
                                        </tr>
                                    ))}

                                    {/* {inventoryList.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.item.title}</td>
                                            <td>{item.item.category}</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                <FormattedDate
                                                    value={item.createdOn}
                                                    mode="yyyy-MM-dd"
                                                />
                                            </td>
                                            <td>{item.description}</td>
                                            <td>
                                                <div className={styles.actionButtons}>
                                                    <Cloak hiddenIf={p => !p.change_inventory}>
                                                        <ModalButton
                                                            className={styles.button}
                                                            modal={(
                                                                <AddInventoryForm
                                                                    onUpdate={onUpdate}
                                                                    value={item}
                                                                    resourceId={item.resource}
                                                                />
                                                            )}
                                                            disabled={disable}
                                                            iconName="edit"
                                                            transparent
                                                        >
                                                            Edit
                                                        </ModalButton>
                                                    </Cloak>
                                                    <Cloak hiddenIf={p => !p.delete_inventory}>
                                                        <DangerConfirmButton
                                                            className={styles.button}
                                                            onClick={() => onDelete(item.id)}
                                                            disabled={disable}
                                                            iconName="delete"
                                                            transparent
                                                            confirmationMessage="Are you sure
                                                        you want to delete this inventory?"
                                                        >
                                                            Delete
                                                        </DangerConfirmButton>
                                                    </Cloak>
                                                </div>
                                            </td>

                                        </tr>
                                    ))} */}


                                </tbody>
                            </table>
                        ) : ''}

                        {
                            selectedCategory === 2
                                ? (
                                    <table className={_cs(styles.contacts,
                                        language === 'np' && styles.languageFont)}
                                    >
                                        <thead>
                                            <tr>
                                                <th colSpan="4" scope="colgroup" style={{ textAlign: 'center' }}>{t('StockIn')}</th>
                                            </tr>
                                            <tr>


                                                <th scope="col">{t('Age Group')}</th>
                                                <th scope="col">{t('Male')}</th>
                                                <th scope="col">{t('Female')}</th>
                                                <th scope="col">{t('Others')}</th>


                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* {ageGroup.map(data => (
                                                <tr key={data.key}>
                                                    <td>{data.label}</td>
                                                    <td>{data.male}</td>
                                                    <td>{data.female}</td>
                                                    <td>{data.other ? data.other : '-'}</td>
                                                </tr>

                                            ))} */}
                                            <tr>
                                                <td>12</td>
                                                <td>12</td>
                                                <td>12</td>
                                                <td>12</td>
                                            </tr>


                                        </tbody>
                                    </table>
                                ) : ''
                        }
                        {selectedCategory === 3 ? (
                            <table className={_cs(styles.contacts,
                                language === 'np' && styles.languageFont)}
                            >
                                <thead>
                                    <tr>
                                        <th colSpan="5" scope="colgroup" style={{ textAlign: 'center' }}>{t('StockOut')}</th>
                                    </tr>
                                    <tr>
                                        {/* {literacy.map(item => (

                                            <th scope="col" key={item.key}>{item.label}</th>

                                        ))} */}
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Name</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {literacy.map(item => (

                                        <td key={item.key}>{item.value}</td>

                                    ))} */}
                                    <tr>
                                        <td>12</td>
                                        <td>12</td>
                                        <td>12</td>
                                        <td>12</td>
                                        <td>12</td>
                                    </tr>


                                </tbody>
                            </table>
                        ) : ''}
                        {selectedCategory === 4 ? (
                            <table className={_cs(styles.contacts,
                                language === 'np' && styles.languageFont)}
                            >
                                <thead>
                                    <tr>
                                        <th colSpan="5" scope="colgroup" style={{ textAlign: 'center' }}>{t('Categories')}</th>
                                    </tr>
                                    <tr>
                                        {/* {literacy.map(item => (

                                            <th scope="col" key={item.key}>{item.label}</th>

                                        ))} */}
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Name</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {literacy.map(item => (

                                        <td key={item.key}>{item.value}</td>

                                    ))} */}
                                    <tr>
                                        <td>12</td>
                                        <td>12</td>
                                        <td>12</td>
                                        <td>12</td>
                                        <td>12</td>
                                    </tr>

                                </tbody>
                            </table>
                        ) : ''}
                        {selectedCategory === 5 ? (
                            <table className={_cs(styles.contacts,
                                language === 'np' && styles.languageFont)}
                            >
                                <thead>
                                    <tr>
                                        <th colSpan="5" scope="colgroup" style={{ textAlign: 'center' }}>{t('Organization')}</th>
                                    </tr>
                                    <tr>
                                        {/* {literacy.map(item => (

                                            <th scope="col" key={item.key}>{item.label}</th>

                                        ))} */}
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Name</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {literacy.map(item => (

                                        <td key={item.key}>{item.value}</td>

                                    ))} */}
                                    <tr>
                                        <td>12</td>
                                        <td>12</td>
                                        <td>12</td>
                                        <td>12</td>
                                        <td>12</td>
                                    </tr>
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
                                            <td>{language === 'en' ? item.title : item.titleNe}</td>
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
                                            <td>{language === 'en' ? item.title : item.titleNe}</td>
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
                                            <td>{language === 'en' ? item.title : item.titleNe}</td>
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

export default TableDataList;
