# Create PDFs in AdonisJS apps

[![Latest Version](https://img.shields.io/github/release/nulix-dev/adonis-pdf.svg?style=flat-square)](https://github.com/nulix-dev/adonis-pdf/releases)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![run-tests](https://img.shields.io/github/actions/workflow/status/nulix-dev/adonis-pdf/test.yml?label=tests&style=flat-square)](https://github.com/nulix-dev/adonis-pdf/actions)

> **Note**
>
> This package is a AdonisJS version of the Laravel package [spatie/laravel-pdf](https://github.com/spatie/laravel-pdf).

This package provides a simple way to create PDFs in AdonisJS apps. Under the hood it uses [Chromium](https://www.chromium.org/chromium-projects/) to generate PDFs from EdgeJS views. You can use modern CSS features like grid and flexbox to create beautiful PDFs.

```bash
npm i @nulix/adonis-pdf

node ace @nulix/adonis-pdf
```

Here's a quick example:

```ts
import { Pdf, Format } from "@ioc:Adonis/Addons/Pdf"

Pdf.view('pdfs.invoice', { invoice })
    .format(Format.A4)
    .save('invoice.pdf')
```

This will render the Edge view `pdfs.invoice` with the given data and save it as a PDF file.

You can also return the PDF as a response from your controller:

```ts
import { Pdf, Format } from "@ioc:Adonis/Addons/Pdf"
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Invoice from "App/Models/Invoice"

class DownloadInvoiceController
{
    public function download({ response }: HttpContextContract)
    {
        const invoice = Invoice.first()

        return Pdf.view('pdfs.invoice', { invoice })
            .name('your-invoice.pdf')
            .format(Format.A4)
            .toResponse(response);
    }
}
```

You can use also test your PDFs:

First you have to register it as a plugin within the entry point file, i.e. (test/bootstrap.ts)

```ts
import { assertPdf } from '@nulix/adonis-pdf'

export const plugins: Required<Config>['plugins'] = [assert(), runFailedTests(), apiClient(), assertPdf()]
```

Then, you can use the new assert functions inside your tests:

```ts
import { test } from "@japa/core"

import { Pdf } from "@ioc:Adonis/Addons/Pdf"

test('can render an invoice', async ({ client, assert }) => {
  const pdf = Pdf.fake();

  const response = await client.get('/')

  response.assertStatus(200)
  assert.pdfViewIs(pdf, 'home')
})

```

## Documentation

All documentation is available [on our documentation site](https://example.com).

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
