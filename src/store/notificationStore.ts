import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'label';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationStore {
  notifications: Notification[];
  activeLabel: string | null;
  addNotification: (type: NotificationType, message: string) => void;
  removeNotification: (id: string) => void;
  setActiveLabel: (label: string | null) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  activeLabel: null,
  addNotification: (type, message) => {
    const id = crypto.randomUUID();
    set((state) => ({
      notifications: [...state.notifications, { id, type, message }],
    }));
    if (type !== 'label') {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, 5000);
    }
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  setActiveLabel: (label) => set({ activeLabel: label }),
}));