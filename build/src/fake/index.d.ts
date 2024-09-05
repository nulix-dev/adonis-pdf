import { FakePdfManagerContract, PdfManagerContract } from '@ioc:Adonis/Addons/Pdf';
/**
 * An implementation of the fake Pdf
 */
export declare class FakePdfManager implements FakePdfManagerContract {
    protected fakePDFs: {
        pdf: PdfManagerContract;
        path: string | null;
    }[];
    assertViewIs(viewName: string): boolean;
    assertViewHas(key: string, value?: any): boolean;
    assertSaved(path: string | ((pdf: PdfManagerContract, path: string) => boolean)): boolean;
    assertSee(text: string | string[]): boolean;
    assertRespondedWithPdf(expectations: (pdf: PdfManagerContract) => boolean): boolean;
}
