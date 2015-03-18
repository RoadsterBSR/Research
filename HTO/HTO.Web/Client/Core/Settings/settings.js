/// <reference path="../zvdz.js" />

(function (hto) {
    "use strict";
    
    // Contains settings used throughout the whole application.

    var urls =  {
        desktopTemplate: "/Client/Desktop/desktop.html",
        getDesktopData: "/Desktop/GetDesktopData",
        stubService: "/StubService/HandleRequest"
    };

    var handlers = {
        getBasisDashboardData: {
            stubDataHandler: "ZvdZOnline.Web.Controllers.StubDataHandlers.BasisDashboard.GetData",
            url: urls.getBasisDashboardData
        }
    };

    zvdz.settings = {
        handlers: handlers,
        urls: urls,
        useAntiForgeryToken: true /* When turned on, all postdata will use an anti forgery token. */
    };
}(zvdz));