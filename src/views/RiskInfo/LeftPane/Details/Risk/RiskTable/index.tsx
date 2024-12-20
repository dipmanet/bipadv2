import React from 'react';
import { connect } from 'react-redux';

import { districtsMapSelector, languageSelector } from '#selectors';
import DataTableModal from '#components/DataTableModal';

interface Props {
    title: string;
    className?: string;
    closeModal?: boolean;
}

const headers = language => ([
    {
        key: 'districtName',
        label: language === 'en' ? 'District' : 'जिल्‍ला',
    },
    {
        key: 'hdiScore',
        label: language === 'en' ? 'HDI' : 'HDI',
    },
    {
        key: 'maxScore',
        label: language === 'en' ? 'Maximum fatalitites' : 'अधिकतम घातकता',
    },
    {
        key: 'medScore',
        label: language === 'en' ? 'Median fatalities' : 'औसत मृत्युहरू',
    },
    {
        key: 'remoteScore',
        label: language === 'en' ? 'Remoteness' : 'दुर्गमता',
    },
    {
        key: 'specificityScore',
        label: language === 'en' ? 'Specificity' : 'विशिष्टता',
    },
    {
        key: 'pctScore',
        label: language === 'en' ? 'Frequency' : 'आवृत्ति',
    },
    {
        key: 'rank',
        label: language === 'en' ? 'Rank' : 'श्रेणी',
    },
]);

const mapStateToProps = state => ({
    districts: districtsMapSelector(state),
    language: languageSelector(state),
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
            language: { language },
        } = this.props;

        const renderData = this.getRenderData(data);

        return (
            <DataTableModal
                className={className}
                closeModal={closeModal}
                headers={headers(language)}
                data={renderData}
                title={title}
                keySelector={keySelector}
            />
        );
    }
}

export default connect(mapStateToProps)(RiskTable);
