const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('filtering checks', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
    });

    test('Verification of Display Accuracy after Adding Random Products to Cart', async ({ inventoryPage, shoppingCartPage }) => {
        // EXPERIMENTAL TEST STEPS

        // 1. const allInventoryItemsList = await inventoryPage.getInventoryItemsList()
        // ===> To get list of all items to compare with list after adding items to the cart
        // 2. select 3 random items and AddToCart them
        // ===> Need to create a method to get 3 random elements from the list and with using for..of get them to the cart
        // 3. await inventoryPage.shoppingCart().click()
        // 4. const allCartItemsList = await shoppingCartPage.getCartItemsList()
        // 5. expect(allCartItemsList).toContainEqual(allInventoryItemsList);
    });
});
