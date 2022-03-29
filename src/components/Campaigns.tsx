import useCampaign from "hooks/useCampaign";

const Campaigns = () => {
  const { loading, campaigns } = useCampaign();

  console.log("campaigns:", campaigns);

  if (loading) {
    return (
      <section>
        <p>Loading campaigns</p>
      </section>
    );
  }

  return (
    <div>
      <p>Campaigns</p>

      <section className="flex justify-center">
        <ul className="w-6/12 grid grid-cols-3 gap-4">
          {["1", "4", "5"].map((campaign) => (
            <li
              key={campaign}
              className="ring-1 ring-green-100 px-4 py-1 rounded-md"
            >
              <p>Campaign</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Campaigns;
