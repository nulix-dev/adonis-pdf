import { FakePdfManagerContract, PdfManagerContract } from '@ioc:Adonis/Addons/Pdf'

/**
 * An implementation of the fake Pdf
 */
export class FakePdfManager implements FakePdfManagerContract {
  protected fakePDFs: { pdf: PdfManagerContract; path: string | null }[] = []

  public assertViewIs(viewName: string) {
    for (const savedPdf of this.fakePDFs) {
      if (savedPdf.pdf.viewName === viewName) {
        return true
      }
    }

    throw new Error(`Did not save a PDF that uses view '${viewName}'`)
  }

  public assertViewHas(key: string, value?: any) {
    if (value === undefined) {
      for (const savedPdf of this.fakePDFs) {
        if (key in savedPdf.pdf.viewData) {
          return true
        }
      }

      throw new Error(`Did not save a PDF that has view data '${key}'`)
    }

    for (const savedPdf of this.fakePDFs) {
      if (key in savedPdf.pdf.viewData && savedPdf.pdf.viewData[key] === value) {
        return true
      }
    }

    throw new Error(`Did not save a PDF that has view data '${key}' with value '${value}'`)
  }

  public assertSaved(path: string | ((pdf: PdfManagerContract, path: string) => boolean)) {
    if (typeof path === 'string') {
      for (const savedPdf of this.fakePDFs) {
        if (savedPdf.path === path) {
          return true
        }
      }

      throw new Error(`Did not save a PDF to '${path}'`)
    }

    const callable = path
    for (const savedPdf of this.fakePDFs) {
      const result = callable(savedPdf.pdf, savedPdf.path!)

      if (result === true) {
        return true
      }
    }

    throw new Error('Did not save a PDF that matched the expectations')
  }

  public assertSee(text: string | string[]) {
    const texts = Array.isArray(text) ? text : [text]

    for (const savedPdf of this.fakePDFs) {
      let containsAll = true
      for (const singleText of texts) {
        if (!savedPdf.pdf._html.includes(singleText)) {
          containsAll = false
          break
        }
      }

      if (containsAll) {
        return true
      }
    }

    const formattedTexts = texts.map((t) => `'${t}'`).join(', and ')
    throw new Error(`Did not save a PDF that contains ${formattedTexts}`)
  }

  public assertRespondedWithPdf(expectations: (pdf: PdfManagerContract) => boolean) {
    if (this.fakePDFs.length === 0) {
      throw new Error('Did not respond with a PDF')
    }

    for (const { pdf } of this.fakePDFs) {
      const result = expectations(pdf)

      if (result === true) {
        return true
      }
    }

    throw new Error('Did not respond with a PDF that matched the expectations')
  }
}
