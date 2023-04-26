import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import Faram, {
    FaramGroup,
} from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';


import IncidentInfo from '#components/IncidentInfo';
import educationIcon from '#resources/icons/Education.svg';
import governanceIcon from '#resources/icons/Government-office.svg';
import groupIcon from '#resources/icons/group1.svg';
import healthFacilityIcon from '#resources/icons/health-facility1.svg';
import warehouseIcon from '#resources/icons/newCapResEvacuationcenter.svg';
import openSpaceIcon from '#resources/icons/Soap.svg';
import financeIcon from '#resources/icons/University.svg';
import Button from '#rsca/Button';
import Checkbox from '#rsci/Checkbox';
import NumberInput from '#rsci/NumberInput';
import SelectInput from '#rsci/SelectInput';
import TextInput from '#rsci/TextInput';
import ListView from '#rscv/List/ListView';
import { languageSelector } from '#selectors';
import styles from './styles.scss';
import { getFilterItems, getSchema } from './utils.js';
import ResourceGroup from './ResourceGroup';
import resourceAttributes from '../resourceAttributes';

const mapStateToProps = state => ({
    language: languageSelector(state),
});

const getKey = x => x.key;

const getLabel = (x, language) => (language === 'en' ? x.label : x.labelNe);

const getFilterInputElement = (filterParam, show, elementProps = {}, language) => {
    const {
        key,
        type: paramType,
        label,
        labelNe,
        filter,
    } = filterParam;
    const labelCheck = language === 'en' ? label : labelNe;

    const type = filter.type || paramType;

    const commonProps = {
        ...elementProps,
        key,
        label: labelCheck,
        faramElementName: key,
        disabled: !show,
    };

    if (type === 'string') {
        return (
            <TextInput
                {...commonProps}
            />
        );
    }
    if (type === 'number') {
        return (
            <NumberInput
                {...commonProps}
                title={label}
                separator=" "
            />
        );
    }
    if (type === 'boolean') {
        return (
            <Checkbox
                {...commonProps}
            />
        );
    }
    if (type === 'select') {
        return (
            <SelectInput
                {...commonProps}
                keySelector={getKey}
                labelSelector={x => getLabel(x, language)}
                options={filter.options}
                placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
            />
        );
    }
    return (
        <TextInput
            {...commonProps}
        />
    );
};

const titles = language => (
    {
        health: language === 'en' ? 'Health facilities' : 'स्वास्थ्य सुविधाहरू',
        finance: language === 'en' ? 'Finance Institutes' : 'वित्त संस्थानहरू',
        volunteer: language === 'en' ? 'Volunteers' : 'स्वयंसेवकहरू',
        education: language === 'en' ? 'Education' : 'शिक्षा',
        openSpace: language === 'en' ? 'Open spaces' : 'खुला ठाउँहरू',
        hotel: language === 'en' ? 'Hotel' : 'होटल',
        governance: language === 'en' ? 'Governance' : 'सुशासन',
    });

const resourceComponentsProps = language => ({
    health: {
        heading: language === 'en' ? 'Health facilities' : 'स्वास्थ्य सुविधाहरू',
        icon: healthFacilityIcon,
    },
    volunteer: {
        heading: language === 'en' ? 'Volunteers' : 'स्वयंसेवकहरू',
        icon: groupIcon,
    },
    education: {
        heading: language === 'en' ? 'Schools' : 'विद्यालयहरू',
        icon: educationIcon,
    },
    finance: {
        heading: language === 'en' ? 'Financial institutes' : 'वित्तीय संस्थानहरू',
        icon: financeIcon,
    },
    governance: {
        heading: language === 'en' ? 'Governance' : 'सुशासन',
        icon: governanceIcon,
    },
    openSpace: {
        heading: language === 'en' ? 'Open space' : 'खुल्‍ला ठाउँ',
        icon: openSpaceIcon,
    },
    warehouse: {
        heading: language === 'en' ? 'Ware House' : 'गोदाम',
        icon: warehouseIcon,
    },
});

const getResources = (resourceList) => {
    const resources = {
        health: [],
        finance: [],
        volunteer: [],
        education: [],
        openSpace: [],
        hotel: [],
        governance: [],
        warehouse: [],
    };

    resourceList.forEach((r) => {
        if (resources[r.resourceType]) {
            resources[r.resourceType].push(r);
        }
    });

    return resources;
};

const propTypes = {
    className: PropTypes.string,
    // setFilter: PropTypes.func.isRequired,
    resourceList: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
    className: '',
    resourceList: [],
};

class LeftPane extends React.Component {
    static propTypes = propTypes

    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.schema = getSchema(resourceAttributes);

        this.state = {
        };
    }

    getResourceRendererParams = (d) => {
        const { language: { language } } = this.props;
        const resources = this.getResources(this.props.resourceList);
        const filteredResources = this.getFilteredResources(this.props.filteredResourceList);

        return {
            ...resourceComponentsProps(language)[d],
            type: d,
            isFilterShown: this.state.selectedFilter === d,
            onFilterShowClick: this.handleFilterClick,
            data: filteredResources[d],
            totalSize: resources[d] ? resources[d].length : 0,
            language,
        };
    };

    getResources = memoize(getResources);

    getFilteredResources = memoize(getResources);

    handleFilterClick = (resourceKey) => {
        this.setState({ selectedFilter: resourceKey });
    }

    handleFilterClose = () => {
        this.setState({ selectedFilter: undefined });
    }

    handleFaramChange = (faramValues) => {
        this.props.setFilter(faramValues);
    }

    renderFilter = () => {
        const { filter, language: { language } } = this.props;
        const { selectedFilter } = this.state;

        const filterItems = getFilterItems(resourceAttributes);
        const filterItem = filterItems[selectedFilter];

        if (!filterItem) {
            return null;
        }

        const {
            key,
            filterParams,
        } = filterItem;

        return (
            <div className={styles.resourceFilter}>
                <FaramGroup
                    key={key}
                    faramElementName={key}
                >
                    <header className={styles.header}>
                        <Checkbox
                            className={styles.checkbox}
                            faramElementName="show"
                            label={titles(language)[key] || key}
                        />
                        <Button
                            className={styles.closeButton}
                            transparent
                            iconName="close"
                            onClick={this.handleFilterClose}
                        />
                    </header>
                    <div className={styles.content}>
                        {filterParams.map(param => (
                            <div className={styles.inputContainer}>
                                {getFilterInputElement(
                                    param,
                                    filter[key].show,
                                    { showHintAndError: false },
                                    language,
                                )}
                            </div>
                        ))}
                    </div>
                </FaramGroup>
            </div>
        );
    }

    render() {
        const {
            className,
            filter,
            resourceList,
            incident,
            wardsMap,
            provincesMap,
            districtsMap,
            municipalitiesMap,
            language: { language },
        } = this.props;

        const {
            selectedFilter,
        } = this.state;

        const resources = this.getResources(this.props.resourceList);
        const resourceKeys = Object.keys(resources);

        return (
            <Translation>
                {
                    t => (
                        <div className={_cs(className, styles.filter)}>
                            <div className={styles.resourceListContainer}>
                                <IncidentInfo
                                    incident={incident}
                                    wardsMap={wardsMap}
                                    provincesMap={provincesMap}
                                    districtsMap={districtsMap}
                                    municipalitiesMap={municipalitiesMap}
                                    hideLink
                                    language={language}
                                />
                                <header className={styles.header}>
                                    <h3 className={styles.heading}>
                                        {t('Resources')}
                                    </h3>
                                </header>
                                <ListView
                                    data={resourceKeys}
                                    renderer={ResourceGroup}
                                    rendererParams={this.getResourceRendererParams}


                                />
                            </div>
                            {selectedFilter && (
                                <Faram
                                    className={styles.filterForm}
                                    onChange={this.handleFaramChange}
                                    schema={this.schema}
                                    value={filter}
                                // error={faramErrors}
                                >
                                    {this.renderFilter()}
                                </Faram>
                            )}
                        </div>
                    )
                }
            </Translation>

        );
    }
}

export default connect(mapStateToProps)(LeftPane);
