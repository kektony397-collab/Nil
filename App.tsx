
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Save, FileSpreadsheet, Printer, Search, Trash2, Edit, CheckCircle, Database } from 'lucide-react';
import { format } from 'date-fns';
import { ReceiptData, ReceiptRow, Stats } from './types';
import { DEFAULT_ROWS, STORAGE_KEY } from './constants';
import { numberToWords, formatCurrency, exportToCSV } from './utils/helpers';
import ReceiptCard from './components/ReceiptCard';

const App: React.FC = () => {
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData>(createNewReceipt(101));
  const [searchQuery, setSearchQuery] = useState({ name: '', house: '', no: '' });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setReceipts(parsed);
      if (parsed.length > 0) {
        // Find highest receipt number to suggest next
        const maxNo = Math.max(...parsed.map((r: ReceiptData) => parseInt(r.receiptNo) || 0));
        setCurrentReceipt(createNewReceipt(maxNo + 1));
      }
    }
  }, []);

  const saveToStorage = (updated: ReceiptData[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

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

  // Handlers
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
      setMessage({ text: "શ્રી/શ્રીમતી નું નામ જરૂરી છે!", type: 'error' });
      return;
    }
    if (currentReceipt.total <= 0) {
      setMessage({ text: "કુલ રકમ શૂન્ય થી વધારે હોવી જોઈએ!", type: 'error' });
      return;
    }

    const existsIdx = receipts.findIndex(r => r.id === currentReceipt.id);
    let updatedReceipts: ReceiptData[];

    if (existsIdx > -1) {
      updatedReceipts = [...receipts];
      updatedReceipts[existsIdx] = currentReceipt;
    } else {
      updatedReceipts = [currentReceipt, ...receipts];
    }

    setReceipts(updatedReceipts);
    saveToStorage(updatedReceipts);
    
    setMessage({ text: "સફળતાપૂર્વક સેવ થઈ ગયું!", type: 'success' });
    
    // Clear after delay or when starting new
    setTimeout(() => setMessage(null), 3000);
  };

  const handleReset = () => {
    const maxNo = receipts.length > 0 
      ? Math.max(...receipts.map(r => parseInt(r.receiptNo) || 0))
      : 100;
    setCurrentReceipt(createNewReceipt(maxNo + 1));
    setMessage(null);
  };

  const handleEdit = (receipt: ReceiptData) => {
    setCurrentReceipt({ ...receipt });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm("આ રેકોર્ડ ડિલીટ કરવો છે?")) {
      const filtered = receipts.filter(r => r.id !== id);
      setReceipts(filtered);
      saveToStorage(filtered);
    }
  };

  // Memoized stats and filtered data
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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navbar Dashboard */}
      <nav className="no-print sticky top-0 z-50 bg-slate-900 text-white shadow-xl p-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Total Collection (કુલ જમા)</span>
              <span className="text-2xl font-black text-green-400">{formatCurrency(stats.totalCollection)}</span>
            </div>
            <div className="h-10 w-px bg-slate-700 hidden md:block" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Receipts (પાવતી સંખ્યા)</span>
              <span className="text-2xl font-black text-blue-400">{stats.totalReceipts}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-bold transition-all transform active:scale-95"
            >
              <Plus size={18} /> New
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-bold transition-all transform active:scale-95"
            >
              <Save size={18} /> Save/Update
            </button>
            <button 
              onClick={() => exportToCSV(receipts)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg font-bold transition-all transform active:scale-95"
            >
              <FileSpreadsheet size={18} /> Export
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-bold transition-all transform active:scale-95"
            >
              <Printer size={18} /> Print
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {message && (
          <div className={`no-print mb-6 p-4 rounded-lg flex items-center gap-3 animate-bounce shadow-md ${
            message.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
          }`}>
            <CheckCircle size={20} />
            <span className="font-bold">{message.text}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form Section */}
          <div className="flex-1 space-y-8">
            <section>
              <ReceiptCard 
                data={currentReceipt} 
                onChangeRow={handleUpdateRow}
                onUpdateField={handleUpdateField}
              />
            </section>
          </div>

          {/* Database Sidebar / Table */}
          <div className="no-print w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden sticky top-32">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
                <Database size={18} className="text-slate-600" />
                <h3 className="font-bold text-slate-700">Recent Receipts</h3>
              </div>

              {/* Filters */}
              <div className="p-4 space-y-3 bg-slate-50/50">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="નામ થી શોધો..." 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={searchQuery.name}
                    onChange={(e) => setSearchQuery(s => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="ઘર નં." 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={searchQuery.house}
                    onChange={(e) => setSearchQuery(s => ({ ...s, house: e.target.value }))}
                  />
                  <input 
                    type="text" 
                    placeholder="પહોંચ નં." 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={searchQuery.no}
                    onChange={(e) => setSearchQuery(s => ({ ...s, no: e.target.value }))}
                  />
                </div>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {filteredReceipts.length === 0 ? (
                  <div className="p-10 text-center text-slate-400">
                    <Database size={40} className="mx-auto mb-2 opacity-20" />
                    <p>કોઈ રેકોર્ડ મળ્યો નથી</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 font-semibold text-slate-500">No.</th>
                        <th className="px-4 py-2 font-semibold text-slate-500">Name</th>
                        <th className="px-4 py-2 font-semibold text-slate-500 text-right">Amt</th>
                        <th className="px-4 py-2 font-semibold text-slate-500 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredReceipts.map(r => (
                        <tr key={r.id} className={`hover:bg-slate-50 transition-colors ${currentReceipt.id === r.id ? 'bg-blue-50' : ''}`}>
                          <td className="px-4 py-3 font-medium">#{r.receiptNo}</td>
                          <td className="px-4 py-3 truncate max-w-[120px]">{r.name}</td>
                          <td className="px-4 py-3 text-right font-bold text-slate-700">₹{r.total.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleEdit(r)}
                                className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(r.id)}
                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Mobile Actions */}
      <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 flex md:hidden gap-3 px-4 py-3 bg-slate-900/90 backdrop-blur rounded-full shadow-2xl z-50">
        <button onClick={handleReset} className="p-3 bg-indigo-600 text-white rounded-full"><Plus size={24} /></button>
        <button onClick={handleSave} className="p-3 bg-emerald-600 text-white rounded-full"><Save size={24} /></button>
        <button onClick={() => window.print()} className="p-3 bg-blue-600 text-white rounded-full"><Printer size={24} /></button>
      </div>

    </div>
  );
};

export default App;
