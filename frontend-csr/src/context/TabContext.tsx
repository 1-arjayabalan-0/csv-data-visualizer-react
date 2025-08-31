import { createContext, useContext, useState, ReactNode } from 'react';

type TabType = 'upload' | 'table' | 'chart';

interface TabContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  hasData: boolean;
  setHasData: (hasData: boolean) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider = ({ children }: { children: ReactNode }) => {
  // Use default values that work for both server and client
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [hasData, setHasData] = useState(false);

  // Custom tab change handler with validation
  const handleTabChange = (tab: TabType) => {
    // Only allow switching to data table or chart tabs if we have data
    if ((tab === 'table' || tab === 'chart') && !hasData) {
      return;
    }
    setActiveTab(tab);
  };

  // Provide stable context values that work in SSR
  const contextValue = {
    activeTab,
    setActiveTab: handleTabChange,
    hasData,
    setHasData
  };

  return (
    <TabContext.Provider value={contextValue}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};