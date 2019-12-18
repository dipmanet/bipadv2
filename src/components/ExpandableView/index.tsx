import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import Icon from '#rscg/Icon';

import styles from './styles.scss';

interface Props {
    className?: string;
    headerContent: React.ReactNode;
}

interface State {
    isExpanded: boolean;
}

class ExpandableView extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            isExpanded: false,
        };
    }

    private handleButtonClick = () => {
        const { isExpanded: prevIsExpanded } = this.state;
        this.setState({ isExpanded: !prevIsExpanded });
    }

    public render() {
        const {
            className,
            headerContent,
        } = this.props;

        const { isExpanded } = this.state;

        return (
            <div className={_cs(styles.expandableView, className)}>
                <header className={styles.header}>
                    <Button
                        transparent
                        onClick={this.handleButtonClick}
                    >
                        <div className={styles.headerContent}>
                            {headerContent}
                        </div>
                        <Icon
                            className={styles.icon}
                            name={isExpanded ? 'chevronUp' : 'chevronDown'}
                        />
                    </Button>
                </header>
            </div>
        );
    }
}

export default ExpandableView;
