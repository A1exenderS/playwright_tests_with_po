const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('filtering checks', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
    });

    test('Perform and verify sorting on the Inventory page (az)', async ({ inventoryPage }) => {
        const filter = 'az';
        const defaultList = await inventoryPage.getInventoryItemsList();
        await inventoryPage.performSorting(filter);
        const sortedList = await inventoryPage.getInventoryItemsList();
        expect(sortedList).toEqual(defaultList.sort((a, b) => a.name.localeCompare(b.name)));
    });

    test('Perform and verify sorting on the Inventory page (za)', async ({ inventoryPage }) => {
        const filter = 'za';
        const defaultList = await inventoryPage.getInventoryItemsList();
        await inventoryPage.performSorting(filter);
        const sortedList = await inventoryPage.getInventoryItemsList();
        expect(sortedList).toEqual(defaultList.sort((a, b) => b.name.localeCompare(a.name)));
    });

    test('Perform and verify sorting on the Inventory page (hilo)', async ({ inventoryPage }) => {
        const filter = 'hilo';
        const defaultList = await inventoryPage.getInventoryItemsList();
        await inventoryPage.performSorting(filter);
        const sortedList = await inventoryPage.getInventoryItemsList();
        expect(sortedList).toEqual(defaultList.sort((a, b) => b.price - a.price));
    });

    test('Perform and verify sorting on the Inventory page (lohi)', async ({ inventoryPage }) => {
        const filter = 'lohi';
        const defaultList = await inventoryPage.getInventoryItemsList();
        await inventoryPage.performSorting(filter);
        const sortedList = await inventoryPage.getInventoryItemsList();
        expect(sortedList).toEqual(defaultList.sort((a, b) => a.price - b.price));
    });
});
