// src/features/admin/pages/AdminSettings.tsx
import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { AdminSettings } from '../../../shared/types/AdminSettings';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get<AdminSettings>('/admin/settings');
        setSettings(res.data);
      } catch {
        setError('Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) =>
      prev ? { ...prev, [name]: type === 'checkbox' ? checked : value } : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', settings);
      alert('Settings updated');
    } catch {
      alert('Failed to update settings');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error || !settings) return <p>{error || 'No settings available.'}</p>;

  return (
    <div className='admin-settings'>
      <h2>Edit Admin Settings</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Site Title:
          <input type='text' name='siteTitle' value={settings.siteTitle} onChange={handleChange} />
        </label>
        <label>
          Enable Chat:
          <input
            type='checkbox'
            name='enableChat'
            checked={settings.enableChat}
            onChange={handleChange}
          />
        </label>
        <label>
          Max Users:
          <input type='number' name='maxUsers' value={settings.maxUsers} onChange={handleChange} />
        </label>
        <button type='submit'>Save</button>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
