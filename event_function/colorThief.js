window.onload = function () {
    const img = document.querySelector('body');
    const colorThief = new ColorThief();
    const imgElement = new Image();
    imgElement.src = img.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
    imgElement.onload = function () {
        const dominantColor = colorThief.getColor(imgElement);
        document.querySelector('header').style.backgroundColor = `rgb(${dominantColor})`;
    };
};
