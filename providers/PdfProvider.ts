import { ViewContract } from '@ioc:Adonis/Core/View'
import { DriveManagerContract } from '@ioc:Adonis/Core/Drive'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import { PdfManager } from '../src/pdf_manager'
import { Format, Unit } from '@nulix/browsershot'

/**
 * Registers pdf with the IoC container
 */
export default class PdfProvider {
  constructor(protected app: ApplicationContract) {}

  /**
   * Register pdf with the container
   */
  protected registerPdf(Drive: DriveManagerContract, View: ViewContract) {
    this.app.container.singleton('Adonis/Addons/Pdf', () => {
      const pdf = new PdfManager(Drive, View)

      return { Format, Unit, Pdf: pdf }
    })
  }

  /**
   * Register edge pdf tags
   */
  protected registerPdfViewGlobal(View: ViewContract) {
    View.global('pageBreak', () => '<div style="page-break-after: always;"></div>')
    View.global('pageNumber', () => '<span class="pageNumber"></span>')
    View.global('totalPages', () => '<span class="totalPages"></span>')
  }

  private registerPdfTags(View: ViewContract) {
    const tags = ['pageBreak', 'pageNumber', 'totalPages']

    for (const tag of tags) {
      View.registerTag({
        block: false,
        tagName: tag,
        seekable: false,
        compile(_, buffer, token) {
          buffer.writeExpression(
            `\n
            out += template.sharedState.${tag}()
            `,
            token.filename,
            token.loc.start.line
          )
        },
      })
    }
  }

  public boot() {
    const Drive = this.app.container.resolveBinding('Adonis/Core/Drive')
    const View = this.app.container.resolveBinding('Adonis/Core/View')

    this.registerPdf(Drive, View)
    this.registerPdfViewGlobal(View)
    this.registerPdfTags(View)
  }
}
