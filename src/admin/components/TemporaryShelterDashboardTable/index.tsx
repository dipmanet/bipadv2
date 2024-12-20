/* eslint-disable no-unused-expressions */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-bracket-spacing */
/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import { connect } from "react-redux";
import { navigate } from "@reach/router";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import Checkbox from "@mui/material/Checkbox";
import Select from "react-select";
import { visuallyHidden } from "@mui/utils";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { CsvBuilder } from "filefy";

import { Paper } from "@mui/material";
import Loader from "react-loader";
import { SetEpidemicsPageAction, SetIncidentPageAction } from "#actionCreators";
import {
  districtsSelector,
  municipalitiesSelector,
  provincesSelector,
  userSelector,
  wardsSelector,
} from "#selectors";
import {
  createConnectedRequestCoordinator,
  createRequestClient,
  methods,
} from "#request";
import { AppState } from "#types";
import { englishToNepaliNumber } from "nepali-number";
import eyeSolid from "#resources/icons/eye-solid.svg";
import Reset from "#resources/icons/reset.svg";
import ADToBS from '#utils/AdBSConverter/AdToBs';
import BSToAD from '#utils/AdBSConverter/BsToAd';
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
// import { ADToBS } from "bikram-sambat-js";
// import { tableTitleRef } from "./utils";
import styles from "./styles.module.scss";

const mapStateToProps = (state: AppState): PropsFromAppState => ({
  user: userSelector(state),
  districts: districtsSelector(state),
  municipalities: municipalitiesSelector(state),
  wards: wardsSelector(state),
  provinces: provincesSelector(state)
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
  getEarthquakeRequest: {
    url: ({ params }) => "/temporary-shelter-data-overview/",
    method: methods.GET,
    onMount: false,
    query: ({ params }) => ({

      province: params.province,
      district: params.district,
      municipality: params.municipality,
      ward: params.ward,
      event: params.event
    }),
    onSuccess: ({ response, props, params }) => {
      params.fetchedData(response);
      params.countData(response.count);
    },
    onFailure: ({ error, params }) => {
      if (params && params.setEpidemicsPage) {
        // TODO: handle error
        console.warn("failure", error);
      }
    },
    onFatal: ({ error, params }) => {
      console.warn("failure", error);
    },
  },

};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    filter,
    fetchedData,
    tableTitleRef,
    onRequestSort,
  } = props;

  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) =>
      onRequestSort(event, property);
  const headCells = Object.keys(tableTitleRef).map((invD: string) => ({
    id: invD,
    numeric:
      invD.includes("count") ||
      invD.includes("no_of") ||
      invD.includes("number"),
    disablePadding: false,
    label: tableTitleRef[invD],
  }));

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell
                    align="center"
                    padding="checkbox"
                    sx={{ backgroundColor: '#DCECFE', fontWeight: 'bold' }}
                >
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        style={{ visibility: 'hidden' }}
                    />
                </TableCell> */}
        {headCells.map((headCell) => {
          const data = fetchedData && fetchedData.length && fetchedData.length && fetchedData[0].district === "" && headCell.id === "district" ? ""
            : fetchedData && fetchedData.length && fetchedData[0].municipality === "" && headCell.id === "municipality" ? ""
              : fetchedData && fetchedData.length && fetchedData[0].province === "" && headCell.id === 'province' ? "" :
                (
                  <TableCell
                    align="center"
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={{ backgroundColor: "#DCECFE", fontWeight: "bold" }}
                  >
                    <TableSortLabel
                      className={styles.setStyleForHead}
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                );

          return data;
        })}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  selected: [];
  dispatch: Dispatch;
  deleteEpidemicTable: ActionCreator;
  epidemicFormEdit: ActionCreator;
}

const TemporaryShelterDashboardTable = (props) => {
  const [filteredRowData, setFilteredRowData] = useState();
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("calories");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [offset, setOffset] = useState(0);
  const [loader, setLoader] = useState(false);
  const { districts, municipalities, wards, provinces } = props;
  const [fetchedData, setFetchedData] = useState([]);
  const [count, setCount] = useState(null);
  const [isFilterEnabled, setIsFilteredEnabled] = useState(false);
  const [disableSearch, setDisableSearch] = useState(true);
  const [benificeryList, setBenificeryList] = useState([]);
  const [tranche1StatusList, setTranche1StatusList] = useState([]);
  const [tranche2StatusList, setTranche2StatusList] = useState([]);
  const [paymentReceiveList, setPaymentReceiveList] = useState([]);
  const [fundingSourceList, setFundingSourceList] = useState([]);
  const [fetchIncident, setFetchIncident] = useState([]);
  const [tableHeaderList, setTableHeaderList] = useState({});

  const [filterData, setFilterData] = useState({
    province: "",
    district: "",
    municipality: "",
    ward: "",
    id: "",
    is_second_tranche_provided: "",
    is_first_tranche_provided: "",
    all_status__funding_source: "",
    all_status__payment_received_status: "",
    all_status__tranche_two_status: "",
    all_status__tranche_one_status: "",
    all_status__overall_beneficiary_status: "",
    event: ""

  });
  const loadingCondition = (boolean) => {
    setLoader(boolean);
  };
  const handleFetchedData = (finalData) => {
    setLoader(false);
    setFetchedData(finalData);
  };
  const handleCount = (countData) => {
    setCount(countData);
  };
  useEffect(() => {
    setLoader(true);
    props.requests.getEarthquakeRequest.do({
      fetchedData: handleFetchedData,
      countData: handleCount,
      offset
    });
  }, [offset]);
  const handleFetchedDataById = (finalData) => {
    setLoader(false);
    if (finalData === null) {
      setFetchedData([]);
    } else {
      setFetchedData([finalData]);
    }
  };

  // props.user.isSuperuser

  const handleSearch = () => {
    setLoader(true);
    setIsFilteredEnabled(true);

    props.requests.getEarthquakeRequest.do({
      fetchedData: handleFetchedData,
      province: props.user.isSuperuser ? filterData.district
        ? ""
        : filterData.province && filterData.province.value
        : props.user.profile.province,
      district: props.user.isSuperuser ? filterData.municipality
        ? ""
        : filterData.district && filterData.district.value
        : props.user.profile.district,
      municipality: props.user.isSuperuser ? filterData.ward
        ? ""
        : filterData.municipality && filterData.municipality.value
        : props.user.profile.municipality,
      ward: filterData.ward ? filterData.ward && filterData.ward.value : "",
      event: filterData.event ? filterData.event.value : "",
      countData: handleCount,
    });
    // }
  };
  // props.user.profile.district
  const DistrictListSelect = filterData.province &&
    districts
      .filter((i) => i.province === Number(filterData.province.value))
      .map((d) => ({
        value: d.id,
        label: d.title_ne,
      }));
  const ProvinceListSelect = provinces.map((d) => ({
    value: d.id,
    label: d.title_ne,
  }));
  const MunicipalityList =
    filterData.district &&
    municipalities
      .filter((i) => i.district === Number(filterData.district.value))
      .map((d) => ({
        value: d.id,
        label: d.title_ne,
      }));
  useEffect(() => {
    setFilterData({
      ...filterData,
      province: props.user.isSuperuser ? "" : props.user.profile.province ? { value: props.user.profile.province } : "",
      district: props.user.isSuperuser ? "" : props.user.profile.district ? { value: props.user.profile.district } : "",
      municipality: props.user.isSuperuser ? "" : props.user.profile.municipality ? { value: props.user.profile.municipality } : ""
    });
  }, [props.user]);

  const WardList =
    props.user.isSuperuser ? filterData.municipality &&
      wards
        .filter((i) => i.municipality === Number(filterData.municipality && filterData.municipality.value))
        .map((title) => ({ ...title, title: Number(title.title) }))
        .sort((a, b) => a.title - b.title)
        .map((d) => ({
          value: d.id,
          label: englishToNepaliNumber(d.title),
        }))

      :
      wards
        .filter((i) => i.municipality === Number(filterData.municipality && filterData.municipality.value))
        .map((title) => ({ ...title, title: Number(title.title) }))
        .sort((a, b) => a.title - b.title)
        .map((d) => ({
          value: d.id,
          label: englishToNepaliNumber(d.title),
        }));


  const dateFormatter = (date) => {
    const slicedDate = date.split("-");
    const year = englishToNepaliNumber(slicedDate[0]);
    const month = englishToNepaliNumber(slicedDate[1]);
    const day = englishToNepaliNumber(slicedDate[2]);
    const finalDate = `${year}/${month}/${day}`;
    return finalDate;
  };
  useEffect(() => {
    if (fetchedData && fetchedData.lowerLevelAggrigated) {
      const tableHeader = {
        sn: 'क्रम संख्या',
        province: "प्रदेश",
        district: "जिल्ला",
        municipality: "पालिका",
        ward: 'वडा',
        totalFirstTrancheFormFilled: "पहिलो किस्ता फारम भरिएको",
        totalFirstTrancheFormUploaded: "पहिलो किस्ता फारम अपलोड गरिएको",
        totalSecondTrancheFormFilled: "दोस्रो किस्ता फारम भरिएको",
        totalSecondTrancheFormUploaded: "दोस्रो किस्ता फारम अपलोड गरिएको",
      };
      fetchedData.lowerLevelAggrigated.data.length && fetchedData.lowerLevelAggrigated.data[0].beneficiaryDistrict_Province_TitleNe
        ?
        ['district', 'municipality', 'ward'].forEach(key => {
          delete tableHeader[key];
        }) :
        fetchedData.lowerLevelAggrigated.data.length && fetchedData.lowerLevelAggrigated.data[0].beneficiaryDistrict_TitleNe ? ['province', 'municipality', 'ward'].forEach(key => {
          delete tableHeader[key];
        }) : fetchedData.lowerLevelAggrigated.data.length && fetchedData.lowerLevelAggrigated.data[0].beneficiaryMunicipality_TitleNe ? ['province', 'district', 'ward'].forEach(key => {
          delete tableHeader[key];
        }) : fetchedData.lowerLevelAggrigated.data.length && fetchedData.lowerLevelAggrigated.data[0].beneficiaryWard_Title ? ['province', 'district', 'municipality'].forEach(key => {
          delete tableHeader[key];
        }) : "";

      setTableHeaderList(tableHeader);
      const tableRows = fetchedData.lowerLevelAggrigated.data.map((row, index) => {
        const epidemicObj = {
          sn: englishToNepaliNumber(index + 1),
          province: row.beneficiaryDistrict_Province_TitleNe,
          district: row.beneficiaryDistrict_TitleNe ? row.beneficiaryDistrict_TitleNe : "",
          municipality: row.beneficiaryMunicipality_TitleNe ? row.beneficiaryMunicipality_TitleNe : "",
          ward: row.beneficiaryWard_Title ? row.beneficiaryWard_Title : "",
          totalFirstTrancheFormFilled: englishToNepaliNumber(row.totalFirstTrancheFormFilled),
          totalFirstTrancheFormUploaded: englishToNepaliNumber(row.totalFirstTrancheFormUploaded),
          totalSecondTrancheFormFilled: englishToNepaliNumber(row.totalSecondTrancheFormFilled),
          totalSecondTrancheFormUploaded: englishToNepaliNumber(row.totalSecondTrancheFormUploaded),
        };

        return epidemicObj;
      });
      setFilteredRowData(tableRows);
    }
  }, [fetchedData]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setLoader(true);
    const remainder = count % 100;
    const maxPages = (count - remainder) / 100 + 1;
    if (newPage <= maxPages) {
      setOffset(newPage * 100);
    }
  };


  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const Dataforcsv = () => {
    const csvData =
      filteredRowData &&
      filteredRowData.map((item) => {
        let date;
        let verified;
        let approved;

        if (item.reportedOn) {
          const a = item.reportedOn;
          date = `${a.split("-")[0]}/${a.split("-")[1]}/${a.split("-")[2]}`;
        } else {
          date = "";
        }
        if (item.verified) {
          verified = "Yes";
        } else {
          verified = "";
        }
        if (item.approved) {
          approved = "Yes";
        } else {
          approved = "";
        }

        return [
          item.id,
          item.wards[0].municipality.district.province.title,
          item.wards[0].municipality.district.title,
          item.wards[0].municipality.title,
          item.wards[0].title,
          item.streetAddress,
          date,
          item.hazard,
          item.cause,
          item.estimatedLoss,
          item.agricultureEconomicLoss,
          item.infrastructureEconomicLoss,
          item.infrastructureDestroyedCount,
          item.infrastructureDestroyedHouseCount,
          item.infrastructureAffectedHouseCount,
          item.livestockDestroyedCount,

          item.totalInjuredMale,
          item.totalInjuredFemale,
          item.totalInjuredOther,
          item.totalInjuredDisabled,
          item.peopleMissingMaleCount,
          item.peopleMissingFemaleCount,
          item.peopleMissingOtherCount,
          item.peopleMissingDisabledCount,

          item.totalDeadMale,
          item.totalDeadFemale,
          item.totalDeadOther,
          item.totalDeadDisabled,
          verified,
          item.verificationMessage,
          approved,
        ];
      });
    return csvData;
  };

  const handleDownload = () => {
    // const csvBuilder = new CsvBuilder(`EpidemicData_${Date.now()}.csv`)
    //     .setColumns([
    //         'id',
    //         'Province',
    //         'District',
    //         'Municipality',
    //         'Ward',
    //         'Local Address',
    //         'Reported Date (A.D.)(eg. 2021/07/31)',
    //         'Hazard',
    //         'Hazard Inducer',
    //         'Total Estimated Loss(NPR)',
    //         'Agriculture Economic Loss(NPR)',
    //         'Infrastructure Economic Loss(NPR)',
    //         'Total Infrastructure Destroyed',
    //         'House Destroyed',
    //         'House Affected',
    //         'Total Livestock Destroyed',
    //         'Total Injured Male',
    //         'Total Injured Female',
    //         'Total Injured Others',
    //         'Total Injured Disabled',
    //         'Total Missing Male',
    //         'Total Missing Female',
    //         'Total Missing Other',
    //         'Total Missing Disabled',
    //         'Total Male Death',
    //         'Total Female Death',
    //         'Total Other Death',
    //         'Total Disabled Death',
    //         'Verified (eg. Yes)',
    //         'Verification message',
    //         'Approved (eg. Yes)',
    //     ])
    //     .addRows(Dataforcsv())
    //     .exportFile();

    // window.open(`${process.env.REACT_APP_API_SERVER_URL}/temporary-shelter-download-xlsx/?${filterData.district ? "" : `province=${
    //   props.user.isSuperuser ? filterData.district
    //   ? ""
    //   : filterData.province && filterData.province.value
    //   : filterData.district
    //   ? ""
    //   : filterData.province ? filterData.province && filterData.province.value : props.user.profile.province
    // }&`}

    // ${filterData.municipality ? "" : `district=${props.user.isSuperuser ? filterData.municipality
    //   ? ""
    //   : filterData.district && filterData.district.value
    //   : filterData.municipality
    //   ? ""
    //   : filterData.district ? filterData.district && filterData.district.value : props.user.profile.district}&`}${filterData.ward ? "" : `municipality=${props.user.isSuperuser
    //     ? filterData.ward
    //     ? ""
    //     : filterData.municipality && filterData.municipality.value
    //     : filterData.ward
    //     ? ""
    //     : filterData.municipality ? filterData.municipality && filterData.municipality.value :

    //     props.user.profile.municipality}&`}${filterData.ward ? `ward=${filterData.ward ? filterData.ward && filterData.ward.value : ""}` : ""}`, "_blank");

    window.open(`${process.env.REACT_APP_API_SERVER_URL}/temporary-shelter-download-xlsx/?${filterData.district ? "" : `province=${props.user.isSuperuser ? filterData.district ? "" : filterData.province && filterData.province.value : filterData.district ? "" : filterData.province ? filterData.province && filterData.province.value : props.user.profile.province || ""}&`}${filterData.municipality ? "" : `district=${props.user.isSuperuser ? filterData.municipality ? "" : filterData.district && filterData.district.value : filterData.municipality ? "" : filterData.district ? filterData.district && filterData.district.value : props.user.profile.district || ""}&`}${filterData.ward ? "" : `municipality=${props.user.isSuperuser ? filterData.ward ? "" : filterData.municipality ? filterData.municipality && filterData.municipality.value : "" : filterData.ward ? "" : filterData.municipality ? filterData.municipality && filterData.municipality.value : props.user.profile.municipality || ""}&`}${filterData.ward ? `ward=${filterData.ward ? filterData.ward && filterData.ward.value : ""}` : "ward="}`, "_blank");
  };

  // const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
  //     const selectedIndex = selected.indexOf(name);
  //     let newSelected: readonly string[] = [];

  //     if (selectedIndex === -1) {
  //         newSelected = newSelected.concat(selected, name);
  //     } else if (selectedIndex === 0) {
  //         newSelected = newSelected.concat(selected.slice(1));
  //     } else if (selectedIndex === selected.length - 1) {
  //         newSelected = newSelected.concat(selected.slice(0, -1));
  //     } else if (selectedIndex > 0) {
  //         newSelected = newSelected.concat(
  //             selected.slice(0, selectedIndex),
  //             selected.slice(selectedIndex + 1),
  //         );
  //     }
  //     setSelected(newSelected);
  // };

  const districtNameConverter = (id) => {
    const finalData =
      fetchedData && id ? districts.find((i) => i.id === id).title_ne : "-";

    return finalData;
  };

  const municipalityNameConverter = (id) => {
    // const finalData = fetchedData && municipalities.find(i => i.id === id).title_ne;
    const finalData =
      fetchedData && id ? municipalities.find((i) => i.id === id) : "";
    if (finalData && finalData.type === "Rural Municipality") {
      const municipality = `${finalData.title_ne} गाउँपालिका`;
      return municipality;
    }
    if (finalData && finalData.type === "Submetropolitan City") {
      const municipality = `${finalData.title_ne} उप-महानगरपालिका`;
      return municipality;
    }
    if (finalData && finalData.type === "Metropolitan City") {
      const municipality = `${finalData.title_ne} महानगरपालिका`;
      return municipality;
    }
    return finalData ? `${finalData.title_ne} नगरपालिका` : "-";
  };

  const wardNameConverter = (id) => {
    const finalData =
      fetchedData && id ? wards.find((i) => i.id === id).title : "-";
    return finalData;
  };

  const handleProvincialFormDataNepaliValue = (
    value,
    dataList,
    isWard = false
  ) => {
    const finalValueToStore = dataList
      .filter((i) => i.id === value)
      .map((d) => ({
        value,
        label: isWard
          ? englishToNepaliNumber(d.title_ne || d.title)
          : d.title_ne || d.title,
      }));

    return finalValueToStore[0];
  };
  const handleChangeId = (e) => {
    if (props.user.isSuperuser) {
      setDisableSearch(false);
      if (e.target.value === "" && !filterData.district) {
        setDisableSearch(true);
      }
    } else if (e.target.value === "" && !filterData.ward) {
      setDisableSearch(true);
    } else {
      setDisableSearch(false);
    }


    setFilterData({
      ...filterData,
      [e.target.name]: e.target.value,
      // district: "",
      // municipality: "",
      // ward: "",
    });
  };

  const handleDropdown = (name, value) => {
    setDisableSearch(false);
    // if (props.user.isSuperuser) {
    //   if (!filterData.province || !filterData.district || !filterData.municipality || !filterData.ward || !filterData.id || !filterData.is_first_tranche_provided || !filterData.is_second_tranche_provided) {
    //     setDisableSearch(true);
    //     } else {
    //       setDisableSearch(false);
    //     }
    // }
    // if (value === null && !filterData.id) {
    //   setDisableSearch(true);
    // }
    // if ((!props.user.isSuperuser && (value === null && !filterData.id)) || (!props.user.isSuperuser && (value === null && !filterData.is_first_tranche_provided)) || ((!props.user.isSuperuser && (value === null && !filterData.is_second_tranche_provided)))) {
    // setDisableSearch(true);
    // }
    if (name === "province") {
      setFilterData({
        ...filterData,
        [name]: value === null ? "" : value,
        district: "",
        municipality: "",
        ward: "",
        id: "",
      });
    } else if (name === "district") {
      if (props.user.isSuperuser) {
        setDisableSearch(false);
      }
      if (value === null && !filterData.id) {
        setDisableSearch(true);
      }
      setFilterData({
        ...filterData,
        [name]: value === null ? "" : value,
        municipality: "",
        ward: "",
        id: "",
      });
    } else if (name === "municipality") {
      setFilterData({
        ...filterData,
        [name]: value === null ? "" : value,
        ward: "",
      });
    } else if (name === "is_first_tranche_provided") {
      setFilterData({
        ...filterData,
        [name]: value === null ? "" : value,
      });
    } else if (name === "is_second_tranche_provided") {
      setFilterData({
        ...filterData,
        [name]: value === null ? "" : value,

      });
    } else {
      if (!props.user.isSuperuser) {
        setDisableSearch(false);
      }
      if (value === null && !filterData.id) {
        setDisableSearch(true);
      }
      setFilterData({
        ...filterData,
        [name]: value === null ? "" : value,
      });
    }

    // setErrorPersonal({ ...errorPersonal, [name]: false });
  };

  const handleReset = () => {
    setLoader(true);
    setIsFilteredEnabled(false);
    setFilterData({
      district: "",
      municipality: "",
      ward: "",
      province: "",
      event: ""
    });
    props.requests.getEarthquakeRequest.do({
      fetchedData: handleFetchedData,
      district: "",
      municipality: "",
      ward: "",
      province: "",
      event: "",
      countData: handleCount,
    });
  };

  const yesNoOptionList = [
    {
      label: 'हो', value: 2
    },
    {
      label: 'छैन', value: 3
    }
  ];
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/overall-beneficiary-status/`, { credentials: 'include' })
      .then(res => res.json())
      .then(final_resp => {
        const data = final_resp.results.map(i => ({ label: i.title, value: i.id }));
        setBenificeryList(data);
      });


    fetch(`${process.env.REACT_APP_API_SERVER_URL}/tranche-two-status/`, { credentials: 'include' })
      .then(res => res.json())

      .then(final_resp => {
        const data = final_resp.results.map(i => ({ label: i.title, value: i.id }));
        setTranche2StatusList(data);
      });

    fetch(`${process.env.REACT_APP_API_SERVER_URL}/tranche-one-status/`, { credentials: 'include' })
      .then(res => res.json())

      .then(final_resp => {
        const data = final_resp.results.map(i => ({ label: i.title, value: i.id }));
        setTranche1StatusList(data);
      });


    fetch(`${process.env.REACT_APP_API_SERVER_URL}/funding-source/`, { credentials: 'include' })
      .then(res => res.json())
      .then(final_resp => {
        const data = final_resp.results.map(i => ({ label: i.title, value: i.id }));
        setFundingSourceList(data);
      });

    fetch(`${process.env.REACT_APP_API_SERVER_URL}/payment-received-status/`, { credentials: 'include' })
      .then(res => res.json())
      .then(final_resp => {
        const data = final_resp.results.map(i => ({ label: i.title, value: i.id }));
        setPaymentReceiveList(data);
      });

    fetch(`${process.env.REACT_APP_API_SERVER_URL}/event/?fields=id,title`, { credentials: 'include' })
      .then(res => res.json())
      .then(final_resp => {
        const data = final_resp.results.map(i => ({ label: i.title, value: i.id }));
        setFetchIncident(data);
      });
  }, []);

  return (
    <>
      {loader ? (
        <Loader
          options={{
            position: "fixed",
            top: "48%",
            right: 0,
            bottom: 0,
            left: "48%",
            background: "gray",
            zIndex: 9999,
          }}
        />
      ) : (
        ""
      )}
      <Box
        sx={{
        }}
      >
        <div className={styles.credentialSearch}>

          <div style={{ display: "flex", gap: "5px", marginLeft: '27px', marginTop: '25px', marginBottom: '54px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ width: "230px" }}>
                  <h3>प्रदेश</h3>
                  <Select
                    isClearable
                    isDisabled={!props.user.isSuperuser}
                    value={
                      !filterData.province
                        ? !props.user.isSuperuser ? handleProvincialFormDataNepaliValue(
                          props.user.profile.province,
                          provinces
                        ) : ''
                        : handleProvincialFormDataNepaliValue(
                          filterData.province,
                          provinces
                        )
                    }
                    name="province"
                    placeholder={"प्रदेश छान्नुहोस्"}
                    onChange={(value, actionMeta) =>
                      handleDropdown(actionMeta.name, value)
                    }
                    options={ProvinceListSelect}
                    className="dropdownZindex"
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>
                <div style={{ width: "230px" }}>
                  <h3>जिल्ला</h3>
                  <Select
                    isClearable
                    // isDisabled={(props.user.isSuperuser === false) || (props.user.profile.region !== "province")}
                    isDisabled={props.user.isSuperuser ? false : props.user.profile.region !== 'province'}
                    value={
                      !filterData.district
                        ? !props.user.isSuperuser ? handleProvincialFormDataNepaliValue(
                          props.user.profile.district,
                          districts
                        ) : ''
                        : handleProvincialFormDataNepaliValue(
                          filterData.district,
                          districts
                        )
                    }
                    name="district"
                    placeholder={"जिल्ला छान्नुहोस्"}
                    onChange={(value, actionMeta) =>
                      handleDropdown(actionMeta.name, value)
                    }
                    options={DistrictListSelect}
                    className="dropdownZindex"
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>

                <div style={{ width: "230px" }}>
                  <h3>पालिका</h3>
                  <Select
                    isClearable
                    // isDisabled={!props.user.isSuperuser || props.user.profile.region !== "district"}
                    isDisabled={props.user.isSuperuser ? false : props.user.profile.region === 'province' ? false : props.user.profile.region === 'district' ? false : props.user.profile.region === 'municipality' ? true : true}
                    value={
                      !filterData.municipality
                        ? !props.user.isSuperuser ? handleProvincialFormDataNepaliValue(
                          props.user.profile.municipality,
                          municipalities
                        ) : ''
                        : handleProvincialFormDataNepaliValue(
                          filterData.municipality,
                          municipalities
                        )
                    }
                    name="municipality"
                    placeholder={"पालिका छान्नुहोस्"}
                    onChange={(value, actionMeta) =>
                      handleDropdown(actionMeta.name, value)
                    }
                    options={MunicipalityList}
                    className="dropdownZindex"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                        width: "220px",
                      }),
                    }}
                  />
                </div>

                <div style={{ width: "230px" }}>
                  <h3>वडा</h3>
                  <Select
                    isClearable
                    value={
                      filterData.ward === ""
                        ? ""
                        : handleProvincialFormDataNepaliValue(
                          filterData.ward,
                          districts
                        )
                    }
                    name="ward"
                    placeholder={"वडा छान्नुहोस्"}
                    onChange={(value, actionMeta) =>
                      handleDropdown(actionMeta.name, value)
                    }
                    options={WardList}
                    className="dropdownZindex"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                        width: "220px",
                      }),
                    }}
                  />
                </div>
                <div style={{ width: "300px" }}>
                  <h3>घटना</h3>

                  <Select
                    isClearable
                    onChange={(value, actionMeta) =>
                      handleDropdown(actionMeta.name, value)
                    }
                    value={filterData.event}
                    name="event"
                    placeholder={"घटना"}

                    options={fetchIncident}
                    className="dropdownZindex"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                        width: "300px",
                      }),
                    }}
                  />
                </div>
              </div>


            </div>
            <div className={styles.saveOrAddButtons}>
              <button
                className={styles.submitButtons}
                // disabled={!!(filterData.district && !filterData.district.value)}
                onClick={handleSearch}
                type="submit"
                disabled={disableSearch}
              >
                {"खोज्नुहोस्"}
              </button>
              {isFilterEnabled ? (
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  role="button"
                  title="फिल्टर रिसेट गर्नुहोस्"
                  onClick={handleReset}
                >
                  <ScalableVectorGraphics
                    className={styles.infoIcon}
                    src={Reset}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div style={{ display: 'flex', margin: '0px 27px', gap: '24px', width: '100%', flexWrap: 'wrap' }}>
            <div style={{ padding: '10px', margin: '10px 0px', border: '2px solid #b6b6b6', width: '150px', height: '150px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'rgba(255, 255, 255, 0.6)' }}>
              <h1 style={{ fontSize: '30px' }}>{fetchedData && fetchedData.totalCounts && englishToNepaliNumber(fetchedData.totalCounts.totalFirstTrancheFormFilled)}</h1>
              <h3>पहिलो किस्ता फारम भरियो</h3>
            </div>
            <div style={{ padding: '10px', margin: '10px 0px', border: '2px solid #b6b6b6', width: '150px', height: '150px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'rgba(255, 255, 255, 0.6)' }}>
              <h1 style={{ fontSize: '30px' }}>{fetchedData && fetchedData.totalCounts && englishToNepaliNumber(fetchedData.totalCounts.totalFirstTrancheFormUploaded)}</h1>
              <h3>पहिलो किस्ता फारम अपलोड गरियो</h3>
            </div>
            <div style={{ padding: '10px', margin: '10px 0px', border: '2px solid #b6b6b6', width: '150px', height: '150px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'rgba(255, 255, 255, 0.6)' }}>
              <h1 style={{ fontSize: '30px' }}>{fetchedData && fetchedData.totalCounts && englishToNepaliNumber(fetchedData.totalCounts.totalSecondTrancheFormFilled)}</h1>
              <h3>दोस्रो किस्ता फारम भरियो</h3>
            </div>
            <div style={{ padding: '10px', margin: '10px 0px', border: '2px solid #b6b6b6', width: '150px', height: '150px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'rgba(255, 255, 255, 0.6)' }}>
              <h1 style={{ fontSize: '30px' }}>{fetchedData && fetchedData.totalCounts && englishToNepaliNumber(fetchedData.totalCounts.totalSecondTrancheFormUploaded)}</h1>
              <h3>दोस्रो किस्ता फारम अपलोड गरियो</h3>
            </div>

          </div>
          {
            fetchedData && fetchedData.lowerLevelAggrigated && fetchedData.lowerLevelAggrigated.data.length ? (
              <div className={styles.rightOptions}>
                <h1 style={{ fontSize: '30px', marginLeft: '27px', marginTop: '24px' }}>तल्लो तह अनुसारको डाटा</h1>


              </div>
            ) : ""}
        </div>
        {
          fetchedData && fetchedData.lowerLevelAggrigated && fetchedData.lowerLevelAggrigated.data.length ? (
            <Paper sx={{ width: "96%", mb: 2, margin: '0px 27px' }}>

              <TableContainer
                sx={{ maxHeight: 800 }}
                style={{ width: "100%", overflowX: "scroll" }}
              >
                <Table
                  sx={{ minWidth: 750 }}
                  stickyHeader
                  aria-label="sticky table"
                  padding="normal"
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    // onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={fetchedData && fetchedData.length}
                    fetchedData={filteredRowData}
                    filter={filterData}
                    tableTitleRef={tableHeaderList}
                  />
                  <TableBody>
                    {filteredRowData ? (
                      stableSort(
                        filteredRowData,
                        getComparator(order, orderBy)
                      ).map((row, index) => {
                        // const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            role="checkbox"

                            tabIndex={-1}
                            key={row.id}

                          >

                            {Object.keys(row).map((val) => {
                              const output = tableHeaderList[val] ?
                                (
                                  <TableCell
                                    align={
                                      typeof val === "string" ? "left" : "center"
                                    }
                                    className={styles.setStyleForTableCell}
                                    component="th"
                                    id={labelId}
                                    scope="row"
                                    padding="none"
                                    key={val}
                                  >
                                    {row[val] || "-"}
                                  </TableCell>
                                ) : "";
                              return output;

                              //   return (
                              //     <>
                              //       <TableCell
                              //         align={
                              //           typeof row[val] === "string"
                              //             ? "left"
                              //             : "center"
                              //         }
                              //         className={styles.setStyleForTableCell}
                              //         component="th"
                              //         id={labelId}
                              //         scope="row"
                              //         padding="none"
                              //         key={val}
                              //       >
                              //         {row[val] || "-"}
                              //       </TableCell>
                              //     </>
                              //   );
                            })}
                          </TableRow>
                        );
                      })
                    ) : (
                      <p />
                    )}
                  </TableBody>
                </Table>

              </TableContainer>
            </Paper>
          ) : (
            ""
          )}
      </Box>
    </>
  );
};

export default connect(
  mapStateToProps,
  null
)(
  createConnectedRequestCoordinator<ReduxProps>()(
    createRequestClient(requests)(TemporaryShelterDashboardTable)
  )
);
