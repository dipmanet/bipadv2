/* eslint-disable import/prefer-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import OpenSeaDragon from 'openseadragon';
import React, { useEffect, useState } from 'react';
import Canvas2Image from '@reglendo/canvas2image';
// import { Canvas2Image } from 'canvas2image';
import Loader from 'react-loader';
import image1 from '#resources/openseadragon-images/download_rest.png';
import image2 from '#resources/openseadragon-images/download_hover.png';

const OpenSeaDragonViewer = ({ image, selectedImage, loadLoader }) => {
    const [viewer, setViewer] = useState(null);
    const [downloadContent, setDownloadContent] = useState(null);
    const [loading, setLoading] = useState(true);

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
        setDownloadContent(e);
    };

    useEffect(() => {
        const { width, height } = calculateDownloadDimensions();

        if (downloadContent !== null) {
            const imageName = selectedImage.split('.');
            Canvas2Image.saveAsPNG(
                viewer.drawer.canvas,
                `${imageName[0]}`,
                width,
                height,
            );


            setDownloadContent(null);
        }
    }, [downloadContent]);


    useEffect(() => {
        if (image && viewer) {
            viewer.open(image.source);
        }
    }, [image, viewer]);

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
            crossOriginPolicy: 'Anonymous',

            tileSources: [
                `https://imageserver.yilab.org.np/iiif/3/${selectedImage}/info.json`,
            ],
        });


        view.addControl(customButton.element, { anchor: OpenSeaDragon.ControlAnchor.TOP_LEFT });

        view.addHandler('open', () => {
            const loader = view.world.getItemAt(0);
            loader.addHandler('fully-loaded-change', (event) => {
                if (event.fullyLoaded) {
                    setLoading(false);
                }
            });
        });

        setViewer(
            view,
        );
    };
    useEffect(() => {
        setLoading(loadLoader);
        InitOpenseadragon();
        return () => {
            // eslint-disable-next-line no-unused-expressions
            viewer && viewer.destroy();
        };
    }, [selectedImage]);


    return (
        <>
            {loading ? (
                <div>

                    <p style={{ fontSize: '18px', fontWeight: 'bold', top: '5%', position: 'absolute', zIndex: '1' }}>Loading Image,Please Wait...</p>
                </div>
            ) : ''}
            <div
                id="openSeaDragon"
                style={{
                    height: '100%',
                    width: 'auto',
                }}
            />


            {loading ? <Loader left="60%" /> : ''}

        </>
    );
};
export { OpenSeaDragonViewer };
