
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, Save, FileSpreadsheet, Printer, Search, 
  Trash2, Edit, CheckCircle, Database, AlertCircle,
  X, ExternalLink, Download
} from 'lucide-react';
import { format } from 'date-fns';
import { ReceiptData, ReceiptRow, Stats } from './types';
import { DEFAULT_ROWS, STORAGE_KEY } from './constants';
import { numberToWords, formatCurrency, exportToCSV } from './utils/helpers';
import ReceiptCard from './components/ReceiptCard';

const App: React.FC = () => {
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData>(() => createNewReceipt(101));
  const [searchQuery, setSearchQuery] = useState({ name: '', house: '', no: '' });
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  function createNewReceipt(suggestedNo: number): ReceiptData {
    return {
      id: crypto.randomUUID(),
      receiptNo: suggestedNo.toString(),
      date: format(new Date(), 'dd - MM - yyyy'),
      houseNo: '',
      name: '',
      payer: '',
      rows: DEFAULT_ROWS.map(r => ({ ...r })),
      total: 0,
      words: '',
      checkDetails: '',
      createdAt: Date.now()
    };
  }

  // Persistence logic
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setReceipts(parsed);
        if (parsed.length > 0) {
          const maxNo = Math.max(...parsed.map((r: ReceiptData) => parseInt(r.receiptNo) || 0));
          setCurrentReceipt(createNewReceipt(maxNo + 1));
        }
      }
    } catch (err) {
      console.error("Failed to load receipts", err);
    }
  }, []);

  const saveToStorage = useCallback((updated: ReceiptData[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdateRow = (index: number, value: number) => {
    setCurrentReceipt(prev => {
      const newRows = [...prev.rows];
      newRows[index].amount = value;
      const newTotal = newRows.reduce((sum, row) => sum + row.amount, 0);
      return {
        ...prev,
        rows: newRows,
        total: newTotal,
        words: numberToWords(newTotal)
      };
    });
  };

  const handleUpdateField = (field: keyof ReceiptData, value: string) => {
    setCurrentReceipt(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!currentReceipt.name.trim()) {
      showToast("શ્રી/શ્રીમતી નું નામ લખવું ફરજિયાત છે!", 'error');
      return;
    }
    if (currentReceipt.total <= 0) {
      showToast("પાવતીમાં રકમ ઉમેરવી જરૂરી છે!", 'error');
      return;
    }

    const existsIdx = receipts.findIndex(r => r.id === currentReceipt.id);
    let updatedReceipts: ReceiptData[];

    if (existsIdx > -1) {
      updatedReceipts = [...receipts];
      updatedReceipts[existsIdx] = currentReceipt;
      showToast("રેકોર્ડ અપડેટ થઈ ગયો!");
    } else {
      updatedReceipts = [currentReceipt, ...receipts];
      showToast("નવી પાવતી સેવ થઈ ગઈ!");
    }

    setReceipts(updatedReceipts);
    saveToStorage(updatedReceipts);
  };

  const handleReset = () => {
    const maxNo = receipts.length > 0 
      ? Math.max(...receipts.map(r => parseInt(r.receiptNo) || 0))
      : 100;
    setCurrentReceipt(createNewReceipt(maxNo + 1));
    showToast("તમે નવી પાવતી બનાવી શકો છો.");
  };

  const handleEdit = (receipt: ReceiptData) => {
    setCurrentReceipt({ ...receipt });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm("શું તમે આ પાવતી ડિલીટ કરવા માંગો છો?")) {
      const filtered = receipts.filter(r => r.id !== id);
      setReceipts(filtered);
      saveToStorage(filtered);
      showToast("પાવતી ડિલીટ કરવામાં આવી છે.", 'error');
    }
  };

  const stats = useMemo<Stats>(() => ({
    totalCollection: receipts.reduce((sum, r) => sum + r.total, 0),
    totalReceipts: receipts.length
  }), [receipts]);

  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => 
      r.name.toLowerCase().includes(searchQuery.name.toLowerCase()) &&
      r.houseNo.toLowerCase().includes(searchQuery.house.toLowerCase()) &&
      r.receiptNo.toLowerCase().includes(searchQuery.no.toLowerCase())
    );
  }, [receipts, searchQuery]);

  return (
    <div className="min-h-screen pb-24">
      {/* Enhanced Dashboard Navbar */}
      <nav className="no-print sticky top-0 z-[100] bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-2xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Total Collection</span>
              <span className="text-2xl font-black text-emerald-400 drop-shadow-sm">{formatCurrency(stats.totalCollection)}</span>
            </div>
            <div className="hidden sm:flex flex-col border-l border-slate-700 pl-8">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Saved Receipts</span>
              <span className="text-2xl font-black text-blue-400">{stats.totalReceipts}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={handleReset}
              title="New Receipt"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm"
            >
              <Plus size={18} /> <span className="hidden sm:inline">New</span>
            </button>
            <button 
              onClick={handleSave}
              title="Save Record"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm"
            >
              <Save size={18} /> <span className="hidden sm:inline">Save</span>
            </button>
            <button 
              onClick={() => exportToCSV(receipts)}
              title="Download Report"
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm"
            >
              <Download size={18} /> <span className="hidden sm:inline">Excel</span>
            </button>
            <button 
              onClick={() => window.print()}
              title="Print Receipt"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm"
            >
              <Printer size={18} /> <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] no-print">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 border-l-4 ${
            toast.type === 'success' ? 'bg-white border-emerald-500 text-emerald-800' : 'bg-white border-red-500 text-red-800'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={20} className="text-emerald-500" /> : <AlertCircle size={20} className="text-red-500" />}
            <span className="font-bold text-sm tracking-wide">{toast.text}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X size={16} /></button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col xl:flex-row gap-10">
          {/* Main Receipt Form */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between no-print">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                    <span className="w-2 h-8 bg-indigo-600 rounded-full inline-block"></span>
                    Receipt Editor
                </h2>
                <span className="text-xs text-slate-500 font-bold bg-slate-200 px-3 py-1 rounded-full">
                    Draft ID: {currentReceipt.id.slice(0, 8)}
                </span>
            </div>
            <ReceiptCard 
              data={currentReceipt} 
              onChangeRow={handleUpdateRow}
              onUpdateField={handleUpdateField}
            />
          </div>

          {/* Database Sidebar */}
          <div className="no-print w-full xl:w-[400px]">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden sticky top-28">
              <div className="bg-slate-50 p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Database size={20} />
                    </div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tight">Records Library</h3>
                </div>
              </div>

              {/* Search Panel */}
              <div className="p-5 space-y-4 bg-white">
                <div className="relative group">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by name..." 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                    value={searchQuery.name}
                    onChange={(e) => setSearchQuery(s => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="House No." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                    value={searchQuery.house}
                    onChange={(e) => setSearchQuery(s => ({ ...s, house: e.target.value }))}
                  />
                  <input 
                    type="text" 
                    placeholder="Receipt No." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                    value={searchQuery.no}
                    onChange={(e) => setSearchQuery(s => ({ ...s, no: e.target.value }))}
                  />
                </div>
              </div>

              {/* Records Table */}
              <div className="max-h-[500px] overflow-y-auto">
                {filteredReceipts.length === 0 ? (
                  <div className="py-20 text-center px-10">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Database size={32} />
                    </div>
                    <p className="text-slate-400 font-bold text-sm">No records found matching your search.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {filteredReceipts.map(r => (
                      <div 
                        key={r.id} 
                        className={`group p-4 flex items-center justify-between hover:bg-indigo-50/40 transition-all cursor-pointer ${currentReceipt.id === r.id ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-200' : ''}`}
                        onClick={() => handleEdit(r)}
                      >
                        <div className="flex flex-col min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded uppercase tracking-wider">#{r.receiptNo}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{r.date}</span>
                          </div>
                          <h4 className="font-black text-slate-800 text-sm truncate">{r.name}</h4>
                          <span className="text-xs text-slate-500 font-medium italic">Unit: {r.houseNo || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col items-end shrink-0 gap-2">
                          <span className="font-black text-slate-900">₹{r.total.toLocaleString()}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                            <div className="p-1.5 text-indigo-400">
                                <Edit size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                Nilkanth Apartment Management v2.1
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <div className="no-print fixed bottom-8 right-8 md:hidden flex flex-col gap-4 z-[100]">
        <button 
            onClick={handleReset}
            className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
        >
            <Plus size={28} />
        </button>
        <button 
            onClick={handleSave}
            className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
        >
            <Save size={28} />
        </button>
      </div>

    </div>
  );
};

export default App;
