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

export const getUserCredentials = (userType) => {
    switch (userType) {
        case 'STANDARD_USER':
            return {
                userName: process.env.STANDARD_USER_NAME,
                password: process.env.PASSWORD,
                firstName: process.env.STANDARD_USER_FIRST_NAME,
                lastName: process.env.STANDARD_USER_LAST_NAME,
                zipCode: process.env.STANDARD_USER_ZIP,
            };
        case 'LOCKED_OUT_USER':
            return {
                userName: process.env.LOCKED_OUT_USER_NAME,
                password: process.env.PASSWORD,
                firstName: process.env.LOCKED_OUT_USER_FIRST_NAME,
                lastName: process.env.LOCKED_OUT_USER_LAST_NAME,
                zipCode: process.env.LOCKED_OUT_USER_ZIP,
            };
        case 'PROBLEM_USER':
            return {
                userName: process.env.PROBLEM_USER_NAME,
                password: process.env.PASSWORD,
                firstName: process.env.PROBLEM_USER_FIRST_NAME,
                lastName: process.env.PROBLEM_USER_LAST_NAME,
                zipCode: process.env.PROBLEM_USER_ZIP,
            };
        default:
            throw new Error(`User type ${userType} not found`);
    }
};

/**
 *
 * @param {Array} defaultList
 * @param {String} value
 */
//
export function performDefaultListSorting(defaultList, value) {
    switch (value) {
        case 'za':
            return defaultList.sort((a, b) => b.name.localeCompare(a.name));
        case 'az':
            return defaultList.sort((a, b) => a.name.localeCompare(b.name));
        case 'hilo':
            return defaultList.sort((a, b) => b.price - a.price);
        case 'lohi':
            return defaultList.sort((a, b) => a.price - b.price);
        default:
            return defaultList;
    }
}
