import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const SiteSettingsContext = createContext(null);

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => setSettings(data.settings || {}))
      .catch(() => setSettings({}));
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

/* Returns the settings object (null while loading) */
export const useSiteSettings = () => useContext(SiteSettingsContext);
