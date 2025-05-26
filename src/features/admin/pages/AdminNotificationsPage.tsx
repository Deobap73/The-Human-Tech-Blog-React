// src/features/admin/pages/AdminNotificationsPage.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from '../../../shared/services/notificationService';
import { Notification, NotificationTranslation } from '../../../shared/types/Notification';
import '../../../features/admin/styles/AdminNotificationsPage.scss';

const languages = ['en', 'pt', 'de', 'es'];

const AdminNotificationsPage = () => {
  const { i18n } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editing, setEditing] = useState<Notification | null>(null);
  const [form, setForm] = useState<{ [key: string]: NotificationTranslation }>({
    en: { title: '', message: '' },
    pt: { title: '', message: '' },
    de: { title: '', message: '' },
    es: { title: '', message: '' },
  });
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    try {
      setNotifications(await fetchNotifications());
    } catch {
      setError('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleInput = (lang: string, field: keyof NotificationTranslation, value: string) => {
    setForm((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  const startEdit = (notif: Notification) => {
    setEditing(notif);
    setForm({
      en: notif.translations.en || { title: '', message: '' },
      pt: notif.translations.pt || { title: '', message: '' },
      de: notif.translations.de || { title: '', message: '' },
      es: notif.translations.es || { title: '', message: '' },
    });
  };

  const clearForm = () => {
    setEditing(null);
    setForm({
      en: { title: '', message: '' },
      pt: { title: '', message: '' },
      de: { title: '', message: '' },
      es: { title: '', message: '' },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateNotification(editing._id, { translations: form });
      } else {
        await createNotification({ translations: form });
      }
      await loadNotifications();
      clearForm();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save notification');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await deleteNotification(id);
      await loadNotifications();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete notification');
    }
  };

  return (
    <div className='admin-notifications-page'>
      <h2>Manage Notifications</h2>
      <form className='admin-notifications-page__form' onSubmit={handleSubmit}>
        <div className='admin-notifications-page__langs'>
          {languages.map((lang) => (
            <div key={lang} className='admin-notifications-page__lang-group'>
              <label>{lang.toUpperCase()}:</label>
              <input
                type='text'
                placeholder='Title'
                value={form[lang]?.title || ''}
                onChange={(e) => handleInput(lang, 'title', e.target.value)}
                className='admin-notifications-page__input'
                required={lang === 'en'}
              />
              <textarea
                placeholder='Message'
                value={form[lang]?.message || ''}
                onChange={(e) => handleInput(lang, 'message', e.target.value)}
                className='admin-notifications-page__textarea'
                rows={2}
              />
            </div>
          ))}
        </div>
        <button type='submit' className='admin-notifications-page__btn'>
          {editing ? 'Update' : 'Create'}
        </button>
        {editing && (
          <button
            type='button'
            onClick={clearForm}
            className='admin-notifications-page__btn admin-notifications-page__btn--cancel'>
            Cancel
          </button>
        )}
        {error && <div className='admin-notifications-page__error'>{error}</div>}
      </form>
      <ul className='admin-notifications-page__list'>
        {notifications.map((notif) => {
          const tr =
            notif.translations[i18n.language] ||
            notif.translations[i18n.language.split('-')[0]] ||
            notif.translations.en;
          return (
            <li key={notif._id} className='admin-notifications-page__item'>
              <b>{tr?.title || '[untitled]'}</b>
              <p>{tr?.message || ''}</p>
              <button className='admin-notifications-page__edit' onClick={() => startEdit(notif)}>
                Edit
              </button>
              <button
                className='admin-notifications-page__delete'
                onClick={() => handleDelete(notif._id)}>
                Delete
              </button>
            </li>
          );
        })}
        {notifications.length === 0 && <li>No notifications found.</li>}
      </ul>
    </div>
  );
};

export default AdminNotificationsPage;
