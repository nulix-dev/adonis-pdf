import { Browsershot, Unit, Format } from '@nulix/browsershot'

import { ViewContract } from '@ioc:Adonis/Core/View'
import { PdfManagerContract } from '@ioc:Adonis/Addons/Pdf'
import { ResponseContract } from '@ioc:Adonis/Core/Response'
import { DisksList, DriveManagerContract } from '@ioc:Adonis/Core/Drive'

/**
 * Pdf manager exposes the API to create pdf files
 */
export class PdfManager implements PdfManagerContract {
  public _html: string = ''
  public _headerHtml?: string
  public _footerHtml?: string
  public _format?: Format
  public _orientation?: 'Landscape' | 'Portrait'
  public _margins?: {
    top: number
    right: number
    bottom: number
    left: number
    unit: Unit
  }

  public viewName: string = ''
  public viewData: object = {}
  public headerViewName: string = ''
  public headerData: object = {}
  public footerViewName: string = ''
  public footerData: object = {}
  public downloadName: string = ''

  /**
   * Callback function to customize Browsershot.
   */
  protected customizeBrowsershot: () => void

  /**
   * HTTP response headers.
   */
  protected responseHeaders: Record<string, string> = {
    'Content-Type': 'application/pdf',
  }

  /**
   * Name of the disk for storage.
   */
  protected diskName: keyof DisksList

  constructor(private drive: DriveManagerContract, private viewContract: ViewContract) {}

  public fake() {
    const { FakePdfManager } = require('../fake/index')

    return new FakePdfManager(this.drive, this.viewContract)
  }

  public view(view: string, data: object = {}) {
    this.viewName = view
    this.viewData = data

    return this
  }

  public headerView(view: string, data: object = {}) {
    this.headerViewName = view
    this.headerData = data

    return this
  }

  public footerView(view: string, data: object = {}) {
    this.footerViewName = view
    this.footerData = data

    return this
  }

  public landscape() {
    return this.orientation('Landscape')
  }

  public portrait() {
    return this.orientation('Portrait')
  }

  public orientation(orientation: 'Landscape' | 'Portrait') {
    this._orientation = orientation

    return this
  }

  public inline(downloadName: string = '') {
    this.name(downloadName)
    this.addHeaders({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${this.downloadName}"`,
    })

    return this
  }

  public html(html: string) {
    this._html = html

    return this
  }

  public headerHtml(html: string) {
    this._headerHtml = html

    return this
  }

  public footerHtml(html: string) {
    this._footerHtml = html

    return this
  }

  public download(downloadName: string) {
    this.name(downloadName)
    this.addHeaders({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${this.downloadName}"`,
    })

    return this
  }

  public headers(headers: Record<string, string>) {
    this.addHeaders(headers)

    return this
  }

  public name(downloadName: string) {
    if (!downloadName.toLowerCase().endsWith('.pdf')) {
      downloadName += '.pdf'
    }

    this.downloadName = downloadName

    return this
  }

  public async base64() {
    const browsershotInstance = await this.getBrowsershot()

    return browsershotInstance.base64pdf()
  }

  public margins(
    top: number = 0,
    right: number = 0,
    bottom: number = 0,
    left: number = 0,
    unit = Unit.Millimeter
  ) {
    this._margins = { top, right, bottom, left, unit }

    return this
  }

  public format(format: Format) {
    this._format = format

    return this
  }

  public withBrowsershot(callback: () => void) {
    this.customizeBrowsershot = callback

    return this
  }

  public async save(path: string) {
    if (this.diskName) {
      return this.saveOnDisk(this.diskName, path)
    }

    const browsershotInstance = await this.getBrowsershot()

    await browsershotInstance.save(path)

    return this
  }

  public disk(diskName: keyof DisksList) {
    this.diskName = diskName

    return this
  }

  protected async saveOnDisk(diskName: keyof DisksList, path: string) {
    const browsershotInstance = await this.getBrowsershot()

    const pdfContent = await browsershotInstance.pdf()

    const drive = this.drive.use(diskName) as DriveManagerContract

    await drive.put(path, pdfContent)

    return this
  }

  protected async getHtml() {
    if (this.viewName) {
      this._html = await this.viewContract.render(this.viewName, this.viewData)
    }

    if (this._html) {
      return this._html
    }

    return '&nbsp'
  }

  protected async getHeaderHtml() {
    if (this.headerViewName) {
      this._headerHtml = await this.viewContract.render(this.headerViewName, this.headerData)
    }

    return this._headerHtml
  }

  protected async getFooterHtml() {
    if (this.footerViewName) {
      this._footerHtml = await this.viewContract.render(this.footerViewName, this.footerData)
    }

    return this._footerHtml
  }

  protected async getBrowsershot() {
    const html = await this.getHtml()

    const browsershot = Browsershot.html(html)

    browsershot.showBackground()

    const headerHtml = await this.getHeaderHtml()
    const footerHtml = await this.getFooterHtml()

    if (headerHtml || footerHtml) {
      browsershot.showBrowserHeaderAndFooter()

      if (!headerHtml) {
        browsershot.hideHeader()
      }

      if (!footerHtml) {
        browsershot.hideFooter()
      }

      if (headerHtml) {
        browsershot.headerHtml(headerHtml)
      }

      if (footerHtml) {
        browsershot.footerHtml(footerHtml)
      }
    }

    if (this._margins) {
      browsershot.margins(
        this._margins.top,
        this._margins.right,
        this._margins.bottom,
        this._margins.left
      )
    }

    if (this._format) {
      browsershot.format(this._format)
    }

    if (this._orientation === 'Landscape') {
      browsershot.landscape()
    }

    if (this.customizeBrowsershot) {
      this.customizeBrowsershot()
    }

    return browsershot
  }

  public async toResponse(response: ResponseContract) {
    if (!this.hasHeader('Content-Disposition')) {
      this.inline(this.downloadName)
    }

    const browsershotInstance = await this.getBrowsershot()

    const pdfContent = await browsershotInstance.pdf()

    for (const [key, value] of Object.entries(this.responseHeaders)) {
      response = response.header(key, value)
    }

    return response.send(pdfContent)
  }

  protected addHeaders(headers: Record<string, string>) {
    this.responseHeaders = { ...this.responseHeaders, ...headers }

    return this
  }

  protected hasHeader(headerName: string) {
    return this.responseHeaders.hasOwnProperty(headerName)
  }

  public isInline() {
    if (!this.hasHeader('Content-Disposition')) {
      return false
    }

    return this.responseHeaders['Content-Disposition'].includes('inline')
  }

  public isDownload() {
    if (!this.hasHeader('Content-Disposition')) {
      return false
    }

    return this.responseHeaders['Content-Disposition'].includes('attachment')
  }
}
