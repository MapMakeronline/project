import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { NotificationType } from '../../store/notificationStore';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  activeLabel: string | null;
}

export function NotificationCenter({ notifications, onDismiss, activeLabel }: NotificationCenterProps) {
  const regularNotifications = notifications.filter(n => n.type !== 'label');
  
  return (
    <>
      {/* Regular Notifications */}
      {regularNotifications.length > 0 && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
          <div className="space-y-2">
            {regularNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center gap-3 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border-l-4 ${
                  notification.type === 'success' ? 'border-green-500' :
                  notification.type === 'error' ? 'border-red-500' :
                  'border-blue-500'
                }`}
              >
                {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {notification.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                <p className="flex-1 text-sm">{notification.message}</p>
                <button
                  onClick={() => onDismiss(notification.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Label */}
      {activeLabel && (
        <div className="fixed bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg text-sm text-gray-600 z-50">
          {activeLabel}
        </div>
      )}
    </>
  );
}