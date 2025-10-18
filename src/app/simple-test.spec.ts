// Prueba simple que no depende de Angular
describe('Simple Tests', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should add numbers correctly', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle strings', () => {
    expect('hello').toContain('hello');
  });
});
