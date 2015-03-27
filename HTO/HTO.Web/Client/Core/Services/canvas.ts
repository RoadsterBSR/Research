module hto.services {
    class Canvas {
        getDataUrl(id: string, removePrefix: boolean): string {
            var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(id);
            var dataURL = canvas.toDataURL("image/png");
            if (removePrefix) {
                dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            }

            return dataURL;
        }
    }

    export var canvas = new Canvas();
}