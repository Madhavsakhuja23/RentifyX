import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../../api';
import './Notifications.css';



export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/conversations').then(res => {
      const messageNotifs = (res.conversations || [])
        // Only show conversations that actually have messages
        .filter(c => c.lastMessage)
        .map(c => ({
          id: `msg-${c._id}`,
          type: c.unreadForMe > 0 ? 'alert' : 'info',
          title: c.unreadForMe > 0 ? 'New Message' : 'Message',
          message: c.unreadForMe > 0 
            ? `You have ${c.unreadForMe} new message(s) regarding ${c.listingId?.title}`
            : `Message regarding ${c.listingId?.title}`,
          time: formatDistanceToNow(new Date(c.updatedAt), { addSuffix: true }),
          read: c.unreadForMe === 0,
          link: `/seller/messages?id=${c._id}`
        }));
      setNotifs(messageNotifs);
    }).catch(err => console.error("Error fetching notifications:", err));
  }, []);

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
                <p style={{ cursor: notif.link ? 'pointer' : 'default', textDecoration: notif.link ? 'underline' : 'none' }} onClick={() => {
                  if (notif.link) {
                    navigate(notif.link);
                  }
                }}>{notif.message}</p>
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
