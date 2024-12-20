/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import style from './styles.scss';
import { setIbfPageAction } from '#actionCreators';
import { ibfPageSelector } from '#selectors';


const mapStateToProps = (state: AppState): PropsFromAppState => ({
    ibfPage: ibfPageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});


const ToggleButton = (props) => {
    const { ibfPage: { showHouseHold } } = props;

    const handleClick = (value) => {
        props.setIbfPage({ showHouseHold: value });
    };

    return (
        <>
            <div className={style.toggleswitchcontainer}>
                <div className={_cs(style.toggleswitch, style.switchvertical)}>
                    <input id="toggle-a" type="radio" name="switch" value="false" checked={showHouseHold === 'false'} onClick={() => handleClick('false')} disabled />
                    <label htmlFor="toggle-a">WARD LEVEL RISK</label>
                    <input id="toggle-b" type="radio" name="switch" value="true" defaultChecked onClick={() => handleClick('true')} />
                    <label htmlFor="toggle-b">HOUSEHOLD LEVEL RISK</label>
                    <span className={style.toggleoutside}>
                        <span className={style.toggleinside} />
                    </span>
                </div>
            </div>


        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ToggleButton);
