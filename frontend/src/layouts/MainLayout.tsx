import React from 'react';
import { Header } from '../components/Header/Header';
import { LayerTree } from '../components/LayerTree/LayerTree';
import { FunctionBar } from '../components/FunctionBar/FunctionBar';
import { AttributesTable } from '../components/Attributes/AttributesTable';
import { NotificationCenter } from '../components/Notifications/NotificationCenter';
import { WelcomeModal } from '../components/WelcomeModal/WelcomeModal';
import { useNotificationStore } from '../store/notificationStore';
import { useWelcomeStore } from '../store/welcomeStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { notifications, removeNotification, activeLabel } = useNotificationStore();
  const { hasSeenWelcome, setHasSeenWelcome } = useWelcomeStore();

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Map Container - Lowest z-index */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>

      {/* UI Components - Layered on top */}
      <div className="relative z-10">
        <Header />
        
        <NotificationCenter
          notifications={notifications}
          onDismiss={removeNotification}
          activeLabel={activeLabel}
        />

        <LayerTree />
        <FunctionBar />
        <AttributesTable />

        {!hasSeenWelcome && (
          <WelcomeModal onClose={() => setHasSeenWelcome(true)} />
        )}
      </div>
    </div>
  );
}