const { expect } = require('@playwright/test');
const { test } = require('../fixture');
// require('dotenv').config();
// got error 'dotenv' should be listed in the project's dependencies. Run 'npm i -S dotenv' to add it

test.describe('filtering checks', () => {
    test.beforeEach(async ({ loginPage }) => {
        // const username = process.env.USERNAME;
        // const password = process.env.PASSWORD;
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
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
});
