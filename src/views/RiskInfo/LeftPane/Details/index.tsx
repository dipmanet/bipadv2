import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import MultiViewContainer from '#rscv/MultiViewContainer';

import Hazard from './Hazard';
import Exposure from './Exposure';
import Vulnerability from './Vulnerability';
import Risk from './Risk';
import CapacityAndResources from './CapacityAndResources';

import styles from './styles.scss';

interface Props {
    className?: string;
    attribute: 'hazard' | 'exposure' | 'vulnerability' | 'risk' | 'capacity-and-resources';
    onBackButtonClick: () => void;
}

interface State {
}

const rendererParams = () => ({
    className: styles.content,
});

export default class Details extends React.PureComponent<Props, State> {
    private views = {
        hazard: {
            title: 'Hazard',
            component: Hazard,
            rendererParams,
        },
        exposure: {
            title: 'Exposure',
            component: Exposure,
            rendererParams,
        },
        vulnerability: {
            title: 'Vulnerability',
            component: Vulnerability,
            rendererParams,
        },
        risk: {
            title: 'Risk',
            component: Risk,
            rendererParams,
        },
        'capacity-and-resources': {
            title: 'Capacity & resources',
            component: CapacityAndResources,
            rendererParams,
        },
    }

    public render() {
        const {
            className,
            attribute,
            onBackButtonClick,
        } = this.props;

        const headingText = this.views[attribute].title;

        return (
            <div className={_cs(styles.details, className)}>
                <header className={styles.header}>
                    <Button
                        className={styles.backButton}
                        onClick={onBackButtonClick}
                        iconName="back"
                        transparent
                    />
                    <h3 className={styles.heading}>
                        { headingText }
                    </h3>
                </header>
                <MultiViewContainer
                    views={this.views}
                    active={attribute}
                />
            </div>
        );
    }
}
