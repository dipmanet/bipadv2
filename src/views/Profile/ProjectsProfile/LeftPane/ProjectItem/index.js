/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import FormattedDate from '#rscv/FormattedDate';
import Button from '#rsca/Button';
import Modal from '#rscv/Modal';
import ListView from '#rscv/List/ListView';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import TextOutput from '#components/TextOutput';
import { iconNames } from '#constants';

import styles from './styles.scss';

const Output = ({
    category,
    drrCycle,
    budget,
    budgetUsd,
    description,
}) => (
    <div className={styles.output}>
        <h3>
            {description}
        </h3>
        <div className={styles.table}>
            <TextOutput
                type="table"
                label="Category"
                value={category}
            />
            <TextOutput
                type="table"
                label="DRR cycle"
                value={drrCycle}
            />
            <TextOutput
                type="table"
                label="Budget USD"
                value={budgetUsd}
                isNumericValue
                prefix="$"
            />
            <TextOutput
                type="table"
                label="Budget"
                value={budget}
                isNumericValue
                prefix="Rs. "
            />
        </div>
    </div>
);

const propTypes = {
    projectId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
};

const defaultProps = {
};

const outputKeySelector = o => o.outputid;

class ProjectItem extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        };
    }

    handleProjectClick = () => {
        this.setState({ showModal: true });
    }

    handleModalClose = () => {
        this.setState({ showModal: false });
    }

    outputRendererParams = (k, d) => {
        const {
            drrCycleMap = {},
            categoryMap = {},
        } = this.props;

        const category = d.category.map(p => (categoryMap[p] || {}).title).join(', ');
        const drrCycle = d.drrcycle.map(p => (drrCycleMap[p] || {}).title).join(', ');

        return ({
            category,
            drrCycle,
            budget: d.output_budloc,
            budgetUsd: d.output_budusd,
            description: d.output_description,
        });
    };

    render() {
        const { showModal } = this.state;
        const {
            projectId,
            output,
            title,
            start,
            end,
            budget,
            budget_usd,
            oid,
            partner,
            donor,
            organizationMap = {},
        } = this.props;

        const partnerNames = partner.map(p => (organizationMap[p] || {}).oname).join(', ');
        const donorNames = donor.map(d => (organizationMap[d] || {}).oname).join(', ');

        return (
            <React.Fragment>
                <div
                    className={styles.project}
                    onClick={this.handleProjectClick}
                    role="button"
                    onKeyPress={() => {}}
                    tabIndex={0}
                >
                    <h4 className={styles.heading}>
                        {title}
                    </h4>
                    <TextOutput
                        className={styles.budget}
                        label="Budget"
                        value={budget}
                        isNumericValue
                        alwaysVisible
                        prefix="Rs. "
                    />
                    <div className={styles.dateContainer}>
                        <TextOutput
                            className={styles.startDate}
                            label="Start Date"
                            value={(
                                <FormattedDate
                                    value={start}
                                    mode="yyyy-MM-dd"
                                />
                            )}
                            alwaysVisible
                        />
                        <TextOutput
                            className={styles.endDate}
                            label="End Date"
                            value={(
                                <FormattedDate
                                    value={end}
                                    mode="yyyy-MM-dd"
                                />
                            )}
                            alwaysVisible
                        />
                    </div>
                </div>
                {showModal && (
                    <Modal
                        className={styles.modal}
                        // closeOnEscape
                        // closeOnOutsideClick
                    >
                        <ModalHeader
                            className={styles.modalHeader}
                            title={title}
                            rightComponent={(
                                <Button
                                    transparent
                                    iconName="close"
                                    onClick={this.handleModalClose}
                                />
                            )}
                        />
                        <ModalBody className={styles.modalBody}>
                            <div className={styles.table}>
                                <TextOutput
                                    label="Budget USD"
                                    value={budget_usd}
                                    isNumericValue
                                    prefix="$"
                                    type="table"
                                />
                                <TextOutput
                                    label="Budget"
                                    value={budget}
                                    isNumericValue
                                    prefix="Rs. "
                                    type="table"
                                />
                                <TextOutput
                                    type="table"
                                    label="Start Date"
                                    value={(
                                        <FormattedDate
                                            value={start}
                                            mode="yyyy-MM-dd"
                                        />
                                    )}
                                />
                                <TextOutput
                                    type="table"
                                    label="End Date"
                                    value={(
                                        <FormattedDate
                                            value={end}
                                            mode="yyyy-MM-dd"
                                        />
                                    )}
                                />
                                <TextOutput
                                    valueClassName={styles.capitalizeValue}
                                    type="table"
                                    label="Project Owner"
                                    value={organizationMap[oid].oname}
                                />
                                <TextOutput
                                    valueClassName={styles.capitalizeValue}
                                    type="table"
                                    label="Project Partner"
                                    value={partnerNames}
                                />
                                <TextOutput
                                    valueClassName={styles.capitalizeValue}
                                    type="table"
                                    label="Project Donor"
                                    value={donorNames}
                                />
                            </div>
                            <ListView
                                className={styles.outputs}
                                data={output}
                                renderer={Output}
                                rendererParams={this.outputRendererParams}
                                keySelector={outputKeySelector}
                            />
                        </ModalBody>
                    </Modal>
                )}
            </React.Fragment>
        );
    }
}

export default ProjectItem;
