import { useState, useEffect } from "react";
import Campaigns from "components/Campaigns";
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
  productDescription: string;
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
          productDescription: product.productDescription,
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

  //
  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen min-h-screen space-y-4">
      <div className="flex flex-col justify-center items-center">
        {campaigns.length !== 0 && (
          <>
            <p className="pb-4">Deal Type</p>

            <ul className="w-6/12 grid grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                const checked =
                  selectedCampaignCode === campaign.code ? true : false;

                return (
                  <li
                    key={campaign.code}
                    className={`col-span-1 grid grid-cols-12 p-2 rounded-md ${
                      checked
                        ? "bg-gray-100 ring-2 ring-purple-200"
                        : "ring-1 ring-purple-100"
                    }`}
                  >
                    <div className="col-span-10">
                      <label className="text-xs">{campaign.name}</label>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <input
                        type="checkbox"
                        id={campaign.code}
                        value={campaign.code}
                        checked={checked}
                        onChange={handleSelectCampaign}
                        className=""
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {productsLoading && (
        <section className="flex justify-center">
          <p>Products loading</p>
        </section>
      )}

      <section className="flex justify-center">
        {providers && productsLoading === false ? (
          <div className="w-8/12 space-y-4">
            <section className="flex justify-end">
              <button className="bg-purple-400 text-white px-6 py-1 rounded-md">
                More Filters
              </button>
            </section>

            <ul className="grid grid-cols-4 gap-4">
              {providers.map((provider) => (
                <li key={provider} className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    id={provider}
                    value={provider}
                    onChange={handleSelectProvider}
                    checked={
                      selectedProviders.indexOf(provider) === -1 ? false : true
                    }
                  />
                  <label className="text-xs">{provider}</label>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section>Price range</section>

      <section className="flex flex-col items-center justify-center">
        <p>Display products</p>

        {filteredProducts && (
          <section className="w-8/12">
            <p>{filteredProducts.length} products found</p>
            <ul className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <li
                  key={product.productName + product.productCode}
                  className="ring-1 ring-purple-100 rounded-md p-3 text-xs"
                >
                  <p>{product.productName}</p>
                  <p>{product.productCode}</p>
                  <p>{product.productRate}</p>
                  <p>{product.subcategory}</p>
                  <p>{product.productDescription}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
