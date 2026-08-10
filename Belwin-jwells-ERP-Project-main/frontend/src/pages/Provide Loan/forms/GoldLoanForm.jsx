import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Save, XCircle, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';

const GoldLoanForm = ({ 
  customerData, 
  schemeData, 
  searchQuery, 
  setSearchQuery, 
  handleSearch 
}) => {
  const navigate = useNavigate();

  // --- Form State ---
  const [loanDetails, setLoanDetails] = useState({
    loanStartDate: new Date().toISOString().split('T')[0],
    loanEndDate: new Date().toISOString().split('T')[0],
    eligibleLoanAmount: 0,
    loanAmount: '',
    remainingLoanAmount: '',
    status: 'Pending'
  });

  const [calculations, setCalculations] = useState({
    totalNoOfDays: 0,
    interestRate: '',
    additionalInterestRate: '',
    totalPaidInterestAmount: '',
    totalInterestPaidDays: '',
    remainingDays: 0,
    remainingInterestAmount: 0,
    documentCharge: '',
    fullSettlementAmount: 0
  });

  const [receiptEntry, setReceiptEntry] = useState({
    enterDays: '',
    receiptDate: new Date().toISOString().split('T')[0],
    receiptAmount: '',
    penalty: false
  });

  // Example empty row for Articles
  const emptyArticle = {
    category: '', jewelDetails: '', quantity: '', totWeight: '', 
    stoneWt: '', nettWt: '', purity: '', gramRate: '', total: ''
  };
  const [articles, setArticles] = useState([ { ...emptyArticle } ]);
  
  // Payments state
  const [payments, setPayments] = useState([]);

  // Input Class Names
  const inp = "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-erp-green bg-white text-sm";
  const lbl = "text-sm font-medium text-gray-700 whitespace-nowrap min-w-[180px]";

  // --- Handlers ---
  const handleLoanChange = (field, val) => setLoanDetails(prev => ({ ...prev, [field]: val }));
  const handleCalcChange = (field, val) => setCalculations(prev => ({ ...prev, [field]: val }));
  const handleReceiptChange = (field, val) => setReceiptEntry(prev => ({ ...prev, [field]: val }));
  
  const handleArticleChange = (index, field, value) => {
    const updated = [...articles];
    let row = { ...updated[index], [field]: value };
    
    // Auto-calculate Net Weight and Total
    const totWt = parseFloat(row.totWeight) || 0;
    const stoneWt = parseFloat(row.stoneWt) || 0;
    const net = Math.max(0, totWt - stoneWt);
    row.nettWt = net > 0 ? net.toFixed(2) : '';

    const nettWt = parseFloat(row.nettWt) || 0;
    const gramRate = parseFloat(row.gramRate) || 0;
    const tot = nettWt * gramRate;
    row.total = tot > 0 ? tot.toFixed(2) : '';

    updated[index] = row;
    setArticles(updated);
  };

  const aggregateTotalWt = articles.reduce((sum, a) => sum + (parseFloat(a.totWeight) || 0), 0);


  const addArticleRow = () => setArticles([...articles, { ...emptyArticle }]);

  const handleAddReceipt = () => {
    if (!receiptEntry.receiptAmount) {
      toast.error("Please enter a receipt amount.");
      return;
    }
    
    const newPayment = {
      receiptNo: 'REC-' + (payments.length + 1).toString().padStart(4, '0'),
      paidDate: receiptEntry.receiptDate,
      amount: receiptEntry.receiptAmount,
      interestAmount: 0, // Placeholder
      principalAmount: receiptEntry.receiptAmount,
      penalty: receiptEntry.penalty ? 'Yes' : 'No',
      penaltyPending: 0
    };
    
    setPayments([...payments, newPayment]);
    
    // Clear receipt entry
    setReceiptEntry({
      ...receiptEntry,
      receiptAmount: '',
      enterDays: '',
      penalty: false
    });
    toast.success("Receipt added to Payment Details table!");
  };

  const handleSave = async (close = false, repledge = false) => {
    try {
      if (!customerData || !customerData.customerId) {
        toast.error("Please select a customer first.");
        return;
      }

      const payload = {
        customerId: customerData.customerId,
        name: customerData.name,
        mobileNo: customerData.mobile,
        fatherHusbandName: customerData.fatherName,
        address: customerData.address,
        loanStartDate: loanDetails.loanStartDate,
        loanEndDate: loanDetails.loanEndDate,
        loanAmount: Number(loanDetails.loanAmount) || 0,
        remainingLoanAmount: Number(loanDetails.remainingLoanAmount) || 0,
        status: loanDetails.status,
        
        totalNoOfDays: Number(calculations.totalNoOfDays) || 0,
        interestRate: Number(calculations.interestRate) || 0,
        additionalInterestRate: Number(calculations.additionalInterestRate) || 0,
        totalPaidInterestAmount: Number(calculations.totalPaidInterestAmount) || 0,
        totalInterestPaidDays: Number(calculations.totalInterestPaidDays) || 0,
        remainingDays: Number(calculations.remainingDays) || 0,
        remainingInterestAmount: Number(calculations.remainingInterestAmount) || 0,
        documentCharge: Number(calculations.documentCharge) || 0,
        fullSettlementAmount: Number(calculations.fullSettlementAmount) || 0,
        
        receiptEntry: {
          ...receiptEntry,
          enterDays: Number(receiptEntry.enterDays) || 0,
          receiptAmount: Number(receiptEntry.receiptAmount) || 0
        },
        
        articles: articles.filter(a => a.category).map(a => ({
          category: a.category,
          details: a.jewelDetails,
          qty: Number(a.quantity) || 0,
          totWt: Number(a.totWeight) || 0,
          stoneWt: Number(a.stoneWt) || 0,
          nettWt: Number(a.nettWt) || 0,
          purity: a.purity,
          gramRate: Number(a.gramRate) || 0,
          total: Number(a.total) || 0
        })),
        payments,
        loanType: 'Gold Loan',
        loanDate: new Date()
      };

      const res = await api.post('/loans', payload);
      toast.success("Gold Loan details saved successfully!");
      
      if (close) {
         // Reset or redirect
         toast.success("Closing form...");
      }
      if (repledge) {
         navigate('/admin/repledge/entry');
      }

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save loan.");
    }
  };

  return (
    <div className="flex flex-col bg-gray-50/30 p-2 space-y-6 max-w-7xl mx-auto w-full pb-20">
      {/* Header Area */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">Provide Loan</h1>
          <p className="text-gray-500 text-sm">Manage Receipts and Repledging.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-black text-white px-4 py-1.5 text-sm font-semibold rounded-sm">New Receipt</button>
          <button onClick={() => navigate('/admin/repledge/entry')} className="bg-white border border-gray-300 text-black px-4 py-1.5 text-sm font-semibold rounded-sm hover:bg-gray-50">Repledge</button>
        </div>
      </div>

      {/* Top Search Bar */}
      <div className="flex items-center gap-2 max-w-md p-3 border border-gray-100 rounded-sm bg-gray-50 shadow-sm">
        <label className="text-sm font-bold text-gray-700 whitespace-nowrap">Customer ID Search :</label>
        <div className="flex flex-1 items-center">
          <input 
            type="text" 
            placeholder="Enter Customer ID (e.g. CUST000001)" 
            className="flex-1 px-3 py-1.5 border border-gray-300 text-sm focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            className="bg-black text-white px-3 py-1.5 text-sm flex items-center gap-1"
          >
            <Search size={16}/> Search
          </button>
        </div>
      </div>

      {/* Info & Loan Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        {/* Left Column - Customer Details */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label className={lbl}>Name :</label>
            <input type="text" className={inp} value={customerData.name || ''} readOnly />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Mobile No :</label>
            <input type="text" className={inp} value={customerData.mobile || ''} readOnly />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Father/Husband Name :</label>
            <input type="text" className={inp} value={customerData.fatherName || ''} readOnly />
          </div>
          <div className="flex items-start">
            <label className={lbl}>Address :</label>
            <textarea className={`${inp} resize-none`} rows="2" value={customerData.address || ''} readOnly />
          </div>
        </div>

        {/* Right Column - Loan Details */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label className={lbl}>Loan Start Date :</label>
            <input type="date" className={inp} value={loanDetails.loanStartDate} onChange={(e) => handleLoanChange('loanStartDate', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Loan End Date :</label>
            <input type="date" className={inp} value={loanDetails.loanEndDate} onChange={(e) => handleLoanChange('loanEndDate', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Eligible Loan Amount :</label>
            <input type="number" className={`${inp} font-bold`} value={loanDetails.eligibleLoanAmount} onChange={(e) => handleLoanChange('eligibleLoanAmount', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Loan Amount :</label>
            <input type="number" className={inp} value={loanDetails.loanAmount} onChange={(e) => handleLoanChange('loanAmount', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Remaining Loan Amount :</label>
            <input type="number" className={inp} value={loanDetails.remainingLoanAmount} onChange={(e) => handleLoanChange('remainingLoanAmount', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Status :</label>
            <select className={inp} value={loanDetails.status} onChange={(e) => handleLoanChange('status', e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Calculations & Receipts Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        {/* Left Column - Calculations */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label className={lbl}>Total No.of Days :</label>
            <input type="number" className={inp} value={calculations.totalNoOfDays} onChange={(e) => handleCalcChange('totalNoOfDays', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Interest Rate % :</label>
            <div className="flex flex-1 items-center gap-2">
              <input type="number" className={inp} value={calculations.interestRate} onChange={(e) => handleCalcChange('interestRate', e.target.value)} />
              <label className="text-sm font-bold whitespace-nowrap">Add. % :</label>
              <input type="number" className={`${inp} w-20`} value={calculations.additionalInterestRate} onChange={(e) => handleCalcChange('additionalInterestRate', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center">
            <label className={lbl}>Total Paid Interest Amount :</label>
            <input type="number" className={inp} value={calculations.totalPaidInterestAmount} onChange={(e) => handleCalcChange('totalPaidInterestAmount', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Total Interest Paid Days :</label>
            <input type="number" className={inp} value={calculations.totalInterestPaidDays} onChange={(e) => handleCalcChange('totalInterestPaidDays', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Remaining Days :</label>
            <input type="number" className={inp} value={calculations.remainingDays} onChange={(e) => handleCalcChange('remainingDays', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Remaining Interest Amount :</label>
            <input type="number" className={`${inp} font-bold`} value={calculations.remainingInterestAmount} onChange={(e) => handleCalcChange('remainingInterestAmount', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Document Charge :</label>
            <input type="number" className={inp} value={calculations.documentCharge} onChange={(e) => handleCalcChange('documentCharge', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={lbl}>Full Settlement Amount Rs :</label>
            <input type="number" className={`${inp} font-bold`} value={calculations.fullSettlementAmount} onChange={(e) => handleCalcChange('fullSettlementAmount', e.target.value)} />
          </div>
        </div>

        {/* Right Column - Receipts & Buttons */}
        <div className="flex flex-col justify-between h-full">
          <div className="bg-green-50/30 border border-green-100 p-6 rounded-sm shadow-sm space-y-4 max-w-sm">
            <div className="flex items-center">
              <label className="text-sm text-gray-700 w-32">Enter Days :</label>
              <input type="number" className={inp} value={receiptEntry.enterDays} onChange={(e) => handleReceiptChange('enterDays', e.target.value)} />
            </div>
            <div className="flex items-center">
              <label className="text-sm text-gray-700 w-32">Receipt Date :</label>
              <input type="date" className={inp} value={receiptEntry.receiptDate} onChange={(e) => handleReceiptChange('receiptDate', e.target.value)} />
            </div>
            <div className="flex items-center">
              <label className="text-sm text-gray-700 w-32">Receipt Amount :</label>
              <input type="number" className={inp} value={receiptEntry.receiptAmount} onChange={(e) => handleReceiptChange('receiptAmount', e.target.value)} />
            </div>
            <div className="flex items-center pl-32">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={receiptEntry.penalty} onChange={(e) => handleReceiptChange('penalty', e.target.checked)} className="w-4 h-4 border-gray-300 rounded-sm focus:ring-black" />
                Penalty
              </label>
            </div>
            <div className="flex items-center pl-32 mt-2">
              <button onClick={handleAddReceipt} className="bg-black text-white px-4 py-1.5 text-sm font-bold rounded-sm w-full">Add Receipt</button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <button onClick={() => handleSave(false, false)} className="bg-[#8b0000] text-white px-6 py-2 text-sm font-bold rounded-sm">Save</button>
            <button className="bg-[#8b0000] text-white px-6 py-2 text-sm font-bold rounded-sm">Cancel</button>
            <button onClick={() => handleSave(true, false)} className="bg-[#8b0000] text-white px-6 py-2 text-sm font-bold rounded-sm">Save & Close</button>
            <button onClick={() => handleSave(true, true)} className="bg-[#8b0000] text-white px-6 py-2 text-sm font-bold rounded-sm">Close & Repledge</button>
          </div>
        </div>
      </div>

      {/* Tables Area */}
      <div className="space-y-8 mt-4">
        
        {/* Article Details Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-black">Article Details :</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Total Wt:</span>
              <input type="text" value={aggregateTotalWt > 0 ? aggregateTotalWt.toFixed(2) : ''} className="w-20 px-2 py-1 border border-gray-300 text-sm text-right bg-white font-bold" placeholder="gms" disabled />
            </div>
          </div>
          <div className="overflow-x-auto border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-black text-white text-xs">
                <tr>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Category</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Jewel Details</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Quantity</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Tot.Weight</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Stone Wt</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Nett.Wt</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Purity</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Gram Rate</th>
                  <th className="px-3 py-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((art, idx) => (
                  <tr key={idx} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-0 border-r border-gray-200"><input className="w-full h-full px-2 py-1.5 focus:outline-none" value={art.category} onChange={e => handleArticleChange(idx, 'category', e.target.value)} /></td>
                    <td className="p-0 border-r border-gray-200"><input className="w-full h-full px-2 py-1.5 focus:outline-none" value={art.jewelDetails} onChange={e => handleArticleChange(idx, 'jewelDetails', e.target.value)} /></td>
                    <td className="p-0 border-r border-gray-200"><input type="number" className="w-full h-full px-2 py-1.5 focus:outline-none text-center" value={art.quantity} onChange={e => handleArticleChange(idx, 'quantity', e.target.value)} /></td>
                    <td className="p-0 border-r border-gray-200"><input type="number" className="w-full h-full px-2 py-1.5 focus:outline-none text-center" value={art.totWeight} onChange={e => handleArticleChange(idx, 'totWeight', e.target.value)} /></td>
                    <td className="p-0 border-r border-gray-200"><input type="number" className="w-full h-full px-2 py-1.5 focus:outline-none text-center" value={art.stoneWt} onChange={e => handleArticleChange(idx, 'stoneWt', e.target.value)} /></td>
                    <td className="p-0 border-r border-gray-200"><input type="number" className="w-full h-full px-2 py-1.5 focus:outline-none text-center" value={art.nettWt} onChange={e => handleArticleChange(idx, 'nettWt', e.target.value)} /></td>
                    <td className="p-0 border-r border-gray-200"><input className="w-full h-full px-2 py-1.5 focus:outline-none text-center" value={art.purity} onChange={e => handleArticleChange(idx, 'purity', e.target.value)} /></td>
                    <td className="p-0 border-r border-gray-200"><input type="number" className="w-full h-full px-2 py-1.5 focus:outline-none text-center" value={art.gramRate} onChange={e => handleArticleChange(idx, 'gramRate', e.target.value)} /></td>
                    <td className="p-0"><input type="number" className="w-full h-full px-2 py-1.5 focus:outline-none text-center" value={art.total} onChange={e => handleArticleChange(idx, 'total', e.target.value)} onBlur={(e) => { if (e.target.value && idx === articles.length - 1) addArticleRow(); }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Details Table */}
        <div>
          <h3 className="font-bold text-sm text-black mb-2">Payment Details :</h3>
          <div className="overflow-x-auto border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-black text-white text-xs">
                <tr>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Receipt No</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Paid Date</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Amount</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Interest Amount</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">Principal Amount</th>
                  <th className="px-3 py-2 border-r border-gray-700 text-center">penalty</th>
                  <th className="px-3 py-2 text-center">penalty pending</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                   // Render empty row placeholders if no payments exist
                   <>
                     <tr className="bg-white border-b border-gray-200 h-8">
                       <td className="border-r border-gray-200"></td>
                       <td className="border-r border-gray-200 px-2 text-gray-400 text-center text-xs">dd-mm-yyyy</td>
                       <td className="border-r border-gray-200"></td><td className="border-r border-gray-200"></td><td className="border-r border-gray-200"></td><td className="border-r border-gray-200"></td><td></td>
                     </tr>
                     <tr className="bg-white border-b border-gray-200 h-8">
                       <td className="border-r border-gray-200"></td>
                       <td className="border-r border-gray-200 px-2 text-gray-400 text-center text-xs">dd-mm-yyyy</td>
                       <td className="border-r border-gray-200"></td><td className="border-r border-gray-200"></td><td className="border-r border-gray-200"></td><td className="border-r border-gray-200"></td><td></td>
                     </tr>
                   </>
                ) : (
                  payments.map((p, idx) => (
                    <tr key={idx} className="bg-white border-b border-gray-200">
                      <td className="p-2 border-r border-gray-200 text-center">{p.receiptNo}</td>
                      <td className="p-2 border-r border-gray-200 text-center">{new Date(p.paidDate).toLocaleDateString()}</td>
                      <td className="p-2 border-r border-gray-200 text-center">{p.amount}</td>
                      <td className="p-2 border-r border-gray-200 text-center">{p.interestAmount}</td>
                      <td className="p-2 border-r border-gray-200 text-center">{p.principalAmount}</td>
                      <td className="p-2 border-r border-gray-200 text-center">{p.penalty}</td>
                      <td className="p-2 text-center">{p.penaltyPending}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GoldLoanForm;
