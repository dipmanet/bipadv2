/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Translation } from 'react-i18next';
import styles from './styles.scss';
import Button from '#rsca/Button';
import TableDataList from './TableDataList';

const TableData = ({ population, literacy, ageGroup,
    householdSummary, selectedFederalName, language }) => {
    const [selectedCategory, setSelectedCategory] = useState(1);
    const [selectedCategoryName, setSelectedCategoryName] = useState('Population');
    const handleClickedDataset = (id, name) => {
        setSelectedCategory(id);
        setSelectedCategoryName(name);
    };
    const handleDownload = () => {
        // Use the outerHTML attribute to get the HTML
        // code of the entire table element (including the <Table> tag),
        // and then wrap it into a complete HTML document.
        // Set charset to urf-8 to prevent garbled code
        const html = `<html><head><meta charset='utf-8' />
        </head><body>${document.getElementsByTagName('table')[0].outerHTML}</body></html>`;
        // Instantiate a Blob object.
        // The first parameter of its constructor is an array containing file contents,
        // and the second parameter is an object containing file type attributes
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const a = document.getElementById('dd');

        // Use URL.createObjectURL() method to generate the Blob URL for the a tag.
        a.href = URL.createObjectURL(blob);

        // Set the download file name.
        a.download = `${selectedFederalName}_${selectedCategoryName}.xls`;
    };

    return (
        <Translation>
            {
                t => (
                    <div>

                        <div>
                            <Button
                                className={selectedCategory === 1 ? styles.active : ''}
                                onClick={() => handleClickedDataset(1, 'Population')}
                            >
                                {t('Population')}

                            </Button>
                            <Button
                                className={selectedCategory === 2 ? styles.active : ''}
                                onClick={() => handleClickedDataset(2, 'Age_Group')}
                            >
                                {t('Age Group')}

                            </Button>
                            <Button
                                className={selectedCategory === 3 ? styles.active : ''}
                                onClick={() => handleClickedDataset(3, 'Literacy_Rate')}
                            >
                                {t('Literacy Rate')}

                            </Button>

                            <Button className={styles.downloadButton}>
                                {' '}
                                <a href="" id="dd" onClick={handleDownload}>{t('Download Csv')}</a>
                            </Button>
                        </div>
                        <TableDataList
                            population={population}
                            literacy={literacy}
                            householdSummary={householdSummary}
                            ageGroup={ageGroup}
                            selectedCategory={selectedCategory}
                            language={language}
                        />

                    </div>
                )
            }
        </Translation>

    );
};

export default TableData;
