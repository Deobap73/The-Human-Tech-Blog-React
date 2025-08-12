// /src/features/post/components/CommentForm.tsx
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../../../shared/utils/axios';
import { toast } from 'react-hot-toast';
import RecaptchaV3 from '../../../shared/components/RecaptchaV3';
import { useAuth } from '../../../shared/hooks/useAuth';

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

/**
 * Handles both authenticated and guest comments.
 * - Guests: must provide name (and optional email/website) + consent checkbox.
 * - Uses reCAPTCHA v3; while token is missing we show a translated title hint on the button.
 */
const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [text, setText] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestWebsite, setGuestWebsite] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [consent, setConsent] = useState<boolean>(false);
  const [captcha, setCaptcha] = useState<string>('');

  const canSubmit: boolean =
    text.trim().length >= 3 && (user ? true : guestName.trim().length >= 2 && consent) && !!captcha;

  const submit = async (): Promise<void> => {
    if (!canSubmit || loading) return;
    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        text: text.trim(),
        postId,
        captcha,
      };

      if (!user) {
        payload.guestName = guestName.trim();
        if (guestEmail.trim()) payload.guestEmail = guestEmail.trim();
        if (guestWebsite.trim()) payload.guestWebsite = guestWebsite.trim();
      }

      await axios.post('/comments', payload);

      // Reset form states
      setText('');
      if (!user) {
        setGuestName('');
        setGuestEmail('');
        setGuestWebsite('');
        setConsent(false);
      }

      toast.success(t('comments.form.submitSuccess'));
      onCommentAdded();

      // Force new captcha token after submit
      setCaptcha('');
    } catch (err: unknown) {
      // Try to extract backend message, fall back to a generic translated string
      const anyErr = err as { response?: { data?: { message?: string } } };
      const msg = anyErr?.response?.data?.message || t('comments.form.sendErrorFallback');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='comments__form' onSubmit={(e) => e.preventDefault()}>
      {/* Invisible component that refreshes the token */}
      <RecaptchaV3
        siteKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
        action='comment_submit'
        onToken={(token: string) => setCaptcha(token)}
      />

      {!user && (
        <>
          <input
            className='comments__input'
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder={t('comments.guest.namePlaceholder')}
            disabled={loading}
            required
          />
          <input
            className='comments__input'
            type='email'
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder={t('comments.guest.emailPlaceholder')}
            disabled={loading}
            // optional
          />
          <input
            className='comments__input'
            value={guestWebsite}
            onChange={(e) => setGuestWebsite(e.target.value)}
            placeholder={t('comments.guest.websitePlaceholder')}
            disabled={loading}
            // optional
          />
          <label className='comments__consent'>
            <input
              type='checkbox'
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={loading}
            />
            {t('comments.guest.consentLabel')}
          </label>
        </>
      )}

      <textarea
        className='comments__textarea'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('comments.form.textareaPlaceholder')}
        required
        disabled={loading}
        rows={3}
      />

      <button
        className='comments__submit'
        type='button'
        disabled={!canSubmit || loading}
        onClick={() => void submit()}
        title={!captcha ? t('comments.form.waitingCaptchaTitle') : undefined}
        aria-busy={loading ? 'true' : 'false'}>
        {loading ? t('comments.form.submitting') : t('comments.form.submit')}
      </button>

      <p className='comments__hint'>{t('comments.form.hint')}</p>
    </form>
  );
};

export default CommentForm;
