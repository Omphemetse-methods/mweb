import { useState, useEffect } from "react";

import Campaigns from "components/Campaigns";
import Providers from "components/Providers";
import Products from "components/Products";

import Footer from "components/Footer";

interface CampaignType {
  links: string[];
  code: string;
  name: string;
  decsription: string;
  category: string;
  urlSlug: string;
  isStandardCampaign: string;
  isPrivateCampaign: string;
  promocodes: string[];
}

interface summarizedProductType {
  productCode: string;
  productName: string;
  productRate: string;
  subcategory: string;
}

const LandingPage = () => {
  const baseURL = "https://apigw.mweb.co.za/prod/baas/proxy";

  // get a list of fibre campaigns
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);

  // selected campaing
  const [
    selectedCampaign,
    setselectedCampaign,
  ] = useState<CampaignType | null>();
  const [selectedCampaignCode, setselectedCampaignCode] = useState(
    "FTTH-FREESETUP-FREEROUTER"
  );

  const handleSelectCampaign = (event: any) => {
    // get campaing code from the id of the event
    const code = event.target.id;
    // update selected campaign code
    setselectedCampaignCode(code);

    // update selected campaign code checkbox and selected campaign
    const selectedCampaign = campaigns.filter((c) => c.code === code)[0];
    setselectedCampaign(selectedCampaign);
  };

  // Fetch campaigns
  useEffect(() => {
    if (campaigns.length !== 0) return;

    fetch(
      "https://apigw.mweb.co.za/prod/baas/proxy/marketing/campaigns/fibre?channels=120&visibility=public"
    )
      .then((response) => response.json())
      .then((data) => {
        setCampaigns(data.campaigns);

        // update selected campaign field
        const defaultCampaign = data.campaigns.filter(
          (c: CampaignType) => c.code === selectedCampaignCode
        )[0];
        setselectedCampaign(defaultCampaign);

        setLoading(false);
      })
      .catch((err) => {
        console.log("hadle error graciously");

        setLoading(false);
      });
  }, []);

  // Use Mweb's marketing API to load products associated with each promo code

  const [productsLoading, setproductsLoading] = useState(false);
  const [promocodeProducts, setPromocodeProducts] = useState<
    summarizedProductType[]
  >([]);

  const [filteredProducts, setFilteredProducts] = useState<
    summarizedProductType[]
  >([]);

  // Use Mweb's marketing API to load products associated with each promo code
  useEffect(() => {
    if (!selectedCampaign) return;

    const handleFetchProducts = async () => {
      setproductsLoading(true);

      try {
        const promocodes = selectedCampaign.promocodes;
        const promcodeProductsURL = `${baseURL}/marketing/products/promos/${promocodes.join(
          ","
        )}?sellable_online=true`;

        const response = await fetch(promcodeProductsURL);
        const promocodeProducts = await response.json();

        // get summarizedProducts
        const summarizedProducts = getSummarizedProducts(promocodeProducts);

        setPromocodeProducts(summarizedProducts);
        setFilteredProducts(summarizedProducts);
      } catch (error) {
        console.log("failed tp load products:", error);
      } finally {
        setproductsLoading(false);
      }
    };

    if (!selectedCampaign) return;
    handleFetchProducts();
  }, [selectedCampaign]);

  // providers
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<any[]>([]);

  function getSummarizedProducts(promocodeProducts: any[]) {
    // providers set in order to get unique providers
    const providersSet = new Set();

    // summarized products: we filter out unwanted product fields: UI/UX purpose
    const summarizedProducts = [];

    for (var pc of promocodeProducts) {
      for (var product of pc.products) {
        // update a list of summarized products
        summarizedProducts.push({
          productName: product.productName,
          productCode: product.productCode,
          productRate: product.productRate,
          subcategory: product.subcategory,
        });

        // get providers
        providersSet.add(product.subcategory);
      }
    }

    // convert providers set to providers array in order to get unique providers
    const providers = Array.from(providersSet);

    setProviders(providers);
    setSelectedProviders(providers);

    return summarizedProducts;
  }

  // handle select provider
  function handleSelectProvider(event: any) {
    // get checked provider from the event id
    const provider = event.target.id;
    const providerChecked = event.target.checked;

    // if provider checked we add provider else remove
    const updateProviders = [...selectedProviders];

    if (providerChecked === true) updateProviders.push(provider);
    else updateProviders.splice(updateProviders.indexOf(provider), 1);

    // update selected providers
    setSelectedProviders(updateProviders);
  }

  useEffect(() => {
    // get ready to mutate products
    const products = [...promocodeProducts];

    const x = products.filter((product) => {
      // check first if product provider is included in one of the selected providers
      const isProviderProductsSelected = selectedProviders.indexOf(
        product.subcategory
      );

      if (isProviderProductsSelected === -1) return false;
      return true;
    });

    setFilteredProducts(x);
  }, [selectedProviders]);

  // filter by price: TODO
  const priceRanges = [
    { min: 0, max: 699, label: "R0 - R699" },
    { min: 700, max: 999, label: "R700 - R999" },
    { min: 1000, max: 9999, label: "R1000+" },
  ];
  const [selectePrice, setSelectedPrice] = useState("all");

  // filter products based on price
  function handlePriceFilter({
    min,
    max,
    label,
  }: {
    min: Number;
    max: Number;
    label: string;
  }) {
    // TODO
    //const;
  }

  return (
    <div className="max-w-screen min-h-screen space-y-4">
      <section className="flex justify-center">
        <div className="w-11/12 md:w-10/12 space-y-3">
          <section className="flex justify-between items-center font-fuzzy py-2">
            <p>
              MWEB <span className="text-xs">log</span>
            </p>
            <div className="flex space-x-2 items-center text-xs">
              <button className="">Coverage</button>
              <button className="">Help Center</button>
              <button className="px-5 py-2 mt-4 text-sm text-center text-gray-700 capitalize transition-colors duration-200 transform border rounded-md dark:hover:bg-gray-700 dark:text-white lg:mt-0 hover:bg-gray-100 lg:w-auto">
                Login
              </button>
            </div>
          </section>

          <section className="flex flex-col items-center items-center space-y-2 pb-8">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white md:text-3xl pt-10">
              Stream all you want, work and play. No contracts
            </h1>
            <p className="w-8/12 text-center font-fuzzy mt-6 text-gray-500 dark:text-gray-300">
              Get fast fibre delivered fast at your doorstep. Order your plug
              and play router now.Change the way you see the world.
            </p>

            <div className="w-full">
              <Campaigns
                campaigns={campaigns}
                selectedCampaignCode={selectedCampaignCode}
                handleSelectCampaign={handleSelectCampaign}
              />
            </div>
          </section>
        </div>
      </section>

      <section className="flex justify-center">
        {providers && productsLoading === false ? (
          <div className="w-full px-2 md:px-0  md:w-8/12 space-y-4 pb-8">
            <Providers
              providers={providers}
              handleSelectProvider={handleSelectProvider}
              selectedProviders={selectedProviders}
            />

            <section className="pb-4">
              <p className="font-bold">Price ranges</p>
              <ul className="flex space-x-8 items-center">
                {priceRanges.map((priceRange) => (
                  <li
                    key={priceRange.min + priceRange.max}
                    className="flex items-center space-x-1"
                  >
                    <input
                      type="radio"
                      onChange={() => handlePriceFilter(priceRange)}
                    />
                    <label className="text-xs font-fuzzy">
                      {priceRange.label}
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <Products filteredProducts={filteredProducts} />

            <section className="flex justify-center">
              <button>Load more</button>
            </section>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default LandingPage;
