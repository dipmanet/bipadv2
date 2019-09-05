import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Overview from './Overview';
import Details from './Details';

import styles from './styles.scss';

interface Props {
    className?: string;
}

type Attribute = 'hazard' | 'exposure' | 'vulnerability' | 'risk' | 'capacity-and-resources';

interface State {
    activeAttribute: Attribute | undefined;
}

export default class RiskInfoLeftPane extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeAttribute: undefined,
        };
    }

    private handleAttributeClick = (key: Attribute) => {
        this.setState({ activeAttribute: key });
    }

    private handleDetailsBackButtonClick = () => {
        this.setState({ activeAttribute: undefined });
    }

    public render() {
        const {
            className,
        } = this.props;

        const {
            activeAttribute,
        } = this.state;

        return (
            <div className={_cs(styles.leftPane, className)}>
                { activeAttribute ? (
                    <Details
                        className={styles.content}
                        attribute={activeAttribute}
                        onBackButtonClick={this.handleDetailsBackButtonClick}
                    />
                ) : (
                    <Overview
                        className={styles.content}
                        onAttributeClick={this.handleAttributeClick}
                    />
                )}
            </div>
        );
    }
}
