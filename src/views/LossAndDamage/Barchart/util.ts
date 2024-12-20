// Capture dom image with description above
import * as HtmltoImage from 'html-to-image';
// eslint-disable-next-line import/prefer-default-export

interface DownloadProps {
    domElement: string;
    selectOption: string;
    headerText: string;
    fileName: string;
    height: number;
    width: number;
}

// eslint-disable-next-line import/prefer-default-export
export const handleDownload = async (props: DownloadProps) => {
    const { domElement,
        selectOption,
        headerText,
        fileName,
        height: h,
        width: w } = props;
    const doc = document.getElementById(domElement);
    if (doc) {
        const clone = doc.cloneNode(true);
        const width = doc.clientWidth + w;
        const height = doc.clientHeight + h;
        const para = document.createElement('p');
        para.style.fontSize = '12px';
        para.style.textAlign = 'center';
        para.style.padding = '0';
        para.style.marginBottom = '0';
        para.style.overflow = 'hidden';
        para.style.textTransform = 'capitalize';
        const textNode = document.createTextNode(headerText);
        para.appendChild(textNode);
        const mainDiv = document.createElement('div');
        mainDiv.style.overflow = 'visible';
        mainDiv.appendChild(para);
        mainDiv.appendChild(clone);
        const image = await HtmltoImage.toPng(mainDiv, { width, height }).then((img) => {
            const link = document.createElement('a');
            link.href = img;
            link.download = `${fileName}.png`;
            link.click();
        });
    }
};
