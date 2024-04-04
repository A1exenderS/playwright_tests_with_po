import { getUserCredentials, performDefaultListSorting } from '../HelperFunctions.util';
import 'dotenv/config';

const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('', () => {
    test.beforeEach(async ({ loginPage }) => {
        const user = getUserCredentials('STANDARD_USER');
        await loginPage.navigate();
        await loginPage.performLogin(user.userName, user.password);
    });

    const filterValues = ['za', 'az', 'lohi', 'hilo'];
    for (const value of filterValues) {
        test(`Perform and verify sorting on the Inventory page ${value}`, async ({ inventoryPage }) => {
            const defaultList = await inventoryPage.getInventoryItemsList();
            const sortedDefaultList = performDefaultListSorting(defaultList, value);
            await inventoryPage.performSorting(value);
            const sortedList = await inventoryPage.getInventoryItemsList();
            expect(sortedList).toEqual(sortedDefaultList);
        });
    }

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
        await inventoryPage.addRandomItemsToCart(randomItemsIndexesArray);
        await inventoryPage.shoppingCart.click();
        const cartItemsListData = await shoppingCartPage.getCartItemsList();
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
        const user = getUserCredentials('STANDARD_USER');
        await checkoutStepOnePage.fillAndConfirmCheckoutStepOne(user.firstName, user.lastName, user.zipCode);
        const checkoutItemsListData = await checkoutStepTwoPage.getCheckoutItemsList();
        for (const i of randomItemsIndexesArray) {
            const k = randomItemsIndexesArray.indexOf(i);
            expect(await inventoryItemsListData[i].name).toEqual(checkoutItemsListData[k].name);
            expect(await inventoryItemsListData[i].description).toEqual(checkoutItemsListData[k].description);
            expect(await inventoryItemsListData[i].price).toEqual(checkoutItemsListData[k].price);
        }
        await expect(checkoutStepTwoPage.summaryInfo).toBeVisible();
        const priceTotal = await checkoutStepTwoPage.getPriceTotal();
        const calculatedTotalPrice = await checkoutStepTwoPage
            .calculateTotalPrice(inventoryItemsListData, randomItemsIndexesArray);
        expect(priceTotal).toEqual(calculatedTotalPrice);
    });
});
