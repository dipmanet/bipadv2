/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-prototype-builtins */
import React from 'react';
import { stateShcema } from '../HouseForm/utils';
import style from './style.scss';

const HouseholdPopup = ({ houseProperties, setOpen, getEditHouseValue, user }) => {
    const getValue = (hKey, hProperties) => {
        if (hKey === 'latitude') {
            return JSON.parse(hProperties.point).coordinates[1];
        }
        if (hKey === 'longitude') {
            return JSON.parse(hProperties.point).coordinates[0];
        }
        const hValue = hProperties[hKey];
        if (hValue === true) {
            return 'Yes';
        }
        if (hValue === false) {
            return 'No';
        }
        if (hValue === 'null') {
            return '-';
        }
        return hValue;
    };

    const setValue = (hProp) => {
        if (hProp === true) {
            return 'Yes';
        }
        if (hProp === false) {
            return 'No';
        }
        if (hProp === 'null') {
            return '-';
        }
        return hProp;
    };

    const editValueHandler = () => {
        const stateToSend = {
            id: houseProperties.id,
            data: {
            },
        };
        const coordinatesObj = JSON.parse(houseProperties.point);

        const [long, lat] = coordinatesObj.coordinates;

        for (const keyItem in stateShcema) {
            if (keyItem === 'latitude') {
                stateToSend.data[keyItem] = {
                    ...stateShcema[keyItem],
                    value: lat,
                };
            } else if (keyItem === 'longitude') {
                stateToSend.data[keyItem] = {
                    ...stateShcema[keyItem],
                    value: long,
                };
            } else {
                stateToSend.data[keyItem] = {
                    ...stateShcema[keyItem],
                    value: setValue(houseProperties[keyItem]),
                };
            }
        }

        return stateToSend;
    };

    const editHandler = () => {
        const editHouseValue = editValueHandler();
        getEditHouseValue(editHouseValue);
    };


    return (
        <div className={style.housePopUpContainer}>
            <div className={style.popUpTitle}>
                <h1 className={style.houseId}>
                    House ID:
                    {' '}
                    {Object.keys(houseProperties).length > 0
                        && houseProperties.houseId !== 'null'
                        ? houseProperties.houseId : '-'}
                </h1>
                {user && (
                    <button
                        className={style.editBtn}
                        type="button"
                        onClick={editHandler}
                    >
 Edit
                    </button>
                )}
            </div>
            <div className={style.fieldContainer}>
                {
                    Object.keys(stateShcema).map((houseKey) => {
                        if (stateShcema[houseKey].view
                      && stateShcema[houseKey].view === 'private' && user) {
                            return (
                                <div className={style.popUpData} key={houseKey}>
                                    <div>
                                        {stateShcema[houseKey].label}
                                    </div>
                                    <div>
                                        {getValue(houseKey, houseProperties)}
                                    </div>
                                </div>
                            );
                        }
                        if (stateShcema[houseKey].view
                          && stateShcema[houseKey].view === 'private' && !user) {
                            return null;
                        }
                        return (
                            <div className={style.popUpData} key={houseKey}>
                                <div>
                                    {stateShcema[houseKey].label}
                                </div>
                                <div>
                                    {getValue(houseKey, houseProperties)}
                                </div>
                            </div>
                        );
                    })
                }
                {/* <p className={style.loginMessage}>Login into BIPAD for more information</p> */}
            </div>
        </div>
    );
};
export default HouseholdPopup;
