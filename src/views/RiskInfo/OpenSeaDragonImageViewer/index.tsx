/* eslint-disable import/prefer-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import OpenSeaDragon from 'openseadragon';
import React, { useEffect, useState } from 'react';
import Canvas2Image from '@reglendo/canvas2image';
import image1 from '#resources/openseadragon-images/download_rest.png';
import image2 from '#resources/openseadragon-images/download_hover.png';


const OpenSeaDragonViewer = ({ image, selectedImage }) => {
    const [viewer, setViewer] = useState(null);
    const [test, setTest] = useState(null);


    const calculateDownloadDimensions = () => {
        let returnObj = {};

        try {
            let height = null;
            let width = null;
            const maxWidth = 3000;
            const canvasHeight = viewer.drawer.canvas.height;
            const canvasWidth = viewer.drawer.canvas.width;
            const proportionRatio = canvasHeight / canvasWidth;

            width = canvasWidth > maxWidth ? maxWidth : canvasWidth;
            height = width * proportionRatio;

            returnObj = { width, height };
        } catch {
            console.error(
                'Error in handling download click for a tile source in OpenSeadragon viewer',
            );
            returnObj = {};
        }

        return returnObj;
    };


    const handleDownload = (e) => {
        setTest(e);
        console.log(e);
        // const { width, height } = calculateDownloadDimensions();
        // console.log("height width",height,width)

        // if (width && height) {

        // Canvas2Image.saveAsJPEG(
        //   viewer.drawer.canvas,
        // "openseadragon-react-viewer-download",
        //   901,
        //   801
        // );
        // }
    };

    useEffect(() => {
        console.log('This viewer', viewer);
        const { width, height } = calculateDownloadDimensions();
        console.log('height width', height, width);
        if (test !== null) {
            console.log('that viewer', viewer);
            Canvas2Image.saveAsJPEG(
                viewer.drawer.canvas,
                'openseadragon-react-viewer-download',
                width,
                height,
            );

            setTest(null);
        }
    }, [test]);


    useEffect(() => {
        if (image && viewer) {
            viewer.open(image.source);
        }
    }, [image, viewer]);
    console.log('This is images', image);
    const InitOpenseadragon = () => {
        // eslint-disable-next-line no-unused-expressions
        viewer && viewer.destroy();
        const customButton = new OpenSeaDragon.Button({
            tooltip: 'Download',
            srcRest: image1,
            srcGroup: image1,
            srcHover: image2,
            srcDown: image1,
            onClick: handleDownload,
        });

        const view = OpenSeaDragon({
            id: 'openSeaDragon',
            prefixUrl: '/src/resources/openseadragon-images/',

            tileSources: [
                `https://imageserver.yilab.org.np/iiif/3/${selectedImage}/info.json`,
            ],
        });
        view.addControl(customButton.element, { anchor: OpenSeaDragon.ControlAnchor.TOP_LEFT });
        //   view.addHandler('open', function() {
        //     const img = view.drawer.canvas.toDataURL("image/png");
        //     console.log(img);
        //  })


        setViewer(
            view,
        );
    };
    useEffect(() => {
        InitOpenseadragon();
        console.log('This is final viewer', viewer);
        return () => {
            // eslint-disable-next-line no-unused-expressions
            viewer && viewer.destroy();
        };
    }, [selectedImage]);


    console.log('This viewer', viewer);

    return (
        <div
            id="openSeaDragon"
            style={{
                height: '100%',
                width: 'auto',
            }}
        />
    );
};
export { OpenSeaDragonViewer };
