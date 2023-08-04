import React from 'react';
import Ibfwater from '#resources/icons/Ibfwater.svg';
import FloodIcon from '#resources/icons/Flood-Icon.svg';
import { compareMonth, getDate, getDay, getMonth, getYear } from '#views/IBF/Calender/expression';
import style from './style.scss';

interface CalendarDataType {
    date: string;
    status: number;
}

interface CalendarButtonPropType {
    calendarData: CalendarDataType;
    index: number;
    calendarDataList: CalendarDataType[];
    selected: number;
    clickHandler: () => void;
}

const selectedStyle = {
    background: `url(${Ibfwater})`,
    backgroundSize: 'cover',
};

const noneStyle = {
    background: 'none',
    backgroundSize: 'cover',
};

const floodWarningStyle = {
    width: '20px',
    height: '20px',
    marginRight: '5px',
    background: `url(${FloodIcon})`,
    backgroundSize: 'contain',
};

const noWarningStyle = {
    background: 'none',
    borderRadius: '50%',
    display: 'inline-block',
};

const CalendarButton = (
    { calendarData, index, calendarDataList, selected, clickHandler }: CalendarButtonPropType,
) => (
    <button
        className={style.button}
        type="button"
        onClick={() => clickHandler()}
        disabled={!((calendarData.status > 0))}
    >
        <div className={style.dateContainer}>
            {/* For displaying month and year(Aug 2022) only once in calendar */}
            {compareMonth(index, calendarDataList)
                ? (
                    <div className={style.monthYear}>
                        <div>{getMonth(calendarData.date)}</div>
                        <div>{getYear(calendarData.date)}</div>
                    </div>
                )
                : ' '
            }
            <div
                style={selected === index ? selectedStyle : noneStyle}
                className={style.dayWeak}
            >
                {selected === index
                    ? '' : (
                        <div style={(calendarData.status > 0)
                            ? floodWarningStyle : noWarningStyle}
                        />
                    )
                }
                <div>
                    <div>{getDate(calendarData.date)}</div>
                    <div className={style.day}>{getDay(calendarData.date)}</div>
                </div>
            </div>
        </div>
        {index === 1 && <p className={style.mode}>Activate Mode</p>}
        {index === 6 && <p className={style.mode}>Readiness Mode</p>}
        {index === 3 && <div className={style.lineInButton} />}
    </button>
);

export default CalendarButton;
