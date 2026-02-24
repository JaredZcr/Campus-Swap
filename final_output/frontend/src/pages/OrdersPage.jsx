import { useEffect, useState } from 'react';
import { getMyOrders, getMySoldItems, updateOrder, payOrder } from '../api';
import { getFirstPictureUrl } from '../utils/picture';
import './OrdersPage.css';

const STATUS_LABEL = { 0: 'Pending', 1: 'Confirmed', 2: 'Shipped', 3: 'Completed', 4: 'Cancelled' };
const PAYMENT_LABEL = { 0: 'Unpaid', 1: 'Paid' };
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop';

export default function OrdersPage({ onViewOrder }) {
  const [tab, setTab] = useState('bought');
  const [orders, setOrders] = useState([]);
  const [soldOrders, setSoldOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyOrders(), getMySoldItems()])
      .then(([boughtRes, soldRes]) => {
        if (boughtRes.code === 200) setOrders(boughtRes.data || []);
        if (soldRes.code === 200) setSoldOrders(soldRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleConfirmReceived = async (order) => {
    const res = await updateOrder({ id: order.id, orderStatus: 3 });
    if (res.code === 200) {
      setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, orderStatus: 3 } : o));
    }
  };

  const handlePay = async (order) => {
    const res = await payOrder({ id: order.id, paymentWay: order.paymentWay || 'Online' });
    if (res.code === 200) {
      setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, paymentStatus: 1 } : o));
    }
  };

  const handleMarkShipped = async (order) => {
    const res = await updateOrder({ id: order.id, orderStatus: 2 });
    if (res.code === 200) {
      setSoldOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, orderStatus: 2 } : o));
    }
  };

  const handleCancel = async (order) => {
    const res = await updateOrder({ id: order.id, orderStatus: 4 });
    if (res.code === 200) {
      if (tab === 'bought') {
        setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, orderStatus: 4 } : o));
      } else {
        setSoldOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, orderStatus: 4 } : o));
      }
    }
  };

  const list = tab === 'bought' ? orders : soldOrders;

  if (loading) return <div className="orders-loading">Loading...</div>;

  return (
    <div className="orders-page">
      <h2 className="orders-title">My Orders</h2>

      <div className="orders-tabs">
        <button className={`orders-tab ${tab === 'bought' ? 'active' : ''}`} onClick={() => setTab('bought')}>
          Purchases ({orders.length})
        </button>
        <button className={`orders-tab ${tab === 'sold' ? 'active' : ''}`} onClick={() => setTab('sold')}>
          Sales ({soldOrders.length})
        </button>
      </div>

      {list.length === 0 ? (
        <div className="orders-empty">No orders yet.</div>
      ) : (
        <div className="orders-list">
          {list.map((order) => (
            <div
              key={order.id}
              className="order-card"
              role="button"
              tabIndex={0}
              onClick={() => onViewOrder && onViewOrder(order.id)}
              onKeyDown={(e) => { if (e.key === 'Enter') onViewOrder && onViewOrder(order.id); }}
            >
              <div className="order-card-left">
              {order.idleItem && (
                <img
                  src={getFirstPictureUrl(order.idleItem.pictureList) || FALLBACK_IMG}
                  alt=""
                  className="order-img"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                />
              )}
                <div className="order-info">
                  <div className="order-item-name">{order.idleItem?.idleName || 'Unknown Item'}</div>
                  <div className="order-number">Order# {order.orderNumber}</div>
                  <div className="order-date">{order.createTime ? new Date(order.createTime).toLocaleDateString() : ''}</div>
                </div>
              </div>
              <div className="order-card-right">
                <div className="order-price">${order.orderPrice}</div>
                <span className={`order-status order-status-${order.orderStatus}`}>
                  {STATUS_LABEL[order.orderStatus] || 'Unknown'}
                </span>
                <span className={`order-payment order-payment-${order.paymentStatus}`}>
                  {PAYMENT_LABEL[order.paymentStatus]}
                </span>
                <button
                  className="order-action-btn"
                  onClick={(e) => { e.stopPropagation(); onViewOrder && onViewOrder(order.id); }}
                >
                  View
                </button>

                {tab === 'bought' && order.paymentStatus === 0 && (
                  <button className="order-action-btn order-pay-btn" onClick={(e) => { e.stopPropagation(); handlePay(order); }}>Pay Now</button>
                )}
                {tab === 'bought' && order.orderStatus === 2 && (
                  <button className="order-action-btn order-confirm-btn" onClick={(e) => { e.stopPropagation(); handleConfirmReceived(order); }}>Confirm Received</button>
                )}

                {tab === 'bought' && order.paymentStatus === 0 && (order.orderStatus === 0 || order.orderStatus === 1) && (
                  <button className="order-action-btn order-cancel-btn" onClick={(e) => { e.stopPropagation(); handleCancel(order); }}>Cancel</button>
                )}

                {tab === 'sold' && order.paymentStatus === 1 && (order.orderStatus === 0 || order.orderStatus === 1) && (
                  <button className="order-action-btn order-confirm-btn" onClick={(e) => { e.stopPropagation(); handleMarkShipped(order); }}>Mark Shipped</button>
                )}
                {tab === 'sold' && order.paymentStatus === 0 && (order.orderStatus === 0 || order.orderStatus === 1) && (
                  <button className="order-action-btn order-cancel-btn" onClick={(e) => { e.stopPropagation(); handleCancel(order); }}>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
