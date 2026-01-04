
import React from 'react';
import { ReceiptData, ReceiptRow } from '../types';
import { PRIMARY_RED, STAMP_BLUE } from '../constants';

interface ReceiptCardProps {
  data: ReceiptData;
  onChangeRow: (index: number, value: number) => void;
  onUpdateField: (field: keyof ReceiptData, value: string) => void;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({ data, onChangeRow, onUpdateField }) => {
  return (
    <div className="receipt-card print-area w-full max-w-4xl mx-auto bg-white p-6 relative border-[6px] border-double overflow-hidden shadow-2xl" 
         style={{ borderColor: PRIMARY_RED }}>
      
      {/* Watermark - Ensure it shows up faintly in print */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.04] pointer-events-none select-none rotate-[-15deg] text-center" style={{ zIndex: 0 }}>
        <p className="text-[10px] md:text-sm font-bold leading-relaxed">
          DIGITAL RECEIPT - IT ACT 2000 VALID - ORIGINAL LOST? THIS IS AUTHENTIC<br />
          Nilkanth Apartment Section-1 (બ્લોક ૧ થી ૬)<br />
          Nilkanth Apartment Section-1 (બ્લોક ૧ થી ૬)<br />
          Nilkanth Apartment Section-1 (બ્લોક ૧ થી ૬)<br />
          DIGITAL RECEIPT - IT ACT 2000 VALID
        </p>
      </div>

      <div className="inner-frame border-2 p-4 relative z-10" style={{ borderColor: PRIMARY_RED }}>
        <div className="text-center mb-4">
          <span className="inline-block px-8 py-1 rounded-full text-sm font-bold border-2" 
                style={{ borderColor: PRIMARY_RED, color: PRIMARY_RED }}>
            જમા પાવતી
          </span>
        </div>

        <header className="grid grid-cols-[80px_1fr_200px] md:grid-cols-[100px_1fr_240px] items-center gap-4 md:gap-6 mb-6">
          <div className="logo flex justify-center">
            <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20">
              <circle cx="50" cy="40" r="28" fill="none" stroke={PRIMARY_RED} strokeWidth="2"/>
              <path d="M50 12 L50 68 M32 40 L68 40" stroke={PRIMARY_RED} strokeWidth="2.5"/>
              <text x="50" y="88" textAnchor="middle" fontSize="10" fontWeight="bold" fill={PRIMARY_RED}>નીલકંઠ</text>
            </svg>
          </div>

          <div className="text-center" style={{ color: PRIMARY_RED }}>
            <h1 className="text-xl md:text-3xl font-black mb-1">ધી નીલકંઠ એપાર્ટમેન્ટ વિભાગ-૧</h1>
            <p className="text-sm md:text-base font-semibold">કો.ઓ.હાઉસિંગ સર્વિસ સોસાયટી લી.</p>
            <p className="text-[10px] md:text-xs mt-1">વંદે માતરમ્ ચાર રસ્તા નજીક, અમદાવાદ | <b>(બ્લોક ૧ થી ૬)</b></p>
          </div>

          <div className="border-[2.5px] text-center" style={{ borderColor: PRIMARY_RED, color: PRIMARY_RED }}>
            <div className="border-b-[1.5px] p-1 text-[10px] font-bold" style={{ borderColor: PRIMARY_RED }}>રોકડા / ચેક | વિભાગ-૧</div>
            <div className="text-[10px] my-0.5 md:my-1">બ્લોક/ઘર નં. :</div>
            <input 
              type="text" 
              value={data.houseNo}
              onChange={(e) => onUpdateField('houseNo', e.target.value)}
              className="w-full bg-transparent text-center text-xl md:text-2xl font-bold outline-none px-2 py-1 placeholder:text-red-200"
              placeholder="0 / 000"
            />
          </div>
        </header>

        <div className="flex justify-between items-center mb-4 font-bold text-sm md:text-base" style={{ color: PRIMARY_RED }}>
          <div className="flex items-center">
            <span>પહોંચ નં:</span>
            <input 
              className="ml-2 border-b border-dotted border-gray-400 bg-transparent outline-none w-16 md:w-24 text-black px-1"
              value={data.receiptNo}
              onChange={(e) => onUpdateField('receiptNo', e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <span>તારીખ :</span>
            <input 
              type="text"
              className="ml-2 border-b border-dotted border-gray-400 bg-transparent outline-none w-28 md:w-36 text-black px-1"
              value={data.date}
              onChange={(e) => onUpdateField('date', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4 text-base md:text-xl font-medium" style={{ color: PRIMARY_RED }}>
          <div className="flex items-end gap-3">
            <span className="whitespace-nowrap">શ્રી/શ્રીમતી,</span>
            <input 
              className="flex-1 border-b border-dotted border-gray-400 bg-transparent outline-none text-black px-1 font-bold"
              value={data.name}
              onChange={(e) => onUpdateField('name', e.target.value)}
            />
          </div>
          <div className="flex items-end gap-3">
            <span className="whitespace-nowrap">હસ્તે</span>
            <input 
              className="flex-1 border-b border-dotted border-gray-400 bg-transparent outline-none text-black px-1 font-bold"
              value={data.payer}
              onChange={(e) => onUpdateField('payer', e.target.value)}
            />
            <span className="whitespace-nowrap">મળ્યા છે.</span>
          </div>
        </div>

        <table className="w-full border-collapse mt-6">
          <thead>
            <tr style={{ color: PRIMARY_RED }}>
              <th className="border-2 p-1 md:p-2 text-xs md:text-sm w-12" style={{ borderColor: PRIMARY_RED }}>ક્રમ</th>
              <th className="border-2 p-1 md:p-2 text-xs md:text-sm text-left" style={{ borderColor: PRIMARY_RED }}>વિગત</th>
              <th className="border-2 p-1 md:p-2 text-xs md:text-sm w-32 md:w-40 text-right" style={{ borderColor: PRIMARY_RED }}>રકમ રૂ.</th>
              <th className="border-2 p-1 md:p-2 text-xs md:text-sm w-12 md:w-16" style={{ borderColor: PRIMARY_RED }}>પૈસા</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, idx) => (
              <tr key={idx}>
                <td className="border-2 p-1 md:p-2 text-center text-xs md:text-sm" style={{ borderColor: PRIMARY_RED }}>{idx + 1}</td>
                <td className="border-2 p-1 md:p-2 font-medium text-xs md:text-sm" style={{ borderColor: PRIMARY_RED }}>{row.label}</td>
                <td className="border-2 p-1 md:p-2" style={{ borderColor: PRIMARY_RED }}>
                  <input 
                    type="number" 
                    className="w-full bg-transparent text-right font-bold text-sm md:text-lg outline-none no-print-spinners"
                    value={row.amount || ''}
                    onChange={(e) => onChangeRow(idx, parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="border-2 p-1 md:p-2 text-center text-xs md:text-sm" style={{ borderColor: PRIMARY_RED }}>00</td>
              </tr>
            ))}
            <tr className="font-bold bg-red-50">
              <td colSpan={2} className="border-2 p-2 md:p-3 text-right text-sm md:text-lg" style={{ borderColor: PRIMARY_RED, color: PRIMARY_RED }}>કુલ...</td>
              <td className="border-2 p-2 md:p-3 text-right text-base md:text-xl" style={{ borderColor: PRIMARY_RED }}>
                {data.total.toFixed(2)}
              </td>
              <td className="border-2 p-2 md:p-3 text-center" style={{ borderColor: PRIMARY_RED }}>00</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 flex items-end gap-3 text-sm md:text-xl font-medium" style={{ color: PRIMARY_RED }}>
          <span className="whitespace-nowrap">અંકે રૂપિયા :</span>
          <input 
            className="flex-1 border-b border-dotted border-gray-400 bg-transparent outline-none text-black px-1 font-bold text-xs md:text-base"
            value={data.words}
            onChange={(e) => onUpdateField('words', e.target.value)}
          />
        </div>

        {/* Seal / Stamp - REMOVED no-print so it prints on the paper */}
        <div className="absolute bottom-12 right-32 md:right-48 w-32 h-32 md:w-40 md:h-40 opacity-70 rotate-[-12deg] pointer-events-none select-none">
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

        <footer className="mt-12 flex justify-between items-end">
          <div className="border-2 p-2 md:p-3 w-56 md:w-72 text-xs md:text-sm space-y-2 rounded-sm" style={{ borderColor: PRIMARY_RED, color: PRIMARY_RED }}>
            <b className="block mb-1 underline">ચેકની વિગત:</b>
            <textarea 
              className="w-full bg-transparent border-none outline-none resize-none h-12 md:h-16 placeholder:text-red-200"
              placeholder="તારીખ: ______________&#10;બેંક: ________________"
              value={data.checkDetails}
              onChange={(e) => onUpdateField('checkDetails', e.target.value)}
            ></textarea>
          </div>
          <div className="text-center font-bold text-sm md:text-base" style={{ color: PRIMARY_RED }}>
            <div className="w-32 md:w-48 border-b-2 mb-2" style={{ borderColor: PRIMARY_RED }}></div>
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
  );
};

export default ReceiptCard;
