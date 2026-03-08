// In dev: keep empty so Vite proxy can forward /user, /idle, ... to the backend.
// In production build: set VITE_API_BASE_URL (e.g. http://localhost:8080).
const BASE_URL = (import.meta.env?.VITE_API_BASE_URL || '').replace(/\/+$/, '');

async function parseResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  const text = await res.text();
  return { status_code: 0, msg: text || `Request failed (${res.status})` };
}

async function request(path, options = {}) {
  const defaultHeaders = {};
  if (options.body) {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  });
  const data = await parseResponse(res);
  if (data && typeof data.status_code !== 'undefined' && typeof data.code === 'undefined') {
    data.code = data.status_code === 1 ? 200 : 0;
  }

  if (data && data.data && !Array.isArray(data.data)) {
    if (Array.isArray(data.data.list) && !Array.isArray(data.data.records)) {
      data.data.records = data.data.list;
    }
  }
  return data;
}

// User
export const userLogin = (accountNumber, userPassword) =>
  request(`/user/login?accountNumber=${encodeURIComponent(accountNumber)}&userPassword=${encodeURIComponent(userPassword)}`, {
    method: 'GET',
  });

export const userSignIn = (user) =>
  request('/user/sign-in', { method: 'POST', body: JSON.stringify(user) });

export const userLogout = () =>
  request('/user/logout', { method: 'GET' });

export const getUserInfo = () =>
  request('/user/info', { method: 'GET' }).catch(() => ({ code: 401 }));

export const updateUserInfo = (user) =>
  request('/user/info', { method: 'POST', body: JSON.stringify(user) });

export const updatePassword = (oldPassword, newPassword) =>
  request(`/user/password?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`, { method: 'GET' });

// Idle Items
export const findIdleItems = (findValue = '', page = 1, nums = 12) =>
  request(`/idle/find?findValue=${encodeURIComponent(findValue)}&page=${page}&nums=${nums}`, { method: 'GET' });

export const findIdleByLabel = (idleLabel, findValue = '', page = 1, nums = 12) =>
  request(`/idle/lable?idleLabel=${idleLabel}&findValue=${encodeURIComponent(findValue)}&page=${page}&nums=${nums}`, { method: 'GET' });

export const getMyIdleItems = () => request('/idle/all', { method: 'GET' });

export const getIdleItemInfo = (id) => request(`/idle/info?id=${id}`, { method: 'GET' });

export const addIdleItem = (item) =>
  request('/idle/add', { method: 'POST', body: JSON.stringify(item) });

export const updateIdleItem = (item) =>
  request('/idle/update', { method: 'POST', body: JSON.stringify(item) });

// Orders
export const addOrder = (order) =>
  request('/order/add', { method: 'POST', body: JSON.stringify(order) });

export const getOrderInfo = (id) => request(`/order/info?id=${id}`, { method: 'GET' });

export const getMyOrders = () => request('/order/my', { method: 'GET' });

export const getMySoldItems = () => request('/order/my-sold', { method: 'GET' });

export const updateOrder = (order) =>
  request('/order/update', { method: 'POST', body: JSON.stringify(order) });

export const payOrder = ({ id, paymentWay = 'Online' }) =>
  updateOrder({ id, paymentStatus: 1, paymentWay });

// Favorites
export const addFavorite = (idleId) =>
  request('/favorite/add', { method: 'POST', body: JSON.stringify({ idleId }) });

export const deleteFavorite = (id) => request(`/favorite/delete?id=${id}`, { method: 'GET' });

export const checkFavorite = (idleId) => request(`/favorite/check?idleId=${idleId}`, { method: 'GET' });

export const getMyFavorites = () => request('/favorite/my', { method: 'GET' });

// Messages
export const sendMessage = (message) =>
  request('/message/send', { method: 'POST', body: JSON.stringify(message) });

export const getIdleMessages = (idleId) => request(`/message/idle?idleId=${idleId}`, { method: 'GET' });

export const getMyMessages = () => request('/message/my', { method: 'GET' });

export const deleteMessage = (id) => request(`/message/delete?id=${id}`, { method: 'GET' });

// Address
export const getAddress = (id) => request(`/address/info${id ? `?id=${id}` : ''}`, { method: 'GET' });

export const addAddress = (address) =>
  request('/address/add', { method: 'POST', body: JSON.stringify(address) });

export const updateAddress = (address) =>
  request('/address/update', { method: 'POST', body: JSON.stringify(address) });

export const deleteAddress = (address) =>
  request('/address/delete', { method: 'POST', body: JSON.stringify(address) });

// Order Address
export const addOrderAddress = (orderAddress) =>
  request('/order-address/add', { method: 'POST', body: JSON.stringify(orderAddress) });

export const updateOrderAddress = (orderAddress) =>
  request('/order-address/update', { method: 'POST', body: JSON.stringify(orderAddress) });

export const getOrderAddress = (orderId) => request(`/order-address/info?orderId=${orderId}`, { method: 'GET' });

// File Upload
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/file`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const data = await parseResponse(res);
  if (data && typeof data.status_code !== 'undefined' && typeof data.code === 'undefined') {
    data.code = data.status_code === 1 ? 200 : 0;
  }
  return data;
};

// Admin
export const adminLogin = (accountNumber, adminPassword) =>
  request(
    `/admin/login?accountNumber=${encodeURIComponent(accountNumber)}&adminPassword=${encodeURIComponent(adminPassword)}`,
    { method: 'GET' }
  );

export const adminLogout = () => request('/admin/loginOut', { method: 'GET' });

export const adminIdleList = (status = 1, page = 1, nums = 12) =>
  request(`/admin/idleList?status=${status}&page=${page}&nums=${nums}`, { method: 'GET' });

export const adminUpdateIdleStatus = (id, status) =>
  request(`/admin/updateIdleStatus?id=${id}&status=${status}`, { method: 'GET' });

export const adminUserList = (status = 0, page = 1, nums = 12) =>
  request(`/admin/userList?status=${status}&page=${page}&nums=${nums}`, { method: 'GET' });

export const adminUpdateUserStatus = (id, status) =>
  request(`/admin/updateUserStatus?id=${id}&status=${status}`, { method: 'GET' });

export const adminOrderList = (page = 1, nums = 12) =>
  request(`/admin/orderList?page=${page}&nums=${nums}`, { method: 'GET' });

export const adminDeleteOrder = (id) => request(`/admin/deleteOrder?id=${id}`, { method: 'GET' });

export const adminList = (page = 1, nums = 12) =>
  request(`/admin/list?page=${page}&nums=${nums}`, { method: 'GET' });

export const adminAdd = (admin) =>
  request('/admin/add', { method: 'POST', body: JSON.stringify(admin) });

export const LABEL_MAP = {
  all: null,
  textbooks: 1,
  electronics: 2,
  furniture: 3,
  clothing: 4,
  sports: 5,
  other: 6,
};
