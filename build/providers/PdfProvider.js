"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_manager_1 = require("../src/pdf_manager");
const browsershot_1 = require("@nulix/browsershot");
/**
 * Registers pdf with the IoC container
 */
class PdfProvider {
    constructor(app) {
        this.app = app;
    }
    /**
     * Register pdf with the container
     */
    registerPdf(Drive, View) {
        this.app.container.singleton('Adonis/Addons/Pdf', () => {
            const pdf = new pdf_manager_1.PdfManager(Drive, View);
            return { Format: browsershot_1.Format, Unit: browsershot_1.Unit, Pdf: pdf };
        });
    }
    /**
     * Register edge pdf tags
     */
    registerPdfViewGlobal(View) {
        View.global('pageBreak', () => '<div style="page-break-after: always;"></div>');
        View.global('pageNumber', () => '<span class="pageNumber"></span>');
        View.global('totalPages', () => '<span class="totalPages"></span>');
    }
    registerPdfTags(View) {
        const tags = ['pageBreak', 'pageNumber', 'totalPages'];
        for (const tag of tags) {
            View.registerTag({
                block: false,
                tagName: tag,
                seekable: false,
                compile(_, buffer, token) {
                    buffer.writeExpression(`\n
            out += template.sharedState.${tag}()
            `, token.filename, token.loc.start.line);
                },
            });
        }
    }
    boot() {
        const Drive = this.app.container.resolveBinding('Adonis/Core/Drive');
        const View = this.app.container.resolveBinding('Adonis/Core/View');
        this.registerPdf(Drive, View);
        this.registerPdfViewGlobal(View);
        this.registerPdfTags(View);
    }
}
exports.default = PdfProvider;
