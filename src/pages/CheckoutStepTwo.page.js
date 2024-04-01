import { getItemsList } from '../additionalFunctions';
import { ShoppingCartPage } from './ShoppingCart.page';

export class CheckoutStepTwoPage extends ShoppingCartPage {
    url = '/checkout-step-two.html';

    get checkoutItems() { return this.page.locator('.cart_item'); }

    get summaryInfo() { return this.page.locator('.summary_info'); }

    get priceTotal() { return this.page.locator('.summary_info>.summary_total_label'); }

    get tax() { return this.page.locator('.summary_tax_label'); }

    async getCheckoutItemsList() {
        return getItemsList(this.checkoutItems);
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
