import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  PackageSearch,
  IdCardLanyard,
  ShoppingCart,
  // Settings,
  // BarChart3,
  // FileText,
} from "lucide-react";
import Overview from "./Overview";
import Products from "./Products";
import Customers from "./Customers";
import Employees from "./Employees";
import Sales from "./Sales";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: PackageSearch },
  { id: "sales", label: "Sales", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
  { id: "employees", label: "Employees", icon: IdCardLanyard },
];

const PAGE_CONTENT = {
  overview: {
    title: "Overview",
    component: Overview,
  },
  products: {
    title: "Products",
    component: Products,
  },
  sales: {
    title: "Sales",
    component: Sales,
  },
  customers: {
    title: "Customers",
    component: Customers,
  },
  employees: {
    title: "Employees",
    component: Employees,
  },
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState("overview");
  const current = PAGE_CONTENT[activePage];

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          {current.title}
        </h2>
        <div className="mt-4 text-gray-600 max-w-auto">
          {current.component ? (
            (() => {
              const Component = current.component;
              return <Component />;
            })()
          ) : (
            <p>Not Found</p>
          )}
        </div>
      </main>
    </div>
  );
}
