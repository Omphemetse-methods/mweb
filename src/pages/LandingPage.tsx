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

  //

  return (
    <div className="max-w-screen min-h-screen space-y-4">
      <Campaigns
        campaigns={campaigns}
        selectedCampaignCode={selectedCampaignCode}
        handleSelectCampaign={handleSelectCampaign}
      />

      {productsLoading && (
        <section className="flex justify-center">
          <p>Products loading</p>
        </section>
      )}

      <section className="flex justify-center">
        {providers && productsLoading === false ? (
          <div className="w-8/12 space-y-4">
            <Providers
              providers={providers}
              handleSelectProvider={handleSelectProvider}
              selectedProviders={selectedProviders}
            />

            <section>
              <p>Price ranges</p>
              <div className="flex items-center space-x-3">
                <section className="col-span-1 flex items-center space-x-1">
                  <input type="radio" />
                  <label className="text-xs">All</label>
                </section>
                <section className="col-span-1 flex items-center space-x-1">
                  <input type="radio" />
                  <label className="text-xs">R0-R699</label>
                </section>
                <section className="col-span-1 flex items-center space-x-1">
                  <input type="radio" />
                  <label className="text-xs">R700-R999</label>
                </section>
                <section className="col-span-1 flex items-center space-x-1">
                  <input type="radio" />
                  <label className="text-xs">R1000+</label>
                </section>
              </div>
            </section>

            <Products filteredProducts={filteredProducts} />
          </div>
        ) : null}
      </section>

      <section>Price range</section>
    </div>
  );
};

export default LandingPage;
