import React from "react";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={`w-full caption-bottom text-sm ${className || ""}`}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={`[&_tr]:border-b ${className || ""}`}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={`[&_tr:last-child]:border-0 ${className || ""}`}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-gray-50/50 ${
      className || ""
    }`}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`h-12 px-4 text-left align-middle font-medium text-gray-500 ${
      className || ""
    }`}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={`p-4 align-middle ${className || ""}`} {...props} />
));
TableCell.displayName = "TableCell";



const TopProducts = ({ products }) => {
  // Calculate revenue and get top 5 products
  const topProducts = products
    ?.map(product => ({
      ...product,
      revenue: product.price * product.stock,
      sales: product.stock,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-black">Top Products</h3>
        <p className="text-sm text-gray-500">Best performing products</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-black text-left">Product</th>
              <th className="py-2 text-black text-right">Revenue</th>
              <th className="py-2 text-black text-right">Sales</th>
              <th className="py-2 text-black text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {topProducts?.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="py-2 text-black">{product.title}</td>
                <td className="py-2 text-black text-right">
                  ${product.revenue.toLocaleString()}
                </td>
                <td className="py-2 text-black text-right">
                  {product.sales.toLocaleString()}
                </td>
                <td className="py-2 text-black text-right">
                  {product.rating.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProducts;