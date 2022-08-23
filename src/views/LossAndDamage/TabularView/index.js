import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
    compareNumber,
    compareString,
    compareBoolean,
} from '@togglecorp/fujs';

import { connect } from 'react-redux';
import { Translation } from 'react-i18next';
import Numeral from '#rscv/Numeral';
import NormalTaebul from '#rscv/Taebul';
import Sortable from '#rscv/Taebul/Sortable';
import ColumnWidth from '#rscv/Taebul/ColumnWidth';

import DownloadButton from '#components/DownloadButton';
import TableDateCell from '#components/TableDateCell';

import {
    convertTableToCsv,
    prepareColumns,
    defaultState,
    readNestedValue,
} from '#utils/table';

import styles from './styles.scss';
import { languageSelector } from '#selectors';
import { convertDateAccToLanguage } from '#utils/common';

const mapStateToProps = state => ({
    language: languageSelector(state),
});
const Taebul = Sortable(ColumnWidth(NormalTaebul));

const NumeralCell = ({ value }, language) => (
    <Numeral
        className={styles.numeral}
        value={value}
        precision={0}
        language={language}
    />
);

const createComparator = (comparator, key) => (a, b, d) => comparator(
    readNestedValue(a, key),
    readNestedValue(b, key),
    d,
);


const propTypes = {
    lossAndDamageList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
};

const defaultProps = {
    lossAndDamageList: [],
    className: undefined,
};

const getDateFromMilliseconds = (milliseconds) => {
    const date = new Date(milliseconds);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];
};

class TabularView extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    static tableKeySelector = data => data.id;

    constructor(props) {
        super(props);
        const { language: { language } } = this.props;

        this.columns = prepareColumns([
            {
                key: 'verified',
                value: { title: language === 'en' ? 'Verified' : 'प्रमाणित' },

                comparator: createComparator(compareBoolean, 'verified'),
                transformer: value => (value ? 'Yes' : 'No'),
            },
            {
                key: 'title',
                value: { title: language === 'en' ? 'Title' : 'शीर्षक' },
                comparator: createComparator(compareString, 'title'),
            },
            {
                key: 'description',
                value: { title: language === 'en' ? 'Description' : 'विवरण' },
                comparator: createComparator(compareString, 'description'),
            },
            {
                key: 'source',
                value: { title: language === 'en' ? 'Source' : 'स्रोत' },
                comparator: createComparator(compareString, 'source'),
            },
            {
                key: 'hazardInfo.title',
                value: { title: language === 'en' ? 'Hazard' : 'प्रकोप' },
                comparator: createComparator(compareString, 'hazardInfo.title'),
            },
            {
                key: 'incidentOn',
                value: { title: language === 'en' ? 'Incident on' : 'घटना भएको' },
                // cellRenderer: TableDateCell,
                // comparator: createComparator(compareDate, 'incidentOn'),
                comparator: createComparator(compareNumber, 'incidentOn'),
                transformer: value => (value ? convertDateAccToLanguage(getDateFromMilliseconds(value.incidentOn), language) : ''),
            },
            // {
            //     key: 'createdOn',
            //     value: { title: 'Created on' },
            //     cellRenderer: TableDateCell,
            //     comparator: createComparator(compareDate, 'createdOn'),
            // },
            {
                key: 'provinceTitle',
                value: { title: language === 'en' ? 'Province' : 'प्रदेश' },
                comparator: createComparator(compareString, 'provinceTitle'),
            },
            {
                key: 'districtTitle',
                value: { title: language === 'en' ? 'District' : 'जिल्‍ला' },
                comparator: createComparator(compareString, 'districtTitle'),
            },
            {
                key: 'municipalityTitle',
                value: { title: language === 'en' ? 'Municipality' : 'नगरपालिका' },
                comparator: createComparator(compareString, 'municipalityTitle'),
            },
            {
                key: 'wardTitle',
                value: { title: language === 'en' ? 'Ward' : 'वार्ड' },
                comparator: createComparator(compareString, 'wardTitle'),
            },

            {
                key: 'loss.estimatedLoss',
                value: { title: language === 'en' ? 'Total estimated loss (NPR)' : 'कुल अनुमानित आर्थिक क्षेति (रु )' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.estimatedLoss'),
            },
            {
                key: 'loss.agricultureEconomicLoss',
                value: { title: language === 'en' ? 'Agriculture economic loss (NPR)' : 'कृषि क्षेत्र को कुल आर्थिक क्षेति' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.agricultureEconomicLoss'),
            },
            {
                key: 'loss.infrastructureEconomicLoss',
                value: { title: language === 'en' ? 'Infrastructure economic loss (NPR)' : 'भौतिक पूर्वाधारमा आर्थिक क्षति (रु)' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.infrastructureEconomicLoss'),
            },
            {
                key: 'loss.infrastructureDestroyedCount',
                value: { title: language === 'en' ? 'Total infrastructure destroyed' : 'कुल पूर्वाधार क्षेति' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.infrastructureDestroyedCount'),
            },
            {
                key: 'loss.infrastructureDestroyedHouseCount',
                value: { title: language === 'en' ? 'House destroyed' : 'घर भत्‍किएको' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.infrastructureDestroyedHouseCount'),
            },
            {
                key: 'loss.infrastructureAffectedHouseCount',
                value: { title: language === 'en' ? 'House affected' : 'घर प्रभावित' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.infrastructureAffectedHouseCount'),
            },

            {
                key: 'loss.livestockDestroyedCount',
                value: { title: language === 'en' ? 'Total livestock destroyed' : 'कुल पशु चौपाया क्षेति' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.livestockDestroyedCount'),
            },

            {
                key: 'loss.peopleDeathCount',
                value: { title: language === 'en' ? 'Total - People Death' : 'कुल मृत्यु संख्या' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleDeathCount'),
            },
            {
                key: 'loss.peopleDeathMaleCount',
                value: { title: language === 'en' ? 'Male - People Death' : 'पुरुष - मनिस मृत्यु' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleDeathMaleCount'),
            },
            {
                key: 'loss.peopleDeathFemaleCount',
                value: { title: language === 'en' ? 'Female - People Death' : 'महिला - मनिस मृत्यु' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleDeathFemaleCount'),
            },
            {
                key: 'loss.peopleDeathUnknownCount',
                value: { title: language === 'en' ? 'Unknown - People Death' : 'अज्ञात - मनिस मृत्यु' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleDeathUnknownCount'),
            },
            {
                key: 'loss.peopleDeathDisabledCount',
                value: { title: language === 'en' ? 'Disabled - People Death' : 'अपाङ्गता - मनिस मृत्यु' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleDeathDisabledCount'),
            },
            {
                key: 'loss.peopleMissingCount',
                value: { title: language === 'en' ? 'Total - People Missing' : 'कुल - हराएको मनिस' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleMissingCount'),
            },
            {
                key: 'loss.peopleMissingMaleCount',
                value: { title: language === 'en' ? 'Male - People Missing' : 'पुरुष - हराएको मनिस' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleMissingMaleCount'),
            },
            {
                key: 'loss.peopleMissingFemaleCount',
                value: { title: language === 'en' ? 'Female - People Missing' : 'महिला - हराएको मनिस' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleMissingFemaleCount'),
            },
            {
                key: 'loss.peopleMissingUnknownCount',
                value: { title: language === 'en' ? 'Unknown - People Missing' : 'अज्ञात - मनिस हराइरहेको' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleMissingUnknownCount'),
            },
            {
                key: 'loss.peopleMissingDisabledCount',
                value: { title: language === 'en' ? 'Disabled - People Missing' : 'अपाङ्गता - मनिस हराइरहेको' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleMissingDisabledCount'),
            },
            {
                key: 'loss.peopleInjuredCount',
                value: { title: language === 'en' ? 'Total - People Injured' : 'कुल - व्यक्ति घाइते' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleInjuredCount'),
            },
            {
                key: 'loss.peopleInjuredMaleCount',
                value: { title: language === 'en' ? 'Male - People Injured' : 'पुरुष - मानिसहरू घाइते' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleInjuredMaleCount'),
            },
            {
                key: 'loss.peopleInjuredFemaleCount',
                value: { title: language === 'en' ? 'Female - People Injured' : 'महिला - व्यक्ति घाइते' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleInjuredFemaleCount'),
            },
            {
                key: 'loss.peopleInjuredUnknownCount',
                value: { title: language === 'en' ? 'Unknown - People Injured' : 'अज्ञात - मानिसहरू घाइते' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleInjuredUnknownCount'),
            },
            {
                key: 'loss.peopleInjuredDisabledCount',
                value: { title: language === 'en' ? 'Disabled - People Injured' : 'अपाङ्गता - घाइते व्यक्तिहरू' },
                cellRenderer: value => NumeralCell(value, language),
                comparator: createComparator(compareNumber, 'loss.peopleInjuredDisabledCount'),
            },
        ], styles);

        this.state = {
            settings: defaultState,
        };
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    handleSettingsChange = (val) => {
        this.setState({ settings: val });
    }

    convertValues = memoize(convertTableToCsv)

    render() {
        const {
            className,
            lossAndDamageList,
            language: { language },
        } = this.props;

        const lossAndDamageListForExport = this.convertValues(lossAndDamageList, this.columns);

        return (
            <div className={_cs(className,
                styles.tabularView, language === 'np' && styles.languageFont)}
            >
                <div className={styles.tableContainer}>
                    <Taebul
                        className={styles.lossAndDamagesTable}
                        data={lossAndDamageList}
                        headClassName={styles.head}
                        keySelector={TabularView.tableKeySelector}
                        columns={this.columns}
                        settings={this.state.settings}
                        onChange={this.handleSettingsChange}
                        rowHeight={30}
                    />
                </div>
                <div className={styles.downloadLinkContainer}>
                    <Translation>
                        {
                            t => (
                                <DownloadButton
                                    onClick={this.handleClick}
                                    value={lossAndDamageListForExport}
                                    name="damage-and-losses"
                                >
                                    {t('Download csv')}
                                </DownloadButton>
                            )
                        }
                    </Translation>

                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps)(TabularView);
