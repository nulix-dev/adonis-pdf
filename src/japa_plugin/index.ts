import { Assert } from '@japa/assert'
import { PluginFn } from '@japa/runner'

import { FakePdfManagerContract, PdfManagerContract } from '@ioc:Adonis/Addons/Pdf'

declare module '@japa/assert' {
  interface Assert {
    pdfViewIs(pdf: FakePdfManagerContract, viewName: string): void

    pdfSaved(
      pdf: FakePdfManagerContract,
      path: string | ((pdf: PdfManagerContract, path: string) => boolean)
    ): void

    pdfViewHas(pdf: FakePdfManagerContract, key: string, value?: any): void

    pdfSee(pdf: FakePdfManagerContract, text: string | string[]): void

    respondedWithPdf(
      pdf: FakePdfManagerContract,
      expectations: (pdf: PdfManagerContract) => boolean
    ): void
  }
}

/**
 * The PDF plugin for Japa
 */
export function assertPdf() {
  const plugin: PluginFn = function () {
    Assert.macro('pdfViewIs', function (pdf: FakePdfManagerContract, viewName: string) {
      this.incrementAssertionsCount()

      this.isTrue(pdf.assertViewIs(viewName))
    })

    Assert.macro(
      'pdfSaved',
      function (
        pdf: FakePdfManagerContract,
        path: string | ((pdf: PdfManagerContract, path: string) => boolean)
      ) {
        this.incrementAssertionsCount()

        this.isTrue(pdf.assertSaved(path))
      }
    )

    Assert.macro('pdfViewHas', function (pdf: FakePdfManagerContract, key: string, value?: any) {
      this.incrementAssertionsCount()

      this.isTrue(pdf.assertViewHas(key, value))
    })

    Assert.macro('pdfSee', function (pdf: FakePdfManagerContract, text: string | string[]) {
      this.incrementAssertionsCount()

      this.isTrue(pdf.assertSee(text))
    })

    Assert.macro(
      'respondedWithPdf',
      function (pdf: FakePdfManagerContract, expectations: (pdf: PdfManagerContract) => boolean) {
        this.incrementAssertionsCount()

        this.isTrue(pdf.assertRespondedWithPdf(expectations))
      }
    )
  }

  return plugin
}
