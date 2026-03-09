import { useState, useEffect, useRef, useCallback } from 'react';

interface Municipality {
  name: string;
  slug: string;
  population: number;
  province: string;
}

interface Props {
  municipalities: Municipality[];
}

const ROLE_OPTIONS = ['Mayor/Reeve', 'Councillor/Trustee', 'CAO/City Manager', 'CFO/Finance Director', 'Other'];
const TEAM_OPTIONS = ['Just me', '2–3', '4–6', '7+'];
const REFERRAL_OPTIONS = ['Google/Search', 'Colleague', 'Social Media', 'Conference/Event', 'Other'];

function ChevronRight() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

function RadioOption({ value, checked, onChange, children }: { value: string; checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="cursor-pointer select-none">
      <input type="radio" value={value} checked={checked} onChange={onChange} className="sr-only" />
      <div
        className={`w-full flex items-center px-4 py-3 rounded-xl border-2 transition-colors text-sm font-medium min-h-[48px]
          ${checked
            ? 'border-[#1A5276] bg-[#1A5276]/5 text-[#1A5276]'
            : 'border-slate-200 hover:border-slate-300 active:border-[#1A5276] text-slate-700'
          }`}
      >
        <span
          className={`mr-3 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
            ${checked ? 'border-[#1A5276] bg-[#1A5276]' : 'border-slate-300'}`}
        >
          {checked && <span className="w-2 h-2 rounded-full bg-white" />}
        </span>
        {children}
      </div>
    </label>
  );
}

export default function RequestAccessForm({ municipalities }: Props) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dir, setDir] = useState(1);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [roleOther, setRoleOther] = useState('');
  const [muniName, setMuniName] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [referral, setReferral] = useState('');
  const [referralOther, setReferralOther] = useState('');



  // UI state
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const textInputRef = useRef<HTMLInputElement>(null);
  const roleOtherRef = useRef<HTMLInputElement>(null);
  const referralOtherRef = useRef<HTMLInputElement>(null);

  const TOTAL_FORM_STEPS = 6;
  const progress = step === 0 ? 0 : step >= 7 ? 100 : Math.round((step / TOTAL_FORM_STEPS) * 100);

  const navigate = useCallback((nextStep: number, direction = 1) => {
    setDir(direction);
    setVisible(false);
    setTimeout(() => {
      setStep(nextStep);
      setError('');
      setVisible(true);
    }, 180);
  }, []);

  const next = useCallback(() => navigate(step + 1), [step, navigate]);
  const back = useCallback(() => { if (step > 0 && step < 7) navigate(step - 1, -1); }, [step, navigate]);

  // Focus text inputs on step change
  useEffect(() => {
    if ([1, 2, 4].includes(step)) {
      const timer = setTimeout(() => textInputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [step]);



  const validateAndAdvance = useCallback(() => {
    setError('');
    if (step === 1) {
      if (!name.trim()) { setError('Please enter your full name.'); return; }
      next();
    } else if (step === 2) {
      if (!email.trim()) { setError('Please enter your email address.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }
      next();
    } else if (step === 4) {
      if (!muniName.trim()) { setError('Please enter your municipality.'); return; }
      next();
    }
  }, [step, name, email, muniName, next]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step > 0 && step < 7) { back(); return; }
      if (e.key === 'Enter' && [1, 2, 4].includes(step)) {
        e.preventDefault();
        validateAndAdvance();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, back, validateAndAdvance]);



  const handleRoleSelect = (r: string) => {
    setRole(r);
    if (r !== 'Other') {
      setTimeout(() => navigate(step + 1), 150);
    } else {
      setTimeout(() => roleOtherRef.current?.focus(), 100);
    }
  };

  const handleTeamSelect = (t: string) => {
    setTeamSize(t);
    setTimeout(() => navigate(step + 1), 150);
  };

  const handleReferralSelect = (r: string) => {
    setReferral(r);
    if (r !== 'Other') {
      setTimeout(() => doSubmit(r), 150);
    } else {
      setTimeout(() => referralOtherRef.current?.focus(), 100);
    }
  };

  const doSubmit = async (finalReferral?: string) => {
    setSubmitting(true);
    setError('');
    const ref = finalReferral ?? (referral === 'Other' ? `Other: ${referralOther}` : referral);
    
    try {
      const res = await fetch('/api/email-octopus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          role: role === 'Other' ? `Other: ${roleOther}` : role,
          municipality: muniName,
          teamSize,
          referral: ref,
        }),
      });
      
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as any).error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      
      navigate(7);
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  const isNavy = step === 0 || step === 7;

  const transitionStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: `translateY(${visible ? 0 : dir * 16}px)`,
    transition: 'opacity 0.18s ease, transform 0.18s ease',
  };

  const enterHint = (
    <p className="text-xs text-slate-400">
      Press{' '}
      <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono text-xs">Enter ↵</kbd>
    </p>
  );

  const nextBtn = (onClick: () => void, disabled = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 bg-[#1A5276] hover:bg-[#2E86C1] active:bg-[#2E86C1] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
    >
      Next <ChevronRight />
    </button>
  );

  return (
    <div
      style={{ minHeight: '100dvh', paddingBottom: 'env(safe-area-inset-bottom)' }}
      className={`flex flex-col transition-colors duration-300 relative ${isNavy ? 'page-header-bg' : 'bg-[var(--color-surface)]'}`}
    >
      {isNavy && <div className="hero-dot-grid absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none" />}
      {isNavy && <div className="absolute bottom-0 left-0 right-0 hero-shimmer-line z-0" />}

      {/* Enterprise Header / Frosted Nav */}
      {isNavy && (
        <nav className="frosted sticky.top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 22h20L12 2z"/></svg>
            <span className="text-white font-bold text-lg tracking-tight">Civic Northstar</span>
          </div>
        </nav>
      )}
      {/* Progress bar */}
      {step > 0 && step < 7 && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200">
          <div
            className="h-full bg-[var(--color-secondary)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Back button */}
      {step > 0 && step < 7 && (
        <button
          onClick={back}
          className="fixed top-2 left-2 z-50 p-3 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          aria-label="Go back"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div style={transitionStyle} className={`w-full ${step === 0 ? 'max-w-[720px]' : 'max-w-[480px]'}`}>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-white relative z-10 lg:pl-10">
              <span className="eyebrow text-white/90 bg-white/15 px-3 py-1.5 rounded-full border border-white/10 inline-flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Coming Soon
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight mt-6">
                Request Early Access
              </h1>
              
              <p className="text-white/80 text-lg lg:text-xl leading-relaxed mb-10 max-w-xl">
                Our tool will give you unprecedented insights into your community data benchmarked against your peers.
              </p>

              <div className="grid sm:grid-cols-1 gap-6 mb-12 max-w-lg">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] border border-[var(--color-secondary)]/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Peer Ranking & Insights</h3>
                    <p className="text-white/70 text-sm leading-snug">See exactly which peers are ahead of you and the per-capita data putting the gap in dollars.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={() => navigate(1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[var(--color-primary)] font-bold px-8 py-4 rounded-xl shadow-elevated transition-transform hover:scale-105 active:scale-95 text-base"
                >
                  Request early access 
                  <ChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <p className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-widest mb-2">Step 1 of 6</p>
              <h2 className="text-xl font-bold text-slate-800 mb-1">What's your name?</h2>
              <p className="text-slate-500 text-sm mb-6">We'd like to know who we're talking to.</p>
              <input
                ref={textInputRef}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
                className="w-full border-b-2 border-slate-200 focus:border-[var(--color-secondary)] outline-none text-slate-800 pb-3 bg-transparent transition-colors placeholder:text-slate-300"
                style={{ fontSize: '18px' }}
              />
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              <div className="flex items-center justify-between mt-6 sticky bottom-0 bg-white pt-2">
                {enterHint}
                {nextBtn(validateAndAdvance)}
              </div>
            </div>
          )}

          {/* Step 2: Email */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <p className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-widest mb-2">Step 2 of 6</p>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Your official email?</h2>
              <p className="text-slate-500 text-sm mb-6">Use your municipality or government email address.</p>
              <input
                ref={textInputRef}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane@kelowna.ca"
                autoComplete="email"
                className="w-full border-b-2 border-slate-200 focus:border-[var(--color-secondary)] outline-none text-slate-800 pb-3 bg-transparent transition-colors placeholder:text-slate-300"
                style={{ fontSize: '18px' }}
              />
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              <div className="flex items-center justify-between mt-6 sticky bottom-0 bg-white pt-2">
                {enterHint}
                {nextBtn(validateAndAdvance)}
              </div>
            </div>
          )}

          {/* Step 3: Role */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <p className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-widest mb-2">Step 3 of 6</p>
              <h2 className="text-xl font-bold text-slate-800 mb-1">What's your role?</h2>
              <p className="text-slate-500 text-sm mb-5">Select the option that best describes you.</p>
              <div className="flex flex-col gap-2">
                {ROLE_OPTIONS.map(r => (
                  <RadioOption key={r} value={r} checked={role === r} onChange={() => handleRoleSelect(r)}>
                    {r}
                  </RadioOption>
                ))}
              </div>
              {role === 'Other' && (
                <div className="mt-4">
                  <input
                    ref={roleOtherRef}
                    type="text"
                    value={roleOther}
                    onChange={e => setRoleOther(e.target.value)}
                    placeholder="Describe your role..."
                    className="w-full border-b-2 border-slate-200 focus:border-[var(--color-secondary)] outline-none text-slate-800 pb-2 bg-transparent transition-colors placeholder:text-slate-300"
                    style={{ fontSize: '16px' }}
                    onKeyDown={e => { if (e.key === 'Enter' && roleOther.trim()) { e.preventDefault(); next(); } }}
                  />
                  <div className="flex justify-end mt-4">
                    {nextBtn(() => { if (roleOther.trim()) next(); else roleOtherRef.current?.focus(); })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Municipality */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <p className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-widest mb-2">Step 4 of 6</p>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Your municipality?</h2>
              <p className="text-slate-500 text-sm mb-6">Which municipality or organization do you represent?</p>
              <input
                ref={textInputRef}
                type="text"
                value={muniName}
                onChange={e => setMuniName(e.target.value)}
                placeholder="e.g. City of Kelowna"
                className="w-full border-b-2 border-slate-200 focus:border-[var(--color-secondary)] outline-none text-slate-800 pb-3 bg-transparent transition-colors placeholder:text-slate-300"
                style={{ fontSize: '18px' }}
              />
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              <div className="flex items-center justify-between mt-6 sticky bottom-0 bg-white pt-2">
                {enterHint}
                {nextBtn(validateAndAdvance)}
              </div>
            </div>
          )}

          {/* Step 5: Team Size */}
          {step === 5 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <p className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-widest mb-2">Step 5 of 6</p>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Team size?</h2>
              <p className="text-slate-500 text-sm mb-5">How many people would use this platform?</p>
              <div className="flex flex-col gap-2">
                {TEAM_OPTIONS.map(t => (
                  <RadioOption key={t} value={t} checked={teamSize === t} onChange={() => handleTeamSelect(t)}>
                    {t}
                  </RadioOption>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Referral */}
          {step === 6 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <p className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-widest mb-2">Step 6 of 6</p>
              <h2 className="text-xl font-bold text-slate-800 mb-1">How did you hear about us?</h2>
              <p className="text-slate-500 text-sm mb-5">Help us understand how you found Civic Northstar.</p>
              <div className="flex flex-col gap-2">
                {REFERRAL_OPTIONS.map(r => (
                  <RadioOption key={r} value={r} checked={referral === r} onChange={() => handleReferralSelect(r)}>
                    {r}
                  </RadioOption>
                ))}
              </div>
              {referral === 'Other' && (
                <div className="mt-4">
                  <input
                    ref={referralOtherRef}
                    type="text"
                    value={referralOther}
                    onChange={e => setReferralOther(e.target.value)}
                    placeholder="Tell us more..."
                    className="w-full border-b-2 border-slate-200 focus:border-[var(--color-secondary)] outline-none text-slate-800 pb-2 bg-transparent transition-colors placeholder:text-slate-300"
                    style={{ fontSize: '16px' }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); doSubmit(); } }}
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => doSubmit()}
                      disabled={submitting}
                      className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] active:bg-[var(--color-secondary)] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      {submitting ? 'Submitting…' : <>Submit <ChevronRight /></>}
                    </button>
                  </div>
                </div>
              )}
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </div>
          )}

          {/* Step 7: Success */}
          {step === 7 && (
            <div className="text-center text-white">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[var(--color-secondary)] rounded-2xl flex items-center justify-center">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-white">Thank you!</h1>
              <p className="text-white/70 text-base mb-8 max-w-sm mx-auto leading-relaxed">
                Your request has been saved. We'll reach out to{' '}
                <strong className="text-white font-semibold">{email}</strong> when your access is ready.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Privacy Policy Footer */}
      <footer className="w-full text-center pb-6 px-4 z-10 mt-auto">
        <p className={`text-[11px] max-w-2xl mx-auto leading-snug ${isNavy ? 'text-white/50' : 'text-slate-400'}`}>
          We respect your privacy. By requesting access, you agree to our use of your information for email marketing and to contact you about Civic Northstar, in accordance with our data collection policy.
        </p>
      </footer>
    </div>
  );
}
