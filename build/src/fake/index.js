"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakePdfManager = void 0;
/**
 * An implementation of the fake Pdf
 */
class FakePdfManager {
    constructor() {
        this.fakePDFs = [];
    }
    assertViewIs(viewName) {
        for (const savedPdf of this.fakePDFs) {
            if (savedPdf.pdf.viewName === viewName) {
                return true;
            }
        }
        throw new Error(`Did not save a PDF that uses view '${viewName}'`);
    }
    assertViewHas(key, value) {
        if (value === undefined) {
            for (const savedPdf of this.fakePDFs) {
                if (key in savedPdf.pdf.viewData) {
                    return true;
                }
            }
            throw new Error(`Did not save a PDF that has view data '${key}'`);
        }
        for (const savedPdf of this.fakePDFs) {
            if (key in savedPdf.pdf.viewData && savedPdf.pdf.viewData[key] === value) {
                return true;
            }
        }
        throw new Error(`Did not save a PDF that has view data '${key}' with value '${value}'`);
    }
    assertSaved(path) {
        if (typeof path === 'string') {
            for (const savedPdf of this.fakePDFs) {
                if (savedPdf.path === path) {
                    return true;
                }
            }
            throw new Error(`Did not save a PDF to '${path}'`);
        }
        const callable = path;
        for (const savedPdf of this.fakePDFs) {
            const result = callable(savedPdf.pdf, savedPdf.path);
            if (result === true) {
                return true;
            }
        }
        throw new Error('Did not save a PDF that matched the expectations');
    }
    assertSee(text) {
        const texts = Array.isArray(text) ? text : [text];
        for (const savedPdf of this.fakePDFs) {
            let containsAll = true;
            for (const singleText of texts) {
                if (!savedPdf.pdf._html.includes(singleText)) {
                    containsAll = false;
                    break;
                }
            }
            if (containsAll) {
                return true;
            }
        }
        const formattedTexts = texts.map((t) => `'${t}'`).join(', and ');
        throw new Error(`Did not save a PDF that contains ${formattedTexts}`);
    }
    assertRespondedWithPdf(expectations) {
        if (this.fakePDFs.length === 0) {
            throw new Error('Did not respond with a PDF');
        }
        for (const { pdf } of this.fakePDFs) {
            const result = expectations(pdf);
            if (result === true) {
                return true;
            }
        }
        throw new Error('Did not respond with a PDF that matched the expectations');
    }
}
exports.FakePdfManager = FakePdfManager;
