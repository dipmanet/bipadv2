import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Cross from '#resources/icons/IbfCross.svg';
import style from './styles.scss';

const Source = ({ sourceClassName, setToggleSource, toggleSource, handleWidth }) => (
    <>
        <div className={_cs(
            style.container,
            sourceClassName,
            toggleSource ? style.hidden : style.visible,
        )
        }
        >
            <div style={{ opacity: toggleSource ? 0 : 1 }} className={style.header}>
                <h2>Source</h2>
                <div className={style.tab}>
                    <div className={_cs(style.button, style.active)}>GLOFAS GLOBAL</div>
                    <div className={_cs(style.button, style.inactive)}>DHM</div>
                </div>
            </div>
            <div style={{ opacity: toggleSource ? 0 : 1 }} className={style.content}>
                <div className={style.row}>
                    <div className={style.col}>
                        Link
                    </div>
                    <div>
                        <a href="https://globalfloods.eu" target="_blank" rel="noopener noreferrer">https://globalfloods.eu</a>
                    </div>
                </div>
                <div className={style.row}>
                    <div className={style.col}>
                        Event Status
                    </div>
                    <div style={{ marginLeft: '-10px' }}>
                        Realtime
                    </div>
                </div>
                <div className={style.row}>
                    <div className={style.col}>
                        Effective Date
                    </div>
                    <div style={{ marginLeft: '-10px' }}>
                        2022-03-13
                    </div>
                </div>
                <div className={style.row}>
                    <div className={style.col}>
                        Lead Time
                    </div>
                    <div style={{ marginLeft: '10px' }}>
                        10 Days from Effective Date
                    </div>
                </div>
            </div>
            <button
                type="button"
                style={{ opacity: toggleSource ? 0 : 1 }}
                className={style.closeBtn}
                onClick={
                    () => {
                        setToggleSource(true);
                        handleWidth(true);
                    }
                }
            >
                <img src={Cross} alt="cross" />
            </button>
        </div>
    </>
);

export default Source;
