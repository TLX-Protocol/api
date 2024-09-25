import { getCirculatingSupply, getTotalSupply, getMaxSupply } from "../supply";
import { MAX_SUPPLY } from "../constants";

describe("Supply Functions", () => {
  test("getCirculatingSupply should return a number", async () => {
    const circulatingSupply = await getCirculatingSupply();
    expect(typeof circulatingSupply).toBe("number");
    expect(circulatingSupply).toBeGreaterThan(0);
    expect(circulatingSupply).toBeLessThan(MAX_SUPPLY);
  });

  test("getTotalSupply should return total supply", async () => {
    const totalSupply = await getTotalSupply();
    expect(totalSupply).toBeLessThanOrEqual(MAX_SUPPLY);
  });

  test("getMaxSupply should return MAX_SUPPLY", async () => {
    const maxSupply = await getMaxSupply();
    expect(maxSupply).toBe(MAX_SUPPLY);
  });
});
