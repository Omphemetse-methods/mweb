import useCampaign from "hooks/useCampaign";

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

interface CampaignProps {
  campaigns: CampaignType[];
  selectedCampaignCode: string;
  handleSelectCampaign: Function;
}

const Campaigns = ({
  campaigns,
  selectedCampaignCode,
  handleSelectCampaign,
}: CampaignProps) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2 py-6">
      {campaigns.length !== 0 && (
        <>
          <h2 className="font-fuzzy text-xs">Select the fibre campaign</h2>

          <ul className="w-full md:w-5/12 grid grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const checked =
                selectedCampaignCode === campaign.code ? true : false;

              return (
                <li
                  key={campaign.code}
                  className={`col-span-1 grid grid-cols-12 p-2 rounded-md ${
                    checked
                      ? "transition ease-in-out delay-50 shadow-md scale-110 bg-indigo-500 text-white ring-1 ring-purple-600"
                      : "ring-1 ring-gray-900"
                  }`}
                >
                  <div className="col-span-10">
                    <label className="text-xs">{campaign.name}</label>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <input
                      type="radio"
                      id={campaign.code}
                      value={campaign.code}
                      checked={checked}
                      onChange={(event) => handleSelectCampaign(event)}
                      className="cursor-pointer"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default Campaigns;
