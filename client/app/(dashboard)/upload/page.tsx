"use client";

import React, { useState, useEffect } from 'react'; // Added useEffect
import { deleteDocument, getDocuments, uploadDocument } from '@/services/document.service';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Trash2, Calendar } from 'lucide-react'; // Added Trash2, Calendar
import { Document } from '@/interface';
import { FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus({ type: null, message: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      await uploadDocument(file);
      setUploadStatus({ 
        type: 'success', 
        message: `${file.name} has been successfully indexed into the horological archive.` 
      });
      setFile(null); 
      fetchDocuments();
    } catch (err) {
      setUploadStatus({ 
        type: 'error', 
        message: 'Failed to index document. Please verify the folio and try again.' 
      });
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await getDocuments();
      const data = res.data.data;
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteDocument(docId);
      fetchDocuments();
    } catch(err) {
      console.log('Delete Failed', err)
    }
  }


  // Gear SVG for loading state
  const GearSVG = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  )

  return (
    <div className="min-h-screen bg-parchment text-charcoal p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 md:mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brass mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Archivist Console
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-forest mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Archive Folio Index
          </h1>
          <p className="text-sm md:text-base text-warmGray" style={{ fontFamily: "'Lora', serif" }}>
            Submit calibre documents, servicing records, or technical schematics for archival indexing.
          </p>
        </header>

        <main className="grid gap-8">
          {/* Upload Section */}
          <section className="bg-ivory border border-brass/20 rounded-sm p-6 md:p-8 shadow-sm">
            <div 
              className={`relative border-2 border-dashed rounded-sm p-8 md:p-12 transition-colors flex flex-col items-center justify-center text-center
                ${file ? 'border-brass bg-parchment' : 'border-parchmentDark hover:border-brass/60'}`}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf,.txt,.doc,.docx"
              />
              
              <div className="bg-parchment p-4 rounded-sm mb-4 border border-brass/10">
                <Upload className="w-8 h-8 text-forest" />
              </div>

              {file ? (
                <div className="space-y-2">
                  <p className="font-bold text-forest" style={{ fontFamily: "'Playfair Display', serif" }}>{file.name}</p>
                  <p className="text-xs text-warmGray" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB · Ready for indexing
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-lg font-bold text-forest" style={{ fontFamily: "'Playfair Display', serif" }}>Select folio for archival</p>
                  <p className="text-sm text-warmGray" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem' }}>PDF, TXT, or DOC (Max 10MB)</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-4">
              {file && (
                <button 
                  onClick={() => setFile(null)}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm text-warmGray hover:text-red-700 transition-colors uppercase tracking-widest"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem' }}
                >
                  Discard
                </button>
              )}
              <button
                disabled={!file || isUploading}
                onClick={handleUpload}
                className={`w-full sm:w-auto px-8 py-2.5 rounded-sm text-sm font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-[0.15em]
                  ${!file || isUploading 
                    ? 'bg-parchmentDark text-warmGray/50 cursor-not-allowed' 
                    : 'bg-forest text-parchment hover:bg-forestLight active:scale-95 shadow-md'}`}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem' }}
              >
                {isUploading ? (
                  <>
                    <GearSVG className="w-4 h-4 gear-spin" />
                    Aligning schematics...
                  </>
                ) : (
                  'Index into Archive'
                )}
              </button>
            </div>

            {/* Status Messages */}
            {uploadStatus.type && (
              <div className={`mt-6 p-4 rounded-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 border-l-3
                ${uploadStatus.type === 'success' ? 'bg-forest/5 border border-forest/20 text-forest border-l-forest' : 'bg-red-50/80 border border-red-200/50 text-red-800 border-l-red-600'}`}
              >
                {uploadStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
                <p className="text-sm" style={{ fontFamily: "'Lora', serif" }}>{uploadStatus.message}</p>
              </div>
            )}
          </section>

          {/* Indexed Documents Section */}
          <section className="bg-ivory border border-brass/20 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-brass/20 bg-parchment flex items-center gap-2">
              <h2 className="font-bold text-forest" style={{ fontFamily: "'Playfair Display', serif" }}>Indexed Folios</h2>
              <span className="text-[9px] text-warmGray uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                · {documents.length} Record{documents.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="divide-y divide-brass/10">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-parchment/50 transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-parchment rounded-sm text-forest border border-brass/10">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate" style={{ fontFamily: "'Lora', serif" }}>{doc.filename}</p>
                        <p className="text-xs text-brass uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem' }}>
                          REF: {(doc.file_type.split('/')[1] || doc.file_type).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="text-warmGray/40 hover:text-red-700 transition-colors p-2 rounded-sm hover:bg-red-50"
                        title="Remove from archive"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-sm text-warmGray italic" style={{ fontFamily: "'Lora', serif" }}>No folios have been indexed into the archive.</p>
                </div>
              )}
            </div>
          </section>

          {/* Guidelines / Help Section */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="p-5 bg-ivory border border-brass/15 rounded-sm border-t-2 border-t-brass/40">
              <h3 className="text-sm font-bold text-forest mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Precision Indexing</h3>
              <p className="text-xs text-warmGray leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>Documents are methodically parsed, segmented, and embedded for precise archival retrieval across the registry.</p>
            </div>
            <div className="p-5 bg-ivory border border-brass/15 rounded-sm border-t-2 border-t-brass/40">
              <h3 className="text-sm font-bold text-forest mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Vault Security</h3>
              <p className="text-xs text-warmGray leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>All records are stored within the private Aethelgard registry vault. No external access is permitted.</p>
            </div>
            <div className="p-5 bg-ivory border border-brass/15 rounded-sm border-t-2 border-t-brass/40 sm:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-bold text-forest mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Folio References</h3>
              <p className="text-xs text-warmGray leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>Indexed documents are automatically cited as archive references when responding to registry queries.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;