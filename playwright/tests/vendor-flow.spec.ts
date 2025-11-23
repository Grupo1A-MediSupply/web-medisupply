import { test, expect, Page } from '@playwright/test';

async function autenticarVendedor(page: Page) {
  await page.goto('/');
  await expect(page).toHaveURL(/\/vendor\/login$/);

  await page.getByPlaceholder('Usuario vendedor').fill('vendedor');
  await page.getByPlaceholder('Digita tu contraseña').fill('demo123');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await expect(page).toHaveURL(/\/vendor\/mfa$/);

  await page.getByPlaceholder('Digita tu código de 6 dígitos').fill('123456');
  await page.getByRole('button', { name: 'Verificar y continuar' }).click();

  await expect(page).toHaveURL(/\/vendor\/orders$/);
}

test.describe('Flujos del portal de vendedor', () => {
  test('inicia sesión, completa MFA y muestra el dashboard', async ({ page }) => {
    await autenticarVendedor(page);

    await expect(page.getByRole('heading', { name: 'Gestión de Órdenes' })).toBeVisible();

    const ordersTable = page.locator('.orders-table tbody tr');
    const ordersAntes = await ordersTable.count();

    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: 'Crear Pedido de Ejemplo' }).click();
    const dialog = await dialogPromise;
    await expect(dialog.message()).toContain('Pedido creado');
    await dialog.accept();

    await expect.poll(async () => ordersTable.count()).toBeGreaterThan(ordersAntes);
  });

  test('permite navegar entre secciones del dashboard', async ({ page }) => {
    await autenticarVendedor(page);

    await page.getByRole('link', { name: 'Inventario' }).click();
    await expect(page.getByRole('heading', { name: 'Gestión de Inventario' })).toBeVisible();

    await page.getByRole('link', { name: 'Rutas' }).click();
    await expect(page.getByRole('heading', { name: 'Gestión de Rutas' })).toBeVisible();

    await page.getByRole('link', { name: 'Carga de Inventario' }).click();
    await expect(page.getByRole('heading', { name: 'Carga de Inventario' })).toBeVisible();
  });
});

