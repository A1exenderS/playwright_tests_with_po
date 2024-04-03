import 'dotenv/config';

const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('filtering checks', () => {
    test.beforeEach(async ({ loginPage }) => {
        const userName = process.env.STANDARD_USER_NAME;
        const password = process.env.PASSWORD;
        await loginPage.navigate();
        await loginPage.performLogin(userName, password);
    });

    test('Perform and verify sorting on the Inventory page (az)', async ({ inventoryPage }) => {
        const defaultList = await inventoryPage.getInventoryItemsList();
        await inventoryPage.performSorting('az');
        const sortedList = await inventoryPage.getInventoryItemsList();
        expect(sortedList).toEqual(defaultList.sort((a, b) => a.name.localeCompare(b.name)));
    });

    test('Perform and verify sorting on the Inventory page (za)', async ({ inventoryPage }) => {
        const defaultList = await inventoryPage.getInventoryItemsList();
        await inventoryPage.performSorting('za');
        const sortedList = await inventoryPage.getInventoryItemsList();
        expect(sortedList).toEqual(defaultList.sort((a, b) => b.name.localeCompare(a.name)));
    });

    test('Perform and verify sorting on the Inventory page (hilo)', async ({ inventoryPage }) => {
        const defaultList = await inventoryPage.getInventoryItemsList();
        await inventoryPage.performSorting('hilo');
        const sortedList = await inventoryPage.getInventoryItemsList();
        expect(sortedList).toEqual(defaultList.sort((a, b) => b.price - a.price));
    });

    test('Perform and verify sorting on the Inventory page (lohi)', async ({ inventoryPage }) => {
        const defaultList = await inventoryPage.getInventoryItemsList();
        await inventoryPage.performSorting('lohi');
        const sortedList = await inventoryPage.getInventoryItemsList();
        expect(sortedList).toEqual(defaultList.sort((a, b) => a.price - b.price));
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
