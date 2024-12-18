import React from 'react';
import { MainLayout } from './layouts/MainLayout';
import { PropertyMap } from './components/Map/PropertyMap';
import { HelpGuide } from './components/HelpGuide/HelpGuide';

function App() {
  return (
    <>
      <MainLayout>
        <PropertyMap />
      </MainLayout>
      <HelpGuide />
    </>
  );
}

export default App;
