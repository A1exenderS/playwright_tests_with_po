export async function getItemsListData(itemSelector) {
    const items = await itemSelector.all();
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
