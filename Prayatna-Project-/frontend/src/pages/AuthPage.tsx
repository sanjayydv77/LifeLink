import React, { useState } from 'react';
import {
  Heart, Phone, User, Mail, Building2, Car, ChevronRight,
  ChevronLeft, Shield, Eye, EyeOff, CheckCircle2, Loader2,
  Ambulance, Stethoscope, Users, ArrowRight, Lock, RefreshCw
} from 'lucide-react';

const API = 'http://localhost:5000';

type Role = 'patient' | 'ambulance_driver' | 'hospital_admin';
type Step = 'role' | 'info' | 'otp' | 'login_phone' | 'login_otp';

interface FormData {
  name: string;
  email: string;
  phone: string;
  otp: string;
  // ambulance driver extras
  agencyName: string;
  vehicleNumber: string;
  licenseNumber: string;
  // hospital admin extras
  hospitalName: string;
  hospitalCity: string;
}

const ROLES = [
  {
    id: 'patient' as Role,
    label: 'Patient / General User',
    desc: 'Access hospital info, book appointments & request SOS',
    icon: Users,
    color: 'from-teal-500 to-emerald-500',
    border: 'border-teal-500/50',
    glow: 'shadow-teal-500/20',
    bg: 'bg-teal-950/30',
  },
  {
    id: 'hospital_admin' as Role,
    label: 'Hospital Admin',
    desc: 'Manage hospital resources, beds, inventory & emergencies',
    icon: Building2,
    color: 'from-violet-500 to-purple-500',
    border: 'border-violet-500/50',
    glow: 'shadow-violet-500/20',
    bg: 'bg-violet-950/30',
  },
  {
    id: 'ambulance_driver' as Role,
    label: 'Ambulance Driver',
    desc: 'Receive & respond to emergency SOS dispatch requests',
    icon: Ambulance,
    color: 'from-rose-500 to-orange-500',
    border: 'border-rose-500/50',
    glow: 'shadow-rose-500/20',
    bg: 'bg-rose-950/30',
  },
];

function InputField({
  label, icon: Icon, type = 'text', value, onChange, placeholder, maxLength
}: {
  label: string; icon: any; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; maxLength?: number;
}) {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-teal-300/70 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500/60" />
        <input
          type={isPass ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full bg-[#051510] border border-teal-800/40 rounded-xl pl-10 pr-10 py-3 text-white placeholder-teal-700/50 text-sm focus:outline-none focus:border-teal-500/70 focus:ring-1 focus:ring-teal-500/30 transition-all"
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-400 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AuthPage({ onAuth }: { onAuth: (user: any) => void }) {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [devOtp, setDevOtp] = useState('');

  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', otp: '',
    agencyName: '', vehicleNumber: '', licenseNumber: '',
    hospitalName: '', hospitalCity: '',
  });

  const set = (k: keyof FormData) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const selectedRole = ROLES.find(r => r.id === role);

  const startCountdown = () => {
    setCountdown(20);
    const t = setInterval(() => {
      setCountdown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
  };

  const sendOtp = async (phoneNum: string) => {
    if (!phoneNum || phoneNum.length !== 10) { setError('Enter a valid 10-digit phone number'); return; }
    setError(''); setLoading(true);
    try {
      const r = await fetch(`${API}/api/auth/send-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNum }),
      });
      const d = await r.json();
      if (!d.success) { setError(d.message || 'Failed to send OTP'); }
      else {
        setOtpSent(true);
        startCountdown();
        if (d.otp) setDevOtp(d.otp); // dev mode OTP
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleRegisterOtp = async () => {
    if (!form.otp || form.otp.length !== 6) { setError('Enter 6-digit OTP'); return; }
    setError(''); setLoading(true);
    try {
      const body: any = {
        phone: form.phone, otp: form.otp, name: form.name,
        email: form.email || undefined, userType: role,
      };
      if (role === 'ambulance_driver') {
        body.agencyName = form.agencyName;
        body.vehicleNumber = form.vehicleNumber;
        body.licenseNumber = form.licenseNumber;
      }
      if (role === 'hospital_admin') {
        body.hospitalName = form.hospitalName;
      }
      const r = await fetch(`${API}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!d.success) { setError(d.message || 'Registration failed'); }
      else {
        sessionStorage.setItem('lifelink_token', d.data.token);
        sessionStorage.setItem('lifelink_user', JSON.stringify(d.data));
        onAuth(d.data);
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleLoginOtp = async () => {
    if (!form.otp || form.otp.length !== 6) { setError('Enter 6-digit OTP'); return; }
    setError(''); setLoading(true);
    try {
      const r = await fetch(`${API}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, otp: form.otp }),
      });
      const d = await r.json();
      if (!d.success) { setError(d.message || 'Login failed'); }
      else {
        sessionStorage.setItem('lifelink_token', d.data.token);
        sessionStorage.setItem('lifelink_user', JSON.stringify(d.data));
        onAuth(d.data);
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const switchMode = (m: 'register' | 'login') => {
    setMode(m); setStep(m === 'register' ? 'role' : 'login_phone');
    setError(''); setOtpSent(false); setDevOtp('');
    setForm({ name: '', email: '', phone: '', otp: '', agencyName: '', vehicleNumber: '', licenseNumber: '', hospitalName: '', hospitalCity: '' });
  };

  // ── Step: Role selection ──
  const renderRoleStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-teal-400/70 text-sm">I am registering as a…</p>
      </div>
      {ROLES.map(r => (
        <button
          key={r.id}
          onClick={() => { setRole(r.id); setStep('info'); setError(''); }}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl border ${r.border} ${r.bg} hover:shadow-lg ${r.glow} transition-all duration-300 group hover:scale-[1.02]`}
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <r.icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-left flex-1">
            <p className="text-white font-bold text-sm">{r.label}</p>
            <p className="text-teal-400/60 text-xs mt-0.5">{r.desc}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-teal-600 group-hover:text-teal-400 transition-colors flex-shrink-0" />
        </button>
      ))}
    </div>
  );

  // ── Step: Info form ──
  const renderInfoStep = () => (
    <div className="space-y-4">
      <button onClick={() => { setStep('role'); setError(''); }} className="flex items-center gap-2 text-teal-400/70 hover:text-teal-300 text-sm transition-colors mb-2">
        <ChevronLeft className="w-4 h-4" /> Change Role
      </button>

      {selectedRole && (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${selectedRole.border} ${selectedRole.bg} mb-4`}>
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedRole.color} flex items-center justify-center`}>
            <selectedRole.icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">{selectedRole.label}</span>
        </div>
      )}

      <InputField label="Full Name" icon={User} value={form.name} onChange={set('name')} placeholder="Enter your full name" />
      <InputField label="Email (Optional)" icon={Mail} type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" />
      <InputField label="Phone Number" icon={Phone} type="tel" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile number" maxLength={10} />

      {role === 'ambulance_driver' && (
        <>
          <InputField label="Agency / Company Name" icon={Building2} value={form.agencyName} onChange={set('agencyName')} placeholder="e.g. City Ambulance Services" />
          <InputField label="Vehicle Number" icon={Car} value={form.vehicleNumber} onChange={set('vehicleNumber')} placeholder="e.g. DL-01-AM-1234" />
          <InputField label="License Number" icon={Shield} value={form.licenseNumber} onChange={set('licenseNumber')} placeholder="Driving license number" />
        </>
      )}

      {role === 'hospital_admin' && (
        <>
          <InputField label="Hospital Name" icon={Building2} value={form.hospitalName} onChange={set('hospitalName')} placeholder="e.g. City Medical Center" />
          <InputField label="City" icon={Stethoscope} value={form.hospitalCity} onChange={set('hospitalCity')} placeholder="e.g. New Delhi" />
        </>
      )}

      {error && <p className="text-rose-400 text-xs bg-rose-950/30 border border-rose-800/30 rounded-lg px-3 py-2">{error}</p>}

      <button
        onClick={async () => {
          if (!form.name.trim()) { setError('Name is required'); return; }
          if (!form.phone || form.phone.length !== 10) { setError('Enter valid 10-digit phone number'); return; }
          if (role === 'hospital_admin' && !form.hospitalName.trim()) { setError('Hospital name is required'); return; }
          await sendOtp(form.phone);
          if (form.phone.length === 10) setStep('otp');
        }}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm transition-all shadow-lg shadow-teal-500/20 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Send OTP</>}
      </button>
    </div>
  );

  // ── Step: OTP (register) ──
  const renderOtpStep = () => (
    <div className="space-y-4">
      <button onClick={() => { setStep('info'); setError(''); }} className="flex items-center gap-2 text-teal-400/70 hover:text-teal-300 text-sm transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <div className="text-center py-2">
        <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-3">
          <Phone className="w-7 h-7 text-teal-400" />
        </div>
        <p className="text-white font-semibold">OTP sent to</p>
        <p className="text-teal-300 font-bold text-lg">+91 {form.phone}</p>
        {devOtp && (
          <p className="text-amber-400 text-xs mt-2 bg-amber-950/30 border border-amber-700/30 rounded-lg px-3 py-1.5">
            🛠 Dev Mode OTP: <strong>{devOtp}</strong>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-teal-300/70 uppercase tracking-wider">Enter 6-Digit OTP</label>
        <input
          type="text"
          value={form.otp}
          onChange={e => set('otp')(e.target.value.replace(/\D/g, ''))}
          maxLength={6}
          placeholder="_ _ _ _ _ _"
          className="w-full bg-[#051510] border border-teal-800/40 rounded-xl px-4 py-4 text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-teal-500/70 focus:ring-1 focus:ring-teal-500/30 transition-all"
        />
      </div>

      {error && <p className="text-rose-400 text-xs bg-rose-950/30 border border-rose-800/30 rounded-lg px-3 py-2">{error}</p>}

      <button onClick={handleRegisterOtp} disabled={loading || form.otp.length !== 6}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm transition-all shadow-lg shadow-teal-500/20 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Verify & Register</>}
      </button>

      <button onClick={() => { sendOtp(form.phone); setForm(f => ({ ...f, otp: '' })); }}
        disabled={countdown > 0 || loading}
        className="w-full py-2 text-teal-400/70 hover:text-teal-300 text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50">
        <RefreshCw className="w-3 h-3" />
        {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
      </button>
    </div>
  );

  // ── Login Steps ──
  const renderLoginPhoneStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-teal-400/70 text-sm">Enter your registered phone number</p>
      </div>
      <InputField label="Phone Number" icon={Phone} type="tel" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile number" maxLength={10} />
      {error && <p className="text-rose-400 text-xs bg-rose-950/30 border border-rose-800/30 rounded-lg px-3 py-2">{error}</p>}
      <button
        onClick={async () => { await sendOtp(form.phone); if (form.phone.length === 10) setStep('login_otp'); }}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm transition-all shadow-lg shadow-teal-500/20 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Send OTP</>}
      </button>
    </div>
  );

  const renderLoginOtpStep = () => (
    <div className="space-y-4">
      <button onClick={() => { setStep('login_phone'); setError(''); }} className="flex items-center gap-2 text-teal-400/70 hover:text-teal-300 text-sm transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <div className="text-center py-2">
        <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-3">
          <Lock className="w-7 h-7 text-teal-400" />
        </div>
        <p className="text-white font-semibold">OTP sent to</p>
        <p className="text-teal-300 font-bold text-lg">+91 {form.phone}</p>
        {devOtp && (
          <p className="text-amber-400 text-xs mt-2 bg-amber-950/30 border border-amber-700/30 rounded-lg px-3 py-1.5">
            🛠 Dev Mode OTP: <strong>{devOtp}</strong>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-teal-300/70 uppercase tracking-wider">Enter 6-Digit OTP</label>
        <input
          type="text"
          value={form.otp}
          onChange={e => set('otp')(e.target.value.replace(/\D/g, ''))}
          maxLength={6}
          placeholder="_ _ _ _ _ _"
          className="w-full bg-[#051510] border border-teal-800/40 rounded-xl px-4 py-4 text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-teal-500/70 focus:ring-1 focus:ring-teal-500/30 transition-all"
        />
      </div>
      {error && <p className="text-rose-400 text-xs bg-rose-950/30 border border-rose-800/30 rounded-lg px-3 py-2">{error}</p>}
      <button onClick={handleLoginOtp} disabled={loading || form.otp.length !== 6}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm transition-all shadow-lg shadow-teal-500/20 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Verify & Sign In</>}
      </button>
      <button onClick={() => { sendOtp(form.phone); setForm(f => ({ ...f, otp: '' })); }}
        disabled={countdown > 0 || loading}
        className="w-full py-2 text-teal-400/70 hover:text-teal-300 text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50">
        <RefreshCw className="w-3 h-3" />
        {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
      </button>
    </div>
  );

  const stepContent = () => {
    if (mode === 'login') {
      return step === 'login_phone' ? renderLoginPhoneStep() : renderLoginOtpStep();
    }
    if (step === 'role') return renderRoleStep();
    if (step === 'info') return renderInfoStep();
    return renderOtpStep();
  };

  const stepLabel = () => {
    if (mode === 'login') return step === 'login_phone' ? 'Enter Phone' : 'Verify OTP';
    if (step === 'role') return 'Select Role';
    if (step === 'info') return 'Your Details';
    return 'Verify OTP';
  };

  return (
    <div className="min-h-screen bg-[#071E1A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#14B8A6 1px,transparent 1px),linear-gradient(90deg,#14B8A6 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">LifeLink</h1>
              <p className="text-teal-400/70 text-xs font-medium">Emergency Response Network</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#0b2e28]/80 backdrop-blur-xl border border-teal-700/30 rounded-3xl shadow-2xl shadow-teal-900/30 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-teal-800/40">
            {(['register', 'login'] as const).map(m => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 py-4 text-sm font-bold transition-all ${mode === m ? 'text-teal-300 bg-teal-900/30 border-b-2 border-teal-400' : 'text-teal-600/60 hover:text-teal-400'}`}>
                {m === 'register' ? 'Create Account' : 'Sign In'}
              </button>
            ))}
          </div>

          {/* Step indicator */}
          <div className="px-6 pt-5 pb-2 flex items-center gap-2">
            {mode === 'register' && (
              <div className="flex items-center gap-1.5 flex-1">
                {['role', 'info', 'otp'].map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={`w-2 h-2 rounded-full transition-all ${step === s ? 'bg-teal-400 scale-125' : ['role', 'info', 'otp'].indexOf(step) > i ? 'bg-teal-500' : 'bg-teal-900'}`} />
                    {i < 2 && <div className={`flex-1 h-px transition-all ${['role', 'info', 'otp'].indexOf(step) > i ? 'bg-teal-500' : 'bg-teal-900'}`} />}
                  </React.Fragment>
                ))}
              </div>
            )}
            <span className="text-xs font-semibold text-teal-400/60 uppercase tracking-wider ml-auto">{stepLabel()}</span>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-2">
            {stepContent()}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-teal-700/50 text-xs mt-6">
          Secured with OTP authentication · LifeLink © 2026
        </p>
      </div>
    </div>
  );
}
