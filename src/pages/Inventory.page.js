/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    get addButton() { return this.page.locator('//button[contains(text(), "Add to cart")]'); }

    get headerTitle() { return this.page.locator('.title'); } // .header_secondary_container - parent

    get productsSortSelect() { return this.page.locator('.product_sort_container'); }

    get inventoryItems() { return this.page.locator('.inventory_item'); }

    get inventoryItemName() { return this.page.locator('.inventory_item_name'); }

    get inventoryItemPrice() { return this.page.locator('.inventory_item_price'); }

    get addItemToCartButtons() { return this.page.locator('[id^="add-to-cart"]'); }

    async addItemToCartById(id) {
        await this.addItemToCartButtons.nth(id).click();
    }

    async performSorting(value) {
        await this.productsSortSelect.selectOption(value); // az, za, lohi, hilo
    }

    async getInventoryItemsList() {
        const items = await this.inventoryItems.all();
        return Promise.all(items.map(async (item) => {
            const name = await item.locator('.inventory_item_name').textContent();
            const description = await item.locator('.inventory_item_desc').textContent();
            let price = await item.locator('.inventory_item_price').textContent();
            price = price.replace('$', '');
            return {
                name,
                description,
                price,
            };
        }));
    }

    async addRandomItemsToCart() {
        const itemsAddToCartItems = await this.inventoryItems.all();

        let amount = 0;
        while (amount === 0) {
            amount = Math.floor(Math.random() * (itemsAddToCartItems.length + 1));
        }

        const randomAddToCartButtons = new Set();
        while (randomAddToCartButtons.size < amount) {
            const randomAddToCartButtonIndex = Math.floor(Math.random() * itemsAddToCartItems.length);
            randomAddToCartButtons.add(randomAddToCartButtonIndex);
        }
        for (const index of randomAddToCartButtons) {
            await itemsAddToCartItems[index].locator(this.addItemToCartButtons).click();
        }

        return randomAddToCartButtons;
    }
}
