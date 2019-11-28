import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Overview from './Overview';
import Details from './Details';

import styles from './styles.scss';
import Risk from './Details/Risk';

interface Props {
    className?: string;
    onViewChange: (key: AttributeKey | undefined) => void;
}

type AttributeKey = 'hazard' | 'exposure' | 'vulnerability' | 'risk' | 'capacity-and-resources' | 'climate-change';

interface State {
    activeAttribute: AttributeKey | undefined;
}

export default class RiskInfoLeftPane extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeAttribute: undefined,
        };
    }

    private handleAttributeClick = (key: AttributeKey) => {
        const {
            onViewChange,
        } = this.props;

        this.setState({ activeAttribute: key });
        onViewChange(key);
    }

    private handleDetailsBackButtonClick = () => {
        const {
            onViewChange,
        } = this.props;

        this.setState({ activeAttribute: undefined });
        onViewChange(undefined);
    }

    public render() {
        const {
            className,
        } = this.props;

        const {
            activeAttribute,
        } = this.state;

        return (
            <div className={
                _cs(
                    styles.leftPane,
                    className,
                    activeAttribute && styles.hasActiveAttribute,
                )}
            >
                <Overview
                    titleShown={!activeAttribute}
                    className={styles.overview}
                    onAttributeClick={this.handleAttributeClick}
                />
                {activeAttribute && (
                    <Details
                        className={styles.content}
                        attribute={activeAttribute}
                        onBackButtonClick={this.handleDetailsBackButtonClick}
                    />
                )}
            </div>
        );
    }
}
