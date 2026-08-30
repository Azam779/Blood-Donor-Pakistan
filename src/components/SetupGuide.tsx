import React, { useState } from 'react';
import { Terminal, Shield, CheckCircle, Smartphone, GitBranch, Github, Download, Copy, Check, ArrowRight, PlayCircle, Sparkles, FolderGit2 } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* GitHub Actions Highlight Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border border-rose-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold">
              <Github className="w-3.5 h-3.5" />
              <span>Ready for GitHub Actions CI/CD</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Build Android APK Automatically on GitHub
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Every push to <code className="text-rose-300 font-mono">main</code> triggers our configured workflow (<code className="text-rose-300 font-mono">.github/workflows/android.yml</code>). GitHub Actions compiles the Android code with Java 17 and Gradle via <code className="text-rose-300 font-mono">gradle assembleDebug</code>, producing a ready-to-install <strong className="text-white">Debug APK artifact</strong>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center min-w-[120px]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Wrapper Script</div>
              <div className="font-mono font-bold text-emerald-400 text-xs mt-0.5">./gradlew</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center min-w-[120px]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">CI Workflow</div>
              <div className="font-mono font-bold text-rose-400 text-xs mt-0.5">android.yml</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Push & Build Instructions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">How to Push to GitHub &amp; Download APK</h3>
              <p className="text-[11px] text-slate-400">Step-by-step commands to push the project and get your APK</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">1</span>
                Initialize &amp; Push to GitHub
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Create a new repository on GitHub (e.g. <code className="text-slate-300">blood-donor-pakistan</code>), then push your files:
              </p>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 relative group">
              <pre className="overflow-x-auto whitespace-pre">git init
git add .
git commit -m "Init Android app &amp; CI"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main</pre>
              <button
                onClick={() => copyToClipboard('git init\ngit add .\ngit commit -m "Init Android app & CI"\ngit branch -M main\ngit push -u origin main', 'git-push')}
                className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[10px] flex items-center gap-1 opacity-80 group-hover:opacity-100 transition"
              >
                {copiedCmd === 'git-push' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">2</span>
                Automated Actions Build
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                GitHub will immediately run the <strong className="text-slate-200">Build Android APK</strong> workflow under the <strong className="text-slate-200">Actions</strong> tab.
              </p>
            </div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" /> Runs gradle assembleDebug
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" /> Sets up JDK 17 &amp; Gradle
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" /> Packages APK Artifact
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">3</span>
                Download APK from Artifacts
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Once the job finishes (~2 mins), scroll to the <strong className="text-slate-200">Artifacts</strong> section at the bottom of the workflow run:
              </p>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[10px] space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-emerald-300">
                <span>📦 debug-apk</span>
                <span className="text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400">Ready to install</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local CLI & Android Studio Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-300 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Local Build &amp; Firebase Verification</h3>
            <p className="text-[11px] text-slate-400">Run locally with Gradle wrapper or in Android Studio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Local Gradle commands */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-rose-400 font-bold">
              <span>Local Gradle Build Commands</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Run directly using the Gradle wrapper in your terminal or in Android Studio:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-[11px] text-amber-300 border border-slate-800 space-y-1">
              <div># Build Debug APK:</div>
              <div className="text-white">./gradlew assembleDebug</div>
              <div className="pt-1"># Build Release APK:</div>
              <div className="text-white">./gradlew assembleRelease</div>
            </div>
          </div>

          {/* Firebase Phone Auth & SHA-1 */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-rose-400 font-bold">
              <span>Firebase SMS Verification SHA-1</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              To enable instant SMS OTP without reCAPTCHA in Firebase Phone Auth:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800">
              gradle signingReport
            </div>
            <p className="text-slate-400 text-[11px]">
              Copy the SHA-1 fingerprint and paste it under <strong className="text-slate-200">Firebase Console &gt; Project Settings &gt; Android App &gt; SHA Certificate Fingerprints</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

