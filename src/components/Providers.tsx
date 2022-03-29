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
    <section>
      <p>Fibre Providers</p>
      <p className="text-xs">
        Select the fibre providers for which products should be displayed
      </p>
      <ul className="grid grid-cols-4 gap-4 px-20">
        <>
          {providers.map((provider) => (
            <li
              key={provider}
              className="col-span-1 flex items-center space-x-1"
            >
              <input
                type="checkbox"
                id={provider}
                value={provider}
                onChange={(event) => handleSelectProvider(event)}
                checked={
                  selectedProviders.indexOf(provider) === -1 ? false : true
                }
              />
              <label className="text-xs">{provider}</label>
            </li>
          ))}
        </>
      </ul>
    </section>
  );
};

export default Providers;
