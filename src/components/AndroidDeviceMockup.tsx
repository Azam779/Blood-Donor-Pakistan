import React, { useState, useMemo } from 'react';
import { ScreenType, BloodGroup, DonorRecord } from '../types';
import { PUNJAB_DISTRICTS, INITIAL_DEMO_DONORS } from '../data/punjabLocations';
import { 
  Heart, 
  Search, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  Info, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Trash2,
  LogOut,
  SlidersHorizontal,
  Droplet
} from 'lucide-react';

interface AndroidDeviceMockupProps {
  onExportZip?: () => void;
}

export const AndroidDeviceMockup: React.FC<AndroidDeviceMockupProps> = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [donors, setDonors] = useState<DonorRecord[]>(INITIAL_DEMO_DONORS);
  const [activeDonor, setActiveDonor] = useState<DonorRecord>(INITIAL_DEMO_DONORS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Donate Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '03001234567',
    age: '26',
    bloodGroup: 'B+' as BloodGroup,
    province: 'Punjab',
    district: 'Lahore',
    city: 'Model Town',
    area: 'Block D',
    address: 'Near Central Mosque (Private)',
    available: true
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Search Filter State
  const [searchBloodGroup, setSearchBloodGroup] = useState<string>('Any');
  const [searchDistrict, setSearchDistrict] = useState<string>('All');
  const [searchCity, setSearchCity] = useState<string>('All');
  const [searchArea, setSearchArea] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // About Modal
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [dialerFeedback, setDialerFeedback] = useState<string | null>(null);

  // Cascading cities for Donate Form
  const availableCitiesForDonate = useMemo(() => {
    const districtObj = PUNJAB_DISTRICTS.find(d => d.name === formData.district);
    return districtObj ? districtObj.cities : [];
  }, [formData.district]);

  // Cascading cities for Search Filter
  const availableCitiesForSearch = useMemo(() => {
    if (searchDistrict === 'All') return [];
    const districtObj = PUNJAB_DISTRICTS.find(d => d.name === searchDistrict);
    return districtObj ? districtObj.cities : [];
  }, [searchDistrict]);

  // Filtered Donors for Search
  const filteredDonors = useMemo(() => {
    return donors.filter(d => {
      if (!d.available) return false;
      if (searchBloodGroup !== 'Any' && d.bloodGroup !== searchBloodGroup) return false;
      if (searchDistrict !== 'All' && d.district !== searchDistrict) return false;
      if (searchCity !== 'All' && d.city !== searchCity) return false;
      if (searchArea.trim() !== '') {
        const query = searchArea.toLowerCase();
        const inArea = d.area.toLowerCase().includes(query);
        const inCity = d.city.toLowerCase().includes(query);
        if (!inArea && !inCity) return false;
      }
      return true;
    });
  }, [donors, searchBloodGroup, searchDistrict, searchCity, searchArea]);

  // Handle Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Full name is required (minimum 2 characters)';
    }
    if (!formData.phone.trim() || !/^(\+92|03)[0-9]{9}$/.test(formData.phone.trim().replace(/\s/g, ''))) {
      errors.phone = 'Valid Pakistani mobile number required (03XXXXXXXXX)';
    }
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      errors.age = 'Age must be between 18 and 65';
    }
    if (!formData.district) {
      errors.district = 'Please select a Punjab district';
    }
    if (!formData.city) {
      errors.city = 'Please select a city/town';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    const newDonor: DonorRecord = {
      id: 'donor-' + Date.now(),
      uid: 'user-' + Date.now(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      age: ageNum,
      bloodGroup: formData.bloodGroup,
      province: 'Punjab',
      district: formData.district,
      city: formData.city,
      area: formData.area.trim(),
      address: formData.address.trim(),
      available: formData.available,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDonors(prev => [newDonor, ...prev]);
    setActiveDonor(newDonor);
    setCurrentScreen('success');
  };

  // Handle Call Donor Dial Action
  const handleCallDonor = (donor: DonorRecord) => {
    setDialerFeedback(`Simulating ACTION_DIAL intent with tel:${donor.phone}`);
    setTimeout(() => {
      setDialerFeedback(null);
    }, 4000);
  };

  // Toggle Donor Availability
  const handleToggleAvailability = (newStatus: boolean) => {
    if (!activeDonor) return;
    const updated = { ...activeDonor, available: newStatus, updatedAt: new Date().toISOString() };
    setActiveDonor(updated);
    setDonors(prev => prev.map(d => (d.id === activeDonor.id ? updated : d)));
  };

  return (
    <div className="relative mx-auto flex flex-col items-center">
      {/* Device Frame */}
      <div className="w-[380px] h-[780px] bg-slate-950 rounded-[48px] p-3 shadow-2xl ring-1 ring-white/20 relative flex flex-col overflow-hidden">
        {/* Hardware Notch & Camera */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-900 rounded-full flex items-center justify-between px-4 z-50">
          <div className="w-2.5 h-2.5 bg-slate-800 rounded-full"></div>
          <div className="w-3 h-3 bg-slate-950 ring-1 ring-slate-800 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-cyan-900 rounded-full"></div>
          </div>
          <div className="w-2.5 h-2.5 bg-slate-800 rounded-full"></div>
        </div>

        {/* Screen Bezel Area */}
        <div className="w-full h-full bg-[#FAFAFA] rounded-[38px] flex flex-col overflow-hidden text-slate-900 relative select-none">
          {/* Status Bar */}
          <div className="h-9 bg-[#D32F2F] text-white/90 text-xs px-6 pt-2 flex items-center justify-between font-medium">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>4G</span>
              <span>📶</span>
              <span>🔋 98%</span>
            </div>
          </div>

          {/* Action Feedback Toast for Intent Trigger */}
          {dialerFeedback && (
            <div className="absolute top-12 left-4 right-4 bg-slate-900/95 backdrop-blur-md text-emerald-300 text-xs px-3.5 py-2.5 rounded-xl shadow-lg border border-emerald-500/30 flex items-center gap-2 z-50 animate-bounce">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate font-mono">{dialerFeedback}</div>
            </div>
          )}

          {/* SCREEN CONTENT AREA */}
          <div className="flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC]">
            {/* 1. SPLASH SCREEN */}
            {currentScreen === 'splash' && (
              <div className="flex-1 bg-gradient-to-b from-[#D32F2F] to-[#991B1B] text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6 ring-8 ring-white/20 animate-pulse">
                  <Heart className="w-12 h-12 text-[#D32F2F] fill-[#D32F2F]" />
                </div>
                <h1 className="text-2xl font-black tracking-tight mb-2">Blood Donor Pakistan</h1>
                <p className="text-white/80 text-sm max-w-[240px] leading-relaxed">
                  Saving Lives Across Punjab • Voluntary Donor Network
                </p>
                <div className="mt-12 flex items-center gap-2 text-xs text-white/70">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                  Initializing Punjab Location Data...
                </div>
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="mt-8 px-6 py-2.5 bg-white text-[#D32F2F] font-bold rounded-full text-xs shadow-lg hover:bg-slate-100 transition"
                >
                  Enter App Dashboard
                </button>
              </div>
            )}

            {/* 2. HOME SCREEN */}
            {currentScreen === 'home' && (
              <div className="flex-1 flex flex-col">
                {/* Header Toolbar */}
                <div className="bg-[#D32F2F] text-white px-5 pt-3 pb-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <Droplet className="w-5 h-5 text-white fill-white" />
                      </div>
                      <div>
                        <div className="text-base font-bold leading-tight">Blood Donor Pakistan</div>
                        <div className="text-[11px] text-white/80">Punjab Regional Hub</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowAbout(true)}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white"
                      title="About & Helpline"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Motivational Banner Card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/20 text-xs text-white/95">
                    <div className="font-semibold flex items-center gap-1.5 mb-1 text-amber-200">
                      <Sparkles className="w-3.5 h-3.5" /> Emergency Blood Network
                    </div>
                    <div>Every donor can save up to 3 lives. Connect directly with voluntary donors in any district.</div>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="p-4 space-y-3.5 flex-1">
                  {/* Donate Blood Card Button */}
                  <button
                    onClick={() => setCurrentScreen('donate')}
                    className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-[#D32F2F]/40 hover:shadow-md transition text-left flex items-center gap-4 group"
                  >
                    <div className="w-13 h-13 rounded-xl bg-red-50 flex items-center justify-center text-[#D32F2F] group-hover:scale-105 transition shrink-0 border border-red-100">
                      <Heart className="w-6 h-6 fill-[#D32F2F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-bold text-slate-900 group-hover:text-[#D32F2F] transition">Donate Blood</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-snug">Register as a voluntary donor in Punjab to help patients in emergency.</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#D32F2F] group-hover:translate-x-0.5 transition" />
                  </button>

                  {/* Find Blood Card Button */}
                  <button
                    onClick={() => setCurrentScreen('search')}
                    className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-emerald-500/40 hover:shadow-md transition text-left flex items-center gap-4 group"
                  >
                    <div className="w-13 h-13 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition shrink-0 border border-emerald-100">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">Find Blood Donor</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-snug">Search available donors by Blood Group, District &amp; City.</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                  </button>

                  {/* My Profile Button */}
                  <button
                    onClick={() => setCurrentScreen('profile')}
                    className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-blue-500/40 hover:shadow-md transition text-left flex items-center gap-4 group"
                  >
                    <div className="w-13 h-13 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition shrink-0 border border-blue-100">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">My Donor Profile</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-snug">Update contact info or toggle your public availability status.</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                  </button>

                  {/* Helplines Card */}
                  <div className="mt-4 bg-rose-50/60 rounded-2xl p-3.5 border border-rose-200/70 text-xs">
                    <div className="font-bold text-rose-900 flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-4 h-4 text-[#D32F2F]" /> Pakistan Emergency Contacts
                    </div>
                    <div className="text-slate-600 text-[11px] space-y-1">
                      <div className="flex justify-between"><span>Rescue 1122</span> <span className="font-mono font-bold text-rose-700">Dial 1122</span></div>
                      <div className="flex justify-between"><span>Edhi Ambulance</span> <span className="font-mono font-bold text-rose-700">Dial 115</span></div>
                      <div className="flex justify-between"><span>Red Crescent (Hilal-e-Ahmar)</span> <span className="font-mono font-bold text-rose-700">Dial 1030</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. DONATE BLOOD REGISTRATION SCREEN */}
            {currentScreen === 'donate' && (
              <div className="flex-1 flex flex-col">
                <div className="bg-[#D32F2F] text-white px-4 py-3 flex items-center gap-3 shadow-md sticky top-0 z-10">
                  <button onClick={() => setCurrentScreen('home')} className="p-1 rounded-full hover:bg-white/10">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold">Donor Registration Form</h2>
                </div>

                <form onSubmit={handleRegisterSubmit} className="p-4 space-y-3.5 flex-1">
                  <div className="text-xs text-slate-500 mb-1">
                    Provide accurate donor details. Your phone number is verified to protect blood recipients.
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent shadow-sm"
                    />
                    {formErrors.name && <p className="text-[10px] text-red-600 mt-1 font-medium">{formErrors.name}</p>}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="03001234567"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent shadow-sm font-mono"
                    />
                    {formErrors.phone && <p className="text-[10px] text-red-600 mt-1 font-medium">{formErrors.phone}</p>}
                  </div>

                  {/* Age & Blood Group Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Age (18-65) *</label>
                      <input
                        type="number"
                        min="18"
                        max="65"
                        value={formData.age}
                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D32F2F] shadow-sm"
                      />
                      {formErrors.age && <p className="text-[10px] text-red-600 mt-1 font-medium">{formErrors.age}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Blood Group *</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D32F2F] shadow-sm font-bold text-[#D32F2F]"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Province (Locked to Punjab) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Province</label>
                    <input
                      type="text"
                      value="Punjab"
                      disabled
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed"
                    />
                  </div>

                  {/* District Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">District *</label>
                    <select
                      value={formData.district}
                      onChange={e => {
                        const dist = e.target.value;
                        const distObj = PUNJAB_DISTRICTS.find(d => d.name === dist);
                        setFormData({
                          ...formData,
                          district: dist,
                          city: distObj && distObj.cities.length > 0 ? distObj.cities[0] : ''
                        });
                      }}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D32F2F] shadow-sm"
                    >
                      {PUNJAB_DISTRICTS.map(d => (
                        <option key={d.name} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                    {formErrors.district && <p className="text-[10px] text-red-600 mt-1 font-medium">{formErrors.district}</p>}
                  </div>

                  {/* Cascading City Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">City / Town * (Cascading)</label>
                    <select
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D32F2F] shadow-sm"
                    >
                      {availableCitiesForDonate.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {formErrors.city && <p className="text-[10px] text-red-600 mt-1 font-medium">{formErrors.city}</p>}
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Area / Locality</label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={e => setFormData({ ...formData, area: e.target.value })}
                      placeholder="e.g. Main Bazaar / Block B"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D32F2F] shadow-sm"
                    />
                  </div>

                  {/* Complete Address (Private) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Complete Address (Private)</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Will not be shown in public searches"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D32F2F] shadow-sm"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Exact house addresses remain private to protect donor privacy.</p>
                  </div>

                  {/* Available Switch */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Available for Donation</div>
                      <div className="text-[10px] text-slate-500">Visible to patients in emergency search</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.available}
                        onChange={e => setFormData({ ...formData, available: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs rounded-xl shadow-md transition tracking-wider uppercase mt-4"
                  >
                    REGISTER AS DONOR
                  </button>
                </form>
              </div>
            )}

            {/* 4. SUCCESS SCREEN */}
            {currentScreen === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Registration Successful!</h2>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Thank you for registering as a voluntary blood donor in Punjab. Your noble deed can save lives.
                </p>

                {activeDonor && (
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6 text-xs space-y-1">
                    <div className="font-bold text-slate-800 text-sm">{activeDonor.name}</div>
                    <div className="text-slate-600">
                      Blood Group: <span className="font-bold text-[#D32F2F]">{activeDonor.bloodGroup}</span>
                    </div>
                    <div className="text-slate-600">
                      Location: <span className="font-medium">{activeDonor.city}, {activeDonor.district}</span>
                    </div>
                    <div className="text-slate-600">
                      Status: <span className="font-bold text-emerald-600">Active &amp; Available</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-full py-3 bg-[#D32F2F] text-white font-bold text-xs rounded-xl shadow-md uppercase mb-2"
                >
                  BACK TO HOME
                </button>
                <button
                  onClick={() => setCurrentScreen('profile')}
                  className="w-full py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-xl"
                >
                  View My Profile
                </button>
              </div>
            )}

            {/* 5. SEARCH DONOR SCREEN */}
            {currentScreen === 'search' && (
              <div className="flex-1 flex flex-col">
                <div className="bg-[#D32F2F] text-white px-4 py-3 flex items-center gap-3 shadow-md sticky top-0 z-10">
                  <button onClick={() => setCurrentScreen('home')} className="p-1 rounded-full hover:bg-white/10">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold">Find Blood Donor</h2>
                </div>

                <div className="p-4 space-y-3.5 flex-1">
                  {/* Filters Card */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Search Filters</span>
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    {/* Blood Group Filter */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Blood Group</label>
                      <select
                        value={searchBloodGroup}
                        onChange={e => setSearchBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#D32F2F]"
                      >
                        {['Any', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <option key={bg} value={bg}>{bg === 'Any' ? 'Any Blood Group' : bg}</option>
                        ))}
                      </select>
                    </div>

                    {/* District Filter */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">District (Punjab)</label>
                      <select
                        value={searchDistrict}
                        onChange={e => {
                          setSearchDistrict(e.target.value);
                          setSearchCity('All');
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="All">All Districts</option>
                        {PUNJAB_DISTRICTS.map(d => (
                          <option key={d.name} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Cascading City Filter */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">City / Town (Optional)</label>
                      <select
                        value={searchCity}
                        onChange={e => setSearchCity(e.target.value)}
                        disabled={searchDistrict === 'All'}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-50"
                      >
                        <option value="All">All Cities</option>
                        {availableCitiesForSearch.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Area Keyword */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Area / Locality Filter</label>
                      <input
                        type="text"
                        value={searchArea}
                        onChange={e => setSearchArea(e.target.value)}
                        placeholder="e.g. Model Town, Shorkot..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Results Count Header */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="font-bold text-slate-700">Available Donors</span>
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[11px]">
                      {filteredDonors.length} Found
                    </span>
                  </div>

                  {/* Donors List (Matching Prompt Specifications) */}
                  <div className="space-y-3 pb-6">
                    {filteredDonors.length === 0 ? (
                      <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
                        <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <div className="font-bold text-slate-700 text-sm">No Donors Found</div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Try searching for 'Any Blood Group' or expanding to all cities in Punjab.
                        </p>
                      </div>
                    ) : (
                      filteredDonors.map(donor => (
                        <div
                          key={donor.id}
                          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3"
                        >
                          {/* Top Row: Name and Blood Group Pill */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{donor.name}</div>
                              <div className="text-[11px] text-slate-500">Age: {donor.age} years</div>
                            </div>
                            <div className="px-3.5 py-1 bg-[#D32F2F] text-white font-black text-xs rounded-full shadow-sm">
                              🩸 {donor.bloodGroup}
                            </div>
                          </div>

                          {/* Location Info (City/Town + District only, private address hidden) */}
                          <div className="text-xs text-slate-700 space-y-1">
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                              <MapPin className="w-3.5 h-3.5 text-[#D32F2F]" />
                              <span>{donor.city}, {donor.district}</span>
                            </div>
                            {donor.area && (
                              <div className="text-[11px] text-slate-500 pl-5">
                                Area: {donor.area}
                              </div>
                            )}
                          </div>

                          {/* Call Donor Action Button (ACTION_DIAL) */}
                          <button
                            onClick={() => handleCallDonor(donor)}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition uppercase"
                          >
                            <Phone className="w-3.5 h-3.5 fill-white" />
                            CALL DONOR
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 6. PROFILE SCREEN */}
            {currentScreen === 'profile' && (
              <div className="flex-1 flex flex-col">
                <div className="bg-[#D32F2F] text-white px-4 py-3 flex items-center gap-3 shadow-md sticky top-0 z-10">
                  <button onClick={() => setCurrentScreen('home')} className="p-1 rounded-full hover:bg-white/10">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold">My Donor Profile</h2>
                </div>

                <div className="p-4 space-y-4 flex-1">
                  {/* Availability Toggle Status Card */}
                  <div className={`p-4 rounded-2xl border-2 transition-all ${activeDonor.available ? 'bg-emerald-50/70 border-emerald-500/50' : 'bg-rose-50/70 border-rose-400'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-bold text-sm ${activeDonor.available ? 'text-emerald-800' : 'text-rose-800'}`}>
                          {activeDonor.available ? 'Active & Available' : 'Temporarily Unavailable'}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {activeDonor.available 
                            ? 'You will appear in blood donor search results.'
                            : 'You are hidden from public blood searches.'}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeDonor.available}
                          onChange={e => handleToggleAvailability(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Donor Info Card */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-xs">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Donor Details</div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Name</span>
                      <span className="font-bold text-slate-800">{activeDonor.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Phone</span>
                      <span className="font-mono font-bold text-slate-800">{activeDonor.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Blood Group</span>
                      <span className="font-bold text-[#D32F2F]">{activeDonor.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Age</span>
                      <span className="font-bold text-slate-800">{activeDonor.age} years</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Location</span>
                      <span className="font-bold text-slate-800">{activeDonor.city}, {activeDonor.district}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Private Address</span>
                      <span className="text-slate-600 text-right max-w-[180px] truncate">{activeDonor.address || 'Confidential'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => setCurrentScreen('donate')}
                    className="w-full py-3 bg-[#D32F2F] text-white font-bold text-xs rounded-xl shadow uppercase"
                  >
                    Edit Profile Details
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Delete your donor profile? You will no longer receive emergency requests.')) {
                        setDonors(prev => prev.filter(d => d.id !== activeDonor.id));
                        setCurrentScreen('home');
                      }
                    }}
                    className="w-full py-2.5 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Donor Profile
                  </button>

                  <button
                    onClick={() => {
                      setIsAuthenticated(false);
                      setCurrentScreen('home');
                    }}
                    className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Android Navigation Bar */}
          <div className="h-10 bg-slate-900 flex items-center justify-around px-8">
            <button onClick={() => setCurrentScreen('home')} className="p-2 text-slate-400 hover:text-white" title="Back">
              <div className="w-3 h-3 border-l-2 border-b-2 border-current rotate-45"></div>
            </button>
            <button onClick={() => setCurrentScreen('home')} className="p-2 text-slate-400 hover:text-white" title="Home">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-current"></div>
            </button>
            <button onClick={() => setCurrentScreen('search')} className="p-2 text-slate-400 hover:text-white" title="Recents / Search">
              <div className="w-3 h-3 border-2 border-current"></div>
            </button>
          </div>
        </div>
      </div>

      {/* About & Emergency Dialog Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#D32F2F]">
              <Heart className="w-6 h-6 fill-[#D32F2F]" />
              <h3 className="font-bold text-lg text-slate-900">About Blood Donor Pakistan</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Blood Donor Pakistan connects voluntary blood donors with patients across Punjab. Donors can register, manage their availability, and citizens can find nearby matching blood groups in emergencies.
            </p>

            <div className="bg-red-50 p-3.5 rounded-xl border border-red-100 text-xs space-y-1.5">
              <div className="font-bold text-red-900">Pakistan Emergency Helplines:</div>
              <div className="flex justify-between text-slate-700"><span>• Rescue 1122</span> <span className="font-bold">1122</span></div>
              <div className="flex justify-between text-slate-700"><span>• Edhi Ambulance</span> <span className="font-bold">115</span></div>
              <div className="flex justify-between text-slate-700"><span>• Red Crescent (Hilal-e-Ahmar)</span> <span className="font-bold">1030</span></div>
            </div>

            <button
              onClick={() => setShowAbout(false)}
              className="w-full py-2.5 bg-[#D32F2F] text-white font-bold text-xs rounded-xl shadow"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
