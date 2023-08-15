/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { _cs } from '@togglecorp/fujs';
import {
    setIbfPageAction,
} from '#actionCreators';

import {
    ibfPageSelector,
} from '#selectors';

import { AppState } from '#types';
import infoIcon from '#resources/icons/info-icon.svg';
import style from './styles.scss';
import CalendarButton from '../Components/CalendarButton';
import { containerStyleData } from './expression';

interface ContainerStyleType {
    bg: {
        background: string;
    };
    text: string;
    animate: boolean;
}

const containerStyleInitialValue = {
    bg: {
        background: '',
    },
    text: '',
    animate: false,
};


const mapStateToProps = (state: AppState) => ({
    ibfPage: ibfPageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const Calendar = (props: any) => {
    const {
        ibfPage: {
            stations,
            selectedStation,
            calendarData,
        },
    } = props;

    const [selected, setSelected] = useState(-1);
    const [containerStyle, setContainerStyle] = useState<ContainerStyleType>(containerStyleInitialValue);

    const recordedDateData = {
        date: '',
        status: 0,
    };

    if (Object.keys(stations).length > 0) {
        recordedDateData.date = stations.features[0].properties.calculation[0].recorded_date;
    }

    const getContainerStyle = (calIndex: number) => {
        switch (true) {
            case calIndex > -1 && calIndex < 3:
                return containerStyleData.three;
            case calIndex > 2 && calIndex < 7:
                return containerStyleData.seven;
            default:
                return containerStyleData.default;
        }
    };

    const clickHandler = (index: number) => {
        const container = getContainerStyle(index);

        setContainerStyle(container);
        setSelected(index);
        if (Object.keys(selectedStation).length > 0) {
            const sel = stations.features
                .filter(item => item.properties.station_id === selectedStation.properties.station_id);

            const returnPer = sel[0].properties.calculation.filter(item => item.leadtime === index + 1);

            if (!returnPer[0].exceed_five && !returnPer[0].exceed_twenty && !returnPer[0].exceed_two) {
                props.setIbfPage({ returnPeriod: 0 });
            } else if (returnPer[0].exceed_twenty) {
                props.setIbfPage({ returnPeriod: 20 });
            } else if (returnPer[0].exceed_five) {
                props.setIbfPage({ returnPeriod: 5 });
            } else if (returnPer[0].exceed_two) {
                props.setIbfPage({ returnPeriod: 2 });
            }
        }
    };

    // Default value for first button to show recorded date
    const def = {
        recordedDateData,
        defaultIndex: 0,
        defaultCalendarList: [],
        defaultSelected: -1,
        defaultClickHandler: () => clickHandler(-1),
    };

    const leadTimeToSetOrIndex: number[] = [];

    // Effect here so that button is automatically selected on initial render and on back from selectedStation if selected field has value
    useEffect(() => {
        calendarData.map((item: any, index: any) => {
            if (item.status > 0) {
                leadTimeToSetOrIndex.push(index + 1);
            }
        });

        if (leadTimeToSetOrIndex.length > 0 && leadTimeToSetOrIndex[0] !== 0) {
            props.setIbfPage({ leadTime: leadTimeToSetOrIndex[0] });
        }
        if (leadTimeToSetOrIndex[0]) {
            clickHandler(leadTimeToSetOrIndex[0] - 1);
        } else {
            // If the status of all calendarData is 0 then it always enters else here
            clickHandler(-1);
        }
    }, [calendarData]);

    // Calendar dates are produced from recorded date that is obtained from stations properties recorded_date and thus obtained the dates for 10 days

    return (
        <>
            <div style={containerStyle.bg} className={style.calendarContainer}>
                <p className={style.disclaimer}>
                    <img src={infoIcon} />
The current feature for the forecast is not available.
                </p>
                {Object.keys(containerStyle).length > 0
                    && containerStyle.text
                    && (
                        <div className={_cs(style.title, containerStyle.animate && style.titleAnimate)}>
                            {containerStyle.text}
                        </div>
                    )}
                <div className={style.buttonContainer}>
                    {/* Default recorded date button */}
                    <CalendarButton
                        calendarData={def.recordedDateData}
                        index={def.defaultIndex}
                        calendarDataList={def.defaultCalendarList}
                        selected={def.defaultSelected}
                        clickHandler={def.defaultClickHandler}
                    />
                    {calendarData && calendarData.map((calendarItem: any, calendarDataIndex: any, calendarArray: any) => (
                        <CalendarButton
                            key={calendarItem.date}
                            calendarData={calendarItem}
                            index={calendarDataIndex}
                            calendarDataList={calendarArray}
                            selected={selected}
                            clickHandler={() => clickHandler(calendarDataIndex)}
                        />
                    ))
                    }
                </div>
                <div className={style.line} />
            </div>

        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
