const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('filtering checks', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
    });

    test('Verification of Display Accuracy after Adding Random Products to Cart', async ({ inventoryPage, shoppingCartPage }) => {
        const allInventoryItemsList = await inventoryPage.getInventoryItemsList();
        const amount = 3;
        await inventoryPage.addRandomItemsToCart(amount);
        await inventoryPage.shoppingCart.click();
        const allCartItemsList = await shoppingCartPage.getCartItemsList();
        // expect(allCartItemsList).toMatch(allInventoryItemsList);

        const correctnessCheck = allCartItemsList.every((element) => allInventoryItemsList.includes(element));
        expect(correctnessCheck).toBe(true);
    });
});
