import { useEffect, useState } from "react";

interface Campaign {
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

// fetch camapaign hook
const useCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // use MWeb API to get campaigns
    const handleGetCampaigns = async () => {
      try {
        // load campaigns
        const response = await fetch(
          "https://apigw.mweb.co.za/prod/baas/proxy/marketing/campaigns/fibre?channels=120&visibility=public"
        );
        const data = await response.json();
        setCampaigns(data.campaigns);
      } catch (error) {
        console.log("Error getting campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    handleGetCampaigns();

    // set loading to false when the hook unmount
    return () => {
      setLoading(false);
    };
  }, []);

  return { loading, campaigns };
};

export default useCampaign;
