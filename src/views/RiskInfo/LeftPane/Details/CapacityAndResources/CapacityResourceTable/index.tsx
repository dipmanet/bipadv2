import React from 'react';
import { connect } from 'react-redux';

import DataTableModal from '#components/DataTableModal';

import { wardsMapSelector } from '#selectors';

interface Props {
    className?: string;
    title: string;
    closeModal?: boolean;
}

const headers = [
    {
        key: 'title',
        label: 'title',
    },
    {
        key: 'resourceType',
        label: 'Resource Type',
    },
    {
        key: 'coordinates',
        label: 'Coordinates',
    },
    {
        key: 'wardName',
        label: 'Ward',
    },
];

const mapStateToProps = state => ({
    wards: wardsMapSelector(state),
});

const keySelector = d => d.id;

class CapacityResourceTable extends React.PureComponent<Props> {
    private getRenderData = data => (
        data.map(d => ({
            id: d.id,
            wardName: (this.props.wards[d.ward] || {}).title,
            title: d.title,
            resourceType: d.resourceType,
            coordinates: `${d.point.coordinates.toString()}`,
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

export default connect(mapStateToProps)(CapacityResourceTable);
