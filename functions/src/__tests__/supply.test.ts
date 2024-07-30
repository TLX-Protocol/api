import { getMaxSupply, getTotalSupply, getCirculatingSupply } from '../supply';

describe('Supply Functions', () => {
  test('getMaxSupply returns the correct value', async () => {
    const maxSupply = await getMaxSupply();
    expect(maxSupply).toBe(100_000_000);
  });

  test('getTotalSupply returns the correct value', async () => {
    const totalSupply = await getTotalSupply();
    expect(totalSupply).toBe(100_000_000);
  });

  test('getCirculatingSupply returns a reasonable value', async () => {
    const circulatingSupply = await getCirculatingSupply();
    expect(circulatingSupply).toBeGreaterThan(0);
    expect(circulatingSupply).toBeLessThanOrEqual(100_000_000);
  });
});
