import { Assert } from '@japa/assert'
import { FakePdfManagerContract } from '@ioc:Adonis/Addons/Pdf'

declare module '@japa/assert' {
  interface Assert {
    pdfViewIs(pdf: FakePdfManagerContract, viewName: string): void
  }
}

Assert.macro('pdfViewIs', function (pdf: FakePdfManagerContract, viewName: string) {
  this.incrementAssertionsCount()

  this.isTrue(pdf.assertViewIs(viewName))
})
