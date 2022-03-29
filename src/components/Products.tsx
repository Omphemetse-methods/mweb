interface summarizedProductType {
  productCode: string;
  productName: string;
  productRate: string;
  subcategory: string;
}

interface ProductsProps {
  filteredProducts: summarizedProductType[];
}

const Products = ({ filteredProducts }: ProductsProps) => {
  return (
    <section className="flex flex-col items-center justify-center">
      {filteredProducts && (
        <section className="w-full">
          <ul className="grid grid-cols-3  gap-4 md:gap-8">
            {filteredProducts.map((product) => (
              <li
                key={product.productName + product.productCode}
                className="ring-1 ring-gray-600 rounded-md p-3 text-xs"
              >
                <section className="">
                  <p className="font-bold">{product.productName}</p>
                  <p>{product.productCode}</p>
                  <p>{product.productRate}</p>
                  <p>{product.subcategory}</p>
                </section>

                <section className="flex justify-center">
                  <button className="btn-primary bg-gray-300 text-gray-900 py-1 px-2">
                    Check Coverage
                  </button>
                </section>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
};

export default Products;
