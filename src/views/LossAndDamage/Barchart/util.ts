// Capture dom image with description above
import * as HtmltoImage from 'html-to-image';
// eslint-disable-next-line import/prefer-default-export
export const handleDownload = async (ref, selectOption, name, h, w) => {
    const doc = document.getElementById(ref);
    if (doc) {
        const clone = doc.cloneNode(true);
        const width = doc.clientWidth + w;
        const height = doc.clientHeight + h;
        const text = `No. of ${selectOption}`;
        const para = document.createElement('p');
        para.style.fontSize = '12px';
        para.style.textAlign = 'center';
        para.style.padding = '0';
        para.style.marginBottom = '0';
        para.style.overflow = 'hidden';
        const textNode = document.createTextNode(text);
        para.appendChild(textNode);
        const mainDiv = document.createElement('div');
        mainDiv.style.overflow = 'visible';
        mainDiv.appendChild(para);
        mainDiv.appendChild(clone);
        const image = await HtmltoImage.toPng(mainDiv, { width, height }).then((img) => {
            const link = document.createElement('a');
            link.href = img;
            link.download = `${name}.png`;
            link.click();
        });
    }
};
