import React, { useState } from 'react';
import { AndroidDeviceMockup } from './components/AndroidDeviceMockup';
import { CodeExplorer } from './components/CodeExplorer';
import { SetupGuide } from './components/SetupGuide';
import { ProjectExporter } from './components/ProjectExporter';
import { 
  Smartphone, 
  Code2, 
  BookOpen, 
  Flame, 
  Heart, 
  ShieldCheck, 
  Layers,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'guide'>('preview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-rose-900/30">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base text-slate-100 tracking-tight">Blood Donor Pakistan</h1>
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Android Native (Java &amp; XML)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                pkg: com.blooddonorpakistan.app • Firebase: blood-donor-pakistan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher Tabs */}
            <div className="hidden sm:flex bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'preview'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Live Android Simulator
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'code'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Project Source Files
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'guide'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Setup &amp; Build Guide
              </button>
            </div>

            {/* One-click Android ZIP Exporter */}
            <ProjectExporter />
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="sm:hidden flex border-t border-slate-800 bg-slate-900/50 p-1.5 justify-around">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex justify-center items-center gap-1 ${
              activeTab === 'preview' ? 'bg-rose-600 text-white' : 'text-slate-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Simulator
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex justify-center items-center gap-1 ${
              activeTab === 'code' ? 'bg-rose-600 text-white' : 'text-slate-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Code
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex justify-center items-center gap-1 ${
              activeTab === 'guide' ? 'bg-rose-600 text-white' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Setup
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {activeTab === 'preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Feature Highlights & Specs */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" /> Production-Ready Architecture
                </div>
                <h2 className="text-xl font-bold text-slate-100">
                  Android Native Blood Donation Platform
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Engineered with standard Android Activity lifecycle in Java, Material Design XML UI components, Punjab district-to-city cascading datasets, and Cloud Firestore integration.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block">Package ID</span>
                    <span className="font-mono font-bold text-rose-300">com.blooddonorpakistan.app</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block">Firebase Project</span>
                    <span className="font-mono font-bold text-rose-300">blood-donor-pakistan</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block">Location Scope</span>
                    <span className="font-bold text-slate-200">Punjab, Pakistan</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block">Architecture</span>
                    <span className="font-bold text-slate-200">Java + Material XML</span>
                  </div>
                </div>
              </div>

              {/* Key Features List */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                <div className="font-bold text-slate-200 text-sm">Implemented Android Features:</div>
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Cascading Dropdown Logic:</strong> Punjab district selection automatically filters city/town dataset via <code className="text-rose-300">LocationHelper</code>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Direct Call Donor Dialer:</strong> Uses Android <code className="text-rose-300">ACTION_DIAL</code> intent to launch phone dialer immediately.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Donor Availability Switch:</strong> Donors can toggle availability on/off to hide from search results when recently donated.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>PII &amp; Address Privacy:</strong> Only general city/district are shown publicly; exact addresses remain private.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Hardened Firestore Rules:</strong> Field validation &amp; user ownership security rules deployed in <code className="text-rose-300">firestore.rules</code>.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-rose-950/40 to-red-950/40 rounded-2xl border border-rose-800/30 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-rose-300">Ready to build APK?</div>
                  <div className="text-slate-400">Download the ZIP or open <code className="text-rose-400">android_project</code> in Android Studio.</div>
                </div>
                <button
                  onClick={() => setActiveTab('guide')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition"
                >
                  View Guide
                </button>
              </div>
            </div>

            {/* Right Col: Interactive Android Device Simulator */}
            <div className="lg:col-span-7 flex justify-center">
              <AndroidDeviceMockup />
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Android Project Source Tree</h2>
                <p className="text-xs text-slate-400">All Java classes, XML layouts, Gradle configurations, and Firestore rules</p>
              </div>
            </div>
            <CodeExplorer />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-4">
            <SetupGuide />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
        Blood Donor Pakistan • Built with Java, Android Material Design &amp; Google Firebase • Package ID: <code className="text-slate-400">com.blooddonorpakistan.app</code>
      </footer>
    </div>
  );
}
