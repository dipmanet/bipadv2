import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import Icon from '#rscg/Icon';

import styles from './styles.scss';

interface Props {
    className?: string;
    headerContent: React.ReactNode;
    expandableContent: React.ReactNode;
    headerContentClassName?: string;
    headerClassName?: string;
    expandedClassName?: string;
    expandButtonClassName?: string;
    expandIconClassName?: string;
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
            expandableContent,
            headerContentClassName,
            headerClassName,
            expandedClassName,
            expandButtonClassName,
            expandIconClassName,
        } = this.props;

        const { isExpanded } = this.state;

        return (
            <div
                className={_cs(
                    styles.expandableView,
                    className,
                    isExpanded && styles.expanded,
                    isExpanded && expandedClassName,
                )}
            >
                <header className={_cs(styles.header, headerClassName)}>
                    <Button
                        transparent
                        onClick={this.handleButtonClick}
                        className={_cs(styles.expandButton, expandButtonClassName)}
                    >
                        <div className={_cs(styles.headerContent, headerContentClassName)}>
                            {headerContent}
                        </div>
                        <Icon
                            className={_cs(styles.icon, expandIconClassName)}
                            name={isExpanded ? 'chevronUp' : 'chevronDown'}
                        />
                    </Button>
                </header>
                {isExpanded && (
                    <div className={styles.expandableContent}>
                        { expandableContent }
                    </div>
                )}
            </div>
        );
    }
}

export default ExpandableView;
