const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('Adding items to cart', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
    });

    test('Proceeding to Checkout, and verifying product details and Total Price accuracy', async ({
        inventoryPage, shoppingCartPage, checkoutStepOnePage, checkoutStepTwoPage,
    }) => {
        const inventoryItemsListData = await inventoryPage.getInventoryItemsList();
        const randomItemsIndexesArray = await inventoryPage.getRandomItemsIndexes();
        await inventoryPage.addRandomItemsToCart(randomItemsIndexesArray);
        await inventoryPage.shoppingCart.click();
        await shoppingCartPage.checkoutButton.click();
        await checkoutStepOnePage.fillAndConfirmCheckoutStepOne('Ssssss', 'Sssssss', '45674');
        const allCheckoutItemsList = await checkoutStepTwoPage.getCheckoutItemsList();
        expect(inventoryItemsListData).toEqual(expect.arrayContaining(allCheckoutItemsList));
        await expect(checkoutStepTwoPage.summaryInfo).toBeVisible();
        const priceTotal = await checkoutStepTwoPage.getPriceTotal();
        const calculatedTotalPrice = await checkoutStepTwoPage
            .calculateTotalPrice(inventoryItemsListData, randomItemsIndexesArray);
        expect(priceTotal).toEqual(calculatedTotalPrice);
    });

    test('Proceeding to Checkout, and verifying product details and Total Price accuracy v2', async ({
        inventoryPage, shoppingCartPage, checkoutStepOnePage, checkoutStepTwoPage,
    }) => {
        const inventoryItemsListData = await inventoryPage.getInventoryItemsList();
        const randomItemsIndexesArray = await inventoryPage.getRandomItemsIndexes();
        await inventoryPage.addRandomItemsToCart(randomItemsIndexesArray);
        await inventoryPage.shoppingCart.click();
        await shoppingCartPage.checkoutButton.click();
        await checkoutStepOnePage.fillAndConfirmCheckoutStepOne('Ssssss', 'Sssssss', '45674');
        const checkoutItemsListData = await checkoutStepTwoPage.getCheckoutItemsList();
        for (const i of randomItemsIndexesArray) {
            const k = randomItemsIndexesArray.indexOf(i);
            expect(await inventoryItemsListData[i].name).toEqual(checkoutItemsListData[k].name);
            expect(await inventoryItemsListData[i].description).toEqual(checkoutItemsListData[k].description);
            expect(await inventoryItemsListData[i].price).toEqual(checkoutItemsListData[k].price);
        }
        await expect(checkoutStepTwoPage.summaryInfo).toBeVisible();
        const priceTotal = await checkoutStepTwoPage.getPriceTotal();
        // це наче також змінив, бо я беру ціни елементів котрі додаю з inventoryPage, і порівнюю їх з priceTotal, котрий відображається на сторінці
        const calculatedTotalPrice = await checkoutStepTwoPage
            .calculateTotalPrice(inventoryItemsListData, randomItemsIndexesArray);
        expect(priceTotal).toEqual(calculatedTotalPrice);
    });
});
