import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { useI18n } from '../context/I18nContext.jsx';
import { useAudio, playBubble } from '../context/AudioContext.jsx';
import LetterTitle from '../components/LetterTitle.jsx';
import { EyeIcon, EyeOffIcon } from '../components/icons.jsx';
import SponsorLogos from '../components/SponsorLogos.jsx';

const loginBg = import.meta.glob('/src/assets/login-bg.{png,jpg,jpeg,svg,webp,gif}', { eager: true });
const bgUrl = Object.values(loginBg)[0]?.default || null;

function mapError(message) {
  return {
    'Network error': 'errors.network',
    'Invalid class code': 'errors.invalidClassCode',
    'Email is already registered': 'errors.emailExists',
    'Incorrect email or password': 'errors.wrongCredentials',
    'Password must be at least 6 characters': 'errors.passwordShort',
    'Name, email and password are required': 'errors.required',
  }[message];
}

function formatWait(t, seconds) {
  const s = Math.max(1, Math.round(seconds || 0));
  if (s < 60) return s === 1 ? t('errors.waitSecond') : t('errors.waitSeconds', { n: s });
  const min = Math.floor(s / 60);
  const sec = s % 60;
  if (sec === 0) return min === 1 ? t('errors.waitMinute') : t('errors.waitMinutes', { min });
  return t('errors.waitMinSec', { min, sec });
}

function errorMessage(t, err) {
  if (err?.status === 429) return t('errors.tooManyRequests', { time: formatWait(t, err.retryAfter) });
  const key = mapError(err?.message);
  return key ? t(key) : t('errors.generic');
}

export default function Login() {
  const { token, login, signup, updateUser, api } = useAuth();
  const { t, lang, setLanguage } = useI18n();
  const { startMusic } = useAudio();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [joinError, setJoinError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needClass, setNeedClass] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('cv_user') || 'null');
      return user?.role === 'student' && !user?.class_id;
    } catch { return false; }
  });
  const [joinCode, setJoinCode] = useState('');

  // Check for joinClass state from navigation (when student is redirected due to missing class_id)
  useEffect(() => {
    if (location.state?.joinClass) {
      setNeedClass(true);
    }
  }, [location.state]);

  async function handleJoinClass(e) {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (!code || loading) return;
    
    // Client-side validation: 6 alphanumeric characters
    if (!/^[A-Z0-9]{6}$/i.test(joinCode.trim())) {
      setJoinError(t('joinClass.error'));
      return;
    }
    
    setLoading(true);
    setJoinError('');
    try {
      const data = await api('/api/auth/join-class', {
        method: 'POST',
        body: { classCode: joinCode.trim().toUpperCase() },
      });
      updateUser(data.user);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err?.status === 429
        ? errorMessage(t, err)
        : (err?.message === 'Network error' ? t('errors.network') : t('joinClass.error'));
      setJoinError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password || (mode === 'signup' && (!name.trim() || (role === 'student' && !classCode.trim())))) {
      setError(t('errors.required'));
      return;
    }
    setLoading(true);
    try {
      let user;
      if (mode === 'login') {
        user = await login(email, password);
      } else {
        user = await signup(name, email, password, classCode, role);
      }
      

      if (user?.role === 'student' && !user?.class_id) {
        setNeedClass(true);
        setLoading(false);
        return;
      }

      let resumePath = '/';
      try {
        const resume = JSON.parse(localStorage.getItem('cv_resume') || 'null');
        if (resume && resume.userId === user.id && resume.path) {
          resumePath = resume.path;
        }
      } catch {
        /* ignore */
      }
      localStorage.removeItem('cv_resume');
      navigate(user?.role === 'teacher' ? '/teacher' : resumePath, { replace: true });
    } catch (err) {
      setError(errorMessage(t, err));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-plum-200 bg-white/70 px-4 py-3 text-plum-900 placeholder-plum-400 outline-none transition focus:border-plum-500 focus:ring-2 focus:ring-plum-200 lg:border-white/20 lg:bg-white/10 lg:text-cream lg:placeholder-cream/40 lg:focus:border-lilac lg:focus:ring-lilac/30';

  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-2">
      <div className="fixed inset-0 overflow-hidden lg:hidden">
        {bgUrl ? (
          <img src={bgUrl} alt="" className="h-full w-full scale-110 object-cover blur-[4px]" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sand via-lilac-light to-lilac" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-plum-900/70 via-plum-800/55 to-plum-900/70" />
      </div>

      <div className="absolute right-4 top-4 z-20 rounded-xl border border-white/60 bg-white/90 px-3 py-2 shadow-md backdrop-blur">
        <SponsorLogos />
      </div>

      <button
        onClick={() => setLanguage(lang === 'en' ? 'id' : 'en')}
        className="absolute left-4 top-4 z-20 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-xs font-semibold text-plum-800 backdrop-blur transition-colors hover:bg-white/70 lg:border-white/25 lg:bg-white/10 lg:text-cream lg:hover:bg-white/20"
      >
        {lang === 'en' ? 'ID' : 'EN'}
      </button>

      <div className="relative hidden lg:flex lg:flex-col lg:justify-center lg:items-start lg:overflow-hidden lg:px-12 lg:py-10">
        {bgUrl ? (
          <img src={bgUrl} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover blur-[4px]" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sand via-lilac-light to-lilac" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-plum-900/70 via-plum-800/55 to-plum-900/70" />

        <div className="relative z-10">
          <LetterTitle
            lines={[{ text: 'Taro Quest' }]}
            sound={playBubble}
            className="text-[58px] text-cream [text-shadow:0_4px_18px_rgba(43,22,74,0.55)] xl:text-[78px] 2xl:text-[88px]"
          />
          <p className="mt-3 font-display text-xl font-bold uppercase tracking-[0.28em] text-cream/90 [text-shadow:0_2px_10px_rgba(43,22,74,0.55)] sm:text-2xl">
            Machine Mystery
          </p>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-center items-center px-4 py-8 lg:bg-plum-900 lg:px-10 xl:px-14 lg:justify-center">
        <div className="mb-8 w-full text-center lg:hidden">
          <LetterTitle
            lines={[{ text: 'Taro Quest' }]}
            interactive={false}
            className="text-[34px] text-cream [text-shadow:0_4px_18px_rgba(43,22,74,0.55)] sm:text-[44px]"
          />
          <p className="mt-1 font-display text-sm font-bold uppercase tracking-[0.28em] text-cream/90 [text-shadow:0_2px_10px_rgba(43,22,74,0.55)] sm:text-base">
            Machine Mystery
          </p>
        </div>
        <div className="w-full max-w-md lg:max-w-sm">
          <div className="rounded-3xl bg-cream p-6 shadow-xl ring-1 ring-plum-700/40 md:p-8 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0">
            {needClass ? (
              <>
                <h2 className="font-display text-2xl font-bold text-plum-900 lg:text-cream">{t('joinClass.title')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-plum-700 lg:text-cream/75">{t('joinClass.desc')}</p>

                <form onSubmit={handleJoinClass} className="mt-6 space-y-4">
                  <label className="block">
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        setJoinCode(val);
                        if (joinError) setJoinError('');
                      }}
                      placeholder={t('joinClass.placeholder')}
                      maxLength={6}
                      autoFocus
                      className={`${inputClass} text-center font-display text-lg uppercase tracking-[0.2em]`}
                    />
                  </label>

                  {joinError && (
                    <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 ring-1 ring-red-200 flex items-center justify-between lg:bg-red-500/15 lg:text-red-100 lg:ring-red-400/30">
                      <span>{joinError}</span>
                      <button
                        type="button"
                        onClick={() => setJoinError('')}
                        className="text-red-600 hover:text-red-800 font-bold lg:text-red-100 lg:hover:text-white"
                        aria-label={t('joinClass.dismissError') || 'Dismiss'}
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setNeedClass(false)}
                      className="w-full rounded-2xl bg-plum-100 py-3 font-display font-semibold text-plum-800 transition-colors hover:bg-plum-200 lg:bg-white/10 lg:text-cream lg:hover:bg-white/20"
                    >
                      {t('joinClass.back')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !joinCode.trim() || !/^[A-Z0-9]{6}$/i.test(joinCode)}
                      className="w-full rounded-2xl bg-plum-800 py-3 font-display font-semibold text-cream shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 lg:bg-lilac lg:text-plum-900"
                    >
                      {loading ? '...' : t('joinClass.join')}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-plum-900 lg:text-cream">
                  {mode === 'login' ? t('login.welcome') : t('login.join')}
                </h2>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {mode === 'signup' && (
                    <>
                      <div>
                        <span className="mb-1.5 block text-sm font-semibold text-plum-800 lg:text-cream/80">
                          {t('login.role')}
                        </span>
                        <div className="flex rounded-2xl bg-plum-100 p-1 ring-1 ring-plum-200 lg:bg-white/10 lg:ring-white/20">
                          {['student', 'teacher'].map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setRole(r)}
                              className={`flex-1 rounded-xl py-2 text-sm font-bold transition-all ${
                                role === r ? 'bg-plum-800 text-cream shadow lg:bg-lilac lg:text-plum-900' : 'text-plum-700 hover:bg-white/70 lg:text-cream/75 lg:hover:bg-white/10'
                              }`}
                            >
                              {r === 'student' ? t('login.roleStudent') : t('login.roleTeacher')}
                            </button>
                          ))}
                        </div>
                        {role === 'teacher' && (
                          <p className="mt-1.5 text-xs font-medium text-plum-600 lg:text-cream/60">{t('login.teacherInfo')}</p>
                        )}
                      </div>
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-plum-800 lg:text-cream/80">
                          {t('login.name')}
                        </span>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t('login.namePlaceholder')}
                          className={inputClass}
                        />
                      </label>
                      {role === 'student' && (
                        <label className="block">
                          <span className="mb-1.5 block text-sm font-semibold text-plum-800 lg:text-cream/80">
                            {t('login.classCode')}
                          </span>
                          <input
                            type="text"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                            placeholder={t('login.classCodePlaceholder')}
                            maxLength={8}
                            className={`${inputClass} font-display uppercase tracking-widest`}
                          />
                        </label>
                      )}
                    </>
                  )}

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-plum-800 lg:text-cream/80">
                      {t('login.email')}
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('login.emailPlaceholder')}
                      className={inputClass}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-plum-800 lg:text-cream/80">
                      {t('login.password')}
                    </span>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-plum-500 transition-colors hover:text-plum-800 lg:text-cream/60 lg:hover:text-cream"
                      >
                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </label>

                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 ring-1 ring-red-200 lg:bg-red-500/15 lg:text-red-100 lg:ring-red-400/30">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-plum-800 py-3 font-display font-semibold text-cream shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 lg:bg-lilac lg:text-plum-900"
                  >
                    {loading ? '...' : mode === 'login' ? t('login.signIn') : t('login.signUp')}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm font-semibold text-plum-800 lg:text-cream/80">
                  {mode === 'login' ? (
                    <button onClick={() => { setMode('signup'); setError(''); }} className="underline-offset-2 hover:underline">
                      {t('login.switchToSignup')}
                    </button>
                  ) : (
                    <button onClick={() => { setMode('login'); setError(''); }} className="underline-offset-2 hover:underline">
                      {t('login.switchToLogin')}
                    </button>
                  )}
                </p>
              </>
            )}
          </div>

          {!needClass && (
            <p className="mt-4 rounded-2xl bg-white/85 px-4 py-2.5 text-center text-xs font-medium text-plum-900 backdrop-blur whitespace-pre-line lg:bg-white/10 lg:text-cream/70">
              {t('login.demoHint')}
            </p>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-4 right-4 z-20 flex items-center gap-4">
          <p className="pointer-events-auto hidden whitespace-nowrap text-xs font-medium text-plum-200/70 select-none lg:block">
            Made with ❤️ by teaMate
          </p>
          <Link
            to="/"
            className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/60 bg-white/40 px-4 py-2 text-sm font-semibold text-plum-800 backdrop-blur transition-transform hover:-translate-x-0.5 hover:bg-white/70 lg:border-white/25 lg:bg-white/10 lg:text-cream lg:hover:bg-white/20"
          >
            ← {t('landing.backHome')}
          </Link>
        </div>
      </div>

      <p className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-white/70 select-none lg:hidden">
        Made with ❤️ by teaMate
      </p>
    </div>
  );
}
