import { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    product_id: "",
    customer_id: "",
    quantity: 1,
  });

  const fetchSales = () => {
    setLoading(true);
    return fetch(`${API_BASE}/sales`)
      .then((res) => res.json())
      .then((result) => setSales(result?.data || []))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSales();
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((result) => setProducts(result?.data || []))
      .catch(() => {});
    fetch(`${API_BASE}/customers`)
      .then((res) => res.json())
      .then((result) => setCustomers(result?.data || []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.product_id || !form.customer_id || !form.quantity) {
      setFormError("Please fill in product, customer, and quantity.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: Number(form.customer_id),
          items: [
            {
              product_id: Number(form.product_id),
              quantity: Number(form.quantity),
            },
          ],
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        // Laravel validation errors or a business-rule message
        // (e.g. "Insufficient stock") land here.
        const firstError = result?.errors
          ? Object.values(result.errors)[0]?.[0]
          : null;
        setFormError(firstError || result?.message || "Failed to record sale.");
        return;
      }

      setForm({ product_id: "", customer_id: "", quantity: 1 });
      await fetchSales();
      // Refresh products so stock quantities reflect the new sale.
      fetch(`${API_BASE}/products`)
        .then((r) => r.json())
        .then((r) => setProducts(r?.data || []))
        .catch(() => {});
    } catch (err) {
      setFormError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProduct = products.find(
    (p) => String(p.id) === String(form.product_id),
  );

  return (
    <div className="space-y-4 max-w-full">
      {/* New sale form */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Record a Sale
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              Product
            </label>
            <select
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (stock: {p.stock_quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              Customer
            </label>
            <select
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              max={selectedProduct?.stock_quantity || undefined}
              value={form.quantity}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-neutral"
          >
            {submitting ? "Recording..." : "Record Sale"}
          </button>
        </form>
        {formError && <p className="text-sm text-red-600 mt-2">{formError}</p>}
      </div>

      {/* Sales history */}
      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
          Loading sales...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : sales.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
          No sales recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {sale.id}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {sale.customer?.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {sale.employee?.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {(sale.items || []).length === 0 ? (
                      "-"
                    ) : (
                      <ul className="space-y-0.5">
                        {sale.items.map((item) => (
                          <li key={item.id} className="whitespace-nowrap">
                            {item.product?.name || "Unknown"}{" "}
                            <span className="text-slate-500">
                              x{item.quantity} ($
                              {Number(item.line_total).toFixed(2)})
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {sale.total_amount != null
                      ? `$${Number(sale.total_amount).toFixed(2)}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {sale.sold_at || sale.created_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Sales;
