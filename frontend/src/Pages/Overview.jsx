import { useState, useEffect } from "react";
import { Package, Users, UserX, IdCardLanyard, ShoppingCart } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const StatCard = ({ icon: Icon, label, value, loading }) => (
  <div className="rounded-lg bg-white p-4 shadow-sm flex items-center gap-4">
    <div className="rounded-md bg-slate-100 p-3 text-slate-700">
      <Icon size={22} />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">
        {loading ? "..." : value}
      </p>
    </div>
  </div>
);

const Overview = () => {
  const [stats, setStats] = useState({
    products: null,
    customers: null,
    lostCustomers: null,
    employees: null,
    sales: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoints = {
      products: "products",
      customers: "customers",
      lostCustomers: "customers/lost",
      employees: "employees",
      sales: "sales",
    };

    Promise.all(
      Object.entries(endpoints).map(([key, path]) =>
        fetch(`${API_BASE}/${path}`)
          .then((res) => res.json())
          .then((result) => [key, (result?.data || []).length])
          .catch(() => [key, "-"])
      )
    ).then((entries) => {
      setStats(Object.fromEntries(entries));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Package}
          label="Products"
          value={stats.products}
          loading={loading}
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={stats.customers}
          loading={loading}
        />
        <StatCard
          icon={UserX}
          label="Lost Customers"
          value={stats.lostCustomers}
          loading={loading}
        />
        <StatCard
          icon={IdCardLanyard}
          label="Employees"
          value={stats.employees}
          loading={loading}
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Sales"
          value={stats.sales}
          loading={loading}
        />
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm text-sm text-slate-600">
        Use the navigation on the left to manage products, record sales, and
        follow up with customers who haven't purchased recently.
      </div>
    </div>
  );
};

export default Overview;
