import { BasePage } from './Base.page';

export class CheckoutStepTwoPage extends BasePage {
    url = '/checkout-step-two.html';

    get checkoutItems() { return this.page.locator('.cart_item'); }

    get summaryInfo() { return this.page.locator('.summary_info'); }

    get priceTotal() { return this.page.locator('.summary_info>.summary_total_label'); }

    get tax() { return this.page.locator('.summary_tax_label'); }

    async getCheckoutItemsList() {
        const items = await this.checkoutItems.all();
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

    async getPriceTotal() {
        let price = await this.priceTotal.textContent();
        price = parseFloat(price.replace('Total: $', ''));
        return price;
    }

    async getTax() {
        let tax = await this.tax.textContent();
        tax = parseFloat(tax.replace('Tax: $', ''));
        return tax;
    }

    async calculateTotalPrice() {
        const items = await this.checkoutItems.all();
        let totalPrice = 0;
        await Promise.all(items.map(async (item) => {
            let price = await item.locator('.inventory_item_price').textContent();
            price = parseFloat(price.replace('$', ''));
            totalPrice += price;
        }));
        const tax = await this.getTax();
        totalPrice += tax;
        const roundedTotalPrice = parseFloat(totalPrice.toFixed(2));
        return roundedTotalPrice;
    }
}
