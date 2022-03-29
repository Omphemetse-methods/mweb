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
      <p>Display products</p>

      {filteredProducts && (
        <section className="w-full">
          <p>{filteredProducts.length} products found</p>
          <ul className="grid grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <li
                key={product.productName + product.productCode}
                className="ring-1 ring-purple-100 rounded-md p-3 text-xs"
              >
                <p>{product.productName}</p>
                <p>{product.productCode}</p>
                <p>{product.productRate}</p>
                <p>{product.subcategory}</p>
                <button className="btn-primary bg-gray-50 text-gray-900">
                  Check Coverage
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
};

export default Products;
