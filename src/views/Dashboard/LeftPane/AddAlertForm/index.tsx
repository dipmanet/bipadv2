import React from 'react';
import { _cs } from '@togglecorp/fujs';

import FixedTabs from '#rscv/FixedTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';

import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';

import LocationInput from '#components/LocationInput';

import styles from './styles.scss';

interface Props {
    className?: string;
}

interface Tabs {
    general: string;
    location: string;
}

interface Views {
    general: {};
    location: {};
}

interface State {
    currentView: keyof Tabs;
}

export default class AddAlertForm extends React.PureComponent<Props, State> {
    private tabs: Tabs;

    private views: Views;

    public constructor(props: Props) {
        super(props);

        this.tabs = {
            general: 'General',
            location: 'Location',
        };

        this.views = {
            general: {
                component: () => (
                    <>
                        <TextArea
                            className={styles.descriptionInput}
                            label="Description"
                        />
                        <SelectInput
                            className={styles.eventInput}
                            label="Event"
                        />
                        <SelectInput
                            className={styles.sourceInput}
                            label="Source"
                        />
                        <SelectInput
                            className={styles.hazardInput}
                            label="Hazard"
                        />
                        <div className={styles.startedOnInputs}>
                            <DateInput
                                className={styles.startedOnDate}
                                label="Started on"
                            />
                            <TimeInput />
                        </div>
                        <div className={styles.expiresOnInputs}>
                            <DateInput
                                label="Expires on"
                            />
                            <TimeInput />
                        </div>
                    </>
                ),
            },
            location: {
                component: () => <LocationInput />,
            },
        };

        this.state = {
            currentView: 'general',
        };
    }

    private handleTabClick = (newTab: keyof Tabs) => {
        this.setState({ currentView: newTab });
    }

    public render() {
        const {
            className,
        } = this.props;

        const {
            currentView,
        } = this.state;

        return (
            <div className={_cs(styles.addAlertForm, className)}>
                <FixedTabs
                    tabs={this.tabs}
                    onClick={this.handleTabClick}
                    active={currentView}
                />
                <MultiViewContainer
                    views={this.views}
                    active={currentView}
                />
            </div>
        );
    }
}
