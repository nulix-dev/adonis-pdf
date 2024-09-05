"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPdf = void 0;
const assert_1 = require("@japa/assert");
/**
 * The PDF plugin for Japa
 */
function assertPdf() {
    const plugin = function () {
        assert_1.Assert.macro('pdfViewIs', function (pdf, viewName) {
            this.incrementAssertionsCount();
            this.isTrue(pdf.assertViewIs(viewName));
        });
        assert_1.Assert.macro('pdfSaved', function (pdf, path) {
            this.incrementAssertionsCount();
            this.isTrue(pdf.assertSaved(path));
        });
        assert_1.Assert.macro('pdfViewHas', function (pdf, key, value) {
            this.incrementAssertionsCount();
            this.isTrue(pdf.assertViewHas(key, value));
        });
        assert_1.Assert.macro('pdfSee', function (pdf, text) {
            this.incrementAssertionsCount();
            this.isTrue(pdf.assertSee(text));
        });
        assert_1.Assert.macro('respondedWithPdf', function (pdf, expectations) {
            this.incrementAssertionsCount();
            this.isTrue(pdf.assertRespondedWithPdf(expectations));
        });
    };
    return plugin;
}
exports.assertPdf = assertPdf;
