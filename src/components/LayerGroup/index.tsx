import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';

import LayerSelection from '#components/LayerSelection';
import LayerDetailModalButton from '#components/LayerDetailModalButton';
import { LayerHierarchy } from '#types';

import styles from './styles.scss';

interface Props {
    className?: string;
    data: LayerHierarchy;
}

interface State {
    isContentShown: boolean;
}

class LayerGroup extends React.PureComponent<Props, State> {
    public state = {
        isContentShown: false,
    }

    private handleShowContentButtonClick = () => {
        this.setState(({ isContentShown }) => ({ isContentShown: !isContentShown }));
    }

    public render() {
        const {
            data,
            className,
        } = this.props;

        const { isContentShown } = this.state;

        if (!data.children) {
            return null;
        }

        return (
            <div className={_cs(
                styles.layerGroup,
                className,
            )}
            >
                <header className={styles.header}>
                    <h3 className={styles.title}>
                        { data.title }
                    </h3>
                    { (data.longDescription || data.metadata) && (
                        <div className={styles.actions}>
                            <LayerDetailModalButton
                                layer={data}
                                className={styles.infoButton}
                            />
                            {/*
                            <Button
                                title="Show data (currently not available)"
                                className={styles.showDataButton}
                                transparent
                                iconName="table"
                                disabled
                            />
                            */}
                        </div>
                    )}
                    <Button
                        transparent
                        className={styles.showContentButton}
                        iconName={isContentShown ? 'chevronUp' : 'chevronDown'}
                        onClick={this.handleShowContentButtonClick}
                    />
                </header>
                { data.shortDescription && (
                    <div className={styles.shortDescription}>
                        { data.shortDescription }
                    </div>
                )}
                { isContentShown && (
                    <div className={styles.content}>
                        {data.children.length !== 0 && (
                            <LayerSelection layerList={data.children as LayerHierarchy[]} />
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default LayerGroup;
