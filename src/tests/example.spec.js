// @ts-check
import { getUserCredentials } from '../HelperFunctions.util';
import 'dotenv/config';

const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('', () => {
    test.beforeEach(async ({ loginPage }) => {
        const user = getUserCredentials('STANDARD_USER');
        await loginPage.navigate();
        await loginPage.performLogin(user.userName, user.password);
    });

    test('Perform login', async ({ inventoryPage }) => {
        await expect(inventoryPage.headerTitle).toBeVisible();

        expect(await inventoryPage.inventoryItems.count()).toBeGreaterThanOrEqual(1);
    });

    test('Add and remove product from the cart', async ({ inventoryPage, shoppingCartPage }) => {
        await inventoryPage.addItemToCartById(0);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe('1');

        await inventoryPage.shoppingCart.click();
        expect(await shoppingCartPage.cartItems.count()).toBeGreaterThanOrEqual(1);

        await shoppingCartPage.removeCartItemById(0);
        await expect(shoppingCartPage.cartItems).not.toBeAttached();
    });
});
