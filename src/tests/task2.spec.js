const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('Adding items to cart', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
    });

    test('Verification of Display Accuracy after Adding Random Products to Cart', async ({ inventoryPage, shoppingCartPage }) => {
        const allInventoryItemsList = await inventoryPage.getInventoryItemsList();
        const randomItemsIndexesArray = await inventoryPage.getRandomItemsIndexes();
        await inventoryPage.addRandomItemsToCart(randomItemsIndexesArray);
        await inventoryPage.shoppingCart.click();
        const allCartItemsList = await shoppingCartPage.getCartItemsList();
        expect(allInventoryItemsList).toEqual(expect.arrayContaining(allCartItemsList));
    });

    test('Verification of Display Accuracy after Adding Random Products to Cart v2', async ({ inventoryPage, shoppingCartPage }) => {
        const allInventoryItemsList = await inventoryPage.getInventoryItemsList();
        const randomItemsIndexesArray = await inventoryPage.getRandomItemsIndexes();
        // const selectedItemsData = await inventoryPage.getRandomItemsData(randomItemsIndexesArray);
        await inventoryPage.addRandomItemsToCart(randomItemsIndexesArray);
        await inventoryPage.shoppingCart.click();
        const cartItemsListData = await shoppingCartPage.getCartItemsList();
        // тут виходить, що я кожну проперті доданого айтему, порівнюю з поперті айтему масиву усих елементів, тому наче має бути норм
        for (const i of randomItemsIndexesArray) {
            const k = randomItemsIndexesArray.indexOf(i);
            expect(await allInventoryItemsList[i].name).toEqual(cartItemsListData[k].name);
            expect(await allInventoryItemsList[i].description).toEqual(cartItemsListData[k].description);
            expect(await allInventoryItemsList[i].price).toEqual(cartItemsListData[k].price);
        }
    });
});
