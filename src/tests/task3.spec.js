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
        const allInventoryItemsList = await inventoryPage.getInventoryItemsList();
        await inventoryPage.addRandomItemsToCart();
        await inventoryPage.shoppingCart.click();
        await shoppingCartPage.checkoutButton.click();
        await checkoutStepOnePage.fillAndConfirmCheckoutStepOne('Ssssss', 'Sssssss', '45674');
        const allCheckoutItemsList = await checkoutStepTwoPage.getCheckoutItemsList();
        expect(allInventoryItemsList).toEqual(expect.arrayContaining(allCheckoutItemsList));
        await expect(checkoutStepTwoPage.summaryInfo).toBeVisible();
        const priceTotal = await checkoutStepTwoPage.getPriceTotal();
        const calculatedTotalPrice = await checkoutStepTwoPage.calculateTotalPrice();
        expect(priceTotal).toEqual(calculatedTotalPrice);
    });
});
