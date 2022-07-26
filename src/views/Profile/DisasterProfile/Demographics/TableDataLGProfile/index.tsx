/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Button from '#rsca/Button';
import TableDataList from './TableDataList';
import styles from './styles.scss';

const TableData = ({ lgProfileWardLevelData, selectedFederalName }) => {
    const [selectedCategory, setSelectedCategory] = useState(1);
    const [selectedCategoryName, setSelectedCategoryName] = useState('Demographics');


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
    const handleClickedDataset = (id, name) => {
        setSelectedCategory(id);
        setSelectedCategoryName(name);
    };
    return (

        <div>
            <div>
                <Button
                    className={selectedCategory === 1 ? styles.active : ''}
                    onClick={() => handleClickedDataset(1, 'Demographics')}
                >
                    Demographics

                </Button>
                <Button
                    className={selectedCategory === 2 ? styles.active : ''}
                    onClick={() => handleClickedDataset(2, 'Household_Statistics')}
                >
                    Household Statistics

                </Button>
                <Button
                    className={selectedCategory === 3 ? styles.active : ''}
                    onClick={() => handleClickedDataset(3, 'Agriculture_Practice')}
                >
                    Agriculture Practice

                </Button>
                <Button
                    className={selectedCategory === 4 ? styles.active : ''}
                    onClick={() => handleClickedDataset(4, 'Physical_Structure_of_House')}
                >
                    Physical Structure of House

                </Button>
                {/* <Button
                    className={selectedCategory === 5 ? styles.active : ''}
                    onClick={() => setSelectedCategory(5)}
                >
                    Landuse Practice

                </Button> */}
                {/* <CsvDownload data={lgProfileWardLevelData} /> */}
                <Button className={styles.downloadButton}>
                    {' '}
                    <a href="" id="dd" onClick={handleDownload}>Download Csv</a>
                </Button>
            </div>
            <TableDataList
                selectedTable={selectedCategory}
                lgProfileWardLevelData={lgProfileWardLevelData}

            />

        </div>
    );
};


export default TableData;
