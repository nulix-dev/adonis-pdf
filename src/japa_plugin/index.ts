import { Assert } from '@japa/assert'
import { PluginFn } from '@japa/runner'

import { PdfManagerContract, Pdf } from '@ioc:Adonis/Addons/Pdf'

declare module '@japa/assert' {
  interface Assert {
    pdfViewIs(viewName: string): void

    pdfSaved(path: string | ((pdf: PdfManagerContract, path: string) => boolean)): void

    pdfViewHas(key: string, value?: any): void

    pdfSee(text: string | string[]): void

    respondedWithPdf(expectations: (pdf: PdfManagerContract) => boolean): void
  }
}

/**
 * The PDF plugin for Japa
 */
export function assertPdf() {
  const plugin: PluginFn = function () {
    Assert.macro('pdfViewIs', function (viewName: string) {
      this.incrementAssertionsCount()

      this.isTrue(Pdf.assertViewIs(viewName))
    })

    Assert.macro(
      'pdfSaved',
      function (path: string | ((pdf: PdfManagerContract, path: string) => boolean)) {
        this.incrementAssertionsCount()

        this.isTrue(Pdf.assertSaved(path))
      }
    )

    Assert.macro('pdfViewHas', function (key: string, value?: any) {
      this.incrementAssertionsCount()

      this.isTrue(Pdf.assertViewHas(key, value))
    })

    Assert.macro('pdfSee', function (text: string | string[]) {
      this.incrementAssertionsCount()

      this.isTrue(Pdf.assertSee(text))
    })

    Assert.macro('respondedWithPdf', function (expectations: (pdf: PdfManagerContract) => boolean) {
      this.incrementAssertionsCount()

      this.isTrue(Pdf.assertRespondedWithPdf(expectations))
    })
  }

  return plugin
}
