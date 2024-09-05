"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("@japa/runner");
runner_1.test.group('Example', () => {
    (0, runner_1.test)('can sum', async ({ assert }) => {
        assert.equal(1 + 1, 2);
    });
});
