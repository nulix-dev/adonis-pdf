import { test } from '@japa/runner'

test.group('Example', () => {
  test('can sum', async ({ assert }) => {
    assert.equal(1 + 1, 2)
  })
})
