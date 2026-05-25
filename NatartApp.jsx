import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API = "https://natart-api.onrender.com/api";

function getToken() { return localStorage.getItem("natartToken"); }
function setToken(t) { localStorage.setItem("natartToken", t); }
function clearToken() { localStorage.removeItem("natartToken"); }

async function apiFetch(path, opts = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) };
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const G = "#8B6508";
const GL = "#C49A1A";
const ROSE = "#FFF5F5";
const CREAM = "#FFF8E8";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Jost', sans-serif; background: ${ROSE}; color: #3a3028; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #e0c8a0; border-radius: 4px; }

  .natart-app { min-height: 100vh; display: flex; flex-direction: column; }

  /* HEADER */
  .na-header { background: #FFE8E8; padding: 0 24px; height: 58px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0d0d0; position: sticky; top: 0; z-index: 100; }
  .na-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: ${G}; letter-spacing: 3px; }
  .na-header-right { display: flex; align-items: center; gap: 12px; }
  .na-user-chip { font-size: 12px; color: #7a6040; background: ${CREAM}; border: 1px solid #e0c890; border-radius: 20px; padding: 4px 12px; }

  /* TABS */
  .na-tabs { display: flex; background: #FFE8E8; border-bottom: 1px solid #f0d0d0; overflow-x: auto; gap: 0; padding: 0 16px; }
  .na-tab { padding: 12px 18px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; background: transparent; color: #9a7050; border-bottom: 2px solid transparent; white-space: nowrap; transition: color .2s; }
  .na-tab.active { color: ${G}; border-bottom-color: ${G}; font-weight: 600; }
  .na-tab:hover:not(.active) { color: ${G}; }

  /* CONTENT */
  .na-content { flex: 1; padding: 24px; max-width: 1100px; width: 100%; margin: 0 auto; }

  /* CARDS */
  .na-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 16px rgba(139,101,8,.07); border: 1px solid #f5e8d0; padding: 20px; margin-bottom: 16px; }
  .na-card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; color: ${G}; font-weight: 700; margin-bottom: 14px; }

  /* METRICS */
  .na-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 20px; }
  .na-metric { background: ${CREAM}; border: 1px solid #e8d08a; border-radius: 10px; padding: 16px; text-align: center; }
  .na-metric-val { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: ${G}; }
  .na-metric-lbl { font-size: 11px; color: #9a7050; margin-top: 3px; letter-spacing: .5px; text-transform: uppercase; }

  /* TABLE */
  .na-table-wrap { overflow-x: auto; }
  .na-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .na-table th { padding: 9px 12px; text-align: left; font-size: 11px; letter-spacing: .5px; text-transform: uppercase; color: #9a7050; border-bottom: 1.5px solid #f0d8b0; font-weight: 600; }
  .na-table td { padding: 10px 12px; border-bottom: 1px solid #f8efe0; vertical-align: middle; }
  .na-table tr:hover td { background: #fffaf2; }
  .na-table tr.selected td { background: #fff8e8; }

  /* BADGES */
  .na-badge { display: inline-block; padding: 3px 9px; border-radius: 99px; font-size: 11px; font-weight: 600; }

  /* FORMS */
  .na-form-group { margin-bottom: 12px; }
  .na-label { font-size: 11px; text-transform: uppercase; letter-spacing: .5px; color: #9a7050; font-weight: 600; display: block; margin-bottom: 5px; }
  .na-input { width: 100%; padding: 9px 12px; border: 1px solid #e0c890; border-radius: 8px; font-family: 'Jost', sans-serif; font-size: 13px; background: ${ROSE}; color: #3a3028; outline: none; transition: border-color .2s; }
  .na-input:focus { border-color: ${GL}; }
  .na-select { width: 100%; padding: 9px 12px; border: 1px solid #e0c890; border-radius: 8px; font-family: 'Jost', sans-serif; font-size: 13px; background: ${ROSE}; color: #3a3028; outline: none; }
  .na-textarea { width: 100%; padding: 9px 12px; border: 1px solid #e0c890; border-radius: 8px; font-family: 'Jost', sans-serif; font-size: 13px; background: ${ROSE}; color: #3a3028; resize: vertical; min-height: 70px; outline: none; }

  /* BUTTONS */
  .na-btn { padding: 8px 16px; border-radius: 8px; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all .18s; }
  .na-btn-gold { background: ${G}; color: #fff; } .na-btn-gold:hover { background: #6e5006; }
  .na-btn-outline { background: transparent; border: 1.5px solid ${G}; color: ${G}; } .na-btn-outline:hover { background: #fff8e0; }
  .na-btn-danger { background: #c62828; color: #fff; } .na-btn-danger:hover { background: #a01010; }
  .na-btn-ghost { background: transparent; border: none; color: #9a7050; font-size: 12px; padding: 4px 8px; } .na-btn-ghost:hover { color: ${G}; }
  .na-btn:disabled { opacity: .5; cursor: not-allowed; }
  .na-btn-sm { padding: 4px 10px; font-size: 11px; border-radius: 6px; }

  /* AUTH */
  .na-auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(160deg, #fff0f0 0%, #fff8e8 100%); }
  .na-auth-box { background: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(139,101,8,.12); padding: 40px 36px; width: 380px; max-width: 95vw; }
  .na-auth-logo { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: ${G}; letter-spacing: 4px; text-align: center; margin-bottom: 4px; }
  .na-auth-sub { text-align: center; font-size: 12px; color: #9a7050; letter-spacing: 1px; margin-bottom: 28px; }
  .na-auth-switch { text-align: center; margin-top: 16px; font-size: 12px; color: #9a7050; }
  .na-auth-switch button { background: none; border: none; color: ${G}; font-weight: 600; cursor: pointer; font-size: 12px; }

  /* TOAST */
  .na-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #2d2416; color: #f5e8c0; padding: 10px 22px; border-radius: 99px; font-size: 13px; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,.25); animation: toast-in .25s ease; }
  @keyframes toast-in { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }

  /* PRODUCTS GRID */
  .na-products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
  .na-product-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(139,101,8,.06); border: 1px solid #f5e8d0; overflow: hidden; transition: transform .2s; }
  .na-product-card:hover { transform: translateY(-3px); }
  .na-product-img { width: 100%; height: 150px; background: linear-gradient(135deg, #ffe8c2, #ffd6e0); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
  .na-product-body { padding: 14px; }
  .na-product-name { font-family: 'Cormorant Garamond', serif; font-size: 1rem; color: ${G}; font-weight: 700; margin-bottom: 4px; }
  .na-product-cat { font-size: 10px; text-transform: uppercase; letter-spacing: .5px; color: #b09050; margin-bottom: 8px; }
  .na-product-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
  .na-product-price { font-weight: 700; font-size: 1rem; color: #3a3028; }

  /* CART */
  .na-cart-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f5ece0; }
  .na-cart-emoji { font-size: 1.5rem; width: 36px; text-align: center; }
  .na-cart-name { flex: 1; font-weight: 500; font-size: 13px; }
  .na-cart-qty { display: flex; align-items: center; gap: 6px; }
  .na-qty-btn { width: 24px; height: 24px; border-radius: 50%; border: 1px solid #e0c890; background: ${CREAM}; cursor: pointer; font-weight: 700; color: ${G}; font-size: 14px; display: flex; align-items: center; justify-content: center; }
  .na-cart-price { font-weight: 600; min-width: 52px; text-align: right; }
  .na-cart-summary { background: ${CREAM}; border-radius: 8px; padding: 14px; margin: 14px 0; }
  .na-summary-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
  .na-summary-total { font-weight: 700; font-size: 1rem; color: ${G}; border-top: 1.5px solid #e0c890; padding-top: 8px; margin-top: 4px; }

  /* CHAT */
  .na-chat-wrap { display: grid; grid-template-columns: 220px 1fr; height: 480px; border: 1px solid #f0d8b0; border-radius: 12px; overflow: hidden; }
  .na-chat-sidebar { border-right: 1px solid #f0d8b0; overflow-y: auto; background: #fffaf5; }
  .na-chat-conv { padding: 10px 14px; cursor: pointer; border-bottom: 1px solid #f5ede0; }
  .na-chat-conv:hover { background: ${CREAM}; }
  .na-chat-conv.active { background: ${CREAM}; border-left: 3px solid ${G}; }
  .na-chat-conv-name { font-size: 13px; font-weight: 600; color: #3a3028; }
  .na-chat-conv-preview { font-size: 11px; color: #9a7050; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .na-chat-main { display: flex; flex-direction: column; }
  .na-chat-messages { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 8px; background: ${ROSE}; }
  .na-msg { max-width: 75%; padding: 9px 13px; border-radius: 12px; font-size: 13px; line-height: 1.5; }
  .na-msg.from-user { background: #fff; border: 1px solid #f0d8c0; border-radius: 12px 12px 12px 3px; align-self: flex-start; }
  .na-msg.from-admin { background: linear-gradient(135deg,${G},${GL}); color: #fff; border-radius: 12px 12px 3px 12px; align-self: flex-end; }
  .na-msg-name { font-size: 10px; color: #b09070; margin-top: 3px; }
  .na-chat-input-row { display: flex; gap: 8px; padding: 10px 14px; border-top: 1px solid #f0d8b0; background: #fff; }
  .na-chat-placeholder { flex: 1; display: flex; align-items: center; justify-content: center; color: #c0a070; font-size: 13px; }

  /* DETAIL PANEL */
  .na-detail { background: #fff; border: 1px solid #f0d8b0; border-radius: 10px; padding: 16px; margin-top: 14px; }
  .na-detail-title { font-size: 12px; text-transform: uppercase; letter-spacing: .5px; color: #9a7050; font-weight: 600; margin-bottom: 8px; }
  .na-detail-close { float: right; background: none; border: none; font-size: 16px; color: #9a7050; cursor: pointer; }

  /* FILTER ROW */
  .na-filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .na-filter-chip { padding: 4px 12px; border-radius: 99px; font-size: 11px; cursor: pointer; border: 1px solid #e0c890; background: ${CREAM}; color: #7a6040; font-weight: 500; }
  .na-filter-chip.active { background: ${G}; color: #fff; border-color: ${G}; }

  /* EMPTY */
  .na-empty { text-align: center; padding: 48px 20px; color: #b0a090; }
  .na-empty-icon { font-size: 2.5rem; margin-bottom: 12px; }

  /* ORDER CARD */
  .na-order-card { background: #fff; border: 1px solid #f0d8b0; border-radius: 10px; padding: 16px; margin-bottom: 12px; cursor: pointer; transition: box-shadow .2s; }
  .na-order-card:hover { box-shadow: 0 4px 20px rgba(139,101,8,.1); }
  .na-order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .na-order-num { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 700; color: ${G}; }
  .na-order-items { font-size: 12px; color: #9a7050; }
  .na-order-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
  .na-order-price { font-weight: 700; font-size: 1rem; }

  /* LOADING */
  .na-loading { display: flex; align-items: center; justify-content: center; padding: 40px; }
  .na-spinner { width: 28px; height: 28px; border: 3px solid #f0d8b0; border-top-color: ${G}; border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ERROR */
  .na-err { background: #fff0f0; border: 1px solid #f0c0c0; color: #c04040; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-bottom: 12px; }

  /* ADMIN PRODUCTS */
  .na-admin-product-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f5ece0; }
  .na-admin-product-emoji { font-size: 1.4rem; width: 32px; text-align: center; }

  @media (max-width: 700px) {
    .na-content { padding: 14px; }
    .na-chat-wrap { grid-template-columns: 1fr; grid-template-rows: 160px 1fr; }
    .na-chat-sidebar { border-right: none; border-bottom: 1px solid #f0d8b0; display: flex; overflow-x: auto; overflow-y: hidden; height: 160px; }
    .na-chat-conv { flex-shrink: 0; width: 130px; }
    .na-table th, .na-table td { padding: 8px; font-size: 12px; }
  }
`;

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS = {
  pending:   { bg: "#fff8e0", text: "#9a6a00", label: "მომლოდინე" },
  confirmed: { bg: "#e0f0ff", text: "#0060a0", label: "დადასტურდა" },
  shipped:   { bg: "#e0eeff", text: "#0040c0", label: "გზაშია" },
  delivered: { bg: "#e0ffe8", text: "#006820", label: "მიტანილი" },
  cancelled: { bg: "#ffe0e0", text: "#a02020", label: "გაუქმდა" },
  completed: { bg: "#e0ffe8", text: "#006820", label: "დასრულდა" },
  active:    { bg: "#e0ffe8", text: "#006820", label: "აქტიური" },
  closed:    { bg: "#f0f0f0", text: "#707070", label: "დახურული" },
};

function Badge({ status }) {
  const s = STATUS[status] || { bg: "#f0f0f0", text: "#707070", label: status };
  return <span className="na-badge" style={{ background: s.bg, color: s.text }}>{s.label}</span>;
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  return msg ? <div className="na-toast">{msg}</div> : null;
}

// ─── LOADING / EMPTY ──────────────────────────────────────────────────────────
function Loading() { return <div className="na-loading"><div className="na-spinner" /></div>; }
function Empty({ icon = "🌿", text = "მონაცემი ვერ მოიძებნა" }) {
  return <div className="na-empty"><div className="na-empty-icon">{icon}</div><p>{text}</p></div>;
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", confirm: "", address: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const up = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));

  async function submit() {
    setErr(""); setLoading(true);
    if (mode === "login") {
      const { ok, data } = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email: f.email, password: f.password }) });
      if (ok && data.token) { setToken(data.token); onLogin(data.user); }
      else setErr(data.message || "შეცდომა");
    } else {
      if (f.password !== f.confirm) { setErr("პაროლები არ ემთხვევა"); setLoading(false); return; }
      const { ok, data } = await apiFetch("/auth/signup", { method: "POST", body: JSON.stringify({ name: f.name, email: f.email, phone: f.phone, password: f.password, confirmPassword: f.confirm, address: f.address }) });
      if (ok && data.token) { setToken(data.token); onLogin(data.user); }
      else setErr(data.message || "შეცდომა");
    }
    setLoading(false);
  }

  return (
    <div className="na-auth-wrap">
      <div className="na-auth-box">
        <div className="na-auth-logo">🕊️ NATART</div>
        <div className="na-auth-sub">Natural Art · Handmade Crafts</div>
        {err && <div className="na-err">{err}</div>}
        {mode === "signup" && <>
          <div className="na-form-group"><label className="na-label">სახელი</label><input className="na-input" value={f.name} onChange={up("name")} placeholder="სახელი და გვარი" /></div>
          <div className="na-form-group"><label className="na-label">ტელეფონი</label><input className="na-input" value={f.phone} onChange={up("phone")} placeholder="+995 577 ..." /></div>
          <div className="na-form-group"><label className="na-label">მისამართი</label><input className="na-input" value={f.address} onChange={up("address")} placeholder="ქალაქი, ქუჩა..." /></div>
        </>}
        <div className="na-form-group"><label className="na-label">ელ-ფოსტა</label><input className="na-input" type="email" value={f.email} onChange={up("email")} placeholder="email@example.com" /></div>
        <div className="na-form-group"><label className="na-label">პაროლი</label><input className="na-input" type="password" value={f.password} onChange={up("password")} placeholder="••••••••" /></div>
        {mode === "signup" && <div className="na-form-group"><label className="na-label">დაადასტურე პაროლი</label><input className="na-input" type="password" value={f.confirm} onChange={up("confirm")} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} /></div>}
        {mode === "login" && <div style={{ height: 8 }} />}
        <button className="na-btn na-btn-gold" style={{ width: "100%", padding: "11px", marginTop: 4 }} onClick={submit} disabled={loading}>
          {loading ? "..." : mode === "login" ? "შესვლა" : "რეგისტრაცია"}
        </button>
        <div className="na-auth-switch">
          {mode === "login" ? <>ანგარიში არ გაქვს? <button onClick={() => { setMode("signup"); setErr(""); }}>დარეგისტრირდი</button></> : <>უკვე გაქვს ანგარიში? <button onClick={() => { setMode("login"); setErr(""); }}>შესვლა</button></>}
        </div>

      </div>
    </div>
  );
}

// ─── USER: SHOP ───────────────────────────────────────────────────────────────
function UserShop({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    apiFetch("/products").then(({ data }) => {
      setProducts(Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cats = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];
  const shown = filter === "all" ? products : products.filter(p => p.category === filter);
  const active = shown.filter(p => p.isActive !== false);

  if (loading) return <Loading />;

  return (
    <>
      <div className="na-filter-row">
        {cats.map(c => <button key={c} className={`na-filter-chip${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>{c}</button>)}
      </div>
      {active.length === 0
        ? <Empty icon="🎨" text="პროდუქტი ვერ მოიძებნა" />
        : <div className="na-products-grid">
            {active.map(p => (
              <div key={p._id || p.id} className="na-product-card">
                <div className="na-product-img">{p.emoji || "🎨"}</div>
                <div className="na-product-body">
                  <div className="na-product-name">{p.name}</div>
                  <div className="na-product-cat">{p.category}</div>
                  {p.description && <div style={{ fontSize: 11, color: "#9a7050", marginBottom: 8, lineHeight: 1.5 }}>{p.description}</div>}
                  <div className="na-product-footer">
                    <span className="na-product-price">₾{p.price}</span>
                    <button className="na-btn na-btn-gold na-btn-sm" disabled={p.stock === 0} onClick={() => onAddToCart(p)}>
                      {p.stock === 0 ? "გაყიდულია" : "+ კალათა"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }
    </>
  );
}

// ─── USER: CART ───────────────────────────────────────────────────────────────
function UserCart({ cart, setCart, user, onCheckout }) {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", address: user?.address || "" });
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);

  const upF = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const changeQty = (id, d) => setCart(p => p.map(i => i._id === id || i.id === id ? { ...i, qty: Math.max(1, (i.qty || 1) + d) } : i));
  const remove = (id) => setCart(p => p.filter(i => (i._id || i.id) !== id));

  async function checkout() {
    if (!form.name || !form.email || !form.phone) return;
    setLoading(true);
    const items = cart.map(i => ({ name: i.name, price: i.price, quantity: i.qty || 1, productId: i._id || i.id }));
    const { ok, data } = await apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify({ ...form, customerName: form.name, customerEmail: form.email, customerPhone: form.phone, customerAddress: form.address, items, totalPrice: total + 10 })
    });
    setLoading(false);
    if (ok) { setCart([]); onCheckout(data.order || data); }
  }

  if (cart.length === 0) return <Empty icon="🛒" text="კალათა ცარიელია" />;

  return (
    <div className="na-card">
      <div className="na-card-title">🛒 კალათა</div>
      {cart.map(i => {
        const id = i._id || i.id;
        return (
          <div key={id} className="na-cart-item">
            <div className="na-cart-emoji">{i.emoji || "🎨"}</div>
            <div className="na-cart-name">{i.name}</div>
            <div className="na-cart-qty">
              <button className="na-qty-btn" onClick={() => changeQty(id, -1)}>−</button>
              <span style={{ minWidth: 20, textAlign: "center", fontSize: 13 }}>{i.qty || 1}</span>
              <button className="na-qty-btn" onClick={() => changeQty(id, 1)}>+</button>
            </div>
            <div className="na-cart-price">₾{i.price * (i.qty || 1)}</div>
            <button className="na-btn-ghost" onClick={() => remove(id)}>✕</button>
          </div>
        );
      })}
      <div className="na-cart-summary">
        <div className="na-summary-row"><span>ქვესულ:</span><span>₾{total}</span></div>
        <div className="na-summary-row"><span>მიწოდება:</span><span>₾10</span></div>
        <div className="na-summary-row na-summary-total"><span>სულ:</span><span>₾{total + 10}</span></div>
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, color: "#9a7050", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: ".5px" }}>მიწოდების ინფო</div>
        {[["name","სახელი გვარი"],["email","ელ-ფოსტა"],["phone","ტელეფონი"],["address","მისამართი"]].map(([k, lbl]) => (
          <div key={k} className="na-form-group">
            <label className="na-label">{lbl}</label>
            <input className="na-input" value={form[k]} onChange={upF(k)} />
          </div>
        ))}
        <button className="na-btn na-btn-gold" style={{ width: "100%", marginTop: 8 }} onClick={checkout} disabled={loading}>
          {loading ? "..." : "შეკვეთის გაფორმება ✓"}
        </button>
      </div>
    </div>
  );
}

// ─── USER: ORDERS ─────────────────────────────────────────────────────────────
function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    apiFetch("/orders/user").then(({ data }) => {
      setOrders(Array.isArray(data.orders) ? data.orders : Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (orders.length === 0) return <Empty icon="📦" text="შეკვეთები ჯერ არ გაქვს" />;

  return (
    <>
      {orders.map(o => (
        <div key={o._id} className="na-order-card" onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
          <div className="na-order-header">
            <span className="na-order-num">{o.orderNumber}</span>
            <Badge status={o.status} />
          </div>
          <div className="na-order-items">{(o.items || []).map(i => `${i.name} ×${i.quantity}`).join(", ")}</div>
          <div className="na-order-footer">
            <span style={{ fontSize: 12, color: "#9a7050" }}>{new Date(o.createdAt).toLocaleDateString("ka-GE")}</span>
            <span className="na-order-price">₾{o.totalPrice}</span>
          </div>
          {expanded === o._id && (
            <div className="na-detail" onClick={e => e.stopPropagation()}>
              {(o.items || []).map((it, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid #f5ece0" }}>
                  <span>{it.name} ×{it.quantity}</span>
                  <span>₾{it.price * it.quantity}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: 8, color: G }}>
                <span>სულ</span><span>₾{o.totalPrice}</span>
              </div>
              {o.trackingNumber && <div style={{ marginTop: 8, fontSize: 12, color: "#6080c0" }}>📦 Tracking: {o.trackingNumber}</div>}
              {o.adminNotes && <div style={{ marginTop: 6, fontSize: 12, color: "#9a7050", fontStyle: "italic" }}>💬 {o.adminNotes}</div>}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

// ─── USER: CHAT ───────────────────────────────────────────────────────────────
function UserChatView({ user }) {
  const [convId, setConvId] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    if (!convId) initConv();
  }, []);

  async function initConv() {
    const { ok, data } = await apiFetch("/chat/conversation", {
      method: "POST",
      body: JSON.stringify({ userName: user.name, userEmail: user.email, userPhone: user.phone || "", userId: user._id })
    });
    if (ok) {
      setConvId(data.conversationId);
      const { data: md } = await apiFetch(`/chat/messages/${data.conversationId}`);
      setMsgs(Array.isArray(md.messages) ? md.messages : Array.isArray(md) ? md : [
        { _id: "0", senderName: "NATART Support", message: "გამარჯობა! 🕊️ როგორ შეგვიძლია დაგეხმაროთ?", isFromAdmin: true }
      ]);
    }
  }

  async function send() {
    if (!inp.trim() || !convId || loading) return;
    const m = inp; setInp(""); setLoading(true);
    const { ok, data } = await apiFetch("/chat/message", {
      method: "POST",
      body: JSON.stringify({ conversationId: convId, senderName: user.name, senderEmail: user.email, senderPhone: user.phone || "", message: m, userId: user._id })
    });
    if (ok) setMsgs(p => [...p, data.message || { _id: Date.now(), senderName: user.name, message: m, isFromAdmin: false }]);
    setLoading(false);
  }

  return (
    <div className="na-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0d8b0", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${G}, ${GL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: "#fff" }}>🕊️</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#3a3028" }}>NATART Support</div>
          <div style={{ fontSize: 11, color: "#00a050" }}>● ონლაინ</div>
        </div>
      </div>
      <div style={{ height: 320, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8, background: ROSE }}>
        {msgs.length === 0 && <div style={{ textAlign: "center", color: "#b0a080", fontSize: 13, paddingTop: 40 }}>საუბრის დასაწყებად გამოგვიგზავნე შეტყობინება 🌿</div>}
        {msgs.map(m => (
          <div key={m._id} className={`na-msg ${m.isFromAdmin ? "from-admin" : "from-user"}`}>
            {m.message}
            <div className="na-msg-name" style={{ color: m.isFromAdmin ? "rgba(255,255,255,.7)" : "#b09070" }}>{m.senderName}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="na-chat-input-row">
        <input className="na-input" value={inp} onChange={e => setInp(e.target.value)} placeholder="შეტყობინება..." onKeyDown={e => e.key === "Enter" && send()} style={{ flex: 1 }} />
        <button className="na-btn na-btn-gold na-btn-sm" onClick={send} disabled={loading || !inp.trim()}>გაგზავნა</button>
      </div>
    </div>
  );
}

// ─── USER: PROFILE ────────────────────────────────────────────────────────────
function UserProfile({ user, setUser, showToast }) {
  const [f, setF] = useState({ name: user.name || "", phone: user.phone || "", address: user.address || "" });
  const [pw, setPw] = useState({ old: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const up = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const upPw = k => e => setPw(p => ({ ...p, [k]: e.target.value }));

  async function saveProfile() {
    setLoading(true);
    const { ok, data } = await apiFetch("/auth/profile", { method: "PUT", body: JSON.stringify(f) });
    setLoading(false);
    if (ok) { setUser(u => ({ ...u, ...f })); showToast("პროფილი განახლდა! ✓"); }
    else showToast(data.message || "შეცდომა");
  }

  async function changePassword() {
    if (pw.new !== pw.confirm) { showToast("პაროლები არ ემთხვევა"); return; }
    setLoading(true);
    const { ok, data } = await apiFetch("/auth/change-password", { method: "POST", body: JSON.stringify({ oldPassword: pw.old, newPassword: pw.new, confirmPassword: pw.confirm }) });
    setLoading(false);
    if (ok) { setPw({ old: "", new: "", confirm: "" }); showToast("პაროლი შეიცვალა! ✓"); }
    else showToast(data.message || "შეცდომა");
  }

  return (
    <>
      <div className="na-card">
        <div className="na-card-title">👤 ჩემი პროფილი</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="na-form-group"><label className="na-label">სახელი</label><input className="na-input" value={f.name} onChange={up("name")} /></div>
          <div className="na-form-group"><label className="na-label">ტელეფონი</label><input className="na-input" value={f.phone} onChange={up("phone")} /></div>
        </div>
        <div className="na-form-group"><label className="na-label">მისამართი</label><input className="na-input" value={f.address} onChange={up("address")} /></div>
        <div className="na-form-group"><label className="na-label">ელ-ფოსტა</label><input className="na-input" value={user.email} disabled style={{ opacity: .6 }} /></div>
        <button className="na-btn na-btn-gold" onClick={saveProfile} disabled={loading}>{loading ? "..." : "შენახვა"}</button>
      </div>
      <div className="na-card">
        <div className="na-card-title">🔑 პაროლის შეცვლა</div>
        {[["old","ძველი პაროლი"],["new","ახალი პაროლი"],["confirm","გაიმეორე"]].map(([k,lbl]) => (
          <div key={k} className="na-form-group"><label className="na-label">{lbl}</label><input className="na-input" type="password" value={pw[k]} onChange={upPw(k)} /></div>
        ))}
        <button className="na-btn na-btn-outline" onClick={changePassword} disabled={loading}>{loading ? "..." : "შეცვლა"}</button>
      </div>
    </>
  );
}

// ─── ADMIN: DASHBOARD ─────────────────────────────────────────────────────────
function AdminDash() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/admin/dashboard").then(({ data }) => { setStats(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!stats) return <Empty icon="📊" text="სტატისტიკა ვერ ჩაიტვირთა" />;

  const metrics = [
    { label: "სულ შემოსავალი", val: `₾${stats.revenue || stats.totalRevenue || 0}` },
    { label: "სულ შეკვეთა", val: stats.totalOrders || 0 },
    { label: "მომლოდინე", val: stats.pendingOrders || 0 },
    { label: "მომხმარებელი", val: stats.totalUsers || 0 },
    { label: "პროდუქტი", val: stats.totalProducts || 0 },
    { label: "წაუკითხავი", val: stats.unreadMessages || 0 },
  ];

  return (
    <>
      <div className="na-metrics">
        {metrics.map(m => <div key={m.label} className="na-metric"><div className="na-metric-val">{m.val}</div><div className="na-metric-lbl">{m.label}</div></div>)}
      </div>
      {stats.recentOrders?.length > 0 && (
        <div className="na-card">
          <div className="na-card-title">ბოლო შეკვეთები</div>
          <div className="na-table-wrap">
            <table className="na-table">
              <thead><tr>{["#", "მომხმარებელი", "თანხა", "სტატუსი", "თარიღი"].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {stats.recentOrders.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 600, color: G }}>{o.orderNumber}</td>
                    <td>{o.customerName}</td>
                    <td>₾{o.totalPrice}</td>
                    <td><Badge status={o.status} /></td>
                    <td style={{ color: "#9a7050", fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString("ka-GE")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

// ─── ADMIN: ORDERS ────────────────────────────────────────────────────────────
function AdminOrders({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [tracking, setTracking] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    apiFetch("/orders").then(({ data }) => {
      setOrders(Array.isArray(data.orders) ? data.orders : Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function update() {
    if (!sel || !status) return;
    const { ok } = await apiFetch(`/orders/${sel._id}/status`, { method: "PUT", body: JSON.stringify({ status, adminNotes: notes, trackingNumber: tracking }) });
    if (ok) { showToast("სტატუსი განახლდა! ✓"); load(); setSel(null); setStatus(""); setNotes(""); setTracking(""); }
    else showToast("შეცდომა");
  }

  if (loading) return <Loading />;

  return (
    <>
      <div className="na-card">
        <div className="na-card-title">📦 შეკვეთები</div>
        <div className="na-table-wrap">
          <table className="na-table">
            <thead><tr>{["#", "მომხმარებელი", "თანხა", "სტატუსი", "გადახდა", "თარიღი"].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className={sel?._id === o._id ? "selected" : ""} style={{ cursor: "pointer" }} onClick={() => { setSel(o); setStatus(o.status); setNotes(o.adminNotes || ""); setTracking(o.trackingNumber || ""); }}>
                  <td style={{ fontWeight: 600, color: G }}>{o.orderNumber}</td>
                  <td>{o.customerName}<br /><span style={{ fontSize: 11, color: "#9a7050" }}>{o.customerEmail}</span></td>
                  <td>₾{o.totalPrice}</td>
                  <td><Badge status={o.status} /></td>
                  <td><Badge status={o.paymentStatus} /></td>
                  <td style={{ fontSize: 12, color: "#9a7050" }}>{new Date(o.createdAt).toLocaleDateString("ka-GE")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {sel && (
        <div className="na-detail">
          <button className="na-detail-close" onClick={() => setSel(null)}>×</button>
          <div className="na-detail-title">{sel.orderNumber} — {sel.customerName}</div>
          <div style={{ fontSize: 13, color: "#9a7050", marginBottom: 10 }}>{sel.customerEmail} · {sel.customerPhone}</div>
          <div style={{ fontSize: 12, color: "#7a6040", marginBottom: 12 }}>📍 {sel.customerAddress}</div>
          {(sel.items || []).map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "1px solid #f5ece0" }}>
              <span>{it.name} ×{it.quantity}</span><span>₾{it.price * it.quantity}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: 8, color: G, marginBottom: 16 }}>
            <span>სულ</span><span>₾{sel.totalPrice}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div className="na-form-group">
              <label className="na-label">სტატუსი</label>
              <select className="na-select" value={status} onChange={e => setStatus(e.target.value)}>
                {["pending","confirmed","shipped","delivered","cancelled"].map(s => <option key={s} value={s}>{STATUS[s]?.label || s}</option>)}
              </select>
            </div>
            <div className="na-form-group">
              <label className="na-label">Tracking #</label>
              <input className="na-input" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="GE12345..." />
            </div>
          </div>
          <div className="na-form-group">
            <label className="na-label">ადმინ შენიშვნა</label>
            <textarea className="na-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={2} style={{ minHeight: 52 }} />
          </div>
          <button className="na-btn na-btn-gold" onClick={update}>განახლება</button>
        </div>
      )}
    </>
  );
}

// ─── ADMIN: PRODUCTS ──────────────────────────────────────────────────────────
function AdminProducts({ showToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProd, setEditProd] = useState(null);
  const [f, setF] = useState({ name: "", price: "", category: "სეტი", stock: "", emoji: "👼", description: "" });

  const load = useCallback(() => {
    setLoading(true);
    apiFetch("/products").then(({ data }) => {
      setProducts(Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  function startEdit(p) {
    setEditProd(p);
    setF({ name: p.name, price: p.price, category: p.category, stock: p.stock, emoji: p.emoji || "", description: p.description || "" });
    setShowForm(true);
  }

  async function save() {
    const body = JSON.stringify({ ...f, price: +f.price, stock: +f.stock });
    let ok;
    if (editProd) {
      const r = await apiFetch(`/products/${editProd._id}`, { method: "PUT", body });
      ok = r.ok;
    } else {
      const r = await apiFetch("/products", { method: "POST", body });
      ok = r.ok;
    }
    if (ok) { showToast(editProd ? "განახლდა! ✓" : "დაემატა! ✓"); load(); setShowForm(false); setEditProd(null); setF({ name: "", price: "", category: "სეტი", stock: "", emoji: "👼", description: "" }); }
    else showToast("შეცდომა");
  }

  async function del(id) {
    const { ok } = await apiFetch(`/products/${id}`, { method: "DELETE" });
    if (ok) { showToast("წაიშალა!"); load(); } else showToast("შეცდომა");
  }

  const up = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  if (loading) return <Loading />;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: G, fontWeight: 700 }}>🎨 პროდუქტები</span>
        <button className="na-btn na-btn-gold na-btn-sm" onClick={() => { setShowForm(!showForm); setEditProd(null); setF({ name: "", price: "", category: "სეტი", stock: "", emoji: "👼", description: "" }); }}>
          {showForm ? "გაუქმება" : "+ ახალი"}
        </button>
      </div>
      {showForm && (
        <div className="na-card">
          <div className="na-card-title">{editProd ? "✏️ რედაქტირება" : "➕ ახალი პროდუქტი"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="na-form-group"><label className="na-label">სახელი</label><input className="na-input" value={f.name} onChange={up("name")} /></div>
            <div className="na-form-group"><label className="na-label">ფასი ₾</label><input className="na-input" type="number" value={f.price} onChange={up("price")} /></div>
            <div className="na-form-group"><label className="na-label">კატეგორია</label><input className="na-input" value={f.category} onChange={up("category")} /></div>
            <div className="na-form-group"><label className="na-label">მარაგი</label><input className="na-input" type="number" value={f.stock} onChange={up("stock")} /></div>
            <div className="na-form-group"><label className="na-label">Emoji</label><input className="na-input" value={f.emoji} onChange={up("emoji")} /></div>
          </div>
          <div className="na-form-group"><label className="na-label">აღწერა</label><textarea className="na-textarea" value={f.description} onChange={up("description")} /></div>
          <button className="na-btn na-btn-gold" onClick={save} disabled={!f.name || !f.price}>შენახვა</button>
        </div>
      )}
      <div className="na-card">
        {products.map(p => (
          <div key={p._id} className="na-admin-product-row">
            <div className="na-admin-product-emoji">{p.emoji || "🎨"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#9a7050" }}>{p.category} · ₾{p.price} · მარაგი: {p.stock}</div>
            </div>
            <Badge status={p.isActive ? "active" : "closed"} />
            <button className="na-btn na-btn-ghost na-btn-sm" onClick={() => startEdit(p)}>✏️</button>
            <button className="na-btn na-btn-danger na-btn-sm" onClick={() => del(p._id)}>🗑</button>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── ADMIN: USERS ─────────────────────────────────────────────────────────────
function AdminUsers({ showToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiFetch("/admin/users").then(({ data }) => {
      setUsers(Array.isArray(data.users) ? data.users : Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggle(u) {
    const path = u.isActive ? `/admin/users/${u._id}/deactivate` : `/admin/users/${u._id}/activate`;
    const { ok } = await apiFetch(path, { method: "PUT" });
    if (ok) { showToast(u.isActive ? "გაითიშა" : "გააქტიურდა"); load(); }
  }

  if (loading) return <Loading />;

  return (
    <div className="na-card">
      <div className="na-card-title">👥 მომხმარებლები</div>
      <div className="na-table-wrap">
        <table className="na-table">
          <thead><tr>{["სახელი", "ელ-ფოსტა", "ტელ.", "სტატუსი", "ქმედება"].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td style={{ fontWeight: 500 }}>{u.name}</td>
                <td style={{ fontSize: 12, color: "#9a7050" }}>{u.email}</td>
                <td style={{ fontSize: 12 }}>{u.phone}</td>
                <td><Badge status={u.isActive ? "active" : "closed"} /></td>
                <td><button className="na-btn na-btn-ghost na-btn-sm" style={{ border: "1px solid #e0c890" }} onClick={() => toggle(u)}>{u.isActive ? "გათიშვა" : "გააქტიურება"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ADMIN: CHAT ──────────────────────────────────────────────────────────────
function AdminChat({ showToast }) {
  const [convs, setConvs] = useState([]);
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [rep, setRep] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    apiFetch("/chat/conversations").then(({ data }) => {
      setConvs(Array.isArray(data.conversations) ? data.conversations : Array.isArray(data) ? data : []);
    });
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function openConv(c) {
    setActive(c);
    const { data } = await apiFetch(`/chat/messages/${c.conversationId}`);
    setMsgs(Array.isArray(data.messages) ? data.messages : Array.isArray(data) ? data : []);
    apiFetch(`/chat/${c.conversationId}/read`, { method: "PUT" });
  }

  async function reply() {
    if (!rep.trim() || !active || loading) return;
    const m = rep; setRep(""); setLoading(true);
    const { ok, data } = await apiFetch("/chat/reply", {
      method: "POST",
      body: JSON.stringify({ conversationId: active.conversationId, message: m, adminName: "NATART Support" })
    });
    setLoading(false);
    if (ok) {
      setMsgs(p => [...p, data.message || { _id: Date.now(), senderName: "NATART Support", message: m, isFromAdmin: true }]);
      showToast("პასუხი გაიგზავნა! ✓");
      setConvs(p => p.map(c => c.conversationId === active.conversationId ? { ...c, lastMessage: m, hasUnreadMessages: false } : c));
    }
  }

  async function close(convId) {
    await apiFetch(`/chat/${convId}/close`, { method: "PUT" });
    setConvs(p => p.map(c => c.conversationId === convId ? { ...c, status: "closed" } : c));
    if (active?.conversationId === convId) setActive(a => a ? { ...a, status: "closed" } : a);
  }

  return (
    <div className="na-chat-wrap">
      <div className="na-chat-sidebar">
        <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0d8b0", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "#9a7050", fontWeight: 600 }}>საუბრები</div>
        {convs.length === 0 && <div style={{ padding: 20, fontSize: 12, color: "#c0a070", textAlign: "center" }}>საუბარი ვერ მოიძებნა</div>}
        {convs.map(c => (
          <div key={c.conversationId} className={`na-chat-conv${active?.conversationId === c.conversationId ? " active" : ""}`} onClick={() => openConv(c)}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="na-chat-conv-name">{c.userName}</div>
              {c.hasUnreadMessages && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#d04040" }} />}
            </div>
            <div className="na-chat-conv-preview">{c.lastMessage}</div>
            <Badge status={c.status} />
          </div>
        ))}
      </div>
      <div className="na-chat-main">
        {active ? (
          <>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0d8b0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{active.userName}</div>
                <div style={{ fontSize: 11, color: "#9a7050" }}>{active.userEmail}</div>
              </div>
              {active.status === "active" && <button className="na-btn na-btn-ghost na-btn-sm" style={{ border: "1px solid #e0c890" }} onClick={() => close(active.conversationId)}>დახურვა</button>}
            </div>
            <div className="na-chat-messages">
              {msgs.map(m => (
                <div key={m._id} className={`na-msg ${m.isFromAdmin ? "from-admin" : "from-user"}`}>
                  {m.message}
                  <div className="na-msg-name" style={{ color: m.isFromAdmin ? "rgba(255,255,255,.7)" : "#b09070" }}>{m.senderName}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            {active.status !== "closed" && (
              <div className="na-chat-input-row">
                <input className="na-input" value={rep} onChange={e => setRep(e.target.value)} placeholder="პასუხი..." onKeyDown={e => e.key === "Enter" && reply()} style={{ flex: 1 }} />
                <button className="na-btn na-btn-gold na-btn-sm" onClick={reply} disabled={loading || !rep.trim()}>გაგზავნა</button>
              </div>
            )}
          </>
        ) : (
          <div className="na-chat-placeholder">← აირჩიე საუბარი</div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [aTab, setATab] = useState("dashboard");
  const [uTab, setUTab] = useState("shop");
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      apiFetch("/auth/me").then(({ ok, data }) => {
        if (ok && data.user) setUser(data.user);
        else clearToken();
        setBooted(true);
      }).catch(() => setBooted(true));
    } else setBooted(true);
  }, []);

  function showToast(m) { setToast(m); setTimeout(() => setToast(null), 2600); }

  function onLogin(u) { setUser(u); showToast(`მოგესალმები, ${u.name}! 🌿`); }

  function logout() { clearToken(); setUser(null); setCart([]); setUTab("shop"); setATab("dashboard"); showToast("გამოხვედით!"); }

  function addToCart(p) {
    setCart(prev => {
      const id = p._id || p.id;
      const ex = prev.find(i => (i._id || i.id) === id);
      if (ex) return prev.map(i => (i._id || i.id) === id ? { ...i, qty: (i.qty || 1) + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
    showToast(`${p.name} კალათაში! 🛒`);
  }

  function onCheckout() { showToast("შეკვეთა გაიგზავნა! ✅"); setUTab("orders"); }

  const isAdmin = user?.role === "admin";
  const cartCount = cart.reduce((s, i) => s + (i.qty || 1), 0);

  if (!booted) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff8f0" }}><div className="na-spinner" /></div>;

  if (!user) return <><style>{css}</style><AuthScreen onLogin={onLogin} /></>;

  const adminTabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "orders", label: "📦 შეკვეთები" },
    { id: "products", label: "🎨 პროდუქტები" },
    { id: "users", label: "👥 მომხმარებლები" },
    { id: "chat", label: "💬 Chat" },
  ];

  const userTabs = [
    { id: "shop", label: "🛍️ მაღაზია" },
    { id: "cart", label: `🛒 კალათა${cartCount > 0 ? ` (${cartCount})` : ""}` },
    { id: "orders", label: "📦 ჩემი შეკვეთები" },
    { id: "chat", label: "💬 მხარდაჭერა" },
    { id: "profile", label: "👤 პროფილი" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="natart-app">
        <header className="na-header">
          <div className="na-logo">🕊️ NATART</div>
          <div className="na-header-right">
            {isAdmin && <span className="na-user-chip" style={{ background: "#fff8e0", borderColor: "#e0c060", color: G }}>⚙️ Admin</span>}
            <span className="na-user-chip">{user.name}</span>
            <button className="na-btn na-btn-ghost na-btn-sm" style={{ border: "1px solid #e0c890" }} onClick={logout}>გამოსვლა</button>
          </div>
        </header>

        <nav className="na-tabs">
          {(isAdmin ? adminTabs : userTabs).map(t => (
            <button key={t.id} className={`na-tab${(isAdmin ? aTab : uTab) === t.id ? " active" : ""}`} onClick={() => isAdmin ? setATab(t.id) : setUTab(t.id)}>{t.label}</button>
          ))}
        </nav>

        <main className="na-content">
          {isAdmin ? (
            <>
              {aTab === "dashboard" && <AdminDash />}
              {aTab === "orders"    && <AdminOrders showToast={showToast} />}
              {aTab === "products"  && <AdminProducts showToast={showToast} />}
              {aTab === "users"     && <AdminUsers showToast={showToast} />}
              {aTab === "chat"      && <AdminChat showToast={showToast} />}
            </>
          ) : (
            <>
              {uTab === "shop"    && <UserShop onAddToCart={addToCart} />}
              {uTab === "cart"    && <UserCart cart={cart} setCart={setCart} user={user} onCheckout={onCheckout} />}
              {uTab === "orders"  && <UserOrders />}
              {uTab === "chat"    && <UserChatView user={user} />}
              {uTab === "profile" && <UserProfile user={user} setUser={setUser} showToast={showToast} />}
            </>
          )}
        </main>

        <Toast msg={toast} />
      </div>
    </>
  );
}
