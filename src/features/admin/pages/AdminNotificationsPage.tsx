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
import { useToast } from '../../../shared/hooks/useToast';
import Loader from '../../../shared/components/Loader';
import '../../../features/admin/styles/AdminNotificationsPage.scss';

const LANGUAGES = ['en', 'pt', 'de', 'es'] as const;
type Lang = (typeof LANGUAGES)[number];

const initialFormState: Record<Lang, NotificationTranslation> = {
  en: { title: '', message: '' },
  pt: { title: '', message: '' },
  de: { title: '', message: '' },
  es: { title: '', message: '' },
};

const AdminNotificationsPage = () => {
  const { t, i18n } = useTranslation();
  const { success, error: errorToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editing, setEditing] = useState<Notification | null>(null);
  const [form, setForm] = useState<Record<Lang, NotificationTranslation>>(initialFormState);
  const [activeLang, setActiveLang] = useState<Lang>('en');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ title?: string }>({});
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      setNotifications(await fetchNotifications());
    } catch {
      errorToast(t('adminNotificationForm.error', 'Failed to fetch notifications'));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = (field: keyof NotificationTranslation, value: string) => {
    setForm((prev) => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [field]: value },
    }));
    if (activeLang === 'en' && field === 'title') setFieldErrors({});
  };

  const startEdit = (notif: Notification) => {
    setEditing(notif);
    setForm({
      en: notif.translations.en || { title: '', message: '' },
      pt: notif.translations.pt || { title: '', message: '' },
      de: notif.translations.de || { title: '', message: '' },
      es: notif.translations.es || { title: '', message: '' },
    });
    setActiveLang('en');
    setError('');
    setFieldErrors({});
  };

  const clearForm = () => {
    setEditing(null);
    setForm(initialFormState);
    setActiveLang('en');
    setError('');
    setFieldErrors({});
  };

  const validateFields = (): boolean => {
    const errors: { title?: string } = {};
    if (!(form.en?.title ?? '').trim()) {
      errors.title = t('adminNotificationForm.requiredTitle', 'Title (EN) is required');
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateFields()) return;
    setLoading(true);
    try {
      if (editing) {
        await updateNotification(editing._id, { translations: form });
        success(t('adminNotificationForm.updateSuccess', 'Notification updated successfully!'));
      } else {
        await createNotification({ translations: form });
        success(t('adminNotificationForm.createSuccess', 'Notification created successfully!'));
      }
      await loadNotifications();
      clearForm();
    } catch (err: any) {
      errorToast(t('adminNotificationForm.error', 'Failed to save notification'));
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('adminNotificationForm.deleteConfirm'))) return;
    setLoading(true);
    try {
      await deleteNotification(id);
      success(t('adminNotificationForm.deleteSuccess', 'Notification deleted successfully!'));
      await loadNotifications();
    } catch (err: any) {
      errorToast(t('adminNotificationForm.error', 'Failed to delete notification'));
    }
    setLoading(false);
  };

  return (
    <div className='admin-notifications-page'>
      <h2>{t('adminNotificationForm.title')}</h2>
      {loading ? (
        <Loader />
      ) : (
        <form className='admin-notifications-page__form' onSubmit={handleSubmit}>
          {/* Multilingual Tabs */}
          <div className='admin-notifications-page__tabs'>
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type='button'
                className={`admin-notifications-page__tab${activeLang === lang ? ' active' : ''}`}
                onClick={() => setActiveLang(lang)}>
                {lang.toUpperCase()}
                {lang === 'en' && <span className='admin-notifications-page__tab-required'>*</span>}
              </button>
            ))}
          </div>
          <div className='admin-notifications-page__fields'>
            <label className='admin-notifications-page__label'>
              {t('adminNotificationForm.notificationTitle')}
              {activeLang === 'en' && <span className='admin-notifications-page__asterisk'>*</span>}
              <input
                type='text'
                placeholder={t('adminNotificationForm.notificationTitlePlaceholder')}
                value={form[activeLang].title}
                required={activeLang === 'en'}
                className={
                  activeLang === 'en' && fieldErrors.title
                    ? 'admin-notifications-page__input-error'
                    : ''
                }
                onChange={(e) => handleInput('title', e.target.value)}
              />
              {activeLang === 'en' && fieldErrors.title && (
                <span className='admin-notifications-page__field-error'>{fieldErrors.title}</span>
              )}
            </label>
            <label className='admin-notifications-page__label'>
              {t('adminNotificationForm.message')}
              <textarea
                placeholder={t('adminNotificationForm.messagePlaceholder')}
                value={form[activeLang].message}
                onChange={(e) => handleInput('message', e.target.value)}
                rows={2}
              />
            </label>
          </div>
          <div className='admin-notifications-page__form-actions'>
            <button type='submit' className='admin-notifications-page__btn'>
              {editing ? t('adminNotificationForm.update') : t('adminNotificationForm.create')}
            </button>
            {editing && (
              <button
                type='button'
                onClick={clearForm}
                className='admin-notifications-page__btn admin-notifications-page__btn--cancel'>
                {t('adminNotificationForm.cancel')}
              </button>
            )}
          </div>
          {error && <div className='admin-notifications-page__error'>{error}</div>}
        </form>
      )}
      <ul className='admin-notifications-page__list'>
        {notifications.map((notif) => {
          const tr =
            notif.translations[i18n.language as Lang] ||
            notif.translations[i18n.language.split('-')[0] as Lang] ||
            notif.translations.en;
          return (
            <li key={notif._id} className='admin-notifications-page__item'>
              <b>{tr?.title || '[untitled]'}</b>
              <p>{tr?.message || ''}</p>
              <button className='admin-notifications-page__edit' onClick={() => startEdit(notif)}>
                {t('admin.edit')}
              </button>
              <button
                className='admin-notifications-page__delete'
                onClick={() => handleDelete(notif._id)}>
                {t('admin.delete')}
              </button>
            </li>
          );
        })}
        {notifications.length === 0 && <li>{t('adminNotificationForm.noNotifications')}</li>}
      </ul>
    </div>
  );
};

export default AdminNotificationsPage;
