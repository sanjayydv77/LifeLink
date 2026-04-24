import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, FileText, ClipboardList, Bell, BedDouble, Activity,
  Wind, Droplets, Car, CheckCircle, XCircle, Clock, AlertTriangle,
  Phone, User, Stethoscope, RefreshCw, ChevronRight, X, Ambulance,
  HeartPulse, CalendarCheck, Building2, LogOut, Users, Package,
  Save, Edit3, TrendingUp, Minus, Plus
} from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');
const API_URL = 'http://localhost:5000';

// ─── Types ───────────────────────────────────────────────────────────────────
interface EmergencyReq {
  id: string; title: string; description: string; priority: string;
  patientName: string; patientPhone?: string; status: string;
  location: string; createdAt: string; hospitalId?: string;
}
interface AppointmentReq {
  id: string; patientName: string; patientPhone?: string; reason: string;
  appointmentType: string; status: string; createdAt: string; hospitalId?: string;
}
interface AmbulanceNotif {
  id: string; ambulance_driver_id: string; hospital_id: string;
  patient_type: string; patient_condition: string; number_of_patients: number;
  driver_contact: string; eta_minutes: number; status: string;
  hospital_response?: string; createdAt: string;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className={`rounded-xl border p-4 ${color} transition-all hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-teal-400/70">{icon}</span>
        <span className="text-2xl font-extrabold text-white">{value}</span>
      </div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-teal-400/60">{label}</p>
    </div>
  );
}

// ─── Request Row ─────────────────────────────────────────────────────────────
function RequestRow({ type, name, phone, detail, status, time, onAccept, onReject }: {
  type: string; name: string; phone?: string; detail: string; status: string;
  time: string; onAccept: () => void; onReject: () => void;
}) {
  const isPending = status === 'pending';
  return (
    <div className="bg-[#0a2822] border border-teal-800/30 rounded-xl p-4 flex items-center gap-4 transition-all hover:border-teal-600/40">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        type === 'emergency' ? 'bg-rose-900/40 text-rose-400' :
        type === 'bed' ? 'bg-emerald-900/40 text-emerald-400' :
        'bg-violet-900/40 text-violet-400'
      }`}>
        {type === 'emergency' ? <AlertTriangle className="w-5 h-5" /> :
         type === 'bed' ? <BedDouble className="w-5 h-5" /> :
         <CalendarCheck className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-white text-sm truncate">{name}</span>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            type === 'emergency' ? 'text-rose-400 bg-rose-950/40 border-rose-800/40' :
            type === 'bed' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' :
            'text-violet-400 bg-violet-950/40 border-violet-800/40'
          }`}>{type === 'emergency' ? 'Emergency' : type === 'bed' ? 'Bed Booking' : 'Appointment'}</span>
        </div>
        <p className="text-teal-400/70 text-xs truncate">{detail}</p>
        {phone && <p className="text-teal-500/50 text-[10px] mt-0.5 flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{phone}</p>}
      </div>
      <div className="text-right shrink-0 flex flex-col items-end gap-2">
        <span className="text-[10px] text-teal-500/50">{new Date(time).toLocaleTimeString()}</span>
        {isPending ? (
          <div className="flex gap-1.5">
            <button onClick={onAccept} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all">Accept</button>
            <button onClick={onReject} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-rose-900/60 hover:bg-rose-800 text-rose-300 rounded-lg border border-rose-800/40 transition-all">Reject</button>
          </div>
        ) : (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            status === 'confirmed' || status === 'assigned' || status === 'completed' ? 'text-emerald-400 bg-emerald-950/40' :
            status === 'cancelled' ? 'text-rose-400 bg-rose-950/40' : 'text-amber-400 bg-amber-950/40'
          }`}>{status}</span>
        )}
      </div>
    </div>
  );
}

// ─── Ambulance Alert Row ─────────────────────────────────────────────────────
function AmbulanceAlertRow({ notif, onAccept, onReject }: { notif: AmbulanceNotif; onAccept: () => void; onReject: () => void }) {
  const isPending = notif.status === 'pending';
  return (
    <div className={`border rounded-xl p-4 transition-all ${isPending ? 'bg-gradient-to-r from-rose-950/30 to-[#0a2822] border-rose-800/40 animate-pulse-slow' : 'bg-[#0a2822] border-teal-800/30'}`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-rose-900/40 flex items-center justify-center shrink-0">
          <Car className="w-5 h-5 text-rose-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-sm">Ambulance Alert</span>
            {isPending && <span className="text-[9px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-800/40 animate-pulse">URGENT</span>}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
            <div><span className="text-teal-500/60">Patient Type:</span> <span className="text-teal-200 font-semibold">{notif.patient_type}</span></div>
            <div><span className="text-teal-500/60">Patients:</span> <span className="text-teal-200 font-semibold">{notif.number_of_patients}</span></div>
            <div><span className="text-teal-500/60">Condition:</span> <span className="text-teal-200 font-semibold">{notif.patient_condition || 'Not specified'}</span></div>
            <div><span className="text-teal-500/60">ETA:</span> <span className="text-amber-400 font-bold">{notif.eta_minutes} min</span></div>
            {notif.driver_contact && <div><span className="text-teal-500/60">Driver:</span> <span className="text-teal-200 font-semibold">{notif.driver_contact}</span></div>}
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-2">
          <span className="text-[10px] text-teal-500/50">{new Date(notif.createdAt).toLocaleTimeString()}</span>
          {isPending ? (
            <div className="flex gap-1.5">
              <button onClick={onAccept} className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-900/30">Accept</button>
              <button onClick={onReject} className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-rose-900/60 hover:bg-rose-800 text-rose-300 rounded-lg border border-rose-800/40 transition-all">Reject</button>
            </div>
          ) : (
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              notif.status === 'accepted' ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40' : 'text-rose-400 bg-rose-950/40 border border-rose-800/40'
            }`}>{notif.status}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Hospital Portal ────────────────────────────────────────────────────
export default function HospitalPortal() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [emergencies, setEmergencies] = useState<EmergencyReq[]>([]);
  const [appointments, setAppointments] = useState<AppointmentReq[]>([]);
  const [ambulanceNotifs, setAmbulanceNotifs] = useState<AmbulanceNotif[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic hospital info from JWT
  const [hospitalInfo, setHospitalInfo] = useState<{ name: string; id: string; city?: string } | null>(null);
  const [profileError, setProfileError] = useState('');

  const [inventory, setInventory] = useState({
    generalBeds: 0, icuBeds: 0, oxygenCylinders: 0, bloodAvailable: 'Not set',
    ambulances: 0, ventilators: 0,
  });
  const [editingInventory, setEditingInventory] = useState(false);

  // Load hospital profile from JWT on mount
  useEffect(() => {
    const token = sessionStorage.getItem('lifelink_token');
    if (!token) { setProfileError('Not authenticated'); setLoading(false); return; }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.hospital) {
          const h = d.data.hospital;
          setHospitalInfo({ name: h.name, id: h.id, city: h.city });
          // Pre-populate inventory from DB if AIIMS (pre-loaded data)
          setInventory({
            generalBeds: h.totalBeds || 0,
            icuBeds: h.icu_beds_available ?? h.icuBeds ?? 0,
            oxygenCylinders: h.oxygen_cylinders_available ?? 0,
            bloodAvailable: 'Not set',
            ambulances: h.ambulances_available ?? h.ambulances ?? 0,
            ventilators: h.ventilators ?? 0,
          });
        } else {
          setProfileError('Hospital profile not found. Please contact support.');
        }
      })
      .catch(() => setProfileError('Could not load hospital profile.'))
      .finally(() => setLoading(false));
  }, []);

  // Fetch all requests scoped to this hospital
  const fetchData = useCallback(async () => {
    if (!hospitalInfo?.id) return;
    setLoading(true);
    try {
      const [emerRes, apptRes, notifRes] = await Promise.all([
        fetch(`${API_URL}/api/emergency`).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_URL}/api/appointments/all`).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_URL}/api/ambulance/all-hospital-notifications`).then(r => r.json()).catch(() => ({ data: [] })),
      ]);

      // Filter to only this hospital's data
      const hId = hospitalInfo.id;
      const allEmerg: EmergencyReq[] = emerRes.data || [];
      const allAppt: AppointmentReq[] = apptRes.data || [];
      const allNotif: AmbulanceNotif[] = notifRes.data || [];

      setEmergencies(allEmerg.filter((e: any) =>
        (!e.hospitalId || e.hospitalId === hId) &&
        (e.title || '').toLowerCase().startsWith('bed booking')
      ));
      setAppointments(allAppt.filter((a: any) => !a.hospitalId || a.hospitalId === hId));
      setAmbulanceNotifs(allNotif.filter((n: any) => !n.hospital_id || n.hospital_id === hId));
    } catch (err) {
      console.error('Failed to fetch hospital data:', err);
    }
    setLoading(false);
  }, [hospitalInfo?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Socket.IO real-time listeners
  useEffect(() => {
    // bed_booking_created → hospital only (SOS emergencies go to ambulance only)
    const onBedBooking = (data: any) => setEmergencies(prev => [data, ...prev]);
    const onAppointment = (data: any) => setAppointments(prev => [data, ...prev]);
    const onAmbulanceNotif = (data: any) => setAmbulanceNotifs(prev => [data, ...prev]);

    socket.on('bed_booking_created', onBedBooking);
    socket.on('appointment_created', onAppointment);
    socket.on('ambulance_notification_created', onAmbulanceNotif);

    return () => {
      socket.off('bed_booking_created', onBedBooking);
      socket.off('appointment_created', onAppointment);
      socket.off('ambulance_notification_created', onAmbulanceNotif);
    };
  }, []);

  // Action handlers
  const handleRequestAction = async (id: string, type: 'emergency' | 'bed' | 'appointment', action: 'accept' | 'reject') => {
    const status = action === 'accept' ? (type === 'appointment' ? 'confirmed' : 'assigned') : 'cancelled';
    try {
      if (type === 'appointment') {
        await fetch(`${API_URL}/api/appointments/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      } else {
        const endpoint = type === 'emergency' ? 'emergency' : 'bed-bookings';
        await fetch(`${API_URL}/api/${endpoint}/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
        setEmergencies(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      }
    } catch (err) { console.error('Action failed:', err); }
  };

  const handleAmbulanceResponse = async (notifId: string, action: 'accepted' | 'rejected') => {
    try {
      await fetch(`${API_URL}/api/webhooks/hospital/${hospitalInfo.id}/ambulance-response`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: notifId, status: action, response_message: action === 'accepted' ? 'Hospital ready for patient' : 'Cannot accommodate at this time' }),
      });
      setAmbulanceNotifs(prev => prev.map(n => n.id === notifId ? { ...n, status: action } : n));
    } catch (err) { console.error('Ambulance response failed:', err); }
  };

  // Computed stats
  const pendingEmergencies = emergencies.filter(e => e.status === 'pending').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const pendingAmbulance = ambulanceNotifs.filter(n => n.status === 'pending').length;
  const totalPending = pendingEmergencies + pendingAppointments + pendingAmbulance;

  const tabs = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Requests', icon: <FileText className="w-5 h-5" />, badge: pendingEmergencies + pendingAppointments },
    { name: 'Inventory', icon: <Package className="w-5 h-5" /> },
    { name: 'Ambulance Alerts', icon: <Car className="w-5 h-5" />, badge: pendingAmbulance },
  ];

  const updateInventoryField = (field: string, delta: number) => {
    setInventory(prev => ({ ...prev, [field]: Math.max(0, (prev as any)[field] + delta) }));
  };

  const saveInventory = async () => {
    setEditingInventory(false);
    const payload = {
      hospitalId: hospitalInfo?.id || '',
      resources: {
        generalBeds: inventory.generalBeds,
        icuBeds: inventory.icuBeds,
        oxygenCylinders: inventory.oxygenCylinders,
        bloodAvailable: inventory.bloodAvailable,
        ambulances: inventory.ambulances,
        ventilators: inventory.ventilators,
      },
    };

    // 1. Persist to DB via REST API
    if (hospitalInfo?.id) {
      try {
        await fetch(`${API_URL}/api/hospitals/${hospitalInfo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalBeds: inventory.generalBeds,
            icu_beds_available: inventory.icuBeds,
            icu_beds_total: inventory.icuBeds,
            oxygen_cylinders_available: inventory.oxygenCylinders,
            oxygen_cylinders_total: inventory.oxygenCylinders,
            ambulances_available: inventory.ambulances,
            ambulances: inventory.ambulances,
            ventilators: inventory.ventilators,
          }),
        });
        console.log('✅ Inventory saved to DB');
      } catch (e) {
        console.warn('⚠️ DB save failed:', e);
      }
    }

    // 2. Broadcast via Socket so open portals update instantly
    socket.emit('hospital_inventory_update', payload);
    // 3. sessionStorage for same-tab sync
    sessionStorage.setItem('lifelink_inventory_update', JSON.stringify({ ...payload, timestamp: Date.now() }));
    window.dispatchEvent(new Event('storage'));
  };

  // Show profile error screen
  if (profileError) {
    return (
      <div className="flex h-screen bg-[#041512] items-center justify-center">
        <div className="text-center p-8 bg-[#0b2e28] border border-rose-700/40 rounded-2xl max-w-md">
          <Building2 className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-xl mb-2">Hospital Profile Not Found</h2>
          <p className="text-teal-400/70 text-sm mb-4">{profileError}</p>
          <button onClick={() => (window as any).__lifeLinkLogout?.()} className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-sm transition-all">Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#041512] font-sans overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#071E1A] border-r border-teal-900/40 flex flex-col shrink-0">
        <div className="p-5 border-b border-teal-900/40">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-pink-500/20 p-2 rounded-lg"><Building2 className="text-pink-400 w-5 h-5" /></div>
            <span className="text-lg font-bold text-white tracking-tight">LifeLink</span>
          </div>
          <p className="text-teal-500/60 text-[10px] uppercase tracking-widest font-bold mt-2">Hospital Admin</p>
        </div>
        <nav className="flex-1 mt-2 px-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm font-semibold ${
                activeTab === tab.name
                  ? 'bg-teal-900/50 text-teal-200 border border-teal-700/40 shadow-lg shadow-teal-900/20'
                  : 'text-teal-400/70 hover:bg-teal-900/20 hover:text-teal-300'
              }`}
            >
              {tab.icon}
              <span className="flex-1">{tab.name}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">{tab.badge}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-teal-900/40 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>System Live
          </div>
          <button
            onClick={() => (window as any).__lifeLinkLogout?.()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-950/30 border border-rose-800/30 text-rose-400 hover:bg-rose-900/40 hover:text-rose-300 transition-all text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-[#0A2924] border-b border-teal-900/40 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-white">{hospitalInfo?.name || 'Hospital Dashboard'}</h1>
            <p className="text-teal-400/60 text-xs mt-0.5">{hospitalInfo?.city ? `${hospitalInfo.city} · ` : ''}Hospital Administration Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            {totalPending > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-950/40 border border-rose-800/40 rounded-full text-rose-400 text-xs font-bold animate-pulse">
                <Bell className="w-3.5 h-3.5" />{totalPending} Pending
              </div>
            )}
            <button onClick={fetchData} className="p-2 rounded-lg bg-teal-900/30 border border-teal-800/30 text-teal-400 hover:text-white hover:bg-teal-800/40 transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-t-teal-500 border-teal-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-teal-400">Loading hospital data...</p>
              </div>
            </div>
          ) : activeTab === 'Dashboard' ? (
            /* ── Dashboard Tab ── */
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Pending Requests" value={pendingEmergencies + pendingAppointments} icon={<ClipboardList className="w-5 h-5" />} color="bg-rose-950/30 border-rose-800/30" />
                <StatCard label="Ambulance Alerts" value={pendingAmbulance} icon={<Car className="w-5 h-5" />} color="bg-amber-950/30 border-amber-800/30" />
                <StatCard label="Total Emergencies" value={emergencies.length} icon={<AlertTriangle className="w-5 h-5" />} color="bg-teal-950/30 border-teal-800/30" />
                <StatCard label="Total Appointments" value={appointments.length} icon={<CalendarCheck className="w-5 h-5" />} color="bg-violet-950/30 border-violet-800/30" />
              </div>

              {/* Recent activity */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400/70 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Recent Activity
                </h3>
                <div className="space-y-3">
                  {[...emergencies, ...appointments.map(a => ({ ...a, title: a.reason, description: a.appointmentType, patientName: a.patientName, priority: 'low' }))]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((item: any) => (
                      <div key={item.id} className="bg-[#0a2822] border border-teal-800/30 rounded-lg p-3 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'pending' ? 'bg-amber-400 animate-pulse' : item.status === 'cancelled' ? 'bg-rose-400' : 'bg-emerald-400'}`}></div>
                        <span className="text-white text-sm font-semibold flex-1 truncate">{item.patientName} — {item.title || item.reason}</span>
                        <span className="text-teal-500/50 text-[10px]">{new Date(item.createdAt).toLocaleString()}</span>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${item.status === 'pending' ? 'text-amber-400 bg-amber-950/40' : item.status === 'cancelled' ? 'text-rose-400 bg-rose-950/40' : 'text-emerald-400 bg-emerald-950/40'}`}>{item.status}</span>
                      </div>
                    ))}
                  {emergencies.length === 0 && appointments.length === 0 && (
                    <div className="text-center py-12 text-teal-500/50">
                      <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-semibold">No activity yet</p>
                      <p className="text-xs mt-1">Incoming requests will appear here in real-time</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'Inventory' ? (
            /* ── Inventory Tab ── */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Resource Inventory</h2>
                  <p className="text-teal-400/60 text-xs mt-0.5">Update counts here — changes sync live to Public & Ambulance portals</p>
                </div>
                {editingInventory ? (
                  <button onClick={saveInventory} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/30">
                    <Save className="w-4 h-4" /> Save & Publish
                  </button>
                ) : (
                  <button onClick={() => setEditingInventory(true)} className="flex items-center gap-2 px-5 py-2.5 bg-teal-800/50 hover:bg-teal-700/60 text-teal-200 rounded-xl text-xs font-bold uppercase tracking-wider border border-teal-700/40 transition-all">
                    <Edit3 className="w-4 h-4" /> Edit Inventory
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'generalBeds', label: 'General Beds', icon: <BedDouble className="w-6 h-6" />, color: 'from-teal-900/60 to-teal-950/40 border-teal-700/40', iconColor: 'text-teal-400' },
                  { key: 'icuBeds', label: 'ICU Beds', icon: <HeartPulse className="w-6 h-6" />, color: 'from-rose-900/40 to-rose-950/30 border-rose-700/40', iconColor: 'text-rose-400' },
                  { key: 'oxygenCylinders', label: 'Oxygen Cylinders', icon: <Wind className="w-6 h-6" />, color: 'from-sky-900/40 to-sky-950/30 border-sky-700/40', iconColor: 'text-sky-400' },
                  { key: 'ventilators', label: 'Ventilators', icon: <Activity className="w-6 h-6" />, color: 'from-violet-900/40 to-violet-950/30 border-violet-700/40', iconColor: 'text-violet-400' },
                  { key: 'ambulances', label: 'Ambulances', icon: <Car className="w-6 h-6" />, color: 'from-amber-900/40 to-amber-950/30 border-amber-700/40', iconColor: 'text-amber-400' },
                ].map(item => (
                  <div key={item.key} className={`bg-gradient-to-br ${item.color} border rounded-2xl p-5 transition-all hover:scale-[1.01]`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={item.iconColor}>{item.icon}</span>
                      {editingInventory && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-800/40">Editing</span>
                      )}
                    </div>
                    <div className="text-3xl font-extrabold text-white mb-1">{(inventory as any)[item.key]}</div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-teal-400/60 mb-3">{item.label}</p>
                    {editingInventory && (
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateInventoryField(item.key, -1)} className="w-8 h-8 rounded-lg bg-rose-900/40 border border-rose-800/40 text-rose-300 flex items-center justify-center hover:bg-rose-800/50 transition-all">
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={(inventory as any)[item.key]}
                          onChange={e => setInventory(prev => ({ ...prev, [item.key]: Math.max(0, parseInt(e.target.value) || 0) }))}
                          className="flex-1 bg-[#05110E] border border-teal-800/40 rounded-lg px-3 py-1.5 text-white text-center text-sm font-bold focus:border-teal-500 focus:outline-none"
                        />
                        <button onClick={() => updateInventoryField(item.key, 1)} className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-800/40 text-emerald-300 flex items-center justify-center hover:bg-emerald-800/50 transition-all">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Blood Bank — special string field */}
                <div className="bg-gradient-to-br from-red-900/40 to-red-950/30 border-red-700/40 border rounded-2xl p-5 transition-all hover:scale-[1.01]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-red-400"><Droplets className="w-6 h-6" /></span>
                    {editingInventory && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-800/40">Editing</span>
                    )}
                  </div>
                  <div className="text-xl font-extrabold text-white mb-1">{inventory.bloodAvailable}</div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-teal-400/60 mb-3">Blood Bank</p>
                  {editingInventory && (
                    <input
                      type="text"
                      value={inventory.bloodAvailable}
                      onChange={e => setInventory(prev => ({ ...prev, bloodAvailable: e.target.value }))}
                      className="w-full bg-[#05110E] border border-teal-800/40 rounded-lg px-3 py-1.5 text-white text-sm font-bold focus:border-teal-500 focus:outline-none mt-2"
                      placeholder="e.g. A+, B+, O-"
                    />
                  )}
                </div>
              </div>

              {/* Last Updated indicator */}
              <div className="flex items-center justify-center gap-2 text-teal-500/50 text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                Changes are broadcast to all connected portals in real-time
              </div>
            </div>
          ) : activeTab === 'Requests' ? (
            /* ── Requests Tab ── */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white">Incoming Requests</h2>
                <span className="text-xs text-teal-500/60">{emergencies.length + appointments.length} total</span>
              </div>
              {/* Emergencies & Bed Bookings */}
              {emergencies.map(e => (
                <RequestRow
                  key={e.id}
                  type={e.title?.toLowerCase().includes('bed booking') ? 'bed' : 'emergency'}
                  name={e.patientName}
                  phone={e.patientPhone}
                  detail={e.title + (e.description ? ` — ${e.description}` : '')}
                  status={e.status}
                  time={e.createdAt}
                  onAccept={() => handleRequestAction(e.id, e.title?.toLowerCase().includes('bed booking') ? 'bed' : 'emergency', 'accept')}
                  onReject={() => handleRequestAction(e.id, e.title?.toLowerCase().includes('bed booking') ? 'bed' : 'emergency', 'reject')}
                />
              ))}
              {/* Appointments */}
              {appointments.map(a => (
                <RequestRow
                  key={a.id}
                  type="appointment"
                  name={a.patientName}
                  phone={a.patientPhone}
                  detail={`${a.appointmentType} — ${a.reason}`}
                  status={a.status}
                  time={a.createdAt}
                  onAccept={() => handleRequestAction(a.id, 'appointment', 'accept')}
                  onReject={() => handleRequestAction(a.id, 'appointment', 'reject')}
                />
              ))}
              {emergencies.length === 0 && appointments.length === 0 && (
                <div className="text-center py-16 text-teal-500/50">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="font-bold text-lg">No requests yet</p>
                  <p className="text-xs mt-1">Bed bookings and appointments from the Public Portal will appear here in real-time</p>
                </div>
              )}
            </div>
          ) : (
            /* ── Ambulance Alerts Tab ── */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white">Ambulance Notifications</h2>
                <span className="text-xs text-teal-500/60">{ambulanceNotifs.length} total</span>
              </div>
              {ambulanceNotifs.map(n => (
                <AmbulanceAlertRow
                  key={n.id}
                  notif={n}
                  onAccept={() => handleAmbulanceResponse(n.id, 'accepted')}
                  onReject={() => handleAmbulanceResponse(n.id, 'rejected')}
                />
              ))}
              {ambulanceNotifs.length === 0 && (
                <div className="text-center py-16 text-teal-500/50">
                  <Car className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="font-bold text-lg">No ambulance alerts</p>
                  <p className="text-xs mt-1">When an ambulance driver sends an alert, it will appear here instantly</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}