"use strict";
/// <reference path="../adonis-typings/pdf.ts" />
/// <reference path="./japa_plugin/index.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPdf = void 0;
const PdfProvider_1 = __importDefault(require("../providers/PdfProvider"));
var japa_plugin_1 = require("./japa_plugin");
Object.defineProperty(exports, "assertPdf", { enumerable: true, get: function () { return japa_plugin_1.assertPdf; } });
exports.default = PdfProvider_1.default;
