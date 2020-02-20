import React from 'react';
import { connect } from 'react-redux';

import { districtsMapSelector } from '#selectors';
import DataTableModal from '#components/DataTableModal';

interface Props {
    title: string;
    className?: string;
    closeModal?: boolean;
}

const headers = [
    {
        key: 'districtName',
        label: 'District',
    },
    {
        key: 'hdiScore',
        label: 'HDI',
    },
    {
        key: 'maxScore',
        label: 'Maximum fatalitites',
    },
    {
        key: 'medScore',
        label: 'Median fatalities',
    },
    {
        key: 'remoteScore',
        label: 'Remoteness',
    },
    {
        key: 'specificityScore',
        label: 'Specificity',
    },
    {
        key: 'pctScore',
        label: 'Frequency',
    },
    {
        key: 'rank',
        label: 'Rank',
    },
];

const mapStateToProps = state => ({
    districts: districtsMapSelector(state),
});

const keySelector = d => d.id;

class RiskTable extends React.PureComponent<Props> {
    private getRenderData = data => (
        data.map(d => ({
            id: d.id,
            districtName: (this.props.districts[d.district] || {}).title,
            ...d.data,
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

export default connect(mapStateToProps)(RiskTable);
