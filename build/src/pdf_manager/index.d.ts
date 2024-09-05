/// <reference types="@adonisjs/drive/build/adonis-typings" />
/// <reference types="@adonisjs/view" />
/// <reference types="@adonisjs/http-server/build/adonis-typings" />
/// <reference types="node" />
import { Browsershot, Unit, Format, BrowserCommandOptions } from '@nulix/browsershot';
import { ViewContract } from '@ioc:Adonis/Core/View';
import { PdfManagerContract } from '@ioc:Adonis/Addons/Pdf';
import { ResponseContract } from '@ioc:Adonis/Core/Response';
import { DisksList, DriveManagerContract } from '@ioc:Adonis/Core/Drive';
import { FakePdfManager } from '../fake';
/**
 * Pdf manager exposes the API to create pdf files
 */
export declare class PdfManager extends FakePdfManager implements PdfManagerContract {
    private drive;
    private viewContract;
    _html: string;
    _headerHtml?: string;
    _footerHtml?: string;
    _format?: Format;
    _orientation?: 'Landscape' | 'Portrait';
    _margins?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
        unit: Unit;
    };
    _noSandbox: boolean;
    viewName: string;
    viewData: object;
    headerViewName: string;
    headerData: object;
    footerViewName: string;
    footerData: object;
    downloadName: string;
    isFake: boolean;
    additionalBrowserOptions: Partial<BrowserCommandOptions>;
    protected fakePDFs: {
        pdf: PdfManagerContract;
        path: string | null;
    }[];
    /**
     * Callback function to customize Browsershot.
     */
    protected customizeBrowsershot: () => void;
    /**
     * HTTP response headers.
     */
    protected responseHeaders: Record<string, string>;
    /**
     * Name of the disk for storage.
     */
    protected diskName: keyof DisksList;
    constructor(drive: DriveManagerContract, viewContract: ViewContract);
    fake(): this;
    view(view: string, data?: object): this;
    headerView(view: string, data?: object): this;
    footerView(view: string, data?: object): this;
    landscape(): this;
    portrait(): this;
    orientation(orientation: 'Landscape' | 'Portrait'): this;
    inline(downloadName?: string): this;
    html(html: string): this;
    headerHtml(html: string): this;
    footerHtml(html: string): this;
    download(downloadName: string): this;
    headers(headers: Record<string, string>): this;
    name(downloadName: string): this;
    base64(): Promise<string>;
    margins(top?: number, right?: number, bottom?: number, left?: number, unit?: Unit): this;
    format(format: Format): this;
    withBrowsershot(callback: () => void): this;
    save(path: string): Promise<this>;
    disk(diskName: keyof DisksList): this;
    useSandbox(): this;
    setBrowsershotOptions(options: Partial<BrowserCommandOptions>): this;
    protected saveOnDisk(diskName: keyof DisksList, path: string): Promise<this>;
    protected getHtml(): Promise<string>;
    protected getHeaderHtml(): Promise<string | undefined>;
    protected getFooterHtml(): Promise<string | undefined>;
    protected getBrowsershot(): Promise<Browsershot>;
    toResponse(response: ResponseContract): Promise<void>;
    buffer(): Promise<Buffer | undefined>;
    protected addHeaders(headers: Record<string, string>): this;
    protected hasHeader(headerName: string): boolean;
    isInline(): boolean;
    isDownload(): boolean;
    protected addFakePdf(path?: string): void;
}
