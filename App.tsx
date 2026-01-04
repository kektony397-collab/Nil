
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, Save, FileSpreadsheet, Printer, Search, 
  Trash2, Edit, Database, Download, CheckCircle, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ReceiptData, Stats } from './types';
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
    setTimeout(() => setToast(null), 3000);
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
      showToast("પાવતી અપડેટ થઈ ગઈ!");
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
    return receipts.filter(r => {
      const nameMatch = r.name.toLowerCase().includes(searchQuery.name.toLowerCase());
      const houseMatch = r.houseNo.toLowerCase().includes(searchQuery.house.toLowerCase());
      const noMatch = r.receiptNo.includes(searchQuery.no);
      return nameMatch && houseMatch && noMatch;
    });
  }, [receipts, searchQuery]);

  return (
    <div className="min-h-screen pb-20 md:p-6 lg:p-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce no-print ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-semibold">{toast.text}</span>
        </div>
      )}

      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Database className="text-red-600" />
            Nilkanth Society Manager
          </h1>
          <p className="text-slate-500 font-medium">Digital Billing & Receipt Management System</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="bg-white text-slate-700 px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-300 font-bold flex items-center gap-2 transition-all">
            <Plus size={18} /> નવી પાવતી
          </button>
          <button onClick={handleSave} className="bg-red-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-red-700 font-bold flex items-center gap-2 transition-all">
            <Save size={18} /> સેવ કરો
          </button>
          <button onClick={() => window.print()} className="bg-slate-800 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-slate-900 font-bold flex items-center gap-2 transition-all">
            <Printer size={18} /> પ્રિન્ટ
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        {/* Statistics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Collection</p>
              <h2 className="text-3xl font-black text-slate-800">{formatCurrency(stats.totalCollection)}</h2>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl text-green-600">
              <Download size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Receipts Issued</p>
              <h2 className="text-3xl font-black text-slate-800">{stats.totalReceipts}</h2>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <FileSpreadsheet size={32} />
            </div>
          </div>
        </section>

        {/* The Receipt Itself */}
        <section className="receipt-section">
          <ReceiptCard 
            data={currentReceipt}
            onChangeRow={handleUpdateRow}
            onUpdateField={handleUpdateField}
          />
        </section>

        {/* Database & Search */}
        <section className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 no-print">
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Search className="text-red-600" />
              પાવતી ડેટાબેઝ
            </h3>
            <div className="flex flex-wrap gap-2">
              <input 
                placeholder="નામ થી શોધો..."
                className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 ring-red-500/20 text-sm"
                value={searchQuery.name}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, name: e.target.value }))}
              />
              <input 
                placeholder="બ્લોક નં..."
                className="w-24 px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 ring-red-500/20 text-sm"
                value={searchQuery.house}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, house: e.target.value }))}
              />
              <button 
                onClick={() => exportToCSV(receipts)}
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 font-bold text-sm flex items-center gap-2"
              >
                <FileSpreadsheet size={16} /> Excel Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold text-sm uppercase tracking-wider">
                  <th className="p-4">પહોંચ નં</th>
                  <th className="p-4">તારીખ</th>
                  <th className="p-4">બ્લોક</th>
                  <th className="p-4">નામ</th>
                  <th className="p-4 text-right">કુલ રકમ</th>
                  <th className="p-4 text-center">એક્શન</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReceipts.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-700">{r.receiptNo}</td>
                    <td className="p-4 text-slate-500">{r.date}</td>
                    <td className="p-4 text-slate-700 font-bold">{r.houseNo}</td>
                    <td className="p-4 text-slate-700 font-medium">{r.name}</td>
                    <td className="p-4 text-right font-black text-slate-800">{formatCurrency(r.total)}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(r)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(r.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredReceipts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      કોઈ ડેટા મળ્યો નથી.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 text-center text-slate-400 text-sm no-print">
        <p>© {new Date().getFullYear()} Nilkanth Apartment Section-1 (બ્લોક ૧ થી ૬)</p>
        <p className="mt-1 font-medium">Digital Society Management Solution</p>
      </footer>
    </div>
  );
};

export default App;
