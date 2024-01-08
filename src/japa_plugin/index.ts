import { PluginFn } from '@japa/runner'

/**
 * The PDF plugin for Japa
 */
export function assertPdf() {
  const plugin: PluginFn = function () {
    require('./asserts')
  }

  return plugin
}
