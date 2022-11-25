import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  await page.goto('http://localhost:3001/architecture/configuration');

  await page.goto('http://localhost:3001/login-tenant?redirectUrl=%2Farchitecture%2Fconfiguration');

  await page.getByTestId('LoginTenantForm__textFieldOrganizations').click();

  await page.getByTestId('LoginTenantForm__textFieldOrganizations').fill('manabie');

  await page.getByTestId('LoginTenantForm__textFieldUsername').click();

  await page.getByTestId('LoginTenantForm__textFieldUsername').fill('ducbinh.pham+stgmaadmin@manabie.com');

  await page.getByTestId('LoginTenantForm__textFieldPassword').click();

  await page.getByTestId('LoginTenantForm__textFieldPassword').fill('123123');

  await page.getByTestId('LoginTenantForm__buttonLogin').click();
  await expect(page).toHaveURL('http://localhost:3001/architecture/configuration');

  await page.frameLocator('internal:attr=[data-testid="Iframe_Appsmith_config-setting"]').locator('.sc-eaHRVx').first().click();

  await page.frameLocator('internal:attr=[data-testid="Iframe_Appsmith_config-setting"]').getByTestId('container-wrapper-ilfrrxnd9s').locator('input[type="text"]').first().click();

  await page.frameLocator('internal:attr=[data-testid="Iframe_Appsmith_config-setting"]').getByTestId('container-wrapper-ilfrrxnd9s').locator('input[type="text"]').first().fill('3');

  await page.frameLocator('internal:attr=[data-testid="Iframe_Appsmith_config-setting"]').getByTestId('container-wrapper-ilfrrxnd9s').locator('input[type="text"]').nth(1).click();

  await page.frameLocator('internal:attr=[data-testid="Iframe_Appsmith_config-setting"]').getByTestId('container-wrapper-ilfrrxnd9s').locator('input[type="text"]').nth(1).fill('3');

  await page.frameLocator('internal:attr=[data-testid="Iframe_Appsmith_config-setting"]').getByTestId('container-wrapper-ilfrrxnd9s').locator('input[type="text"]').nth(2).click();

  await page.frameLocator('internal:attr=[data-testid="Iframe_Appsmith_config-setting"]').getByTestId('container-wrapper-ilfrrxnd9s').locator('input[type="text"]').nth(2).fill('3');

  await page.frameLocator('internal:attr=[data-testid="Iframe_Appsmith_config-setting"]').locator('#nfnjhq98vz div:has-text("Save")').nth(2).click();

});