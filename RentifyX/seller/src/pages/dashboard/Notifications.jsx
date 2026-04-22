import { useState } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, Check, Trash2 } from 'lucide-react';
import './Notifications.css';

const dummyNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Payment Received',
    message: 'You received ₹7,500 from Rahul Verma for Honda City 2023.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'New Rental Request',
    message: 'Priya Sharma requested to rent Modern 2BHK Flat.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'alert',
    title: 'Listing Expiring Soon',
    message: 'Your listing "Yamaha R15" will be marked unavailable tomorrow.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 4,
    type: 'success',
    title: 'Rental Completed',
    message: 'Booking TR-1082 has been marked as completed successfully.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 5,
    type: 'info',
    title: 'System Update',
    message: 'We have updated our platform fee guidelines. Please review them.',
    time: '4 days ago',
    read: true,
  },
];

export default function Notifications() {
  const [notifs, setNotifs] = useState(dummyNotifications);

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotif = (id) => {
    setNotifs(notifs.filter((n) => n.id !== id));
  };

  const IconMap = {
    success: <CheckCircle size={20} className="icon-success" />,
    info: <Info size={20} className="icon-info" />,
    alert: <AlertTriangle size={20} className="icon-alert" />,
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="page-header notif-header">
        <div>
          <h1>Notifications</h1>
          <p>You have {unreadCount} unread messages.</p>
        </div>
        {unreadCount > 0 && (
          <button className="mark-all-btn" onClick={markAllRead}>
            <Check size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="notif-list">
        {notifs.length === 0 ? (
          <div className="empty-notifs">
            <Bell size={48} />
            <p>You&apos;re all caught up!</p>
          </div>
        ) : (
          notifs.map((notif) => (
            <div className={`notif-card ${!notif.read ? 'unread' : ''}`} key={notif.id}>
              <div className="notif-icon-wrap">
                {IconMap[notif.type]}
              </div>
              <div className="notif-content">
                <div className="notif-top">
                  <h4>{notif.title}</h4>
                  <span className="notif-time">{notif.time}</span>
                </div>
                <p>{notif.message}</p>
                {!notif.read && (
                  <button className="btn-read-text" onClick={() => markRead(notif.id)}>
                    Mark as read
                  </button>
                )}
              </div>
              <button
                className="notif-delete"
                onClick={() => deleteNotif(notif.id)}
                title="Delete Notification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
