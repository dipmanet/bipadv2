import React, { useState, useEffect } from 'react';

import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';

import { connect } from 'react-redux';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';


import { ibfPageSelector } from '#selectors';
import { setIbfPageAction } from '#actionCreators';
import style from './styles.scss';

import * as initialOptions from './chartOptions';


const mapStateToProps = (state: AppState): PropsFromAppState => ({
    ibfPage: ibfPageSelector(state),
});


const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

interface OwnProps {
    handleModalClose: () => void;
}

HighchartsMore(Highcharts);


const BoxModal = (props) => {
    const { ibfPage: { selectedStation, stations }, handleModalClose } = props;
    const [data, setData] = useState([]);
    const [category, setCategory] = useState([]);
    const [thresholdFive, setThresholdFive] = useState(null);
    const [thresholdTwenty, setThresholdTwenty] = useState(null);
    const [chartOptions, setChartOptions] = useState(initialOptions);


    useEffect(() => {
        const temp = [];
        const produceDate = JSON.parse(selectedStation.properties.calculation)[0].recorded_date;
        const mydate = new Date(produceDate);
        const myDate = (Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            x => (mydate.setDate(mydate.getDate() + 1))));
        const temps = myDate.map(item => new Date(item).toLocaleDateString());
        setCategory(temps);

        JSON.parse(selectedStation.properties.calculation).map((item, index) => {
            if (index !== 0) {
                temp.push([
                    Number((item.min_dis).toFixed(2)),
                    Number((item.first_quartile).toFixed(2)),
                    Number((item.median).toFixed(2)),
                    Number((item.third_quartile).toFixed(2)),
                    Number((item.max_dis).toFixed(2)),
                ]);
                setThresholdFive(Number(Number(item.threshold_five).toFixed(2)));
                setThresholdTwenty(Number(Number(item.threshold_twenty).toFixed(2)));
            }
            return null;
        });
        setData(temp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const temp = { ...chartOptions };
        if (data && thresholdFive && thresholdTwenty) {
            temp.default.yAxis.plotLines[0].value = thresholdFive;
            temp.default.yAxis.plotLines[1].value = thresholdTwenty;
            temp.default.series[0].data = data;
            temp.default.xAxis.categories = category;
            setChartOptions(temp.default);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, thresholdFive, thresholdTwenty]);

    return (
        <Modal className={style.modal}>
            <ModalHeader
                title={`${selectedStation.properties.station_name} Station`}
                rightComponent={(
                    <DangerButton
                        transparent
                        iconName="close"
                        onClick={handleModalClose}
                    />
                )}
            />
            <ModalBody>
                {data
                    && (
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={chartOptions}
                            {...props}
                        />
                    )
                }
            </ModalBody>

        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(BoxModal);
