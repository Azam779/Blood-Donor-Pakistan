import React from 'react';
import { Terminal, Shield, CheckCircle, Smartphone, KeyRound, Flame, ArrowRight } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-300 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">Android Studio &amp; Firebase Setup Guide</h2>
          <p className="text-xs text-slate-400">Complete verification and build instructions for Blood Donor Pakistan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Step 1 */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">1</span>
            Open in Android Studio
          </div>
          <p className="text-slate-400 leading-relaxed">
            Launch Android Studio (Giraffe, Hedgehog, Iguana, or newer) and select <strong className="text-slate-200">Open Project</strong>. Navigate to the root directory containing <code className="text-rose-300">android_project</code>.
          </p>
          <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800">
            Package: com.blooddonorpakistan.app
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">2</span>
            Firebase Configuration Attached
          </div>
          <p className="text-slate-400 leading-relaxed">
            The provided <code className="text-rose-300">google-services.json</code> is configured in <code className="text-rose-300">app/google-services.json</code> with Project ID <code className="text-rose-300">blood-donor-pakistan</code>.
          </p>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
            <CheckCircle className="w-3.5 h-3.5" /> google-services.json verified &amp; connected
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">3</span>
            Enable Phone Auth &amp; Firestore
          </div>
          <p className="text-slate-400 leading-relaxed">
            In Firebase Console (<a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-rose-400 underline">console.firebase.google.com</a>):
          </p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1">
            <li>Go to <strong>Authentication &gt; Sign-in method</strong> &gt; Enable <strong>Phone</strong>.</li>
            <li>Go to <strong>Firestore Database</strong> &gt; Create Database (Rules deployed).</li>
          </ul>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">4</span>
            Add SHA-1 for SMS Verification
          </div>
          <p className="text-slate-400 leading-relaxed">
            To enable SMS OTP verification without captcha:
          </p>
          <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-[11px] text-amber-300 border border-slate-800">
            ./gradlew signingReport
          </div>
          <p className="text-slate-400">Copy the SHA-1 fingerprint and paste it under <strong>Project Settings &gt; Android App &gt; SHA Certificate Fingerprints</strong> in Firebase Console.</p>
        </div>
      </div>

      {/* Build APK Section */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" /> Building the Production APK
          </div>
          <p className="text-xs text-slate-400 mt-1">
            In Android Studio, click <span className="text-slate-200 font-semibold">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</span>. The output APK will be generated at <code className="text-rose-300">app/build/outputs/apk/debug/app-debug.apk</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
