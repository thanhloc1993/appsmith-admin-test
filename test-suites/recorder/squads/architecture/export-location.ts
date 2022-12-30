import { test, expect } from '@playwright/test';

test('[@architecture] export location', async ({ page }) => {
    await page.goto('https://backoffice.staging.manabie.io/payment/masters');

    await page.goto(
        'https://backoffice.staging.manabie.io/login-tenant?redirectUrl=%2Fpayment%2Fmasters'
    );

    await page.getByTestId('LoginTenantForm__textFieldOrganizations').click();

    await page.getByTestId('LoginTenantForm__textFieldOrganizations').fill('manabie');

    await page.getByTestId('LoginTenantForm__textFieldUsername').click();

    await page
        .getByTestId('LoginTenantForm__textFieldUsername')
        .fill('ducbinh.pham+stgmaadmin@manabie.com');

    await page.getByTestId('LoginTenantForm__textFieldPassword').click();

    await page.getByTestId('LoginTenantForm__textFieldPassword').fill('123123');

    await page.getByTestId('LoginTenantForm__buttonLogin').click();
    await expect(page).toHaveURL('https://backoffice.staging.manabie.io/payment/masters');

    await page.getByRole('button', { name: 'Master Data' }).click();

    await page.getByRole('option', { name: 'Location' }).click();

    await page.getByTestId('StyledButtonDropdown__iconButton').click();

    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('menuitem', { name: 'Export Data' }).click(),
    ]);
    const url = await download.url();
    await expect(url).toContain('blob:https://backoffice.staging.manabie.io/');
});
