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
    });

    // це друга варіація тесту, з порівнянням проперті кожного обʼякта окремо, проперті вдається отримати, проте не можу зрозуміти як зметчики проперті обьектів з allInventoryItemsList з індексом рандомно додатого айтему, та айтемом, котрий відображаʼється на cartPage

    // тест не працює

    // test('Verification of Display Accuracy after Adding Random Products to Cart v2', async ({ inventoryPage, shoppingCartPage }) => {
    //     const allInventoryItemsList = await inventoryPage.getInventoryItemsList();
    //     await inventoryPage.addRandomItemsToCart();
    //     const randomItemsIndexesArray = await inventoryPage.selectRandomAddToCartButtons();
    //     await inventoryPage.shoppingCart.click();
    //     const allCartItemsList = await shoppingCartPage.getCartItemsList();
    //     for (const i of randomItemsIndexesArray) {
    //         let count = 0;
    //         expect(await allInventoryItemsList[i].name).toEqual(allCartItemsList[count].name);
    //         expect(await allInventoryItemsList[i].description).toEqual(allCartItemsList[count].description);
    //         expect(await allInventoryItemsList[i].price).toEqual(allCartItemsList[count].price);
    //         count++;
    //     }
    // });
});
