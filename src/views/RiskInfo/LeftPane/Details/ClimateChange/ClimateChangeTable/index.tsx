import React from 'react';
import { connect } from 'react-redux';

import DataTableModal from '#components/DataTableModal';

import { districtsMapSelector } from '#selectors';

interface Props {
    className?: string;
    title: string;
    closeModal?: boolean;
}

const headers = [
    {
        key: 'year',
        label: 'year',
    },
    {
        key: 'district',
        label: 'District',
    },
    {
        key: 'rcp45',
        label: 'RCP 4.5',
    },
    {
        key: 'sdRcp45',
        label: 'S.D. RCP 4.5',
    },
    {
        key: 'rcp85',
        label: 'RCP 8.5',
    },
    {
        key: 'sdRcp85',
        label: 'S.D. RCP 8.5',
    },
];

const mapStateToProps = state => ({
    districts: districtsMapSelector(state),
});

const keySelector = d => d.id;

class ClimateChangeTable extends React.PureComponent<Props> {
    private getRenderData = data => (
        data.map((d, i) => ({
            id: i,
            ...d,
            district: (this.props.districts[d.district] || {}).title,
        }))
    )

    public render() {
        const {
            className,
            data,
            title,
            closeModal,
        } = this.props;

        const renderData = this.getRenderData(data);
        return (
            <DataTableModal
                className={className}
                closeModal={closeModal}
                headers={headers}
                data={renderData}
                title={title}
                keySelector={keySelector}
            />
        );
    }
}

export default connect(mapStateToProps)(ClimateChangeTable);
