/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('Adding items to cart', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
    });

    test('Verification of Display Accuracy after Adding Random Products to Cart', async ({ inventoryPage, shoppingCartPage }) => {
        const allInventoryItemsList = await inventoryPage.getInventoryItemsList();
        await inventoryPage.addRandomItemsToCart();
        await inventoryPage.shoppingCart.click();
        const allCartItemsList = await shoppingCartPage.getCartItemsList();
        expect(allInventoryItemsList).toEqual(expect.arrayContaining(allCartItemsList));

        // намагався зрозуміти як порівнювати кожну проперті окремо, але не можу заметчити id кожного обʼєкту в різних масивах, буду дуже вдячний якщо зможете підказати як це можна краще зробити, тому поки суворо (===) порівнюю чи міститься один масив в іншому

        // const randomItemsIndexesArray = await inventoryPage.addRandomItemsToCart();
        // for (const i of randomItemsIndexesArray) {
        //     let count = 0;
        //     expect(await allInventoryItemsList[i].name).toEqual(allCartItemsList[count].name);
        //     expect(await allInventoryItemsList[i].description).toEqual(allCartItemsList[count].description);
        //     expect(await allInventoryItemsList[i].price).toEqual(allCartItemsList[count].price);
        //     count++;
        // }
    });
});
