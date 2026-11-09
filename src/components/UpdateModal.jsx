import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, X, ExternalLink, Sparkles, Copy, Check } from 'lucide-react';

const REPO_OWNER = 'Honiboll';
const REPO_NAME = 'Habit-matrix';

export default function UpdateModal({
  isOpen,
  onClose,
  currentVersion = '1.0.1'
}) {
  const [loading, setLoading] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [error, setError] = useState(null);
  const [hasNewVersion, setHasNewVersion] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compare semantic versions (e.g. "1.0.1" vs "1.0.0")
  const isNewer = (latest, current) => {
    const cleanLatest = latest.replace(/^v/, '');
    const cleanCurrent = current.replace(/^v/, '');
    const lParts = cleanLatest.split('.').map(Number);
    const cParts = cleanCurrent.split('.').map(Number);

    for (let i = 0; i < Math.max(lParts.length, cParts.length); i++) {
      const l = lParts[i] || 0;
      const c = cParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  };

  const handleOpenLink = (e, url) => {
    if (window.electronAPI && window.electronAPI.openExternal) {
      e.preventDefault();
      window.electronAPI.openExternal(url);
    }
  };

  const copyMacFix = () => {
    navigator.clipboard.writeText('xattr -cr "/Applications/Habit Matrix.app"');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const checkForUpdates = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API returned status ${response.status}`);
      }

      const data = await response.json();
      const latestTag = data.tag_name || data.name || '';
      const updateAvailable = isNewer(latestTag, currentVersion);

      // Prioritize .dmg over .zip for macOS!
      const assets = data.assets || [];
      const winAsset = assets.find((a) => a.name.endsWith('.exe'));
      const macDmgAsset = assets.find((a) => a.name.endsWith('.dmg'));
      const macZipAsset = assets.find((a) => a.name.endsWith('.zip'));
      const macAsset = macDmgAsset || macZipAsset;

      setUpdateInfo({
        version: latestTag,
        name: data.name || latestTag,
        notes: data.body || 'Performance improvements and bug fixes.',
        publishedAt: data.published_at ? new Date(data.published_at).toLocaleDateString() : '',
        htmlUrl: data.html_url,
        winUrl: winAsset ? winAsset.browser_download_url : null,
        winName: winAsset ? winAsset.name : null,
        macUrl: macAsset ? macAsset.browser_download_url : null,
        macName: macAsset ? macAsset.name : null,
        isMacDmg: !!macDmgAsset
      });

      setHasNewVersion(updateAvailable);
    } catch (err) {
      console.error('Update check failed:', err);
      setError('Could not connect to GitHub to check for updates. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Check on modal open if not checked yet
  useEffect(() => {
    if (isOpen) {
      checkForUpdates();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all transform duration-200"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border)',
          color: 'var(--text-main)'
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#f5d087]" />
            <h3 className="font-semibold text-base">Check for Updates</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Version Info Badge */}
          <div
            className="flex items-center justify-between p-3.5 rounded-xl border text-xs"
            style={{
              backgroundColor: 'var(--cell-empty)',
              borderColor: 'var(--border)'
            }}
          >
            <div>
              <span className="block" style={{ color: 'var(--text-muted)' }}>
                Installed Version
              </span>
              <span className="font-mono font-semibold text-sm">
                v{currentVersion}
              </span>
            </div>

            {updateInfo && (
              <div className="text-right">
                <span className="block" style={{ color: 'var(--text-muted)' }}>
                  Latest on GitHub
                </span>
                <span className="font-mono font-semibold text-sm" style={{ color: 'var(--accent)' }}>
                  {updateInfo.version}
                </span>
              </div>
            )}
          </div>

          {/* Status Display */}
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#f5d087]" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Checking GitHub for the latest release...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl border flex items-start gap-3 bg-red-950/20 border-red-900/40 text-red-200 text-xs">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Check Failed</p>
                <p className="text-red-300/80">{error}</p>
              </div>
            </div>
          ) : hasNewVersion && updateInfo ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-amber-950/15 border-amber-900/40 text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#f5d087] font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>New Version Available ({updateInfo.version})!</span>
                </div>
                {updateInfo.publishedAt && (
                  <p style={{ color: 'var(--text-muted)' }}>
                    Published on: {updateInfo.publishedAt}
                  </p>
                )}
                {updateInfo.notes && (
                  <div
                    className="p-3 rounded-lg border mt-2 max-h-28 overflow-y-auto whitespace-pre-line text-[11px]"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-main)'
                    }}
                  >
                    {updateInfo.notes}
                  </div>
                )}
              </div>

              {/* Download Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Direct download installers from GitHub:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {updateInfo.macUrl && (
                    <a
                      href={updateInfo.macUrl}
                      onClick={(e) => handleOpenLink(e, updateInfo.macUrl)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-[#f5d087] text-[#09090b] hover:bg-[#ebd59a] transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Download macOS (.dmg)</span>
                    </a>
                  )}

                  {updateInfo.winUrl && (
                    <a
                      href={updateInfo.winUrl}
                      onClick={(e) => handleOpenLink(e, updateInfo.winUrl)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold border hover:opacity-85 transition-colors"
                      style={{
                        backgroundColor: 'var(--cell-empty)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-main)'
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Windows (.exe)</span>
                    </a>
                  )}
                </div>

                {/* macOS Gatekeeper Security Notice */}
                <div
                  className="p-3 rounded-xl border text-[11px] space-y-2"
                  style={{
                    backgroundColor: 'var(--cell-empty)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-center gap-1.5 font-medium text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>راهنمای باز کردن در مک (رفع ارور "Damaged" یا مسدودی)</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)' }} className="leading-relaxed">
                    در مک، برنامه‌های دانلود شده از اینترنت که لایسنس پولی اپل ندارند، توسط Gatekeeper علامت‌گذاری می‌شوند. برای رفع این مورد کافیست دستور زیر را در Terminal اجرا کنید:
                  </p>
                  <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-zinc-800 font-mono text-[10px]">
                    <span className="truncate select-all text-amber-200">
                      xattr -cr "/Applications/Habit Matrix.app"
                    </span>
                    <button
                      onClick={copyMacFix}
                      className="ml-2 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1 shrink-0 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'کپی شد' : 'کپی'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-center pt-1">
                  <a
                    href={updateInfo.htmlUrl}
                    onClick={(e) => handleOpenLink(e, updateInfo.htmlUrl)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#f4f4f6] transition-colors"
                  >
                    <span>View full release on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ) : updateInfo ? (
            <div className="py-6 flex flex-col items-center justify-center text-center gap-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              <p className="text-sm font-semibold">You're up to date!</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Habit Matrix v{currentVersion} is currently the latest version.
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-3.5 border-t text-xs"
          style={{
            backgroundColor: 'var(--cell-empty)',
            borderColor: 'var(--border)'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>
            GitHub: {REPO_OWNER}/{REPO_NAME}
          </span>
          <button
            onClick={checkForUpdates}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium hover:opacity-85 transition-colors disabled:opacity-50 cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text-main)'
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Check Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
