interface ProvidersProps {
  providers: string[];
  handleSelectProvider: Function;
  selectedProviders: string[];
}

const Providers = ({
  providers,
  handleSelectProvider,
  selectedProviders,
}: ProvidersProps) => {
  return (
    <section className="">
      <p className="font-bold">Fibre Providers</p>
      <p className="text-xs text-gray-900y">
        Select the fibre providers for which products should be displayed
      </p>
      <ul className="grid grid-cols-3 md:grid-cols-4 gap-4 px-20 py-3">
        <>
          {providers.map((provider) => (
            <li
              key={provider}
              className="col-span-1 flex justify-end items-center space-x-1"
            >
              <label className="text-xs font-fuzzy text-gray-900">
                {provider}
              </label>
              <input
                type="checkbox"
                id={provider}
                value={provider}
                onChange={(event) => handleSelectProvider(event)}
                checked={
                  selectedProviders.indexOf(provider) === -1 ? false : true
                }
              />
            </li>
          ))}
        </>
      </ul>
    </section>
  );
};

export default Providers;
