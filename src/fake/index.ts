import { ResponseContract } from '@ioc:Adonis/Core/Response'
import { FakePdfManagerContract } from '@ioc:Adonis/Addons/Pdf'

import { PdfManager } from '../pdf_manager'

/**
 * An implementation of the fake Pdf
 */
export class FakePdfManager extends PdfManager implements FakePdfManagerContract {
  protected respondedWithPdf: FakePdfManagerContract[] = []
  protected savedPdfs: { pdf: FakePdfManagerContract; path: string }[] = []

  public async save(path: string) {
    this.getBrowsershot()

    this.savedPdfs.push({
      pdf: { ...this },
      path,
    })

    return this
  }

  public async toResponse(_response: ResponseContract) {
    this.respondedWithPdf.push({ ...this }) // Clone the PdfBuilder

    return
  }

  public assertViewIs(viewName: string) {
    for (const savedPdf of this.savedPdfs) {
      if (savedPdf.pdf.viewName === viewName) {
        return true
      }
    }

    throw new Error(`Did not save a PDF that uses view '${viewName}'`)
  }

  public assertViewHas(key: string, value?: any) {
    if (value === undefined) {
      for (const savedPdf of this.savedPdfs) {
        if (key in savedPdf.pdf.viewData) {
          return true
        }
      }

      throw new Error(`Did not save a PDF that has view data '${key}'`)
    }

    for (const savedPdf of this.savedPdfs) {
      if (key in savedPdf.pdf.viewData && savedPdf.pdf.viewData[key] === value) {
        return true
      }
    }

    throw new Error(`Did not save a PDF that has view data '${key}' with value '${value}'`)
  }

  public assertSaved(path: string | ((pdf: FakePdfManagerContract, path: string) => boolean)) {
    if (typeof path === 'string') {
      for (const savedPdf of this.savedPdfs) {
        if (savedPdf.path === path) {
          return true
        }
      }

      throw new Error(`Did not save a PDF to '${path}'`)
    }

    const callable = path
    for (const savedPdf of this.savedPdfs) {
      const result = callable(savedPdf.pdf, savedPdf.path)

      if (result === true) {
        return true
      }
    }

    throw new Error('Did not save a PDF that matched the expectations')
  }

  public assertSee(text: string | string[]) {
    const texts = Array.isArray(text) ? text : [text]

    for (const savedPdf of this.savedPdfs) {
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

  public assertRespondedWithPdf(expectations: (pdf: FakePdfManagerContract) => boolean) {
    if (this.respondedWithPdf.length === 0) {
      throw new Error('Did not respond with a PDF')
    }

    for (const pdf of this.respondedWithPdf) {
      const result = expectations(pdf)

      if (result === true) {
        return true
      }
    }

    throw new Error('Did not respond with a PDF that matched the expectations')
  }
}
