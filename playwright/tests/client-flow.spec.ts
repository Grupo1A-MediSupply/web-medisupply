import { test, expect, Page } from '@playwright/test';

async function autenticarCliente(page: Page) {
  await page.goto('/client/login');
  await expect(page).toHaveURL(/\/client\/login$/);

  await page.getByPlaceholder('Usuario cliente').fill('cliente');
  await page.getByPlaceholder('Digita tu contraseña').fill('demo123');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await expect(page).toHaveURL(/\/client\/mfa$/);

  await page.getByPlaceholder('Digita tu código de 6 dígitos').fill('123456');
  await page.getByRole('button', { name: 'Verificar y continuar' }).click();

  await expect(page).toHaveURL(/\/client/);
}

test.describe('Flujos del portal de cliente', () => {
  test('crea un pedido desde el formulario principal', async ({ page }) => {
    await autenticarCliente(page);

    await expect(page.getByRole('heading', { name: 'Crear Nuevo Pedido' })).toBeVisible();

    const hoy = new Date().toISOString().split('T')[0];

    await page.getByPlaceholder('Nombre de su institución').fill('Clínica Test Automation');
    await page.getByPlaceholder('Dirección completa de entrega').fill('Calle 123 #45-67');
    await page.locator('input[formcontrolname="deliveryDate"]').fill(hoy);
    await page.getByPlaceholder('Persona de contacto').fill('Dr. QA');
    await page.getByPlaceholder('Número de teléfono').fill('3001234567');

    await page.locator('.product-dropdown').first().selectOption('Insulina');
    await page.locator('input[formcontrolname="quantity"]').first().fill('3');

    await expect(page.getByRole('button', { name: 'Crear Pedido' })).toBeEnabled();
    await page.getByRole('button', { name: 'Crear Pedido' }).click();

    const modal = page.getByRole('heading', { name: '¡Pedido Creado Exitosamente!' });
    await expect(modal).toBeVisible();
    await expect(page.getByText('Clínica Test Automation')).toBeVisible();

    await page.getByRole('button', { name: 'Entendido' }).click();
    await expect(modal).not.toBeVisible();
  });
});

