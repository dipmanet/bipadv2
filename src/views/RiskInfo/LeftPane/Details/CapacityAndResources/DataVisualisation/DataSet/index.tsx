/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable valid-typeof */
/* eslint-disable no-undef */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable import/export */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import styled, { keyframes } from 'styled-components';
import { CsvBuilder } from 'filefy';
import { districtsSelector, municipalitiesSelector, provincesSelector, wardsSelector } from '#selectors';
import Button from '#rsca/Button';
import styles from './styles.scss';
import { resourceHeader } from './TableHeader';

const mapStateToProps = (state, props) => ({
  provinces: provincesSelector(state),
  districts: districtsSelector(state),
  municipalities: municipalitiesSelector(state),
  wards: wardsSelector(state),


});


const CustomLoader = () => (
  <div style={{ padding: '24px' }}>
    <Spinner />
    <div>Loading Data,Please Wait...</div>
  </div>
);
const rotate360 = keyframes`
      from {
        transform: rotate(0deg);
      }
        
          to {
            transform: rotate(360deg);
          }
        `;

const Spinner = styled.div`
        	margin: 16px;
        	animation: ${rotate360} 1s linear infinite;
            	border-right: 2px solid grey;
        	border-bottom: 2px solid grey;
        	border-left: 4px solid black;
        	background: transparent;
        	width: 80px;
        	height: 80px;
        	border-radius: 50%;
        `;
const TextField = styled.input`
        	height: 32px;
        	width: 200px;
        	border-radius: 3px;
        	border-top-left-radius: 5px;
        	border-bottom-left-radius: 5px;
        	border-top-right-radius: 0;
        	border-bottom-right-radius: 0;
        	border: 1px solid #e5e5e5;
        	padding: 0 32px 0 16px;
        
        	&:hover {
        		cursor: pointer;
        	}
        `;

const ClearButton = styled(Button)`
        	border-top-left-radius: 0;
        	border-bottom-left-radius: 0;
        	border-top-right-radius: 5px;
        	border-bottom-right-radius: 5px;
        	height: 32px;
        	width: auto;
        	text-align: center;
        	display: flex;
        	align-items: center;
        	justify-content: center;
          margin-left:10px;
        `;

const DownloadButton = styled(Button)`
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        height: 32px;
        width: auto;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right:8px;
      `;


const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Search By Title"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton type="button" onClick={onClear}>
      Clear
    </ClearButton>
  </>
);


const TableData = ({ selectedResourceData, resourceType }) => {
  const [pending, setPending] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = selectedResourceData.filter(
    item => item.title && item.title.toLowerCase().includes(filterText.toLowerCase()),
  );
  const tableHeader = resourceHeader.find(data => data.resourceType === resourceType).data;
  const columns = tableHeader.map(item => ({
    name: item.value,
    id: item.value === 'Title' ? 'title' : '',
    selector: item.key === 'title' ? row => row[item.key] : row => ((item.key === 'point1') ? row.point ? row.point.coordinates[1] : '' : (item.key === 'point2') ? row.point ? row.point.coordinates[0] : '' : row[item.key] ? typeof (row[item.key]) === 'boolean' ? row[item.key] === true ? 'Yes' : 'No' : row[item.key] : row[item.key] === false ? 'No' : row[item.key]),
    sortable: true,
    minWidth: '100px',
    wrap: true,
    // allowOverflow: true,

    conditionalCellStyles: item.key === 'title' ? [
      {
        when: (row, index) => row.title,
        style: {
          position: 'sticky',
          left: '0',
          zIndex: '9',
          backgroundColor: 'white',

        },
      },


    ] : '',

  }));


  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
    );
  }, [filterText, resetPaginationToggle]);


  const handleDownload = useCallback((datas) => {
    const column = tableHeader.map(item => item.value);

    const csvData = datas.map(itm => (
      tableHeader.map(data => (
        data.key === 'point1' ? itm.point ? itm.point.coordinates[1] : '' : data.key === 'point2' ? itm.point ? itm.point.coordinates[0] : '' : itm[data.key] ? typeof (itm[data.key]) === 'boolean' ? itm[data.key] === true ? 'Yes' : '' : itm[data.key] : itm[data.key] === false ? 'No' : itm[data.key]
      ))
    ));

    const csvBuilder = new CsvBuilder(`${resourceType}.csv`)
      .setColumns(column)
      .addRows(csvData)
      .exportFile();
  });

  const Export = ({ onExport }) => <button className={styles.downloadButton} type="button" onClick={e => onExport(e.target.value)}>Download</button>;
  // const Export = ({ onExport }) => <DownloadButton onClick={e => onExport(e.target.value)}>Download</DownloadButton>;


  const actionsMemo = React.useMemo(() => <Export onExport={() => handleDownload(selectedResourceData)} />, [handleDownload, selectedResourceData]);
  const actionsMemo1 = React.useMemo(() => <Export onExport={() => handleDownload(selectedResourceData)} />, [handleDownload, selectedResourceData]);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setRows(selectedResourceData);
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [selectedResourceData]);
  const customStyles = {
    header: {
      style: {
        width: '50%',
        float: 'right',
        border: '2px solid white',
        marginBottom: '50px',


      },
    },
    headCells: {
      style: {
        // fontSize: '20px',
        // fontWeight: '500',
        textTransform: 'uppercase',
        fontFamily: 'inherit',
        fontWeight: 'bold',

        // maxWidth: '100px',
        // width: '100px',
        // paddingLeft: '0 8px',
      },
    },
    pagination: {
      style: {
        // color: theme.text.secondary,
        fontSize: '13px',
        minHeight: '56px',
        // backgroundColor: theme.background.default,
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        // borderTopColor: theme.divider.default,
      },
      pageButtonsStyle: {
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        padding: '8px',
        margin: 'px',
        cursor: 'pointer',
        transition: '0.4s',
        // color: theme.button.default,
        // fill: theme.button.default,
        backgroundColor: 'transparent',
        '&:disabled': {
          cursor: 'unset',
          // color: theme.button.disabled,
          // fill: theme.button.disabled,
        },
        '&:hover:not(:disabled)': {
          backgroundColor: '#1A70AC',

        },
        '&:focus': {
          outline: 'none',
          backgroundColor: '#1A70AC',
        },
      },
    },
    rows: {
      style: {
        zIndex: 0,
      },
    },
  };

  return (
    <div className={styles.dataTable}>

      <DataTable

        // title="Movie List"
        pagination
        paginationPerPage={100}
        paginationRowsPerPageOptions={[50, 100, 200, 500]}
        columns={columns}
        data={filteredItems}
        fixedHeader
        fixedHeaderScrollHeight={'500px'}
        striped
        // highlightOnHover
        // pointerOnHover
        actions={actionsMemo}
        progressPending={pending}
        progressComponent={<CustomLoader />}
        subHeader
        subHeaderWrap

        subHeaderComponent={subHeaderComponentMemo}
        customStyles={customStyles}

      />
    </div>
  );
};
export default connect(mapStateToProps)(TableData);
