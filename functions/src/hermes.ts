const ENDPOINT = "https://gateway-usa.liquify.com/api=HERMESTOKV1MPLSSG922CZ/api/get_vaa";

const getVaa = async (feedId: string) => {
  const publishTime = Math.round(Date.now() / 1000);
  const response = await fetch(`${ENDPOINT}?id=${feedId}&publish_time=${publishTime}`);
  const data = await response.json();
  return data.vaa;
};

export default getVaa;
