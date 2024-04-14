const bigintToNumber = (bigInt: bigint, decimals = 18): number => {
  const bigIntString = bigInt.toString();
  const length = bigIntString.length;
  const integerPart = bigIntString.substring(0, length - decimals);
  const decimalPart = bigIntString.substring(length - decimals);
  return parseFloat(`${integerPart}.${decimalPart}`);
};

export default bigintToNumber;
