import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { fetchAccounts, createAccount, updateAccount, setActive, terminateAccount, clearTerminated } from "../lib/accounts";


// ── Types ─────────────────────────────────────────────────────────────────────

type Tab         = "active" | "terminated";
type ConfirmKind = "activate" | "deactivate" | "terminate" | "clear-all";

interface User {
  id: string;
  username: string;
  role: string;
  active: boolean;
  terminated: boolean;
  createdAt: string;
  terminatedAt?: string | null;
}

interface ConfirmState {
  kind: ConfirmKind;
  userId?: string;
  username?: string;
}

// ── Dashboard styles ──────────────────────────────────────────────────────────

const DASHBOARD_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: 'Segoe UI', Arial, sans-serif; }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 24px;
  }

  .user-table { width: 100%; border-collapse: collapse; }
  .user-table th, .user-table td { padding: 13px 18px; text-align: left; }
  .user-table thead tr { background: #fafafa; }
  .user-table th {
    font-size: 11px; font-weight: 700; color: #888;
    text-transform: uppercase; letter-spacing: .06em;
    border-bottom: 1px solid #f0f0f0;
  }
  .user-table tbody tr { border-bottom: 1px solid #f5f5f5; }
  .user-table tbody tr:last-child { border-bottom: none; }
  .action-cell { display: flex; gap: 6px; flex-wrap: wrap; }

  .mobile-cards { display: none; }

  .nav-right { display: flex; align-items: center; gap: 10px; }
  .nav-admin-label { color: #ffdddd; font-size: 13px; white-space: nowrap; }
  .nav-admin-label strong { color: #fff; }

  .modal-box {
    background: #fff; border-radius: 16px; padding: 32px 28px;
    width: 420px; max-width: calc(100vw - 32px);
    box-shadow: 0 8px 40px #0004; position: relative;
  }

  .tab-bar {
    display: flex;
    border-bottom: 2px solid #f0f0f0;
    padding: 0 20px;
    gap: 0;
  }
  .tab-btn {
    padding: 14px 20px; border: none; background: none;
    font-size: 13px; font-weight: 600; cursor: pointer;
    color: #999; border-bottom: 3px solid transparent;
    margin-bottom: -2px; display: flex; align-items: center; gap: 7px;
    transition: color .15s;
  }
  .tab-btn.active-tab { color: #cc0000; border-bottom-color: #cc0000; }
  .tab-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; border-radius: 9px;
    font-size: 10px; font-weight: 800; padding: 0 5px;
  }

  .card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid #f0f0f0; flex-wrap: wrap; gap: 10px;
  }
  .card-header-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  @media (max-width: 700px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .user-table { display: none; }
    .mobile-cards { display: block; padding: 12px; }
    .nav-right .nav-admin-label { display: none; }
    .topbar { padding: 0 14px !important; }
    .page-content { padding: 0 12px !important; margin-top: 18px !important; }
    .tab-btn { padding: 12px 14px; font-size: 12px; }
  }

  @media (max-width: 420px) {
    .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .card-header { flex-direction: column; align-items: flex-start; }
  }
`;

function DashboardStyles() { return <style>{DASHBOARD_CSS}</style>; }

// ── Button styles ─────────────────────────────────────────────────────────────

const primaryBtn: React.CSSProperties = {
  background: "#cc0000", color: "#fff", border: "none",
  borderRadius: 8, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer",
};
const secondaryBtn: React.CSSProperties = {
  background: "#f5f5f5", color: "#555", border: "none",
  borderRadius: 8, padding: "9px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer",
};
const ghostBtn: React.CSSProperties = {
  background: "transparent", color: "#fff", border: "1px solid #fff4",
  borderRadius: 6, padding: "5px 12px", fontWeight: 600, fontSize: 12,
  cursor: "pointer", whiteSpace: "nowrap",
};
const tBtn = (color: string, disabled = false): React.CSSProperties => ({
  background: disabled ? "#f0f0f0" : `${color}18`,
  color: disabled ? "#bbb" : color,
  border: disabled ? "1px solid #e5e5e5" : `1px solid ${color}44`,
  borderRadius: 6, padding: "5px 11px", fontWeight: 600, fontSize: 12,
  cursor: disabled ? "not-allowed" : "pointer", whiteSpace: "nowrap",
});

// ── Input ─────────────────────────────────────────────────────────────────────

function Input({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6,
        letterSpacing: ".05em", textTransform: "uppercase", color: "#444",
      }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 8,
          border: "1px solid #e5e5e5", outline: "none", fontSize: 14,
          background: "#fafafa", color: "#111",
        }}
      />
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function Pill({ bg, color, border, children }: {
  bg: string; color: string; border: string; children: string;
}) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase",
      background: bg, color, border: `1px solid ${border}`,
    }}>{children}</span>
  );
}

function StatusBadge({ user }: { user: User }) {
  if (user.terminated)
    return <Pill bg="#7c3aed22" color="#7c3aed" border="#7c3aed55">Terminated</Pill>;
  if (user.active)
    return <Pill bg="#22c55e22" color="#16a34a" border="#22c55e55">Active</Pill>;
  return <Pill bg="#ef444422" color="#dc2626" border="#ef444455">Inactive</Pill>;
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────

const CONFIRM_CONFIG: Record<ConfirmKind, {
  title: string; icon: string;
  message: (name?: string) => string;
  confirmLabel: string; confirmColor: string;
}> = {
  activate:   { title: "Activate Account",       icon: "✓",  confirmLabel: "Yes, Activate",   confirmColor: "#16a34a", message: (n) => `Are you sure you want to activate the account for "${n}"? They will be able to log in immediately.` },
  deactivate: { title: "Deactivate Account",     icon: "⏸", confirmLabel: "Yes, Deactivate", confirmColor: "#d97706", message: (n) => `Are you sure you want to deactivate the account for "${n}"? They will lose access until reactivated.` },
  terminate:  { title: "Terminate Account",      icon: "✕",  confirmLabel: "Yes, Terminate",  confirmColor: "#dc2626", message: (n) => `Are you sure you want to permanently terminate the account for "${n}"? This action cannot be undone.` },
  "clear-all":{ title: "Clear All Terminated",   icon: "🗑", confirmLabel: "Yes, Clear All",  confirmColor: "#dc2626", message: () => "Are you sure you want to permanently delete all terminated account records? This cannot be undone." },
};

function ConfirmDialog({ state, onConfirm, onCancel }: {
  state: ConfirmState; onConfirm: () => void; onCancel: () => void;
}) {
  const cfg = CONFIRM_CONFIG[state.kind];
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0006", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", width: 400, maxWidth: "100%", boxShadow: "0 8px 40px #0005", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${cfg.confirmColor}18`, border: `2px solid ${cfg.confirmColor}44`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22, color: cfg.confirmColor, fontWeight: 700 }}>{cfg.icon}</div>
        <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: "#111" }}>{cfg.title}</h3>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#666", lineHeight: 1.6 }}>{cfg.message(state.username)}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onCancel} style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid #e5e5e5", background: "#f5f5f5", color: "#555", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "10px 22px", borderRadius: 8, border: "none", background: cfg.confirmColor, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{cfg.confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Row action buttons ────────────────────────────────────────────────────────

function UserActions({ user, isSelf, onEdit, onConfirmRequest }: {
  user: User; isSelf: boolean; onEdit: () => void; onConfirmRequest: (k: ConfirmKind) => void;
}) {
  return (
    <div className="action-cell">
      <button onClick={onEdit} style={tBtn("#cc0000")}>Edit</button>
      <button
        onClick={() => onConfirmRequest(user.active ? "deactivate" : "activate")}
        style={tBtn(user.active ? "#d97706" : "#16a34a", isSelf)}
        disabled={isSelf}
      >
        {user.active ? "Deactivate" : "Activate"}
      </button>
      <button onClick={() => onConfirmRequest("terminate")} style={tBtn("#dc2626", isSelf)} disabled={isSelf}>
        Terminate
      </button>
      {isSelf && <span style={{ fontSize: 11, color: "#999", alignSelf: "center" }}>(You)</span>}
    </div>
  );
}

// ── Mobile cards ──────────────────────────────────────────────────────────────

function MobileUserCard({ user, isSelf, onEdit, onConfirmRequest }: {
  user: User; isSelf: boolean; onEdit: () => void; onConfirmRequest: (k: ConfirmKind) => void;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, boxShadow: "0 1px 4px #0001" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{user.username}</div>
          <div style={{ fontSize: 12, color: "#cc0000", marginTop: 2, fontWeight: 600, textTransform: "capitalize" }}>{user.role}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Created {user.createdAt}</div>
        </div>
        <StatusBadge user={user} />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={onEdit} style={tBtn("#cc0000")}>Edit</button>
        <button
          onClick={() => onConfirmRequest(user.active ? "deactivate" : "activate")}
          style={tBtn(user.active ? "#d97706" : "#16a34a", isSelf)}
          disabled={isSelf}
        >
          {user.active ? "Deactivate" : "Activate"}
        </button>
        <button onClick={() => onConfirmRequest("terminate")} style={tBtn("#dc2626", isSelf)} disabled={isSelf}>
          Terminate
        </button>
        {isSelf && <span style={{ fontSize: 11, color: "#999", alignSelf: "center" }}>(You)</span>}
      </div>
    </div>
  );
}

function MobileTerminatedCard({ user }: { user: User }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, boxShadow: "0 1px 4px #0001", opacity: 0.7 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{user.username}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Created {user.createdAt}</div>
          {user.terminatedAt && <div style={{ fontSize: 12, color: "#7c3aed", marginTop: 2 }}>Terminated {user.terminatedAt}</div>}
        </div>
        <StatusBadge user={user} />
      </div>
    </div>
  );
}

// ── Overlay wrapper ───────────────────────────────────────────────────────────

function Overlay({ children, title, onClose }: {
  children: React.ReactNode; title: string; onClose: () => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0005", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }}>
      <div className="modal-box">
        <div style={{ width: "100%", height: 4, background: "#cc0000", borderRadius: "4px 4px 0 0", position: "absolute", top: 0, left: 0 }} />
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#cc0000" }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

// ── Modals ────────────────────────────────────────────────────────────────────

function EditUserModal({ user, onSave, onClose }: {
  user: User; onSave: (id: string, u: string, p: string) => void; onClose: () => void;
}) {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  return (
    <Overlay onClose={onClose} title={`Edit — ${user.username}`}>
      <Input label="Username" value={username} onChange={setUsername} placeholder="New username" />
      <Input label="New Password" value={password} onChange={setPassword} type="password" placeholder="Leave blank to keep current" />
      {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "0 0 12px" }}>{error}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => {
            if (!username.trim()) { setError("Username cannot be empty."); return; }
              onSave(user.id, username.trim(), password); // empty password = "keep current", handled in updateAccount
            }} style={primaryBtn}>Save Changes</button>
        <button onClick={onClose} style={secondaryBtn}>Cancel</button>
      </div>
    </Overlay>
  );
}

function CreateUserModal({ onSave, onClose }: {
  onSave: (u: string, p: string, role: 'supervisor' | 'admin') => void; onClose: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState<'supervisor' | 'admin'>("supervisor");
  const [error, setError]       = useState("");
  return (
    <Overlay onClose={onClose} title="Create Account">
      <Input label="Username" value={username} onChange={setUsername} placeholder="Enter username" />
      <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="Enter password" />
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: ".05em", textTransform: "uppercase", color: "#444" }}>Role</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value as 'supervisor' | 'admin')}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 14, background: "#fafafa", color: "#111", outline: "none" }}
        >
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "0 0 12px" }}>{error}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => {
          if (!username.trim()) { setError("Username is required."); return; }
          if (!password.trim()) { setError("Password is required."); return; }
          onSave(username.trim(), password.trim(), role);
        }} style={primaryBtn}>Create Account</button>
        <button onClick={onClose} style={secondaryBtn}>Cancel</button>
      </div>
    </Overlay>
  );
}

function EditAdminModal({ adminUsername, onSave, onClose }: {
  adminUsername: string; onSave: (u: string, p: string) => void; onClose: () => void;
}) {
  const [username, setUsername] = useState(adminUsername);
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  return (
    <Overlay onClose={onClose} title="Edit Admin Profile">
      <p style={{ color: "#888", fontSize: 13, marginTop: 0, marginBottom: 20 }}>Update your admin username or password.</p>
      <Input label="Username" value={username} onChange={setUsername} />
      <Input label="New Password" value={password} onChange={setPassword} type="password" placeholder="Leave blank to keep current" />
      {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "0 0 12px" }}>{error}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => { if (!username.trim()) { setError("Username cannot be empty."); return; } onSave(username.trim(), password); }} style={primaryBtn}>Save Changes</button>
        <button onClick={onClose} style={secondaryBtn}>Cancel</button>
      </div>
    </Overlay>
  );
}

// ── Dashboard page (self-contained) ──────────────────────────────────────────

type Modal = "edit-user" | "create-user" | "edit-admin" | null;

export default function Admin() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();

  const [users, setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState<Tab>("active");
  const [modal, setModal]   = useState<Modal>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  async function loadUsers() {
    const data = await fetchAccounts();
    setUsers(data.map(a => ({
      id: a.id,
      username: a.username,
      role: a.role,
      active: a.is_active,
      terminated: a.terminated,
      createdAt: a.created_at,
      terminatedAt: a.terminated_at ?? undefined,
    })));
    setLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  const activeUsers     = users.filter(u => !u.terminated);
  const terminatedUsers = users.filter(u => u.terminated);
  const activeCount     = activeUsers.filter(u => u.active).length;
  const inactiveCount   = activeUsers.filter(u => !u.active).length;

  function requestConfirm(kind: ConfirmKind, user?: User) {
    setConfirm({ kind, userId: user?.id, username: user?.username });
  }

  async function handleConfirm() {
    if (!confirm) return;
    try {
      const { kind, userId } = confirm;
      if (kind === "clear-all") await clearTerminated();
      else if (userId) {
        if (kind === "activate")   await setActive(userId, true);
        if (kind === "deactivate") await setActive(userId, false);
        if (kind === "terminate")  await terminateAccount(userId);
      }
      await loadUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setConfirm(null);
    }
  }

  async function saveUser(id: string, username: string, password: string) {
    try {
      await updateAccount(id, username, password);
      await loadUsers();
      setModal(null);
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function createUser(username: string, password: string, role: 'supervisor' | 'admin') {
    try {
      await createAccount(username, password, role);
      await loadUsers();
      setModal(null);
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function saveAdmin(username: string, password: string) {
    if (!currentUser) return;
    try {
      await updateAccount(currentUser.id, username, password);
      setCurrentUser({ ...currentUser, username });
      await loadUsers();
      setModal(null);
    } catch (err: any) {
      alert(err.message);
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <>
      <DashboardStyles />
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>

        {/* Top bar */}
        <div className="topbar" style={{ background: "#cc0000", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, boxShadow: "0 2px 8px #0002" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#cc0000", fontWeight: 800, fontSize: 10 }}>regcris</span>
            </div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>User Management</span>
          </div>
          <div className="nav-right">
            <span className="nav-admin-label">Admin: <strong>{currentUser?.username}</strong></span>
            <button onClick={() => setModal("edit-admin")} style={ghostBtn}>Edit Profile</button>
            <button onClick={handleLogout} style={ghostBtn}>Log out</button>
          </div>
        </div>

        {/* Page */}
        <div className="page-content" style={{ maxWidth: 980, margin: "28px auto", padding: "0 20px" }}>

          {/* Stats */}
          <div className="stats-grid">
            {[
              { label: "Total Users", value: activeUsers.length,    color: "#cc0000" },
              { label: "Active",      value: activeCount,            color: "#16a34a" },
              { label: "Inactive",    value: inactiveCount,          color: "#d97706" },
              { label: "Terminated",  value: terminatedUsers.length, color: "#7c3aed" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 4px #0001", borderTop: `4px solid ${s.color}` }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Card with tabs */}
          <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 1px 4px #0001", overflow: "hidden" }}>

            <div className="tab-bar">
              <button className={`tab-btn${tab === "active" ? " active-tab" : ""}`} onClick={() => setTab("active")}>
                All Accounts
                <span className="tab-badge" style={{ background: tab === "active" ? "#cc000018" : "#f0f0f0", color: tab === "active" ? "#cc0000" : "#999" }}>{activeUsers.length}</span>
              </button>
              <button className={`tab-btn${tab === "terminated" ? " active-tab" : ""}`} onClick={() => setTab("terminated")}>
                Terminated
                <span className="tab-badge" style={{ background: tab === "terminated" ? "#7c3aed18" : "#f0f0f0", color: tab === "terminated" ? "#7c3aed" : "#999" }}>{terminatedUsers.length}</span>
              </button>
            </div>

            {/* Active tab */}
            {tab === "active" && (
              <>
                <div className="card-header">
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#222" }}>Manage user accounts</span>
                  <div className="card-header-actions">
                    <button onClick={() => setModal("create-user")} style={primaryBtn}>+ Create Account</button>
                  </div>
                </div>
                <table className="user-table">
                  <thead><tr>{["Username", "Role", "Created", "Status", "Actions"].map(h => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {activeUsers.map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600, color: "#222", fontSize: 14 }}>{u.username}</td>
                        <td style={{ color: "#888", fontSize: 13, textTransform: "capitalize" }}>{u.role}</td>
                        <td style={{ color: "#888", fontSize: 13 }}>{u.createdAt}</td>
                        <td><StatusBadge user={u} /></td>
                        <td>
                            <UserActions
                                user={u}
                                isSelf={u.id === currentUser?.id}
                                onEdit={() => { setEditingUser(u); setModal("edit-user"); }}
                                onConfirmRequest={k => requestConfirm(k, u)}
                            />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mobile-cards">
                  {activeUsers.map(u => (
                    <MobileUserCard
                        key={u.id}
                        user={u}
                        isSelf={u.id === currentUser?.id}
                        onEdit={() => { setEditingUser(u); setModal("edit-user"); }}
                        onConfirmRequest={k => requestConfirm(k, u)}
                    />
                    ))}
                </div>
                {activeUsers.length === 0 && <div style={{ padding: 48, textAlign: "center", color: "#bbb", fontSize: 14 }}>No active accounts yet. Create one to get started.</div>}
              </>
            )}

            {/* Terminated tab */}
            {tab === "terminated" && (
              <>
                <div className="card-header">
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#222" }}>Terminated account records</span>
                  <div className="card-header-actions">
                    {terminatedUsers.length > 0 && (
                      <button onClick={() => requestConfirm("clear-all")} style={{ background: "#dc262618", color: "#dc2626", border: "1px solid #dc262644", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🗑 Clear All</button>
                    )}
                  </div>
                </div>
                <table className="user-table">
                  <thead><tr>{["Username", "Created", "Terminated On", "Status"].map(h => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {terminatedUsers.map(u => (
                      <tr key={u.id} style={{ opacity: 0.65 }}>
                        <td style={{ fontWeight: 600, color: "#222", fontSize: 14 }}>{u.username}</td>
                        <td style={{ color: "#888", fontSize: 13 }}>{u.createdAt}</td>
                        <td style={{ color: "#7c3aed", fontSize: 13, fontWeight: 600 }}>{u.terminatedAt ?? "—"}</td>
                        <td><StatusBadge user={u} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mobile-cards">
                  {terminatedUsers.map(u => <MobileTerminatedCard key={u.id} user={u} />)}
                </div>
                {terminatedUsers.length === 0 && <div style={{ padding: 48, textAlign: "center", color: "#bbb", fontSize: 14 }}>No terminated accounts on record.</div>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "edit-user"   && editingUser && <EditUserModal  user={editingUser} onSave={saveUser}  onClose={() => setModal(null)} />}
      {modal === "create-user" && <CreateUserModal onSave={createUser} onClose={() => setModal(null)} />}
      {modal === "edit-admin" && currentUser && (<EditAdminModal adminUsername={currentUser.username} onSave={saveAdmin} onClose={() => setModal(null)} />)}
      {confirm && <ConfirmDialog state={confirm} onConfirm={handleConfirm} onCancel={() => setConfirm(null)} />}
    </>
  );
}
