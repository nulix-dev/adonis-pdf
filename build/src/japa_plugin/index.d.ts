import { PluginFn } from '@japa/runner';
import { FakePdfManagerContract, PdfManagerContract } from '@ioc:Adonis/Addons/Pdf';
declare module '@japa/assert' {
    interface Assert {
        pdfViewIs(pdf: FakePdfManagerContract, viewName: string): void;
        pdfSaved(pdf: FakePdfManagerContract, path: string | ((pdf: PdfManagerContract, path: string) => boolean)): void;
        pdfViewHas(pdf: FakePdfManagerContract, key: string, value?: any): void;
        pdfSee(pdf: FakePdfManagerContract, text: string | string[]): void;
        respondedWithPdf(pdf: FakePdfManagerContract, expectations: (pdf: PdfManagerContract) => boolean): void;
    }
}
/**
 * The PDF plugin for Japa
 */
export declare function assertPdf(): PluginFn;
