/* eslint-disable consistent-return */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from "react";
import {
  ClientAttributes,
  createRequestClient,
  methods,
} from "@togglecorp/react-rest-request";
import { connect } from "react-redux";
import { _cs } from "@togglecorp/fujs";
import Cross from "#resources/icons/IbfCross.svg";
import mapAddIcon from "#resources/icons/ibf-mapIcon.svg";
import { createConnectedRequestCoordinator } from "#request";
import { setIbfPageAction } from "#actionCreators";
import { ibfPageSelector } from "#selectors";
import TextInput from "../TextInput";
import SelectInput from "../SelectInput";
import style from "./styles.module.scss";
import {
  getOptions,
  stateShcema,
  useFormValidation,
  validationShcema,
} from "./utils";
import MapCoordinatesInput from "../MapCoordinatesInput";
import { calculation } from "../RiskAndImpact/expression";

interface Props {}
interface Params {}

const mapStateToProps = (state) => ({
  ibfPage: ibfPageSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  setIbfPage: (params) => dispatch(setIbfPageAction(params)),
});

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
  housePostRequest: {
    url: "/ibf-households/",
    method: methods.POST,
    body: ({ params }) => ({ ...params.houseData }),
    onSuccess: ({ response, params }) => {
      params.handlePostSuccess(response, params.houseData, params.reset);
      params.setPending(false);
    },
  },

  housePatchRequest: {
    url: ({ params }) => `/ibf-households/${params.houseId}/`,
    method: methods.PUT,
    body: ({ params }) => ({
      ...params.houseData,
    }),
    onSuccess: ({ response, params }) => {
      params.handlePatchSuccess(response, params.reset);
      params.setPending(false);
    },
  },
};

const HouseForm = ({
  mapSelectHandler,
  coordinates,
  setCoordinates,
  requests,
  setFormOpen,
  editValue,
  ibfPage,
  setIbfPage,
  setEditState,
}) => {
  const [pending, setPending] = useState(false);
  const { state, disable, handleChange, handleSubmit, handleReset } =
    useFormValidation(editValue, stateShcema, validationShcema, handleSend);

  const { housePostRequest, housePatchRequest } = requests;
  const { householdJson, indicators } = ibfPage;

  function getTextInput(inputDataObject, stateItem, stateForArray) {
    if (stateItem === "incomeSource") {
      return null;
    }
    if (stateItem === "otherJob") {
      if (stateForArray.isOtherJob.value === "Yes") {
        return (
          <TextInput
            type={inputDataObject.type}
            placeholder={inputDataObject.placeholder}
            label={inputDataObject.label}
            htmlForId={inputDataObject.label}
            value={inputDataObject.value}
            name={stateItem}
            onChangeHandler={handleChange}
            errorMessage={inputDataObject.error}
          />
        );
      }
      return "";
    }
    return (
      <TextInput
        type={inputDataObject.type}
        placeholder={inputDataObject.placeholder}
        label={inputDataObject.label}
        htmlForId={inputDataObject.label}
        value={inputDataObject.value}
        name={stateItem}
        onChangeHandler={handleChange}
        errorMessage={inputDataObject.error}
      />
    );
  }

  function getInput(stateItem, stateForArray) {
    const inputDataObject = stateForArray[stateItem];
    switch (inputDataObject.inputType) {
      case "input":
        return getTextInput(inputDataObject, stateItem, stateForArray);
      case "select":
        return (
          <SelectInput
            label={inputDataObject.label}
            name={stateItem}
            value={inputDataObject.value}
            options={getOptions(stateItem)}
            placeholder={inputDataObject.placeholder}
            onChangeHandler={handleChange}
          />
        );
      default:
        return null;
    }
  }

  function doCalculation(hoose) {
    const calculatedData = calculation(hoose, indicators);
    const { averageDatas, houseHoldDatas, weight_Data } = calculatedData[0];

    // const modifiedHouseData = houseDataKeyModifier(houseHoldDatas);
    setIbfPage({
      weights: weight_Data,
    });
    setIbfPage({
      householdDistrictAverage: averageDatas,
    });
    setIbfPage({
      householdJson: houseHoldDatas,
    });
  }

  function handlePostSuccess(res, householdData, reset) {
    const dataToMerge = {
      ...householdData,
      ...res,
    };
    const houseCalcData = [...householdJson];
    houseCalcData.push(dataToMerge);
    doCalculation(houseCalcData);
    reset();
  }

  function handlePatchSuccess(res, reset) {
    const patchedHouse = [];
    for (const hhold of householdJson) {
      if (hhold.id !== res.id) {
        patchedHouse.push(hhold);
      } else {
        patchedHouse.push(res);
      }
    }
    doCalculation(patchedHouse);
    reset();
  }

  function getValue(houseKey, optState) {
    if (optState[houseKey].value === "Yes") {
      return true;
    }
    if (optState[houseKey].value === "No") {
      return false;
    }
    if (optState[houseKey].value === "-") {
      return null;
    }

    return optState[houseKey].value;
  }

  function handleSend() {
    const houseDataToSend = {
      point: {
        type: "Point",
        coordinates: [],
      },
    };

    for (const houseDataKey in state) {
      if (houseDataKey === "latitude") {
        houseDataToSend.point.coordinates[1] = state[houseDataKey].value;
      } else if (houseDataKey === "longitude") {
        houseDataToSend.point.coordinates[0] = state[houseDataKey].value;
      } else if (state[houseDataKey].inputType === "select") {
        const valueToSend = getValue(houseDataKey, state);

        houseDataToSend[houseDataKey] = valueToSend;
      } else if (state[houseDataKey].value === "-") {
        houseDataToSend[houseDataKey] = null;
      } else {
        houseDataToSend[houseDataKey] = state[houseDataKey].value;
      }
    }

    setPending(true);
    if (Object.keys(editValue).length > 0 && editValue.id) {
      housePatchRequest.do({
        handlePatchSuccess,
        houseData: houseDataToSend,
        houseId: editValue.id,
        setPending,
        reset: resetHandler,
      });
    } else {
      housePostRequest.do({
        handlePostSuccess,
        houseData: houseDataToSend,
        setPending,
        reset: resetHandler,
      });
    }

    // mapSelectHandler(false);
    // setFormOpen(false);
    // handleReset();
  }

  function resetHandler() {
    handleReset();
    mapSelectHandler(false);
    setFormOpen(false);
    setEditState({});
    setCoordinates({});
  }

  return (
    <div className={style.houseFormContainer}>
      <h1>Household Level Data</h1>
      <div className={style.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={style.subContainer}>
            <MapCoordinatesInput
              type="number"
              placeholder="Select a latitude from map"
              label="Latitude"
              htmlForId="latitude"
              value={state.latitude.value}
              name="latitude"
              coordinate={coordinates.lat}
              onChangeHandler={handleChange}
            />
            <MapCoordinatesInput
              type="number"
              placeholder="Select a longitude from map"
              label="Longitude"
              htmlForId="longitude"
              value={state.longitude.value}
              name="longitude"
              coordinate={coordinates.lng}
              onChangeHandler={handleChange}
            />
            <div className={style.mapSelect}>
              <img src={mapAddIcon} alt="Map Add Icon" />
              <button
                className={style.mapButton}
                type="button"
                onClick={() => mapSelectHandler(true)}
              >
                Select in Map
              </button>
            </div>
          </div>
          <div className={style.subContainer}>
            {Object.keys(state).map((stateItem) => getInput(stateItem, state))}
          </div>
          <button
            className={_cs(
              style.formSubmit,
              disable ? style.disabled : style.allowed
            )}
            disabled={disable}
            type="submit"
            onClick={() => mapSelectHandler(false)}
          >
            {pending ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
      <button
        type="button"
        className={style.closeHouseForm}
        onClick={resetHandler}
      >
        <img src={Cross} alt="cross" />
      </button>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  createConnectedRequestCoordinator<ReduxProps>()(
    createRequestClient(requestOptions)(HouseForm)
  )
);
