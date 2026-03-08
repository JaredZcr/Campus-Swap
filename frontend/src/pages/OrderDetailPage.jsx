import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Package, CreditCard, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { getOrderInfo, getOrderAddress, updateOrder, payOrder } from '../api';
import { useAuth } from '../context/AuthContext';
import { getFirstPictureUrl } from '../utils/picture';
import Toast from '../components/Toast';
import './OrderDetailPage.css';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop';

const ORDER_STATUS_LABEL = {
  0: { text: 'Pending', icon: Package },
  1: { text: 'Confirmed', icon: CheckCircle2 },
  2: { text: 'Shipped', icon: Truck },
  3: { text: 'Completed', icon: CheckCircle2 },
  4: { text: 'Cancelled', icon: XCircle },
};

export default function OrderDetailPage({ orderId, onBack }) {
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [addr, setAddr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const toast = (m) => { setToastMsg(m); setShowToast(true); };

  const load = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const [oRes, aRes] = await Promise.all([
        getOrderInfo(orderId),
        getOrderAddress(orderId),
      ]);
      if (oRes.code === 200) setOrder(oRes.data);
      if (aRes.code === 200) setAddr(aRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [orderId]);

  const sellerId = order?.idleItem?.userId;
  const role = useMemo(() => {
    if (!order || !user) return 'viewer';
    if (order.userId === user.id) return 'buyer';
    if (sellerId === user.id) return 'seller';
    return 'viewer';
  }, [order, sellerId, user]);

  const statusMeta = ORDER_STATUS_LABEL[order?.orderStatus] || ORDER_STATUS_LABEL[0];
  const StatusIcon = statusMeta.icon;

  const canPay = role === 'buyer' && order?.paymentStatus === 0 && (order?.orderStatus ?? 0) < 4;
  const canConfirmReceived = role === 'buyer' && order?.paymentStatus === 1 && order?.orderStatus === 2;
  const canShip = role === 'seller' && order?.paymentStatus === 1 && (order?.orderStatus === 0 || order?.orderStatus === 1);
  const canCancel = (role === 'buyer' || role === 'seller') && (order?.orderStatus === 0 || order?.orderStatus === 1) && order?.paymentStatus === 0;

  const doPay = async () => {
    setWorking(true);
    try {
      const res = await payOrder({ id: order.id, paymentWay: order.paymentWay || 'Online' });
      if (res.code === 200) {
        toast('Payment successful');
        await load();
      } else {
        toast(res.msg || 'Payment failed');
      }
    } finally {
      setWorking(false);
    }
  };

  const doUpdateStatus = async (newStatus) => {
    setWorking(true);
    try {
      const res = await updateOrder({ id: order.id, orderStatus: newStatus });
      if (res.code === 200) {
        toast('Order updated');
        await load();
      } else {
        toast(res.msg || 'Update failed');
      }
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return (
      <div className="orderdetail">
        <div className="orderdetail_header">
          <button className="orderdetail_back" onClick={onBack}><ArrowLeft size={18} /> Back</button>
          <div className="orderdetail_title">Order Details</div>
        </div>
        <div className="orderdetail_card">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="orderdetail">
        <div className="orderdetail_header">
          <button className="orderdetail_back" onClick={onBack}><ArrowLeft size={18} /> Back</button>
          <div className="orderdetail_title">Order Details</div>
        </div>
        <div className="orderdetail_card">Order not found.</div>
      </div>
    );
  }

  return (
    <div className="orderdetail">
      <div className="orderdetail_header">
        <button className="orderdetail_back" onClick={onBack}><ArrowLeft size={18} /> Back</button>
        <div className="orderdetail_title">Order Details</div>
      </div>

      <div className="orderdetail_grid">
        <div className="orderdetail_card">
          <div className="orderdetail_row">
            <div className="orderdetail_status">
              <StatusIcon size={18} /> {statusMeta.text}
            </div>
            <div className="orderdetail_badges">
              <span className={`orderdetail_badge ${order.paymentStatus === 1 ? 'paid' : 'unpaid'}`}>
                <CreditCard size={14} /> {order.paymentStatus === 1 ? 'Paid' : 'Unpaid'}
              </span>
            </div>
          </div>

          <div className="orderdetail_item">
            <img
              className="orderdetail_item_img"
              src={getFirstPictureUrl(order.idleItem?.pictureList) || FALLBACK_IMG}
              alt=""
              onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
            />
            <div className="orderdetail_item_info">
              <div className="orderdetail_item_name">{order.idleItem?.idleName || `Item #${order.idleId}`}</div>
              <div className="orderdetail_item_price">${Number(order.orderPrice || 0).toFixed(2)}</div>
              <div className="orderdetail_meta">Order ID: {order.id}</div>
              <div className="orderdetail_meta">Payment: {order.paymentWay || 'Online'}</div>
            </div>
          </div>

          {(canPay || canConfirmReceived || canShip || canCancel) && (
            <div className="orderdetail_actions">
              {canPay && (
                <button className="orderdetail_btn primary" onClick={doPay} disabled={working}>
                  Pay Now
                </button>
              )}
              {canShip && (
                <button className="orderdetail_btn primary" onClick={() => doUpdateStatus(2)} disabled={working}>
                  Mark Shipped
                </button>
              )}
              {canConfirmReceived && (
                <button className="orderdetail_btn primary" onClick={() => doUpdateStatus(3)} disabled={working}>
                  Confirm Received
                </button>
              )}
              {canCancel && (
                <button className="orderdetail_btn danger" onClick={() => doUpdateStatus(4)} disabled={working}>
                  Cancel Order
                </button>
              )}
            </div>
          )}
        </div>

        <div className="orderdetail_card">
          <div className="orderdetail_section_title"><MapPin size={18} /> Shipping Address</div>
          {addr ? (
            <div className="orderdetail_addr">
              <div className="orderdetail_addr_name">{addr.consigneeName} · {addr.consigneePhone}</div>
              <div className="orderdetail_addr_detail">{addr.detailAddress}</div>
            </div>
          ) : (
            <div className="orderdetail_muted">No address attached to this order.</div>
          )}

          <div className="orderdetail_section_title" style={{ marginTop: 18 }}><Package size={18} /> Participants</div>
          <div className="orderdetail_participants">
            <div className="orderdetail_participant">
              <div className="orderdetail_participant_label">Buyer</div>
              <div className="orderdetail_participant_value">{order.user?.nickname || `User #${order.userId}`}</div>
            </div>
            <div className="orderdetail_participant">
              <div className="orderdetail_participant_label">Seller</div>
              <div className="orderdetail_participant_value">{order.idleItem?.user?.nickname || (sellerId ? `User #${sellerId}` : 'Unknown')}</div>
            </div>
          </div>
        </div>
      </div>

      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
    </div>
  );
}
