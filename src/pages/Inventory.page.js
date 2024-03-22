const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

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
}
