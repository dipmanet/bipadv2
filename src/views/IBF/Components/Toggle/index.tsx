import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setIbfPageAction } from '#actionCreators';
import { ibfPageSelector } from '#selectors';
import style from './styles.scss';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    ibfPage: ibfPageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const Toggle = (props) => {
    const { ibfPage: { demo } } = props;
    const [mode, setMode] = useState(true);

    const handleClick = () => {
        if (demo === 0) {
            setMode(true);
            props.setIbfPage({ demo: 1 });
        } else {
            setMode(false);
            props.setIbfPage({ demo: 0 });
        }
    };


    return (
        <button className={style.toggle} type="button" onClick={handleClick}>{mode ? 'ON' : 'OFF'}</button>

    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Toggle);
