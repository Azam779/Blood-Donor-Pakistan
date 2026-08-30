import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ANDROID_PROJECT_FILES } from '../data/projectFiles';
import { Download, Check, Loader2, Sparkles, FolderArchive } from 'lucide-react';

export const ProjectExporter: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zip = new JSZip();

      // Add all project files to ZIP
      ANDROID_PROJECT_FILES.forEach(file => {
        if (file.path.endsWith('gradlew')) {
          zip.file(file.path, file.content, { unixPermissions: '755' });
        } else {
          zip.file(file.path, file.content);
        }
      });

      // Add top-level README for Android Studio
      zip.file(
        'README.md',
        `# Blood Donor Pakistan - Android Studio Application

Production-ready native Android application built with Java, Material Design XML layouts, and Google Firebase (Authentication & Cloud Firestore).

## Project Details
* **Application ID**: \`com.blooddonorpakistan.app\`
* **Target SDK**: 34 (Android 14)
* **Minimum SDK**: 23 (Android 6.0)
* **Firebase Project ID**: \`blood-donor-pakistan\`

## How to Build & Run
1. Open Android Studio.
2. Select **Open** and choose the \`android_project\` folder.
3. Allow Gradle to sync dependencies.
4. Click **Run > Run 'app'** or **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'blood-donor-pakistan-android-project.zip');

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleDownloadZip}
      disabled={isExporting}
      className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 flex items-center gap-2 transition disabled:opacity-50"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : downloaded ? (
        <Check className="w-4 h-4 text-emerald-300" />
      ) : (
        <FolderArchive className="w-4 h-4" />
      )}
      <span>{isExporting ? 'Packaging Project...' : downloaded ? 'ZIP Downloaded!' : 'Download Android Studio ZIP'}</span>
    </button>
  );
};
