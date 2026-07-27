import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const EMPTY_FORM = { name: "", sku: "", price: "", stock_quantity: "" };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    return fetch(`${API_BASE}/products`)
      .then((response) => response.json())
      .then((result) => {
        setMessage(result?.message || "");
        setProducts(result.data || []);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      sku: product.sku || "",
      price: product.price ?? "",
      stock_quantity: product.stock_quantity ?? "",
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name || !form.sku || !form.price || form.stock_quantity === "") {
      setFormError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    const isEditing = Boolean(editingId);
    const url = isEditing
      ? `${API_BASE}/products/${editingId}`
      : `${API_BASE}/products`;

    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          price: Number(form.price),
          stock_quantity: Number(form.stock_quantity),
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        const firstError = result?.errors
          ? Object.values(result.errors)[0]?.[0]
          : null;
        setFormError(firstError || result?.message || "Failed to save product.");
        return;
      }

      await fetchProducts();
      closeModal();
    } catch {
      setFormError("Could not reach the server. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/products/${product.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        alert(result?.message || "Failed to delete product.");
        return;
      }
      fetchProducts();
    } catch {
      alert("Could not reach the server.");
    }
  };

  return (
    <div className="space-y-4 max-w-full">
      <div className="rounded-lg bg-white p-4 shadow-sm flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{message}</h3>
        <button
          onClick={openCreateModal}
          className="btn btn-sm btn-neutral flex items-center gap-1"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
          Loading products...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {String(error)}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
          No products found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {product.id}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{product.sku}</td>
                  <td className="px-4 py-3 text-slate-700">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {product.stock_quantity}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {product.updated_at}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="btn btn-xs btn-outline"
                        title="Edit product"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="btn btn-xs btn-outline btn-error"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingId ? "Edit Product" : "Add Product"}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  name="stock_quantity"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {formError && (
                <p className="text-sm text-red-600">{formError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-neutral w-full"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
