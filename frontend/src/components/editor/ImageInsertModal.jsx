import { useState, useRef, useCallback } from "react";
import { Upload, Link, Image, X, Loader } from "lucide-react";
import api, { formatError } from "@/lib/api";

/**
 * Modal for inserting an image into TipTap.
 * Two modes: Upload a file, or enter a URL directly.
 */
export default function ImageInsertModal({ onInsert, onClose }) {
  const [mode, setMode] = useState("upload"); // "upload" | "url"
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt_text", altText);
      form.append("context", "blog_content");
      const res = await api.post("/api/admin/media/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imgUrl = `${process.env.REACT_APP_BACKEND_URL}${res.data.url}`;
      onInsert(imgUrl, res.data.alt_text || file.name);
    } catch (err) {
      setError(formatError(err.response?.data?.detail) || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [altText, onInsert]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleUrlInsert = () => {
    if (!url.trim()) return;
    onInsert(url.trim(), altText || "");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0f1117] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-slate-400" />
            <h3 className="text-white font-semibold text-sm">Insert Image</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800">
          {[["upload", "Upload File"], ["url", "From URL"]].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                mode === key
                  ? "text-white border-b-2 border-[#002FA7] -mb-px"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}

          {/* Alt text — shared between modes */}
          <div>
            <label className="text-xs text-slate-500 font-medium block mb-1.5">
              Alt text <span className="text-slate-700">(for accessibility)</span>
            </label>
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#002FA7]"
            />
          </div>

          {mode === "upload" ? (
            <>
              {/* Drop zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-[#002FA7] bg-[#002FA7]/10"
                    : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/30"
                }`}
                data-testid="image-drop-zone"
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader className="w-6 h-6 text-[#002FA7] animate-spin" />
                    <p className="text-slate-400 text-sm">Uploading…</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-slate-500" />
                    <p className="text-slate-300 text-sm font-medium">Drop image here or click to browse</p>
                    <p className="text-slate-600 text-xs">JPG, PNG, GIF, WebP — max 10 MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
            </>
          ) : (
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1.5">Image URL</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                    data-testid="image-url-input"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleUrlInsert(); } }}
                  />
                </div>
              </div>
              {url && (
                <img
                  src={url}
                  alt="Preview"
                  className="mt-3 w-full h-32 object-cover rounded-lg opacity-70"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-700 text-slate-400 hover:text-white py-2 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            {mode === "url" && (
              <button
                type="button"
                onClick={handleUrlInsert}
                disabled={!url.trim()}
                className="flex-1 bg-[#002FA7] hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
                data-testid="image-url-insert-btn"
              >
                Insert
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
