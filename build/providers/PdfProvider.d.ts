/// <reference types="@adonisjs/application/build/adonis-typings" />
/// <reference types="@adonisjs/drive/build/adonis-typings" />
/// <reference types="@adonisjs/view" />
import { ViewContract } from '@ioc:Adonis/Core/View';
import { DriveManagerContract } from '@ioc:Adonis/Core/Drive';
import { ApplicationContract } from '@ioc:Adonis/Core/Application';
/**
 * Registers pdf with the IoC container
 */
export default class PdfProvider {
    protected app: ApplicationContract;
    constructor(app: ApplicationContract);
    /**
     * Register pdf with the container
     */
    protected registerPdf(Drive: DriveManagerContract, View: ViewContract): void;
    /**
     * Register edge pdf tags
     */
    protected registerPdfViewGlobal(View: ViewContract): void;
    private registerPdfTags;
    boot(): void;
}
