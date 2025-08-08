// src/features/post/components/CommentForm.tsx
import { useState } from 'react';
import axios from '../../../shared/utils/axios';
import { toast } from 'react-hot-toast';
import RecaptchaV3 from '../../../shared/components/RecaptchaV3';
import { useAuth } from '../../../shared/hooks/useAuth';

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const { user } = useAuth();

  const [text, setText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestWebsite, setGuestWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [captcha, setCaptcha] = useState<string>('');

  const canSubmit =
    text.trim().length >= 3 && (user ? true : guestName.trim().length >= 2 && consent) && !!captcha;

  const submit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      const payload: any = { text: text.trim(), postId, captcha };

      if (!user) {
        payload.guestName = guestName.trim();
        if (guestEmail.trim()) payload.guestEmail = guestEmail.trim();
        if (guestWebsite.trim()) payload.guestWebsite = guestWebsite.trim();
      }

      await axios.post('/comments', payload);

      setText('');
      if (!user) {
        setGuestName('');
        setGuestEmail('');
        setGuestWebsite('');
        setConsent(false);
      }
      toast.success('Comentário enviado. Aguarda moderação');
      onCommentAdded();

      // força obter novo token depois de enviar
      setCaptcha('');
    } catch (err: any) {
      console.error('Failed to add comment:', err);
      const msg = err?.response?.data?.message || 'Falha ao enviar comentário';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='comments__form' onSubmit={(e) => e.preventDefault()}>
      {/* componente invisível que atualiza o token */}
      <RecaptchaV3
        siteKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
        action='comment_submit'
        onToken={(token) => setCaptcha(token)}
      />

      {!user && (
        <>
          <input
            className='comments__input'
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder='Nome'
            disabled={loading}
            required
          />
          <input
            className='comments__input'
            type='email'
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder='Email opcional'
            disabled={loading}
          />
          <input
            className='comments__input'
            value={guestWebsite}
            onChange={(e) => setGuestWebsite(e.target.value)}
            placeholder='Website opcional'
            disabled={loading}
          />
          <label className='comments__consent'>
            <input
              type='checkbox'
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={loading}
            />
            Aceito guardar estes dados para moderação
          </label>
        </>
      )}

      <textarea
        className='comments__textarea'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Escreve o teu comentário'
        required
        disabled={loading}
        rows={3}
      />

      <button
        className='comments__submit'
        type='button'
        disabled={!canSubmit || loading}
        onClick={submit}
        title={!captcha ? 'A obter verificação' : undefined}>
        {loading ? 'A enviar' : 'Enviar'}
      </button>

      <p className='comments__hint'>Comentários de convidados ficam pendentes até aprovação</p>
    </form>
  );
};

export default CommentForm;
