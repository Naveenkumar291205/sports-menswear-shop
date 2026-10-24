'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowRight,
  RefreshCw,
  Layers,
  Database
} from 'lucide-react';

interface ParsedRowPreview {
  row: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  sizes: string;
  stock: number;
  isValid: boolean;
  error?: string;
}

export default function BulkImportPage() {
  const { showToast } = useToast();
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload');
  const [fileName, setFileName] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState(0);

  const sampleParsedRows: ParsedRowPreview[] = [
    { row: 1, sku: 'SMW-TSH-101', name: 'SMW HyperDry Athletic Muscle Tee', category: 'T-Shirts', price: 699, sizes: 'S, M, L, XL', stock: 120, isValid: true },
    { row: 2, sku: 'SMW-JOG-102', name: 'SMW Stealth Kinetic Cargo Joggers', category: 'Joggers', price: 699, sizes: 'M, L, XL', stock: 80, isValid: true },
    { row: 3, sku: 'SMW-SHT-103', name: 'SMW UltraLite 5-Inch Split Shorts', category: 'Shorts', price: 699, sizes: 'S, M, L, XL, XXL', stock: 150, isValid: true },
    { row: 4, sku: 'SMW-CMP-104', name: 'SMW Graduated Recovery Full Tights', category: 'Compression Wear', price: 699, sizes: 'S, M, L, XL', stock: 95, isValid: true },
    { row: 5, sku: 'SMW-ERR-105', name: 'SMW Invalid Sample Item', category: 'Unknown', price: 0, sizes: '', stock: -5, isValid: false, error: 'Price must be > 0 and Category must match taxonomy' },
    { row: 6, sku: 'SMW-JCK-106', name: 'SMW Monsoon All-Weather Shell', category: 'Jackets', price: 1499, sizes: 'M, L, XL', stock: 40, isValid: true },
  ];

  const handleSimulatedUpload = () => {
    setFileName('SPORTS_MENS_WEAR_5000_CATALOG_MASTER.csv');
    setStep('preview');
    showToast('Catalog spreadsheet parsed: 5,000 product rows detected', 'info');
  };

  const handleStartImport = () => {
    setStep('importing');
    setImportProgress(0);

    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('complete');
          showToast('Successfully imported products into database!', 'success');
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleDownloadTemplate = () => {
    const csvContent = 'data:text/csv;charset=utf-8,SKU,Name,Category,Price,MRP,Sizes,Colors,Stock,Material,Description\nSMW-TSH-001,SMW AeroTech Tee,T-Shirts,699,1299,"S,M,L,XL,XXL","Black,White",100,Poly-Coolmax,Sample description';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sports_mens_wear_product_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sample CSV template downloaded', 'success');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="BULK PRODUCT IMPORT"
          subtitle="Catalog Ingestion Engine • Supports CSV / Excel • 5,000 SKU Scale"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto max-w-6xl">
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-white">
                    Step 1: Upload Product Spreadsheet
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Import large inventories with multi-variant sizing and Tamil Nadu store stock levels.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadTemplate}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download CSV Template
                </Button>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onClick={handleSimulatedUpload}
                className="border-2 border-dashed border-zinc-700 hover:border-white bg-zinc-950 p-12 text-center cursor-pointer transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-zinc-900 mx-auto flex items-center justify-center text-white mb-4 border border-zinc-800 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold uppercase text-white tracking-wider mb-1">
                  Drag & Drop CSV / Excel Spreadsheet Here
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                  Supports .csv, .xlsx up to 50MB (approximately 5,000 product rows with image URLs)
                </p>
                <Button size="md" variant="primary">
                  BROWSE COMPUTER FILES
                </Button>
              </div>

              {/* Ingestion Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <span className="font-bold text-white uppercase">Automated Taxonomy Mapping</span>
                  <p className="text-zinc-400">Categories & subcategories are automatically synced to our 10 sport categories.</p>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <span className="font-bold text-white uppercase">Sizing & Color Variants</span>
                  <p className="text-zinc-400">Comma-separated sizes (S, M, L, XL, XXL) generate automatic SKU children.</p>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <span className="font-bold text-white uppercase">Pre-Validation Engine</span>
                  <p className="text-zinc-400">Checks for duplicate SKUs, invalid price points, and missing image links before saving.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VALIDATE & PREVIEW */}
          {step === 'preview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-white">
                    Step 2: Validate Ingestion Preview
                  </h2>
                  <p className="text-xs text-zinc-400">
                    File: <strong className="text-white font-mono">{fileName}</strong> • 4,999 Valid Rows / 1 Error Row
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setStep('upload')}>
                    Re-upload
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleStartImport}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    CONFIRM & IMPORT 5,000 PRODUCTS
                  </Button>
                </div>
              </div>

              {/* Status Summary Strip */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-zinc-900/60 border border-zinc-800 text-xs">
                  <span className="text-zinc-500 uppercase text-[10px]">Total Detected</span>
                  <p className="text-lg font-black text-white font-mono">5,000 Items</p>
                </div>
                <div className="p-3 bg-zinc-900/60 border border-zinc-800 text-xs">
                  <span className="text-emerald-500 uppercase text-[10px] font-bold">Valid & Ready</span>
                  <p className="text-lg font-black text-emerald-400 font-mono">4,999 Items</p>
                </div>
                <div className="p-3 bg-zinc-900/60 border border-zinc-800 text-xs">
                  <span className="text-red-500 uppercase text-[10px] font-bold">Errors Found</span>
                  <p className="text-lg font-black text-red-400 font-mono">1 Item (Flagged)</p>
                </div>
              </div>

              {/* Preview Table */}
              <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Status</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Sizes</th>
                      <th className="p-3">Initial Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {sampleParsedRows.map((r) => (
                      <tr
                        key={r.row}
                        className={`hover:bg-zinc-900/40 ${!r.isValid ? 'bg-red-950/20' : ''}`}
                      >
                        <td className="p-3">
                          {r.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-bold uppercase" title={r.error}>
                              <AlertCircle className="w-3.5 h-3.5" /> {r.error}
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono font-bold text-white">{r.sku}</td>
                        <td className="p-3 font-bold text-white uppercase">{r.name}</td>
                        <td className="p-3">{r.category}</td>
                        <td className="p-3 font-mono font-bold text-white">₹{r.price}</td>
                        <td className="p-3 font-mono text-[11px]">{r.sizes || '—'}</td>
                        <td className="p-3 font-mono">{r.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: IMPORTING PROGRESS */}
          {step === 'importing' && (
            <div className="bg-zinc-950 border border-zinc-800 p-12 text-center max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 bg-zinc-900 mx-auto flex items-center justify-center text-white border border-zinc-800">
                <Database className="w-8 h-8 animate-pulse text-white" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  Ingesting 5,000 Catalog SKUs Into Database...
                </h3>
                <p className="text-xs text-zinc-400">
                  Building inventory matrix, indexing search tokens, and syncing store stocks.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-zinc-900 h-3 border border-zinc-700">
                  <div
                    className="bg-white h-full transition-all duration-300 shadow-glow"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-300">{importProgress}% Completed</span>
              </div>
            </div>
          )}

          {/* STEP 4: COMPLETED */}
          {step === 'complete' && (
            <div className="bg-zinc-950 border border-zinc-800 p-12 text-center max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 bg-white text-black mx-auto flex items-center justify-center shadow-glow">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-wider text-white font-sans">
                  IMPORT SUCCESSFUL
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  5,000 Sportswear items have been loaded into the active master catalog and are now searchable on the storefront.
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <Button size="md" variant="primary" onClick={() => setStep('upload')}>
                  IMPORT ANOTHER BATCH
                </Button>
                <Link href="/admin/products">
                  <Button size="md" variant="outline">
                    VIEW PRODUCTS LIST
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
