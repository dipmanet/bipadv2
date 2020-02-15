import React from 'react';
import SVGInjector from 'svg-injector';
import html2canvas from 'html2canvas';
import memoize from 'memoize-one';

import MapImage from '#re-map/MapImage';

interface Props {
    src: string;
    name: string;
    fillColor?: string;
    width?: number;
    height?: number;
}

interface State {
    image: HTMLElement | undefined;
}

class SVGMapIcon extends React.PureComponent<Props, State> {
    public state = {
        image: undefined,
    }

    private generateImage = memoize((src: string, width, height, fillColor) => {
        const dummySvg = document.createElement('svg');
        const container = document.createElement('div');
        dummySvg.setAttribute('data-src', src);
        container.appendChild(dummySvg);

        const options = {};

        SVGInjector(dummySvg, options, () => {
            const svg = container.children[0] as HTMLElement;
            svg.style.width = `${width}px`;
            svg.style.height = `${height}px`;

            if (fillColor) {
                svg.style.fill = fillColor;

                const paths = svg.getElementsByTagName('path');
                for (let i = 0; i < paths.length; i += 1) {
                    paths[i].style.fill = fillColor;
                }
            }

            document.body.appendChild(container);
            const svgCanvas = html2canvas(container, {
                allowTaint: true,
                width,
                height,
                backgroundColor: null, // transparent
            });
            svgCanvas.then((c) => {
                document.body.removeChild(container);
                const image = new Image();
                image.onload = () => {
                    this.setState({ image });
                };
                image.src = c.toDataURL();
            });
        });
    })

    public render() {
        const {
            src,
            fillColor = undefined,
            width = 56,
            height = 56,
            name,
            ...otherProps
        } = this.props;

        this.generateImage(src, width, height, fillColor);

        const { image } = this.state;
        if (!image) {
            return null;
        }

        return (
            <MapImage
                image={image}
                name={name}
                {...otherProps}
            />
        );
    }
}

export default SVGMapIcon;
