import { useEffect, useMemo, useState } from 'react';
import {
  adminLogin,
  adminLogout,
  adminIdleList,
  adminUpdateIdleStatus,
  adminUserList,
  adminUpdateUserStatus,
  adminOrderList,
  adminDeleteOrder,
  adminList,
  adminAdd,
} from '../api';
import './AdminPage.css';

function parsePage(res) {
  const d = res?.data;
  if (!d) return { records: [], count: 0 };
  if (Array.isArray(d)) return { records: d, count: d.length };
  const records = d.records || d.list || [];
  const count = typeof d.count === 'number' ? d.count : records.length;
  return { records: Array.isArray(records) ? records : [], count };
}

function isCookieError(res) {
  return res && res.code === 0 && String(res.msg || '').toLowerCase().includes('log in again');
}

export default function AdminPage({ onBackHome }) {
  const [admin, setAdmin] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // tabs
  const [tab, setTab] = useState('items'); // items | users | orders | admins

  // login form
  const [accountNumber, setAccountNumber] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // items
  const [itemStatus, setItemStatus] = useState(1);
  const [itemPage, setItemPage] = useState(1);
  const [itemNums] = useState(12);
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);

  // users
  const [userStatus, setUserStatus] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [userNums] = useState(12);
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  // orders
  const [orderPage, setOrderPage] = useState(1);
  const [orderNums] = useState(12);
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  // admins
  const [adminsPage, setAdminsPage] = useState(1);
  const [adminsNums] = useState(12);
  const [admins, setAdmins] = useState([]);
  const [adminsCount, setAdminsCount] = useState(0);
  const [newAdmin, setNewAdmin] = useState({ accountNumber: '', adminPassword: '', adminName: '' });

  const itemMaxPage = useMemo(() => Math.max(1, Math.ceil(itemCount / itemNums)), [itemCount, itemNums]);
  const userMaxPage = useMemo(() => Math.max(1, Math.ceil(userCount / userNums)), [userCount, userNums]);
  const orderMaxPage = useMemo(() => Math.max(1, Math.ceil(orderCount / orderNums)), [orderCount, orderNums]);
  const adminsMaxPage = useMemo(() => Math.max(1, Math.ceil(adminsCount / adminsNums)), [adminsCount, adminsNums]);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    const res = await adminIdleList(itemStatus, itemPage, itemNums).catch(() => null);
    setLoading(false);
    if (!res) return setError('Network error');
    if (isCookieError(res)) {
      setAuthed(false);
      setAdmin(null);
      return;
    }
    if (res.code !== 200) return setError(res.msg || 'Failed');
    const { records, count } = parsePage(res);
    setItems(records);
    setItemCount(count);
  };

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    const res = await adminUserList(userStatus, userPage, userNums).catch(() => null);
    setLoading(false);
    if (!res) return setError('Network error');
    if (isCookieError(res)) {
      setAuthed(false);
      setAdmin(null);
      return;
    }
    if (res.code !== 200) return setError(res.msg || 'Failed');
    const { records, count } = parsePage(res);
    setUsers(records);
    setUserCount(count);
  };

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    const res = await adminOrderList(orderPage, orderNums).catch(() => null);
    setLoading(false);
    if (!res) return setError('Network error');
    if (isCookieError(res)) {
      setAuthed(false);
      setAdmin(null);
      return;
    }
    if (res.code !== 200) return setError(res.msg || 'Failed');
    const { records, count } = parsePage(res);
    setOrders(records);
    setOrderCount(count);
  };

  const loadAdmins = async () => {
    setLoading(true);
    setError('');
    const res = await adminList(adminsPage, adminsNums).catch(() => null);
    setLoading(false);
    if (!res) return setError('Network error');
    if (isCookieError(res)) {
      setAuthed(false);
      setAdmin(null);
      return;
    }
    if (res.code !== 200) return setError(res.msg || 'Failed');
    const { records, count } = parsePage(res);
    setAdmins(records);
    setAdminsCount(count);
  };

  const refresh = async () => {
    if (!authed) return;
    if (tab === 'items') return loadItems();
    if (tab === 'users') return loadUsers();
    if (tab === 'orders') return loadOrders();
    if (tab === 'admins') return loadAdmins();
  };

  // On mount, try loading items to detect existing admin session.
  useEffect(() => {
    (async () => {
      const res = await adminIdleList(1, 1, 1).catch(() => null);
      if (res && res.code === 200) {
        setAuthed(true);
        setTab('items');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto refresh when tab/page/status changes
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, itemStatus, itemPage, userStatus, userPage, orderPage, adminsPage, authed]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await adminLogin(accountNumber, adminPassword).catch(() => null);
    setLoading(false);
    if (!res) return setError('Network error');
    if (res.code !== 200) return setError(res.msg || 'Login failed');
    setAdmin(res.data);
    setAuthed(true);
    setTab('items');
  };

  const handleAdminLogout = async () => {
    await adminLogout().catch(() => null);
    setAuthed(false);
    setAdmin(null);
    setAccountNumber('');
    setAdminPassword('');
    setTab('items');
  };

  const updateItemStatus = async (id, status) => {
    setLoading(true);
    setError('');
    const res = await adminUpdateIdleStatus(id, status).catch(() => null);
    setLoading(false);
    if (!res) return setError('Network error');
    if (isCookieError(res)) {
      setAuthed(false);
      setAdmin(null);
      return;
    }
    if (res.code !== 200) return setError(res.msg || 'Failed');
    await loadItems();
  };

  const updateUserStatus = async (id, status) => {
    setLoading(true);
    setError('');
    const res = await adminUpdateUserStatus(id, status).catch(() => null);
    setLoading(false);
    if (!res) return setError('Network error');
    if (isCookieError(res)) {
      setAuthed(false);
      setAdmin(null);
      return;
    }
    if (res.code !== 200) return setError(res.msg || 'Failed');
    await loadUsers();
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    setLoading(true);
    setError('');
    const res = await adminDeleteOrder(id).catch(() => null);
    setLoading(false);
    if (!res) return setError('Network error');
    if (isCookieError(res)) {
      setAuthed(false);
      setAdmin(null);
      return;
    }
    if (res.code !== 200) return setError(res.msg || 'Failed');
    await loadOrders();
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await adminAdd(newAdmin).catch(() => null);
    setLoading(false);
    if (!res) return setError('Network error');
    if (isCookieError(res)) {
      setAuthed(false);
      setAdmin(null);
      return;
    }
    if (res.code !== 200) return setError(res.msg || 'Failed');
    setNewAdmin({ accountNumber: '', adminPassword: '', adminName: '' });
    await loadAdmins();
  };

  if (!authed) {
    return (
      <div className="admin_container">
        <div className="admin_header">
          <div className="admin_title">Admin Login</div>
          <div className="admin_header_actions">
            <button className="admin_btn admin_btn_secondary" onClick={onBackHome}>Back to Shop</button>
          </div>
        </div>

        <div className="admin_card">
          <form onSubmit={handleAdminLogin} className="admin_form">
            <label>
              Account Number
              <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="e.g. 11" />
            </label>
            <label>
              Password
              <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="e.g. 123123" />
            </label>
            {error && <div className="admin_error">{error}</div>}
            <button className="admin_btn" type="submit" disabled={loading || !accountNumber || !adminPassword}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="admin_hint">
              Default admin in SQL: 11 / 123123
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin_container">
      <div className="admin_header">
        <div>
          <div className="admin_title">Admin Panel</div>
          <div className="admin_subtitle">{admin?.adminName ? `Hello, ${admin.adminName}` : 'Session active'}</div>
        </div>
        <div className="admin_header_actions">
          <button className="admin_btn admin_btn_secondary" onClick={onBackHome}>Back to Shop</button>
          <button className="admin_btn admin_btn_secondary" onClick={handleAdminLogout}>Log Out</button>
        </div>
      </div>

      <div className="admin_layout">
        <div className="admin_sidebar">
          <button className={`admin_nav ${tab === 'items' ? 'active' : ''}`} onClick={() => setTab('items')}>Items</button>
          <button className={`admin_nav ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>Users</button>
          <button className={`admin_nav ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>Orders</button>
          <button className={`admin_nav ${tab === 'admins' ? 'active' : ''}`} onClick={() => setTab('admins')}>Admins</button>
        </div>

        <div className="admin_main">
          {error && <div className="admin_error">{error}</div>}

          {tab === 'items' && (
            <div className="admin_section">
              <div className="admin_section_header">
                <div className="admin_section_title">Item Moderation</div>
                <div className="admin_filters">
                  <button className={`pill ${itemStatus === 1 ? 'active' : ''}`} onClick={() => { setItemStatus(1); setItemPage(1); }}>Published</button>
                  <button className={`pill ${itemStatus === 2 ? 'active' : ''}`} onClick={() => { setItemStatus(2); setItemPage(1); }}>Off-shelf</button>
                  <button className={`pill ${itemStatus === 0 ? 'active' : ''}`} onClick={() => { setItemStatus(0); setItemPage(1); }}>Deleted</button>
                </div>
              </div>

              <div className="admin_table">
                <div className="admin_row admin_row_head">
                  <div>ID</div>
                  <div>Name</div>
                  <div>Price</div>
                  <div>Seller</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                {items.map((it) => (
                  <div className="admin_row" key={it.id}>
                    <div>{it.id}</div>
                    <div className="ellipsis" title={it.idleName}>{it.idleName}</div>
                    <div>${it.idlePrice}</div>
                    <div className="ellipsis" title={it.user?.nickname || it.user?.accountNumber || ''}>{it.user?.nickname || it.user?.accountNumber || '-'}</div>
                    <div>{Number(it.idleStatus) === 1 ? 'Published' : Number(it.idleStatus) === 2 ? 'Off-shelf' : 'Deleted'}</div>
                    <div className="admin_actions">
                      {Number(it.idleStatus) !== 2 && (
                        <button className="admin_btn admin_btn_small" onClick={() => updateItemStatus(it.id, 2)} disabled={loading}>Off-shelf</button>
                      )}
                      {Number(it.idleStatus) !== 1 && (
                        <button className="admin_btn admin_btn_small" onClick={() => updateItemStatus(it.id, 1)} disabled={loading}>Restore</button>
                      )}
                      {Number(it.idleStatus) !== 0 && (
                        <button className="admin_btn admin_btn_small admin_btn_danger" onClick={() => updateItemStatus(it.id, 0)} disabled={loading}>Delete</button>
                      )}
                    </div>
                  </div>
                ))}
                {!items.length && <div className="admin_empty">No items.</div>}
              </div>

              <div className="admin_pager">
                <button className="admin_btn admin_btn_secondary" onClick={() => setItemPage((p) => Math.max(1, p - 1))} disabled={itemPage <= 1}>Prev</button>
                <div className="admin_pager_text">Page {itemPage} / {itemMaxPage} · Total {itemCount}</div>
                <button className="admin_btn admin_btn_secondary" onClick={() => setItemPage((p) => Math.min(itemMaxPage, p + 1))} disabled={itemPage >= itemMaxPage}>Next</button>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="admin_section">
              <div className="admin_section_header">
                <div className="admin_section_title">User Management</div>
                <div className="admin_filters">
                  <button className={`pill ${userStatus === 0 ? 'active' : ''}`} onClick={() => { setUserStatus(0); setUserPage(1); }}>Normal</button>
                  <button className={`pill ${userStatus === 1 ? 'active' : ''}`} onClick={() => { setUserStatus(1); setUserPage(1); }}>Banned</button>
                </div>
              </div>

              <div className="admin_table">
                <div className="admin_row admin_row_head">
                  <div>ID</div>
                  <div>Account</div>
                  <div>Nickname</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                {users.map((u) => (
                  <div className="admin_row" key={u.id}>
                    <div>{u.id}</div>
                    <div>{u.accountNumber}</div>
                    <div className="ellipsis" title={u.nickname || ''}>{u.nickname || '-'}</div>
                    <div>{Number(u.userStatus) === 1 ? 'Banned' : 'Normal'}</div>
                    <div className="admin_actions">
                      {Number(u.userStatus) !== 1 && (
                        <button className="admin_btn admin_btn_small admin_btn_danger" onClick={() => updateUserStatus(u.id, 1)} disabled={loading}>Ban</button>
                      )}
                      {Number(u.userStatus) === 1 && (
                        <button className="admin_btn admin_btn_small" onClick={() => updateUserStatus(u.id, 0)} disabled={loading}>Unban</button>
                      )}
                    </div>
                  </div>
                ))}
                {!users.length && <div className="admin_empty">No users.</div>}
              </div>

              <div className="admin_pager">
                <button className="admin_btn admin_btn_secondary" onClick={() => setUserPage((p) => Math.max(1, p - 1))} disabled={userPage <= 1}>Prev</button>
                <div className="admin_pager_text">Page {userPage} / {userMaxPage} · Total {userCount}</div>
                <button className="admin_btn admin_btn_secondary" onClick={() => setUserPage((p) => Math.min(userMaxPage, p + 1))} disabled={userPage >= userMaxPage}>Next</button>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="admin_section">
              <div className="admin_section_header">
                <div className="admin_section_title">Order Management</div>
              </div>

              <div className="admin_table">
                <div className="admin_row admin_row_head">
                  <div>ID</div>
                  <div>Order #</div>
                  <div>Item</div>
                  <div>Buyer</div>
                  <div>Price</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                {orders.map((o) => (
                  <div className="admin_row" key={o.id}>
                    <div>{o.id}</div>
                    <div className="ellipsis" title={o.orderNumber}>{o.orderNumber}</div>
                    <div className="ellipsis" title={o.idleItem?.idleName || ''}>{o.idleItem?.idleName || '-'}</div>
                    <div className="ellipsis" title={o.user?.accountNumber || ''}>{o.user?.accountNumber || '-'}</div>
                    <div>${o.orderPrice}</div>
                    <div>{Number(o.orderStatus) === 0 ? 'Pending' : Number(o.orderStatus) === 1 ? 'Confirmed' : Number(o.orderStatus) === 2 ? 'Shipped' : Number(o.orderStatus) === 3 ? 'Completed' : 'Cancelled'}</div>
                    <div className="admin_actions">
                      <button className="admin_btn admin_btn_small admin_btn_danger" onClick={() => deleteOrder(o.id)} disabled={loading}>Delete</button>
                    </div>
                  </div>
                ))}
                {!orders.length && <div className="admin_empty">No orders.</div>}
              </div>

              <div className="admin_pager">
                <button className="admin_btn admin_btn_secondary" onClick={() => setOrderPage((p) => Math.max(1, p - 1))} disabled={orderPage <= 1}>Prev</button>
                <div className="admin_pager_text">Page {orderPage} / {orderMaxPage} · Total {orderCount}</div>
                <button className="admin_btn admin_btn_secondary" onClick={() => setOrderPage((p) => Math.min(orderMaxPage, p + 1))} disabled={orderPage >= orderMaxPage}>Next</button>
              </div>
            </div>
          )}

          {tab === 'admins' && (
            <div className="admin_section">
              <div className="admin_section_header">
                <div className="admin_section_title">Admin Accounts</div>
              </div>

              <div className="admin_card" style={{ marginBottom: 12 }}>
                <form className="admin_form admin_form_inline" onSubmit={handleAddAdmin}>
                  <label>
                    Account
                    <input value={newAdmin.accountNumber} onChange={(e) => setNewAdmin((s) => ({ ...s, accountNumber: e.target.value }))} placeholder="account number" />
                  </label>
                  <label>
                    Password
                    <input type="password" value={newAdmin.adminPassword} onChange={(e) => setNewAdmin((s) => ({ ...s, adminPassword: e.target.value }))} placeholder="password" />
                  </label>
                  <label>
                    Name
                    <input value={newAdmin.adminName} onChange={(e) => setNewAdmin((s) => ({ ...s, adminName: e.target.value }))} placeholder="admin name" />
                  </label>
                  <button className="admin_btn" type="submit" disabled={loading || !newAdmin.accountNumber || !newAdmin.adminPassword}>
                    Add Admin
                  </button>
                </form>
              </div>

              <div className="admin_table">
                <div className="admin_row admin_row_head">
                  <div>ID</div>
                  <div>Account</div>
                  <div>Name</div>
                </div>
                {admins.map((a) => (
                  <div className="admin_row" key={a.id}>
                    <div>{a.id}</div>
                    <div>{a.accountNumber}</div>
                    <div className="ellipsis" title={a.adminName || ''}>{a.adminName || '-'}</div>
                  </div>
                ))}
                {!admins.length && <div className="admin_empty">No admins.</div>}
              </div>

              <div className="admin_pager">
                <button className="admin_btn admin_btn_secondary" onClick={() => setAdminsPage((p) => Math.max(1, p - 1))} disabled={adminsPage <= 1}>Prev</button>
                <div className="admin_pager_text">Page {adminsPage} / {adminsMaxPage} · Total {adminsCount}</div>
                <button className="admin_btn admin_btn_secondary" onClick={() => setAdminsPage((p) => Math.min(adminsMaxPage, p + 1))} disabled={adminsPage >= adminsMaxPage}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
