// /src/features/ats/pages/AtsGeneratorPage.tsx
// Description: Public ATS Generator page. Anonymous access allowed until payment.
// After successful PayPal capture, unlocks GPT generation and client-side export (DOCX/PDF).

import React, { useCallback, useMemo, useState } from 'react';
import '../../post/styles/BlogPage.scss';
import '../styles/AtsGeneratorPage.scss';
import CvUploader from '../components/CvUploader';
import JobAdInput from '../components/JobAdInput';
import GeneratorOptions from '../components/GeneratorOptions';
import PaymentModal from '../components/PaymentModal';
import ResultPreview from '../components/ResultPreview';
import DownloadButtons from '../components/DownloadButtons';
import { AtsGenerationPayload, AtsGenerationResult, AtsOptions } from '../../../types/Ats';
import { generateCoverLetter } from '../../../shared/services/atsService';
// NOTE: This hook exists in your repo at /src/shared/hooks/useToast.ts
import { useToast } from '../../../shared/hooks/useToast';

const DEFAULT_OPTIONS: AtsOptions = {
  language: 'en',
  tone: 'professional',
  seniority: 'mid',
  includeKeywords: [],
};

const AtsGeneratorPage: React.FC = () => {
  // FIX: your hook exposes success/error/info (not showToast)
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [cvText, setCvText] = useState<string>('');
  const [jobAdText, setJobAdText] = useState<string>('');
  const [options, setOptions] = useState<AtsOptions>(DEFAULT_OPTIONS);

  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [paymentOk, setPaymentOk] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AtsGenerationResult | null>(null);

  const canGenerate = useMemo<boolean>(() => {
    return Boolean(cvText.trim()) && Boolean(jobAdText.trim()) && paymentOk;
  }, [cvText, jobAdText, paymentOk]);

  const handleOpenPayment = useCallback(() => {
    if (!cvText.trim() || !jobAdText.trim()) {
      toastInfo('Please add your CV and the job ad first.');
      return;
    }
    setIsPaymentOpen(true);
    return;
  }, [cvText, jobAdText, toastInfo]);

  const handlePaymentSuccess = useCallback(() => {
    setPaymentOk(true);
    setIsPaymentOpen(false);
    toastSuccess('Payment confirmed. You can now generate your cover letter.');
    return;
  }, [toastSuccess]);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    try {
      const payload: AtsGenerationPayload = {
        cvText,
        jobAdText,
        options,
      };

      const response = await generateCoverLetter(payload);
      if (!response?.success || !response.data) {
        toastError(response?.message ?? 'Generation failed. Please try again.');
        setResult(null);
        return;
      }
      setResult(response.data);
      toastSuccess('Cover letter generated successfully.');
    } catch (err) {
      console.error('ATS generate error:', err);
      toastError('Unexpected error while generating. Please retry.');
      setResult(null);
    } finally {
      setLoading(false);
    }
    return;
  }, [cvText, jobAdText, options, toastError, toastSuccess]);

  return (
    <div className='ats-page'>
      <div className='ats-page__header'>
        <h1 className='ats-page__title'>ATS-Friendly Cover Letters</h1>
        <p className='ats-page__subtitle'>
          Upload your CV, paste the job ad, pay €0.50, and get a downloadable ATS-optimized cover
          letter.
        </p>
      </div>

      <div className='ats-page__grid'>
        <section className='ats-page__panel ats-page__panel--left'>
          <CvUploader value={cvText} onChange={setCvText} />
          <JobAdInput value={jobAdText} onChange={setJobAdText} />
          <GeneratorOptions value={options} onChange={setOptions} />

          <div className='ats-page__actions'>
            {!paymentOk ? (
              <button className='ats-page__btn ats-page__btn--primary' onClick={handleOpenPayment}>
                Pay €0.50 to Unlock
              </button>
            ) : (
              <button
                className='ats-page__btn ats-page__btn--primary'
                onClick={handleGenerate}
                disabled={!canGenerate || loading}>
                {loading ? 'Generating…' : 'Generate Cover Letter'}
              </button>
            )}
          </div>
        </section>

        <section className='ats-page__panel ats-page__panel--right'>
          <ResultPreview content={result?.coverLetter ?? ''} watermark={!paymentOk} />
          <DownloadButtons content={result?.coverLetter ?? ''} disabled={!result?.coverLetter} />
        </section>
      </div>

      {isPaymentOpen && (
        <PaymentModal
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
          priceEUR={0.5}
        />
      )}
    </div>
  );
};

export default AtsGeneratorPage;
