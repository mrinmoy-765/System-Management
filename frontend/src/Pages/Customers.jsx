import { useState, useEffect } from "react";
import { History, UserPlus, Mail, X } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  // Manage-customer modal state
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [assignEmployeeId, setAssignEmployeeId] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionBusy, setActionBusy] = useState(false);

  // Re-engagement state
  const [reengageChannel, setReengageChannel] = useState("email");
  const [reengageMessage, setReengageMessage] = useState(
    "We miss you! Come back and get 10% off your next purchase.",
  );

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const fetchCustomers = () => {
    setLoading(true);
    setError("");

    const url = isChecked
      ? `${API_BASE}/customers/lost`
      : `${API_BASE}/customers`;

    return fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setMessage(result?.message || "");
        setCustomers(result?.data || []);
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked]);

  useEffect(() => {
    fetch(`${API_BASE}/employees`)
      .then((res) => res.json())
      .then((result) => setEmployees(result?.data || []))
      .catch(() => {});
  }, []);

  const openManageModal = (customer) => {
    setActiveCustomer(customer);
    setHistoryData(null);
    setActionMessage("");
    setAssignEmployeeId(customer.assigned_employee_id || "");
    setReengageChannel("email");
    setReengageMessage(
      `Hi ${customer.name}, we miss you! Come back and enjoy a special offer.`,
    );

    setHistoryLoading(true);
    fetch(`${API_BASE}/customers/${customer.id}/history`)
      .then((res) => res.json())
      .then((result) => {
        const payload = result?.data;

        if (Array.isArray(payload)) {
          setHistoryData({ sales: payload });
        } else if (payload && typeof payload === "object") {
          const sales =
            payload.sales || payload.purchases || payload.history || [];
          setHistoryData({ ...payload, sales });
        } else {
          setHistoryData({ sales: [] });
        }
      })
      .catch(() => setHistoryData({ sales: [] }))
      .finally(() => setHistoryLoading(false));
  };

  const closeModal = () => {
    setActiveCustomer(null);
    setHistoryData(null);
    setActionMessage("");
  };

  const handleAssign = async () => {
    if (!activeCustomer || !assignEmployeeId) return;

    setActionBusy(true);
    setActionMessage("");

    try {
      const res = await fetch(
        `${API_BASE}/customers/${activeCustomer.id}/assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id: Number(assignEmployeeId) }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        setActionMessage(result?.message || "Could not assign employee.");
        return;
      }

      setActionMessage(result?.message || "Employee assigned successfully.");
      fetchCustomers();
    } catch {
      setActionMessage("Could not reach the server.");
    } finally {
      setActionBusy(false);
    }
  };

  const handleReengage = async () => {
    if (!activeCustomer) return;

    setActionBusy(true);
    setActionMessage("");

    try {
      const res = await fetch(
        `${API_BASE}/customers/${activeCustomer.id}/reengage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: reengageChannel,
            message: reengageMessage,
          }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        setActionMessage(result?.message || "Could not send re-engagement.");
        return;
      }

      setActionMessage(result?.message || "Re-engagement message sent.");
    } catch {
      setActionMessage("Could not reach the server.");
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="space-y-4 max-w-full">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">{message}</h3>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          See Lost Customers
        </label>
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
          Loading customers...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {String(error)}
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
          No customers found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {customer.id}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{customer.name}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.email}</td>
                  <td className="px-4 py-3 text-slate-700">{customer.phone}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {customer.updated_at}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openManageModal(customer)}
                      className="btn btn-xs btn-outline flex items-center gap-1"
                      title="View history, assign, or re-engage"
                    >
                      <History size={14} />
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manage customer modal */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg max-h-[85vh] overflow-y-auto">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {activeCustomer.name}
                </h3>
                <p className="text-sm text-slate-500">{activeCustomer.email}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {actionMessage && (
              <div className="mb-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {actionMessage}
              </div>
            )}

            {/* Assign */}
            <div className="mb-4">
              <p className="mb-1 text-xs font-medium text-slate-600">
                Assign to employee
              </p>
              <div className="flex gap-2">
                <select
                  value={assignEmployeeId}
                  onChange={(e) => setAssignEmployeeId(e.target.value)}
                  className="select select-bordered select-sm flex-1"
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={actionBusy || !assignEmployeeId}
                  className="btn btn-sm btn-neutral flex items-center gap-1"
                >
                  <UserPlus size={14} />
                  Assign
                </button>
              </div>
            </div>

            {/* Reengage */}
            <div className="mb-4 space-y-2">
              <p className="text-xs font-medium text-slate-600">
                Re-engagement channel
              </p>
              <select
                value={reengageChannel}
                onChange={(e) => setReengageChannel(e.target.value)}
                className="select select-bordered select-sm w-full"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>

              <textarea
                value={reengageMessage}
                onChange={(e) => setReengageMessage(e.target.value)}
                className="textarea textarea-bordered w-full"
                rows={4}
                placeholder="Write re-engagement message..."
              />

              <button
                onClick={handleReengage}
                disabled={actionBusy}
                className="btn btn-sm btn-outline flex items-center gap-1"
              >
                <Mail size={14} />
                Send Re-engagement
              </button>
            </div>

            {/* Purchase history */}
            <div>
              <p className="mb-2 text-xs font-medium text-slate-600">
                Purchase History
              </p>

              {historyLoading ? (
                <p className="text-sm text-slate-500">Loading history...</p>
              ) : (
                <>
                  {(historyData?.purchase_frequency != null ||
                    historyData?.last_purchase_date) && (
                    <div className="mb-3 flex gap-4 text-xs text-slate-600">
                      {historyData?.purchase_frequency != null && (
                        <span>
                          Purchases:{" "}
                          <strong>{historyData.purchase_frequency}</strong>
                        </span>
                      )}
                      {historyData?.last_purchase_date && (
                        <span>
                          Last purchase:{" "}
                          <strong>{historyData.last_purchase_date}</strong>
                        </span>
                      )}
                    </div>
                  )}

                  {!historyData?.sales || historyData.sales.length === 0 ? (
                    <p className="text-sm text-slate-500">No purchases yet.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-md border border-slate-200">
                      <table className="min-w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-3 py-2">Items</th>
                            <th className="px-3 py-2">Total</th>
                            <th className="px-3 py-2">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {historyData.sales.map((sale) => (
                            <tr key={sale.id}>
                              <td className="px-3 py-2 text-slate-700">
                                {sale.items && sale.items.length > 0 ? (
                                  <ul className="space-y-0.5">
                                    {sale.items.map((item) => (
                                      <li
                                        key={item.id}
                                        className="whitespace-nowrap"
                                      >
                                        {item.product?.name || "Unknown"}{" "}
                                        <span className="text-slate-500">
                                          x{item.quantity}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  sale.product?.name || sale.product_name || "-"
                                )}
                              </td>
                              <td className="px-3 py-2 text-slate-700">
                                {sale.total_amount != null
                                  ? `$${Number(sale.total_amount).toFixed(2)}`
                                  : sale.total_price
                                    ? `$${Number(sale.total_price).toFixed(2)}`
                                    : "-"}
                              </td>
                              <td className="px-3 py-2 text-slate-500">
                                {sale.sold_at ||
                                  sale.sale_date ||
                                  sale.created_at}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
