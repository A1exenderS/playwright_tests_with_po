const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('filtering checks', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
    });
});
