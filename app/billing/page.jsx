import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import ProductsList from "@/components/ProductsList";

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [] };
  }
}

const BillingPage = async () => {
  const session = await getServerSession(options);
  const productsData = await fetchProducts();

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/billing");
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-black mb-6">Billing</h2>
      <ProductsList products={productsData.products} />
    </div>
  );
};

export default BillingPage;
