import { useState, useEffect } from "react";
import { X } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // KPI modal state
  const [activeEmployeeId, setActiveEmployeeId] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [kpiLoading, setKpiLoading] = useState(false);
  const [kpiError, setKpiError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/employees`)
      .then((response) => response.json())
      .then((result) => {
        setMessage(result?.message || "");
        setEmployees(result.data || []);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const openKpiModal = (employee) => {
    setActiveEmployeeId(employee.id);
    setKpiData(null);
    setKpiError("");
    setKpiLoading(true);

    fetch(`${API_BASE}/employees/${employee.id}/kpi`)
      .then((res) => res.json())
      .then((result) => setKpiData(result?.data || null))
      .catch(() => setKpiError("Could not load KPI data."))
      .finally(() => setKpiLoading(false));
  };

  const closeModal = () => {
    setActiveEmployeeId(null);
    setKpiData(null);
    setKpiError("");
  };

  return (
    <div className="space-y-4 max-w-full">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">{message}</h3>
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
          Loading employees...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {String(error)}
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
          No employees found.
        </div>
      ) : (
        <div className="overflow-x-auto  rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">KPI Score</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {employee.id}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <button
                      onClick={() => openKpiModal(employee)}
                      className="text-blue-600 hover:underline hover:text-blue-800"
                    >
                      {employee.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{employee.email}</td>

                  <td className="px-4 py-3 text-slate-700">
                    {employee.kpi_score}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {employee.updated_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* KPI modal */}
      {activeEmployeeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Employee KPI
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {kpiLoading ? (
              <p className="text-sm text-slate-500">Loading KPI...</p>
            ) : kpiError ? (
              <p className="text-sm text-red-600">{kpiError}</p>
            ) : kpiData ? (
              <div className="space-y-3">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {kpiData.employee?.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {kpiData.employee?.email}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-md bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-500">KPI Score</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {kpiData.kpi_score}
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-500">Assignments</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {kpiData.active_assignments}
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-500">Sales</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {kpiData.sales_count}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No KPI data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
