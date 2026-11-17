
import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

import {
  LayoutDashboard, Building2, MapPin, Tags, Database,
  Search, Bell, ChevronDown, TrendingUp, Menu,
  RefreshCw, ArrowUpRight, BriefcaseBusiness, X,
  CheckCircle2, AlertCircle, ArrowUpDown
} from "lucide-react";

import "./App.css";

const API = "http://127.0.0.1:8000";

const COLORS = [
  "#3976ed", "#8b5cf6", "#06a6a6", "#f59e0b",
  "#10b981", "#ec4899", "#64748b", "#ef4444",
  "#a78bfa", "#14b8a6", "#d97706", "#6366f1"
];

export default function App() {
  const [summary, setSummary] = useState({});
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);

  const [search, setSearch] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: "business_name",
    direction: "asc"
  });

  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA FROM FASTAPI
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [s, c, cat, l] = await Promise.all([
        fetch(`${API}/api/dashboard/summary`),
        fetch(`${API}/api/dashboard/city-wise`),
        fetch(`${API}/api/dashboard/category-wise`),
        fetch(`${API}/api/listings?limit=500`)
      ]);

      if (![s, c, cat, l].every(response => response.ok)) {
        throw new Error("API response failed");
      }

      const [sd, cd, catd, ld] = await Promise.all([
        s.json(),
        c.json(),
        cat.json(),
        l.json()
      ]);

      setSummary(sd);
      setCities(cd);
      setCategories(catd);
      setListings(Array.isArray(ld) ? ld : []);

    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to backend. Please check whether FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // SEARCH AND SORT
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = listings.filter(item => {
      if (!query) return true;

      const city = String(item.city ?? "").trim().toLowerCase();

      const businessName = String(item.business_name ?? "").toLowerCase();
      const category = String(item.category ?? "").toLowerCase();
      const phone = String(item.phone ?? "").toLowerCase();
      const address = String(item.address ?? "").toLowerCase();
      const source = String(item.source ?? "").toLowerCase();

      // City search has priority:
      // If query matches any city name, show only matching cities.
      const matchingCities = listings.some(listing =>
        String(listing.city ?? "").trim().toLowerCase().includes(query)
      );

      if (matchingCities) {
        return city.includes(query);
      }

      // Otherwise search other fields.
      return (
        businessName.includes(query) ||
        category.includes(query) ||
        phone.includes(query) ||
        address.includes(query) ||
        source.includes(query)
      );
    });

    return [...result].sort((a, b) => {
      const first = String(a[sortConfig.key] ?? "").toLowerCase();
      const second = String(b[sortConfig.key] ?? "").toLowerCase();

      const comparison = first.localeCompare(
        second,
        undefined,
        { numeric: true, sensitivity: "base" }
      );

      return sortConfig.direction === "asc"
        ? comparison
        : -comparison;
    });
  }, [listings, search, sortConfig]);

  // SORT COLUMN
  const handleSort = key => {
    setSortConfig(current => ({
      key,
      direction:
        current.key === key && current.direction === "asc"
          ? "desc"
          : "asc"
    }));
  };

  const SortHeader = ({ label, sortKey }) => (
    <th
      onClick={() => handleSort(sortKey)}
      title={`Sort by ${label}`}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6
      }}>
        {label}
        <ArrowUpDown size={13} />
        {sortConfig.key === sortKey &&
          (sortConfig.direction === "asc" ? "↑" : "↓")}
      </span>
    </th>
  );

  // DASHBOARD STATS
  const stats = [
    {
      label: "Total Businesses",
      value: summary.total_businesses ?? 0,
      icon: Building2,
      color: "blue",
      note: "Total business records"
    },
    {
      label: "Total Cities",
      value: summary.total_cities ?? 0,
      icon: MapPin,
      color: "purple",
      note: "Locations covered"
    },
    {
      label: "Categories",
      value: summary.total_categories ?? 0,
      icon: Tags,
      color: "green",
      note: "Business sectors"
    },
    {
      label: "Data Sources",
      value: summary.total_sources ?? 0,
      icon: Database,
      color: "orange",
      note: "Dataset sources"
    }
  ];

  const nav = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Business Listings", icon: Building2 },
    { name: "City Analytics", icon: MapPin }
  ];

  const totalCategoryRecords = categories.reduce(
    (sum, item) => sum + Number(item.count || 0), 0
  );

  const CustomTooltip = ({ active: isActive, payload, label }) => {
    if (isActive && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <strong>{label}</strong>
          <p>{payload[0].value} Businesses</p>
        </div>
      );
    }
    return null;
  };

  const clearSearch = () => setSearch("");

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "" : "sidebar-closed"}`}>
        <div className="brand">
          <div className="brand-icon">
            <BriefcaseBusiness size={22} />
          </div>
          <div className="brand-text">
            <h2>BizInsights</h2>
            <span>BUSINESS INTELLIGENCE</span>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav>
          {nav.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${active === item.name ? "active" : ""}`}
                onClick={() => {
                  setActive(item.name);
                  setSearch("");
                }}
                title={item.name}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">?</div>
            <strong>Business Insights</strong>
            <p>Explore business data and understand market distribution.</p>
          </div>

          <div className="profile">
            <div className="avatar">PS</div>
            <div className="profile-info">
              <strong>Administrator</strong>
              <span>Dashboard User</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="main-area">

        <header className="topbar">
          <button
            className="icon-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{active}</strong>
          </div>

          <div className="top-actions">
            <div className="api-status">
              {error ? (
                <>
                  <span className="status-dot offline" />
                  API Offline
                </>
              ) : (
                <>
                  <span className="status-dot" />
                  API Connected
                </>
              )}
            </div>

            <button
              className={`icon-btn refresh-btn ${loading ? "spinning" : ""}`}
              onClick={loadData}
              title="Refresh data"
              disabled={loading}
            >
              <RefreshCw size={18} />
            </button>

            <button className="icon-btn notification-btn" title="Notifications">
              <Bell size={19} />
            </button>

            <div className="top-avatar">PS</div>
          </div>
        </header>

        <div className="content">

          <div className="welcome-row">
            <div>
              <div className="eyebrow">BUSINESS LISTINGS SYSTEM</div>
              <h1>
                {active === "Dashboard" ? "Business Dashboard" : active}
              </h1>
              <p>
                Monitor business listings and understand market distribution.
              </p>
            </div>

            <div className="date-chip">
              <Database size={15} />
              November 2026
            </div>
          </div>

          {error && (
            <div className="error-banner">
              <AlertCircle size={17} />
              {error}
            </div>
          )}

          {/* DASHBOARD */}
          {active === "Dashboard" && (
            <>
              <div className="section-heading">
                <div>
                  <h2>Overview</h2>
                  <p>Key performance indicators at a glance</p>
                </div>

                <div className="sample-badge">
                  <span />
                  Sample Dataset
                </div>
              </div>

              <div className="stats-grid">
                {stats.map(stat => {
                  const Icon = stat.icon;

                  return (
                    <div className="stat-card" key={stat.label}>
                      <div className="stat-top">
                        <div className={`stat-icon ${stat.color}`}>
                          <Icon size={21} />
                        </div>
                        <ArrowUpRight size={17} className="stat-arrow" />
                      </div>

                      <div className="stat-label">{stat.label}</div>

                      <div className="stat-value">
                        {loading
                          ? "..."
                          : Number(stat.value).toLocaleString("en-IN")}
                      </div>

                      <div className="stat-note">
                        <TrendingUp size={13} />
                        {stat.note}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="charts-grid">

                <section className="panel city-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Business by City</h3>
                      <p>Distribution across locations</p>
                    </div>
                    <span className="chart-tag">CITY ANALYSIS</span>
                  </div>

                  <div className="chart-area">
                    {cities.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={cities}
                          margin={{ top: 12, right: 12, left: -18, bottom: 4 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#edf0f5"
                          />
                          <XAxis
                            dataKey="city"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#718096", fontSize: 11 }}
                            interval={0}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#718096", fontSize: 11 }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey="count"
                            name="Businesses"
                            fill="#3976ed"
                            radius={[7, 7, 0, 0]}
                            maxBarSize={45}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="chart-empty">
                        {loading ? "Loading chart..." : "No city data available"}
                      </div>
                    )}
                  </div>
                </section>

                <section className="panel category-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Category Distribution</h3>
                      <p>Listings by business category</p>
                    </div>
                    <span className="chart-tag">CATEGORIES</span>
                  </div>

                  <div className="chart-area pie-layout">
                    <div className="pie-visual">
                      {categories.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categories}
                              dataKey="count"
                              nameKey="category"
                              cx="50%"
                              cy="50%"
                              innerRadius={48}
                              outerRadius={82}
                              paddingAngle={3}
                            >
                              {categories.map((entry, index) => (
                                <Cell
                                  key={entry.category}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>

                            <Tooltip
                              contentStyle={{
                                borderRadius: 10,
                                border: "1px solid #e5eaf2",
                                fontSize: 11
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="chart-empty">
                          {loading ? "Loading..." : "No category data"}
                        </div>
                      )}

                      <div className="pie-center">
                        <strong>
                          {loading
                            ? "..."
                            : totalCategoryRecords.toLocaleString("en-IN")}
                        </strong>
                        <span>Listings</span>
                      </div>
                    </div>

                    <div className="pie-legend">
                      {categories.map((item, index) => (
                        <div
                          className="pie-legend-item"
                          key={item.category}
                          title={item.category}
                        >
                          <span
                            className="pie-legend-dot"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                          <span className="pie-legend-name">
                            {item.category}
                          </span>
                          <strong>{item.count}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              <section className="insight-panel">
                <div className="insight-icon">
                  <CheckCircle2 size={21} />
                </div>
                <div>
                  <strong>Dashboard Data Overview</strong>
                  <p>
                    The dashboard is connected to the FastAPI backend and MySQL
                    database. The current dataset contains sample records
                    generated for demonstration and testing.
                  </p>
                </div>
              </section>
            </>
          )}

          {/* CITY ANALYTICS */}
          {active === "City Analytics" && (
            <section className="panel analytics-panel">
              <div className="panel-heading">
                <div>
                  <h3>City Performance</h3>
                  <p>Business listings across all available cities</p>
                </div>
                <span className="chart-tag">CITY REPORT</span>
              </div>

              <div className="chart-area city-large">
                {cities.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cities}
                      margin={{ top: 15, right: 20, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="city" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        name="Businesses"
                        fill="#3976ed"
                        radius={[7, 7, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-empty">
                    {loading ? "Loading..." : "No city data available"}
                  </div>
                )}
              </div>

              <div className="city-summary">
                {cities.map((city, index) => (
                  <div className="city-summary-item" key={city.city}>
                    <span className="city-rank">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="city-name">{city.city}</span>
                    <strong>{city.count} Businesses</strong>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* BUSINESS LISTINGS */}
          {active === "Business Listings" && (
            <section className="panel listings-panel">

              <div className="panel-heading">
                <div>
                  <h3>Business Directory</h3>
                  <p>Browse, search and explore business records</p>
                </div>

                <span className="record-count">
                  {filtered.length} Records
                </span>
              </div>

              <div className="search-row">

                <form
                  className="search-wrap"
                  onSubmit={e => e.preventDefault()}
                >
                  <Search size={18} />

                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search city (e.g. Raipur), business, category, phone..."
                  />

                  {search && (
                    <button
                      type="button"
                      className="clear-search"
                      onClick={clearSearch}
                      title="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </form>

                <button
                  className="refresh-list-btn"
                  onClick={loadData}
                  disabled={loading}
                  type="button"
                >
                  <RefreshCw size={15} />
                  Refresh
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <SortHeader
                        label="BUSINESS NAME"
                        sortKey="business_name"
                      />
                      <SortHeader
                        label="CATEGORY"
                        sortKey="category"
                      />
                      <SortHeader
                        label="CITY"
                        sortKey="city"
                      />
                      <SortHeader
                        label="PHONE"
                        sortKey="phone"
                      />
                      <SortHeader
                        label="SOURCE"
                        sortKey="source"
                      />
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="business-name-cell">
                            <div className="business-table-icon">
                              <Building2 size={15} />
                            </div>
                            <strong>{item.business_name}</strong>
                          </div>
                        </td>

                        <td>
                          <span className="category-pill">
                            {item.category || "N/A"}
                          </span>
                        </td>

                        <td>{item.city || "N/A"}</td>

                        <td>{item.phone || "N/A"}</td>

                        <td>
                          <span className="source-pill">
                            {item.source || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <div className="empty-state">
                    <Search size={25} />
                    <strong>No matching records found</strong>
                    <span>
                      Try another business name, city or category.
                    </span>
                  </div>
                )}
              </div>

              <div className="table-footer">
                Showing {filtered.length} of {listings.length} loaded records
              </div>

            </section>
          )}

          <footer className="footer">
            <span>BizInsights · Business Listings Intelligence</span>
            <span>Built with React, FastAPI & MySQL</span>
          </footer>

        </div>
      </main>
    </div>
  );
}
