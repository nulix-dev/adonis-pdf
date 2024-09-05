"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfManager = void 0;
const browsershot_1 = require("@nulix/browsershot");
const fake_1 = require("../fake");
/**
 * Pdf manager exposes the API to create pdf files
 */
class PdfManager extends fake_1.FakePdfManager {
    constructor(drive, viewContract) {
        super();
        this.drive = drive;
        this.viewContract = viewContract;
        this._html = '';
        this._noSandbox = true;
        this.viewName = '';
        this.viewData = {};
        this.headerViewName = '';
        this.headerData = {};
        this.footerViewName = '';
        this.footerData = {};
        this.downloadName = '';
        this.isFake = false;
        this.additionalBrowserOptions = {};
        this.fakePDFs = [];
        /**
         * HTTP response headers.
         */
        this.responseHeaders = {
            'Content-Type': 'application/pdf',
        };
    }
    fake() {
        this.isFake = true;
        return this;
    }
    view(view, data = {}) {
        this.viewName = view;
        this.viewData = data;
        return this;
    }
    headerView(view, data = {}) {
        this.headerViewName = view;
        this.headerData = data;
        return this;
    }
    footerView(view, data = {}) {
        this.footerViewName = view;
        this.footerData = data;
        return this;
    }
    landscape() {
        return this.orientation('Landscape');
    }
    portrait() {
        return this.orientation('Portrait');
    }
    orientation(orientation) {
        this._orientation = orientation;
        return this;
    }
    inline(downloadName = '') {
        this.name(downloadName);
        this.addHeaders({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${this.downloadName}"`,
        });
        return this;
    }
    html(html) {
        this._html = html;
        return this;
    }
    headerHtml(html) {
        this._headerHtml = html;
        return this;
    }
    footerHtml(html) {
        this._footerHtml = html;
        return this;
    }
    download(downloadName) {
        this.name(downloadName);
        this.addHeaders({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${this.downloadName}"`,
        });
        return this;
    }
    headers(headers) {
        this.addHeaders(headers);
        return this;
    }
    name(downloadName) {
        if (!downloadName.toLowerCase().endsWith('.pdf')) {
            downloadName += '.pdf';
        }
        this.downloadName = downloadName;
        return this;
    }
    async base64() {
        const browsershotInstance = await this.getBrowsershot();
        if (this.isFake) {
            this.addFakePdf();
            return '';
        }
        return browsershotInstance.base64pdf();
    }
    margins(top = 0, right = 0, bottom = 0, left = 0, unit = browsershot_1.Unit.Millimeter) {
        this._margins = { top, right, bottom, left, unit };
        return this;
    }
    format(format) {
        this._format = format;
        return this;
    }
    withBrowsershot(callback) {
        this.customizeBrowsershot = callback;
        return this;
    }
    async save(path) {
        if (this.diskName) {
            return this.saveOnDisk(this.diskName, path);
        }
        const browsershotInstance = await this.getBrowsershot();
        if (this.isFake) {
            this.addFakePdf();
            return this;
        }
        await browsershotInstance.save(path);
        return this;
    }
    disk(diskName) {
        this.diskName = diskName;
        return this;
    }
    useSandbox() {
        this._noSandbox = false;
        return this;
    }
    setBrowsershotOptions(options) {
        this.additionalBrowserOptions = options;
        return this;
    }
    async saveOnDisk(diskName, path) {
        const browsershotInstance = await this.getBrowsershot();
        if (this.isFake) {
            this.addFakePdf();
            return this;
        }
        const pdfContent = await browsershotInstance.pdf();
        const drive = this.drive.use(diskName);
        await drive.put(path, pdfContent);
        return this;
    }
    async getHtml() {
        if (this.viewName) {
            this._html = await this.viewContract.render(this.viewName, this.viewData);
        }
        if (this._html) {
            return this._html;
        }
        return '&nbsp';
    }
    async getHeaderHtml() {
        if (this.headerViewName) {
            this._headerHtml = await this.viewContract.render(this.headerViewName, this.headerData);
        }
        return this._headerHtml;
    }
    async getFooterHtml() {
        if (this.footerViewName) {
            this._footerHtml = await this.viewContract.render(this.footerViewName, this.footerData);
        }
        return this._footerHtml;
    }
    async getBrowsershot() {
        const html = await this.getHtml();
        const browsershot = browsershot_1.Browsershot.html(html);
        browsershot.showBackground();
        const headerHtml = await this.getHeaderHtml();
        const footerHtml = await this.getFooterHtml();
        if (headerHtml || footerHtml) {
            browsershot.showBrowserHeaderAndFooter();
            if (!headerHtml) {
                browsershot.hideHeader();
            }
            if (!footerHtml) {
                browsershot.hideFooter();
            }
            if (headerHtml) {
                browsershot.headerHtml(headerHtml);
            }
            if (footerHtml) {
                browsershot.footerHtml(footerHtml);
            }
        }
        if (this._margins) {
            browsershot.margins(this._margins.top, this._margins.right, this._margins.bottom, this._margins.left);
        }
        if (this._format) {
            browsershot.format(this._format);
        }
        if (this._orientation === 'Landscape') {
            browsershot.landscape();
        }
        if (!this._noSandbox) {
            browsershot.noSandbox();
        }
        if (Object.keys(this.additionalBrowserOptions).length) {
            const entries = Object.entries(this.additionalBrowserOptions);
            for (const [key, value] of entries) {
                browsershot.setOption(key, value);
            }
        }
        if (this.customizeBrowsershot) {
            this.customizeBrowsershot();
        }
        return browsershot;
    }
    async toResponse(response) {
        if (!this.hasHeader('Content-Disposition')) {
            this.inline(this.downloadName);
        }
        const browsershotInstance = await this.getBrowsershot();
        if (this.isFake) {
            this.addFakePdf();
            return;
        }
        const pdfContent = await browsershotInstance.pdf();
        for (const [key, value] of Object.entries(this.responseHeaders)) {
            response = response.header(key, value);
        }
        return response.send(pdfContent);
    }
    addHeaders(headers) {
        this.responseHeaders = { ...this.responseHeaders, ...headers };
        return this;
    }
    hasHeader(headerName) {
        return this.responseHeaders.hasOwnProperty(headerName);
    }
    isInline() {
        if (!this.hasHeader('Content-Disposition')) {
            return false;
        }
        return this.responseHeaders['Content-Disposition'].includes('inline');
    }
    isDownload() {
        if (!this.hasHeader('Content-Disposition')) {
            return false;
        }
        return this.responseHeaders['Content-Disposition'].includes('attachment');
    }
    addFakePdf(path) {
        this.fakePDFs.push({
            pdf: { ...this },
            path: path ?? null,
        });
    }
}
exports.PdfManager = PdfManager;
