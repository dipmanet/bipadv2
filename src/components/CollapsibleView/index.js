import PropTypes from 'prop-types';
import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class CollapsibleView extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            expanding: false,
            collapsing: false,
        };

        this.expandedContainerRef = React.createRef();
        this.collapsedContainerRef = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        const { expanded: isExpanded } = this.props;
        const { expanded: willExpand } = nextProps;

        if (isExpanded !== willExpand) {
            if (willExpand) {
                this.setState({
                    expanding: true,
                    collapsing: false,
                });
            } else {
                this.setState({
                    collapsing: true,
                    expanding: false,
                });
            }

            window.cancelAnimationFrame(this.animationFrameRequest);
        }
    }

    componentDidUpdate() {
        const {
            collapsing,
            expanding,
        } = this.state;

        if (!(expanding || collapsing)) {
            return;
        }

        const { current: expandedContainer } = this.expandedContainerRef;
        const { current: collapsedContainer } = this.collapsedContainerRef;


        if (expandedContainer && collapsedContainer) {
            const expandedContainerBCR = expandedContainer.getBoundingClientRect();
            const collapsedContainerBCR = collapsedContainer.getBoundingClientRect();

            if (expanding) {
                const {
                    width: initialWidth,
                    height: initialHeight,
                } = collapsedContainerBCR;

                const {
                    width: finalWidth,
                    height: finalHeight,
                } = expandedContainerBCR;

                this.animationFrameRequest = window.requestAnimationFrame((timestamp) => {
                    this.animate({
                        expandedContainer,
                        collapsedContainer,
                        initialWidth,
                        initialHeight,
                        finalWidth,
                        finalHeight,
                    }, timestamp);
                });
            } else if (collapsing) {
                const {
                    width: initialWidth,
                    height: initialHeight,
                } = expandedContainerBCR;

                const {
                    width: finalWidth,
                    height: finalHeight,
                } = collapsedContainerBCR;

                this.animationFrameRequest = window.requestAnimationFrame((timestamp) => {
                    this.animate({
                        expandedContainer,
                        collapsedContainer,
                        initialWidth,
                        initialHeight,
                        finalWidth,
                        finalHeight,
                    }, timestamp);
                });
            }
        }
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.animationFrameRequest);
    }

    animate = ({
        expandedContainer,
        collapsedContainer,
        initialWidth,
        initialHeight,
        finalWidth,
        finalHeight,
    }, currentTimestamp, initialTimestamp = 0) => {
        let animationProgress = 0;

        if (initialTimestamp === 0) {
            // eslint-disable-next-line no-param-reassign
            initialTimestamp = currentTimestamp;
        } else {
            const ANIMATION_DURATION = 200;

            animationProgress = (currentTimestamp - initialTimestamp) / ANIMATION_DURATION;
            animationProgress = Math.min(animationProgress, 1) ** 3;

            const { style: expandedContainerStyle } = expandedContainer;
            const { style: collapsedContainerStyle } = collapsedContainer;

            const isExpanding = initialWidth < finalWidth;
            const isCollapsing = initialWidth > finalWidth;

            const newWidth = initialWidth
                + ((finalWidth - initialWidth) * animationProgress);
            const newHeight = initialHeight
                + ((finalHeight - initialHeight) * animationProgress);

            if (isExpanding) {
                const expandedContainerScaleX = newWidth / finalWidth;
                const expandedContainerScaleY = newHeight / finalHeight;

                expandedContainerStyle.transform = `scale(${expandedContainerScaleX}, ${expandedContainerScaleY})`;
                expandedContainerStyle.opacity = animationProgress;

                collapsedContainerStyle.opacity = 1 - animationProgress;
            }

            if (isCollapsing) {
                const expandedContainerScaleX = newWidth / initialWidth;
                const expandedContainerScaleY = newHeight / initialHeight;

                expandedContainerStyle.transform = `scale(${expandedContainerScaleX}, ${expandedContainerScaleY})`;
                expandedContainerStyle.opacity = 1 - animationProgress;

                collapsedContainerStyle.opacity = animationProgress;
            }
        }

        if (animationProgress < 1) {
            this.animationFrameRequest = window.requestAnimationFrame((timestamp) => {
                this.animate({
                    expandedContainer,
                    collapsedContainer,
                    initialWidth,
                    initialHeight,
                    finalWidth,
                    finalHeight,
                }, timestamp, initialTimestamp);
            });
        } else {
            this.setState({
                expanding: false,
                collapsing: false,
            });
        }
    }

    render() {
        const {
            className: classNameFromProps,
            collapsedView,
            collapsedViewContainerClassName,
            expandedView,
            expandedViewContainerClassName,
            expanded,
        } = this.props;

        const {
            expanding,
            collapsing,
        } = this.state;

        const className = _cs(
            styles.collapsibleView,
            classNameFromProps,
        );

        const expandedContainerClassName = _cs(
            collapsing && styles.ghost,
            collapsing && 'expanded-container-ghost',
            expanding && styles.expanding,
            expanding && 'expanded-container-expanding',
            collapsing && styles.collapsing,
            collapsing && 'expanded-container-collapsing',
            styles.expanded,
            expandedViewContainerClassName,
        );

        const collapsedContainerClassName = _cs(
            expanding && styles.ghost,
            expanding && 'collapsed-container-ghost',
            collapsing && styles.collapsing,
            collapsing && 'collapsed-container-collapsing',
            styles.collapsed,
            collapsedViewContainerClassName,
        );

        return (
            <div className={className}>
                { (expanded || collapsing) && (
                    <div
                        ref={this.expandedContainerRef}
                        className={expandedContainerClassName}
                    >
                        { expandedView }
                    </div>
                ) }
                { (!expanded || expanding) && (
                    <div
                        ref={this.collapsedContainerRef}
                        className={collapsedContainerClassName}
                    >
                        { collapsedView }
                    </div>
                ) }
            </div>
        );
    }
}
