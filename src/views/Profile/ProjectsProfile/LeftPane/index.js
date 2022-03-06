/* eslint-disable no-plusplus */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  Pie,
  Cell,
  PieChart,
} from 'recharts';

import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';
import StatOutput from '#components/StatOutput';
import { saveChart } from '#utils/common';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Project from './ProjectItem';
import styles from './styles.scss';
import tableView from '#resources/icons/list-view.svg';
import listView from '#resources/icons/category-view.svg';
import Icon from '#rscg/Icon';
import dateCalender from '#resources/icons/date-calender.svg';

const propTypes = {};

const defaultProps = {};

const projectKeySelector = p => p.pid;
let splittedData = [];
class ProjectsProfileLeftPane extends React.PureComponent {
  static propTypes = propTypes;


  static defaultProps = defaultProps;

  constructor(props) {
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

  // componentDidMount() {
  //   const { searchActivated, searchKeyword } = this.props;
  //   this.setState({ searchActivated, searchKeyword });
  // }
  componentDidUpdate(prevProps) {
    if (prevProps.projects !== this.props.projects) {
      this.setState({
        searchKeyword: '',
        searchActivated: false,
      });
    }
  }

  handleSaveClick = () => {
    // saveChart('drrCycleData', 'drrCycle');
    // saveChart('categoryData', 'category');
    saveChart('projectOrganizationData', 'projectOrganization');
  };

  handleExpand = () => {
    this.props.onExpandChange(true);
  };

  handleContract = () => {
    this.props.onExpandChange(false);
  };

  handleSearch = (value) => {
    this.setState({ searchActivated: true, searchKeyword: value });
    const { sortData } = this.state;
    const { projects } = this.props;
    if (value === '' || value === null) {
      this.setState({
        sortData: projects,
      });
    } else {
      const filteredData = projects.filter((item, i) => (
        item.ptitle.toLowerCase().indexOf(value.toLowerCase()) !== -1
      ));


      this.setState({ sortData: filteredData });
    }
  }

  sortButtonDescending = (keyword) => {
    const { projects } = this.props;
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
      data = projects.sort((a, b) => {
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

  sortButtonAscending = (keyword) => {
    const { sortData } = this.state;
    const { projects } = this.props;
    this.setState({ searchActivated: true });
    let data = [];
    if (sortData.length) {
      data = sortData.sort((a, b) => {
        if (a[keyword] < b[keyword]) return -1;
        if (a[keyword] > b[keyword]) return 1;
        return 0;
      });
    } else {
      data = projects.sort((a, b) => {
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

  SortButton = (tableHeaderName) => {
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

  listComponent = () => {
    const { splitData, sortData, mainColumnIndex, clickedColumn, searchKeyword, searchActivated, selectedContactFromLabelListId } = this.state;
    const { user, region, projects } = this.props;

    const englishMonth = [{ id: '01', month: 'Jan' },
    { id: '02', month: 'Feb' },
    { id: '03', month: 'Mar' },
    { id: '04', month: 'Apr' },
    { id: '05', month: 'May' },
    { id: '06', month: 'Jun' },
    { id: '07', month: 'Jul' },
    { id: '08', month: 'Aug' },
    { id: '09', month: 'Sep' },
    { id: '10', month: 'Oct' },
    { id: '11', month: 'Nov' },
    { id: '12', month: 'Dec' },
    ];

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


    const splitingValue = searchKeyword ? sortData : projects;
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
        const splittedDateFrom = d.pdurfrom && d.pdurfrom.split('-');
        const splittedDateTo = d.pdurto && d.pdurto.split('-');
        const englishMonthConvertedFrom = englishMonth.find(m => m.id === splittedDateFrom[1]).month;
        const englishMonthConvertedTo = englishMonth.find(m => m.id === splittedDateTo[1]).month;
        const listViewDate = `${englishMonthConvertedFrom},${splittedDateFrom[0]}-${englishMonthConvertedTo},${splittedDateTo[0]}`;
        return ({
          ...d,
          listViewDate,

        });
      });
      return individualItem;
    });
    splittedData = dataList;
    return (

      splittedData.length
        ? splittedData.map((item, i) => (
          <div key={i} style={{ display: 'flex', width: '100%', height: '220px', marginBottom: '60px' }}>

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
                        <div
                          className="col1"
                          style={{
                            padding: '10px',
                            maxHeight: '130px',
                            justifyContent: 'space-between',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: '7',
                            minHeight: '130px',

                          }}
                        >

                          <h4 style={{ wordBreak: 'break-word' }} title={data.ptitle}>{data.ptitle}</h4>


                        </div>
                        <div className="col1" style={{ borderTop: '1px solid #e1e1e1', minHeight: '90px', padding: '10px' }}>
                          <div style={{ display: 'flex' }}>
                            <div style={{ fontWeight: 'bold' }}>Organization:</div>
                            <div
                              style={{
                                marginLeft: '2px',
                                maxHeight: '35px',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: '2',
                                minHeight: '35px',
                              }}
                              title={data.oname}
                            >
                              {data.oname}
                            </div>
                          </div>
                          <div style={{ display: 'flex' }}>
                            <div style={{ fontWeight: 'bold' }}>Budget:</div>
                            <div style={{ marginLeft: '30px' }}>
                              <span>
                                USD
                                {' '}
                                {data.budget_usd}
                              </span>


                            </div>
                          </div>
                        </div>


                      </div>
                      <div className={styles.footer}>
                        <div style={{ display: 'flex', borderTop: '1px solid rgb(225, 225, 225)', position: 'relative', padding: '10px' }}>
                          <ScalableVectorGraphics
                            className={styles.icon}
                            src={dateCalender}
                          />
                          <div style={{ marginLeft: '5px' }}>

                            {data.listViewDate}
                          </div>
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
                        <div
                          className="col1"
                          style={{
                            padding: '10px',
                            maxHeight: '130px',
                            justifyContent: 'space-between',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: '7',
                            minHeight: '130px',

                          }}
                        >

                          <h4 style={{ wordBreak: 'break-word' }} title={data.ptitle}>{data.ptitle}</h4>


                        </div>
                        <div className="col1" style={{ borderTop: '1px solid #e1e1e1', minHeight: '90px', padding: '10px' }}>
                          <div style={{ display: 'flex' }}>
                            <div style={{ fontWeight: 'bold' }}>Organization:</div>
                            <div
                              style={{
                                marginLeft: '2px',
                                maxHeight: '35px',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: '2',
                                minHeight: '35px',
                              }}
                              title={data.oname}
                            >
                              {data.oname}
                            </div>
                          </div>
                          <div style={{ display: 'flex' }}>
                            <div style={{ fontWeight: 'bold' }}>Budget:</div>
                            <div style={{ marginLeft: '30px' }}>
                              <span>
                                USD
                                {' '}
                                {data.budget_usd}
                              </span>
                            </div>
                          </div>

                        </div>

                      </div>
                      <div className={styles.footer}>
                        <div style={{ display: 'flex', borderTop: '1px solid rgb(225, 225, 225)', position: 'relative', padding: '10px' }}>
                          <ScalableVectorGraphics
                            className={styles.icon}
                            src={dateCalender}
                          />
                          <div style={{ marginLeft: '5px' }}>

                            {data.listViewDate}
                          </div>
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
                        <div
                          className="col1"
                          style={{
                            padding: '10px',
                            maxHeight: '130px',
                            justifyContent: 'space-between',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: '7',
                            minHeight: '130px',
                          }}
                        >

                          <h4 style={{ wordBreak: 'break-word' }} title={data.ptitle}>{data.ptitle}</h4>


                        </div>
                        <div className="col1" style={{ borderTop: '1px solid #e1e1e1', minHeight: '90px', padding: '10px' }}>
                          <div style={{ display: 'flex' }}>
                            <div style={{ fontWeight: 'bold' }}>Organization: </div>
                            <div
                              style={{
                                marginLeft: '2px',
                                maxHeight: '35px',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: '2',
                                minHeight: '35px',
                              }}
                              title={data.oname}
                            >
                              {data.oname}
                            </div>
                          </div>
                          <div style={{ display: 'flex' }}>
                            <div style={{ fontWeight: 'bold' }}>Budget: </div>
                            <div style={{ marginLeft: '30px' }}>
                              <span>
                                USD
                                {' '}
                                {data.budget_usd}
                              </span>


                            </div>
                          </div>
                        </div>

                      </div>
                      <div className={styles.footer}>
                        <div style={{ display: 'flex', borderTop: '1px solid rgb(225, 225, 225)', position: 'relative', padding: '10px' }}>
                          <ScalableVectorGraphics
                            className={styles.icon}
                            src={dateCalender}
                          />
                          <div style={{ marginLeft: '5px' }}>

                            {data.listViewDate}
                          </div>
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
        )) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            No Data Available
            <div />
          </div>
        )


    );
  }


  tableComponent = () => {
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
    const { projects, organizationMap } = this.props;
    const splitingValue = searchKeyword ? sortData : projects;
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


    return (
      <div style={{ overflow: 'auto', padding: '20px', paddingTop: '0px' }}>
        <table className={styles.contacts}>
          <thead>
            <tr style={{ position: 'sticky', top: '0', zIndex: '2' }}>
              <th>S/N</th>
              <th>
                <div style={{ display: 'flex' }}>
                  Project
                  {this.SortButton('ptitle')}
                </div>
              </th>
              <th>
                <div style={{ display: 'flex' }}>
                  Organization
                  {this.SortButton('oname')}
                </div>
              </th>

              <th>
                <div style={{ display: 'flex' }}>
                  Budget(USD)
                  {this.SortButton('budget_usd')}
                </div>
              </th>

              <th>
                <div style={{ display: 'flex' }}>
                  Start Date
                  {this.SortButton('pdurfrom')}
                </div>
              </th>
              <th>
                <div style={{ display: 'flex' }}>
                  End Date
                  {this.SortButton('pdurto')}
                </div>
              </th>


            </tr>
          </thead>
          <tbody>
            {searchActivated ? (
              !splitingValue.length ? (
                <tr>
                  <td />
                  <td />
                  <td />
                  <td>No Data Available</td>
                  <td />
                  <td />
                  <td />
                </tr>
              ) : (
                splitingValue.map((item, i) => (
                  <tr key={item.pid}>
                    <td>{i + 1}</td>
                    <td>{item.ptitle}</td>
                    <td>{item.oname}</td>
                    <td>{item.budget_usd}</td>
                    <td>{item.pdurfrom}</td>
                    <td>{item.pdurto}</td>


                  </tr>
                ))
              )
            ) : splitingValue.length ? (
              splitingValue.map((item, i) => (
                <tr key={item.pid}>
                  <td>{i + 1}</td>
                  <td>{item.ptitle}</td>
                  <td>{item.oname}</td>
                  <td>{item.budget_usd}</td>
                  <td>{item.pdurfrom}</td>
                  <td>{item.pdurto}</td>


                </tr>
              ))
            ) : (
              <tr>
                <td />
                <td />
                <td />
                <td>No Data Available</td>
                <td />
                <td />
                <td />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  projectRendererParams = (projectId, project) => {
    const { projectMap, organizationMap, drrCycleMap, categoryMap } = this.props;

    return {
      title: project.ptitle,
      start: project.pdurfrom,
      end: project.pdurto,
      budget: project.budget_local,
      projectId,
      ...projectMap[projectId],
      organizationMap,
      drrCycleMap,
      categoryMap,
    };
  };

  render() {
    const {
      leftPaneExpanded,
      projects,
      drrCycleData,
      categoryData,
      projectMap,
      className,
      projectOrganizationPieData,


    } = this.props;
    const { enableListView, searchKeyword } = this.state;
    return (
      <div className={_cs(className, styles.leftPane)}>
        <header className={styles.header}>
          <input
            className={styles.search}
            name="search"
            type="text"
            placeholder="SEARCH BY TITLE"
            value={searchKeyword}
            onChange={e => this.handleSearch(e.target.value)}
          />
          <div
            style={{ marginLeft: '10px', marginRight: '10px', display: 'flex' }}
          >
            <Button
              className={styles.SelectTableButton}
              onClick={() => this.setState({ enableListView: !enableListView })}
              disabled={!projects.length}
              title={enableListView ? 'Table View' : 'List View'}
            >
              <div key={enableListView}>
                <ScalableVectorGraphics
                  className={styles.iconDataView}
                  src={enableListView ? tableView : listView}
                />
              </div>
            </Button>

          </div>
        </header>
        {enableListView ? this.listComponent() : this.tableComponent()}

        {/* <StatOutput
          className={styles.stat}
          label="No. of Projects"
          value={projects.length}
        />
        <ListView
          className={styles.projectsList}
          data={projects}
          renderer={Project}
          keySelector={projectKeySelector}
          rendererParams={this.projectRendererParams}
        /> */}
      </div>
    );
  }
}

export default ProjectsProfileLeftPane;
