declare module '@ioc:Adonis/Addons/Pdf' {
  import { Unit } from '@nulix/browsershot'

  import { DisksList } from '@ioc:Adonis/Core/Drive'
  import { ResponseContract } from '@ioc:Adonis/Core/Response'

  export enum Format {
    Letter = 'letter',
    Legal = 'legal',
    Tabloid = 'tabloid',
    Ledger = 'ledger',
    A0 = 'a0',
    A1 = 'a1',
    A2 = 'a2',
    A3 = 'a3',
    A4 = 'a4',
    A5 = 'a5',
    A6 = 'a6',
  }

  export enum Orientation {
    Portrait = 'Portrait',
    Landscape = 'Landscape',
  }

  export interface FakePdfManagerContract extends PdfManagerContract {
    assertViewIs(viewName: string): boolean

    assertViewHas(key: string, value?: any): boolean

    assertSaved(path: string | ((pdf: FakePdfManagerContract, path: string) => boolean)): boolean

    assertSee(text: string | string[]): boolean

    assertRespondedWithPdf(expectations: (pdf: FakePdfManagerContract) => boolean): boolean
  }

  export interface PdfManagerContract {
    /**
     * The name of the view for the main content.
     */
    viewName: string

    /**
     * Data to be passed to the main view.
     */
    viewData: object

    /**
     * HTML content for the main view.
     */
    _html: string

    /**
     * The name of the view for the header content.
     */
    headerViewName: string

    /**
     * Data to be passed to the header view.
     */
    headerData: object

    /**
     * HTML content for the header view.
     */
    _headerHtml?: string

    /**
     * The name of the view for the footer content.
     */
    footerViewName: string

    /**
     * Data to be passed to the footer view.
     */
    footerData: object

    /**
     * HTML content for the footer view.
     */
    _footerHtml?: string

    /**
     * The name used when downloading the PDF.
     */
    downloadName: string

    /**
     * The format of the PDF.
     */
    _format?: string

    /**
     * The orientation of the PDF.
     */
    _orientation?: string

    /**
     * Margins for the PDF content.
     */
    _margins?: {
      top: number
      right: number
      bottom: number
      left: number
      unit: Unit
    }

    fake(): FakePdfManagerContract

    /**
     * Set the main view and data.
     */
    view(view: string, data?: object): this

    /**
     * Set the header view and data.
     */
    headerView(view: string, data?: object): this

    /**
     * Set the footer view and data.
     */
    footerView(view: string, data?: object): this

    /**
     * Set orientation to landscape.
     */
    landscape(): this

    /**
     * Set orientation to portrait.
     */
    portrait(): this

    /**
     * Set the PDF orientation.
     */
    orientation(orientation: Orientation): this

    /**
     * Set headers for inline PDF display.
     */
    inline(downloadName?: string): this

    /**
     * Set HTML content for the main view.
     */
    html(html: string): this

    /**
     * Set HTML content for the header view.
     */
    headerHtml(html: string): this

    /**
     * Set HTML content for the footer view.
     */
    footerHtml(html: string): this

    /**
     * Set headers for PDF download.
     */
    download(downloadName?: string): this

    /**
     * Add custom headers to the response.
     */
    headers(headers: Record<string, string>): this

    /**
     * Set the download name for the PDF.
     */
    name(downloadName: string): this

    /**
     * Generate base64-encoded PDF.
     */
    base64(): Promise<string>

    /**
     * Set margins for the PDF.
     */
    margins(top?: number, right?: number, bottom?: number, left?: number, unit?: Unit): this

    /**
     * Set the format of the PDF.
     */
    format(format: Format): this

    /**
     * Customize Browsershot using a callback.
     */
    withBrowsershot(callback: () => void): this

    /**
     * Save the PDF to a specified path.
     */
    save(path: string): Promise<this>

    /**
     * Set the disk for storage.
     */
    disk(diskName: DisksList): this

    /**
     * Generate an HTTP response for the PDF.
     */
    toResponse(response: ResponseContract): Promise<void>

    /**
     * Check if the PDF should be displayed inline.
     */
    isInline(): boolean

    /**
     * Check if the PDF should be downloaded.
     */
    isDownload(): boolean
  }

  const Pdf: PdfManagerContract

  export default Pdf
}
