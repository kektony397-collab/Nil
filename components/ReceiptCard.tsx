
import React from 'react';
import { ReceiptData } from '../types';
import { PRIMARY_RED, STAMP_BLUE } from '../constants';

interface ReceiptCardProps {
  data: ReceiptData;
  onChangeRow: (index: number, value: number) => void;
  onUpdateField: (field: keyof ReceiptData, value: string) => void;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({ data, onChangeRow, onUpdateField }) => {
  return (
    <div className="print-container">
      <div className="receipt-card print-area w-full max-w-4xl mx-auto bg-white p-4 md:p-5 relative border-[5px] border-double overflow-hidden shadow-2xl" 
           style={{ borderColor: PRIMARY_RED }}>
        
        {/* Watermark */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-[-15deg] text-center" style={{ zIndex: 0 }}>
          <p className="text-[10px] md:text-sm font-bold leading-relaxed">
            DIGITAL RECEIPT - IT ACT 2000 VALID - ORIGINAL LOST? THIS IS AUTHENTIC<br />
            Nilkanth Apartment Section-1 (બ્લોક ૧ થી ૬)<br />
            Nilkanth Apartment Section-1 (બ્લોક ૧ થી ૬)<br />
            Nilkanth Apartment Section-1 (બ્લોક ૧ થી ૬)<br />
            DIGITAL RECEIPT - IT ACT 2000 VALID
          </p>
        </div>

        <div className="inner-frame border p-3 relative z-10" style={{ borderColor: PRIMARY_RED }}>
          <div className="text-center mb-2">
            <span className="inline-block px-6 py-0.5 rounded-full text-xs font-bold border" 
                  style={{ borderColor: PRIMARY_RED, color: PRIMARY_RED }}>
              જમા પાવતી
            </span>
          </div>

          <header className="grid grid-cols-[70px_1fr_180px] md:grid-cols-[100px_1fr_240px] items-center gap-3 mb-3">
            <div className="logo flex justify-center">
              <svg viewBox="0 0 100 100" className="w-14 h-14 md:w-20 md:h-20">
                <circle cx="50" cy="40" r="28" fill="none" stroke={PRIMARY_RED} strokeWidth="2"/>
                <path d="M50 12 L50 68 M32 40 L68 40" stroke={PRIMARY_RED} strokeWidth="2.5"/>
                <text x="50" y="88" textAnchor="middle" fontSize="10" fontWeight="bold" fill={PRIMARY_RED}>નીલકંઠ</text>
              </svg>
            </div>

            <div className="text-center" style={{ color: PRIMARY_RED }}>
              <h1 className="text-lg md:text-2xl font-black mb-0">ધી નીલકંઠ એપાર્ટમેન્ટ વિભાગ-૧</h1>
              <p className="text-[10px] md:text-sm font-semibold">કો.ઓ.હાઉસિંગ સર્વિસ સોસાયટી લી.</p>
              <p className="text-[9px] md:text-xs mt-0.5">વંદે માતરમ્ ચાર રસ્તા નજીક, અમદાવાદ | <b>(બ્લોક ૧ થી ૬)</b></p>
            </div>

            <div className="border-[1.5px] text-center bg-red-50/20" style={{ borderColor: PRIMARY_RED, color: PRIMARY_RED }}>
              <div className="border-b p-1 text-[8px] md:text-[9px] font-bold" style={{ borderColor: PRIMARY_RED }}>રોકડા / ચેક | વિભાગ-૧</div>
              <div className="text-[9px] mt-1 font-bold">બ્લોક/ઘર નં. :</div>
              <input 
                type="text" 
                value={data.houseNo}
                onChange={(e) => onUpdateField('houseNo', e.target.value)}
                className="w-full bg-transparent text-center text-lg md:text-2xl font-bold outline-none px-2 py-0.5 placeholder:text-red-200"
                placeholder="0 / 000"
              />
            </div>
          </header>

          <div className="flex justify-between items-center mb-3 font-bold text-xs md:text-sm" style={{ color: PRIMARY_RED }}>
            <div className="flex items-center">
              <span>પહોંચ નં:</span>
              <input 
                className="ml-2 border-b border-dotted border-gray-400 bg-transparent outline-none w-14 md:w-20 text-black px-1"
                value={data.receiptNo}
                onChange={(e) => onUpdateField('receiptNo', e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span>તારીખ :</span>
              <input 
                type="text"
                className="ml-2 border-b border-dotted border-gray-400 bg-transparent outline-none w-24 md:w-32 text-black px-1"
                value={data.date}
                onChange={(e) => onUpdateField('date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 text-sm md:text-base font-medium mb-3" style={{ color: PRIMARY_RED }}>
            <div className="flex items-end gap-2">
              <span className="whitespace-nowrap">શ્રી/શ્રીમતી,</span>
              <input 
                className="flex-1 border-b border-dotted border-gray-400 bg-transparent outline-none text-black px-1 font-bold"
                value={data.name}
                onChange={(e) => onUpdateField('name', e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <span className="whitespace-nowrap">હસ્તે</span>
              <input 
                className="flex-1 border-b border-dotted border-gray-400 bg-transparent outline-none text-black px-1 font-bold"
                value={data.payer}
                onChange={(e) => onUpdateField('payer', e.target.value)}
              />
              <span className="whitespace-nowrap">મળ્યા છે.</span>
            </div>
          </div>

          <table className="w-full border-collapse mb-3">
            <thead>
              <tr className="bg-red-50/30" style={{ color: PRIMARY_RED }}>
                <th className="border p-1 text-[9px] md:text-xs w-10" style={{ borderColor: PRIMARY_RED }}>ક્રમ</th>
                <th className="border p-1 text-[9px] md:text-xs text-left" style={{ borderColor: PRIMARY_RED }}>વિગત</th>
                <th className="border p-1 text-[9px] md:text-xs w-24 md:w-32 text-right" style={{ borderColor: PRIMARY_RED }}>રકમ રૂ.</th>
                <th className="border p-1 text-[9px] md:text-xs w-10" style={{ borderColor: PRIMARY_RED }}>પૈસા</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="border p-1 text-center text-[9px] md:text-xs" style={{ borderColor: PRIMARY_RED }}>{idx + 1}</td>
                  <td className="border p-1 font-medium text-[9px] md:text-xs" style={{ borderColor: PRIMARY_RED }}>{row.label}</td>
                  <td className="border p-1" style={{ borderColor: PRIMARY_RED }}>
                    <input 
                      type="number" 
                      className="w-full bg-transparent text-right font-bold text-xs md:text-sm outline-none no-print-spinners"
                      value={row.amount || ''}
                      onChange={(e) => onChangeRow(idx, parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="border p-1 text-center text-[9px] md:text-xs" style={{ borderColor: PRIMARY_RED }}>00</td>
                </tr>
              ))}
              <tr className="font-bold bg-red-50/60">
                <td colSpan={2} className="border p-1.5 text-right text-xs md:text-sm" style={{ borderColor: PRIMARY_RED, color: PRIMARY_RED }}>કુલ...</td>
                <td className="border p-1.5 text-right text-xs md:text-sm" style={{ borderColor: PRIMARY_RED }}>
                  {data.total.toFixed(2)}
                </td>
                <td className="border p-1.5 text-center" style={{ borderColor: PRIMARY_RED }}>00</td>
              </tr>
            </tbody>
          </table>

          <div className="mb-4 flex items-end gap-2 text-xs md:text-sm font-medium" style={{ color: PRIMARY_RED }}>
            <span className="whitespace-nowrap">અંકે રૂપિયા :</span>
            <input 
              className="flex-1 border-b border-dotted border-gray-400 bg-transparent outline-none text-black px-1 font-bold text-[10px] md:text-xs"
              value={data.words}
              onChange={(e) => onUpdateField('words', e.target.value)}
            />
          </div>

          {/* Society Seal - Absolute positioned to not effect height flow */}
          <div className="absolute bottom-[20%] right-[15%] w-24 h-24 md:w-32 md:h-32 opacity-70 rotate-[-12deg] pointer-events-none select-none">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="95" fill="none" stroke={STAMP_BLUE} strokeWidth="3"/>
              <path id="stPath" fill="none" d="M 35,100 A 65,65 0 1,1 165,100" />
              <text fill={STAMP_BLUE} fontSize="10" fontWeight="bold">
                <textPath xlinkHref="#stPath">ધી નીલકંઠ એપાર્ટમેન્ટ વિભાગ-૧ કો.ઓ. સોસાયટી</textPath>
              </text>
              <text x="100" y="95" textAnchor="middle" fill={STAMP_BLUE} fontSize="12" fontWeight="bold">VERIFIED</text>
              <text x="100" y="115" textAnchor="middle" fill={STAMP_BLUE} fontSize="12" fontWeight="bold">SOCIETY SEAL</text>
              <text x="100" y="145" textAnchor="middle" fill={STAMP_BLUE} fontSize="18">★</text>
            </svg>
          </div>

          <footer className="mt-6 flex justify-between items-end">
            <div className="border p-2 w-44 md:w-64 text-[8px] md:text-[10px] space-y-1 rounded-sm bg-red-50/10" style={{ borderColor: PRIMARY_RED, color: PRIMARY_RED }}>
              <b className="block mb-0.5 underline">ચેકની વિગત:</b>
              <textarea 
                className="w-full bg-transparent border-none outline-none resize-none h-10 md:h-12 placeholder:text-red-200"
                placeholder="તારીખ: ______________&#10;બેંક: ________________"
                value={data.checkDetails}
                onChange={(e) => onUpdateField('checkDetails', e.target.value)}
              ></textarea>
            </div>
            <div className="text-center font-bold text-[10px] md:text-sm" style={{ color: PRIMARY_RED }}>
              <div className="w-24 md:w-36 border-b mb-1.5" style={{ borderColor: PRIMARY_RED }}></div>
              <p>નાણાં લેનારની સહી.</p>
            </div>
          </footer>
        </div>

        <style>{`
          .no-print-spinners::-webkit-inner-spin-button, 
          .no-print-spinners::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
          }
        `}</style>
      </div>
    </div>
  );
};

export default ReceiptCard;
