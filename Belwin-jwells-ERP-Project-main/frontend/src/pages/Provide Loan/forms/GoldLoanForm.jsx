import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCcw, Camera, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../services/api';

const GoldLoanForm = ({ customerData, schemeData, selectedLoan }) => {
  const [loanInfo, setLoanInfo] = useState({
    loanNumber: 'GL-' + Math.floor(100000 + Math.random() * 900000), // Mock Auto Generate
    loanDate: new Date().toISOString().split('T')[0],
    branch: '',
    loanScheme: '',
    loanType: 'EMI',
    loanOfficer: '',
    status: 'Pending'
  });

  const [goldDetails, setGoldDetails] = useState({
    ornamentType: 'Ring',
    ornamentName: '',
    numberOfItems: 1,
    ornamentImage: null,
    grossWeight: '',
    stoneWeight: '',
    netWeight: 0,
    purity: '916',
    hallmark: 'Yes',
    goldRatePerGram: '',
    totalGoldValue: 0
  });

  const [isOrnamentTypeOpen, setIsOrnamentTypeOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const ornamentOptions = [
    'Ring', 'Chain', 'Necklace', 'Bangle', 'Bracelet', 'Kada', 
    'Earring', 'Stud', 'Jhumka', 'Pendant', 'Locket', 'Haram', 
    'Choker', 'Thali Chain', 'Thali', 'Vanki / Armlet', 
    'Oddiyanam', 'Anklet', 'Nose Ring', 'Gold Coin', 'Gold Bar / Biscuit'
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOrnamentTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto calculate net weight and total value
  useEffect(() => {
    const gross = parseFloat(goldDetails.grossWeight) || 0;
    const stone = parseFloat(goldDetails.stoneWeight) || 0;
    const rate = parseFloat(goldDetails.goldRatePerGram) || 0;
    
    const net = Math.max(0, gross - stone);
    const totalValue = net * rate;

    setGoldDetails(prev => ({
      ...prev,
      netWeight: parseFloat(net.toFixed(2)),
      totalGoldValue: parseFloat(totalValue.toFixed(2))
    }));
  }, [goldDetails.grossWeight, goldDetails.stoneWeight, goldDetails.goldRatePerGram]);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      let stream;
      try {
        // Try to access rear camera first (for mobile phones)
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } });
      } catch (e) {
        // Fallback to any available camera (for laptops/PCs)
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera. Please connect a camera or allow permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      handleGoldDetailsChange('ornamentImage', imageDataUrl);
      stopCamera();
    }
  };

  // Populate form if selectedLoan is passed (for Edit Loan)
  useEffect(() => {
    if (selectedLoan) {
      setLoanInfo(prev => ({
        ...prev,
        loanNumber: selectedLoan.loanId || prev.loanNumber,
        loanDate: selectedLoan.loanDate ? new Date(selectedLoan.loanDate).toISOString().split('T')[0] : prev.loanDate,
        loanOfficer: selectedLoan.employeeName || prev.loanOfficer,
        branch: selectedLoan.branch || prev.branch,
        closeDate: selectedLoan.closeDate ? new Date(selectedLoan.closeDate).toISOString().split('T')[0] : prev.closeDate,
        loanScheme: selectedLoan.schemeName || schemeData?.schemeName || prev.loanScheme,
        status: selectedLoan.status || prev.status,
        loanType: selectedLoan.loanType || prev.loanType
      }));

      if (selectedLoan.articles && selectedLoan.articles.length > 0) {
        const art = selectedLoan.articles[0];
        setGoldDetails(prev => ({
          ...prev,
          ornamentType: art.category || 'Ring',
          ornamentName: art.details || '',
          numberOfItems: art.qty || 1,
          grossWeight: art.totWt || '',
          stoneWeight: art.stoneWt || '',
          netWeight: art.nettWt || 0,
          purity: art.purity || '916',
          goldRatePerGram: art.gramRate || '',
          totalGoldValue: art.total || 0
        }));
      }
    } else if (schemeData) {
      setLoanInfo(prev => ({ ...prev, loanScheme: schemeData.schemeName || prev.loanScheme }));
    }
  }, [selectedLoan, schemeData]);

  // Auto-calculate Close Date based on Open Date (Default +1 year)
  useEffect(() => {
    if (loanInfo.loanDate) {
      const matureMonths = schemeData?.maturePeriodMonths 
        ? parseInt(schemeData.maturePeriodMonths, 10) 
        : 12; // Default to 1 year

      if (!isNaN(matureMonths) && matureMonths > 0) {
        const openDate = new Date(loanInfo.loanDate);
        openDate.setMonth(openDate.getMonth() + matureMonths);
        const calculatedCloseDate = openDate.toISOString().split('T')[0];
        
        setLoanInfo(prev => ({
          ...prev,
          closeDate: calculatedCloseDate
        }));
      }
    }
  }, [loanInfo.loanDate, schemeData?.maturePeriodMonths]);

  const handleLoanInfoChange = (field, value) => {
    setLoanInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleGoldDetailsChange = (field, value) => {
    setGoldDetails(prev => ({ ...prev, [field]: value }));
  };

  const inp = "w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-erp-green bg-white";
  const lbl = "block text-sm font-medium text-gray-700 mb-1";

  const handleSubmit = async () => {
    if (!customerData || !customerData.customerId) {
      toast.error("Please search and select a customer first.");
      return;
    }

    if (customerData.status !== 'Approved' && customerData.approvalStatus !== 'Approved') {
      toast.error("Customer KYC is not approved yet. Cannot provide loan.");
      return;
    }

    try {
      const payload = {
        customerId: customerData.customerId,
        name: customerData.name,
        mobileNo: customerData.mobile,
        fatherHusbandName: customerData.fatherName,
        address: customerData.address,

        loanDate: loanInfo.loanDate,
        loanStartDate: loanInfo.loanDate,
        status: loanInfo.status,
        loanAmount: goldDetails.totalGoldValue,

        articles: [{
          category: goldDetails.ornamentType,
          details: goldDetails.ornamentName,
          qty: goldDetails.numberOfItems,
          totWt: goldDetails.grossWeight,
          stoneWt: goldDetails.stoneWeight,
          nettWt: goldDetails.netWeight,
          purity: goldDetails.purity,
          gramRate: goldDetails.goldRatePerGram,
          total: goldDetails.totalGoldValue
        }],
        totalWt: goldDetails.grossWeight,
        
        schemeId: schemeData?.schemeId || null,
        schemeName: schemeData?.schemeName || loanInfo.loanScheme,
        interestPercent: schemeData?.interestPercent ? schemeData.interestPercent.replace('%','') : 0,
        gramRate: schemeData?.gramRate || goldDetails.goldRatePerGram,
        minimumGram: schemeData?.minimumGram || 0,
        documentCharge: schemeData?.documentCharges || 0,
        
        branch: loanInfo.branch,
        employeeName: loanInfo.loanOfficer,
        loanType: loanInfo.loanType
      };

      const response = await api.post('/loans', payload);
      
      if (response.status === 201) {
        toast.success("Loan created successfully!");
        setLoanInfo({
          ...loanInfo,
          loanNumber: 'GL-' + Math.floor(100000 + Math.random() * 900000)
        });
        setGoldDetails({
          ornamentType: 'Ring', ornamentName: '', numberOfItems: 1, ornamentImage: null,
          grossWeight: '', stoneWeight: '', netWeight: 0,
          purity: '916', hallmark: 'Yes', goldRatePerGram: '', totalGoldValue: 0
        });
      }
    } catch (error) {
      console.error("Error creating loan:", error);
      toast.error(error.response?.data?.message || "Failed to submit loan");
    }
  };

  return (
    <div className="w-full">
      {/* Loan Information */}
      <div className="bg-white border border-gray-100 rounded-none shadow-sm flex flex-col mb-8 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Loan Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className={lbl}>Loan Number</label>
            <input type="text" className={`${inp} bg-gray-50`} value={loanInfo.loanNumber} readOnly />
          </div>
          <div>
            <label className={lbl}>Open Date <span className="text-red-500">*</span></label>
            <input type="date" className={inp} value={loanInfo.loanDate} onChange={(e) => handleLoanInfoChange('loanDate', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Close Date</label>
            <input type="date" className={inp} value={loanInfo.closeDate || ''} onChange={(e) => handleLoanInfoChange('closeDate', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Branch</label>
            <select className={inp} value={loanInfo.branch || ''} onChange={(e) => handleLoanInfoChange('branch', e.target.value)}>
              <option value="">Select Branch</option>
              <option value="TRICHY">TRICHY</option>
              <option value="PUDUKKOTTAI">PUDUKKOTTAI</option>
              <option value="THANJAVUR">THANJAVUR</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Loan Scheme</label>
            <input type="text" className={inp} value={loanInfo.loanScheme || ''} onChange={(e) => handleLoanInfoChange('loanScheme', e.target.value)} placeholder="Enter Loan Scheme" />
          </div>
          <div>
            <label className={lbl}>Loan Type</label>
            <select className={inp} value={loanInfo.loanType || 'EMI'} onChange={(e) => handleLoanInfoChange('loanType', e.target.value)}>
              <option value="EMI">EMI</option>
              <option value="Non EMI">Non EMI</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Loan Officer</label>
            <input type="text" className={inp} value={loanInfo.loanOfficer || ''} onChange={(e) => handleLoanInfoChange('loanOfficer', e.target.value)} placeholder="Officer Name" />
          </div>
        </div>
      </div>

      {/* Gold Details */}
      <div className="bg-white border border-gray-100 rounded-none shadow-sm flex flex-col mb-8 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Gold Ornament Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div ref={dropdownRef} className="relative">
            <label className={lbl}>Ornament Type</label>
            <div 
              className={`${inp} cursor-pointer flex justify-between items-center`}
              onClick={() => setIsOrnamentTypeOpen(!isOrnamentTypeOpen)}
            >
              <span>{goldDetails.ornamentType || 'Select Type'}</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            
            {isOrnamentTypeOpen && (
              <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-300 rounded-none shadow-lg max-h-60 overflow-y-auto top-full left-0">
                {ornamentOptions.map(opt => (
                  <div 
                    key={opt}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => { 
                      handleGoldDetailsChange('ornamentType', opt); 
                      setIsOrnamentTypeOpen(false); 
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className={lbl}>Ornament Name</label>
            <input type="text" className={inp} value={goldDetails.ornamentName} onChange={(e) => handleGoldDetailsChange('ornamentName', e.target.value)} placeholder="e.g. Gold Ring 22k" />
          </div>
          <div>
            <label className={lbl}>Number of Items</label>
            <input type="number" min="1" className={inp} value={goldDetails.numberOfItems} onChange={(e) => handleGoldDetailsChange('numberOfItems', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Ornament Image</label>
            <div className="flex gap-2 items-center">
              <button 
                type="button"
                onClick={startCamera}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-none hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium w-full justify-center"
              >
                <Camera className="w-4 h-4" /> Open Camera
              </button>
              {goldDetails.ornamentImage && (
                <span className="text-xs font-bold text-green-600 flex-shrink-0">Captured ✓</span>
              )}
            </div>
          </div>
          <div>
            <label className={lbl}>Purity</label>
            <select className={inp} value={goldDetails.purity} onChange={(e) => handleGoldDetailsChange('purity', e.target.value)}>
              <option value="916">916</option>
              <option value="22">22</option>
              <option value="Locket">Locket</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Gross Weight (g)</label>
            <input type="number" step="0.01" className={inp} value={goldDetails.grossWeight} onChange={(e) => handleGoldDetailsChange('grossWeight', e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label className={lbl}>Stone/Dust Weight (g)</label>
            <input type="number" step="0.01" className={inp} value={goldDetails.stoneWeight} onChange={(e) => handleGoldDetailsChange('stoneWeight', e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label className={lbl}>Net Weight (g)</label>
            <input type="number" step="0.01" className={inp} value={goldDetails.netWeight} onChange={(e) => handleGoldDetailsChange('netWeight', e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label className={lbl}>Gold Rate per Gram (Rs)</label>
            <input type="number" step="0.01" className={inp} value={goldDetails.goldRatePerGram} onChange={(e) => handleGoldDetailsChange('goldRatePerGram', e.target.value)} placeholder="0.00" />
          </div>
          <div className="md:col-span-2">
            <label className={lbl}>Total Gold Value (Rs)</label>
            <input type="number" step="0.01" className={`${inp} text-xl font-bold text-erp-green-dark`} value={goldDetails.totalGoldValue} onChange={(e) => handleGoldDetailsChange('totalGoldValue', e.target.value)} placeholder="0" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 mb-8">
        <button className="px-6 py-2.5 bg-gray-200 text-gray-800 text-sm font-bold rounded-none shadow-sm hover:bg-gray-300 transition-all flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> Clear Form
        </button>
        <button onClick={handleSubmit} className="px-8 py-2.5 bg-black text-white text-sm font-bold rounded-none shadow-md hover:bg-gray-800 transition-all flex items-center gap-2">
          <Save className="w-4 h-4" /> Submit Loan
        </button>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[200] bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-white rounded-none overflow-hidden shadow-2xl max-w-lg w-full relative">
            <div className="p-4 bg-gray-900 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2"><Camera className="w-5 h-5"/> Capture Ornament</h3>
              <button onClick={stopCamera} className="hover:text-red-400 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative bg-black flex justify-center items-center h-72">
              <video ref={videoRef} autoPlay playsInline className="h-full w-full object-contain"></video>
              <canvas ref={canvasRef} className="hidden" width="640" height="480"></canvas>
            </div>
            <div className="p-5 bg-gray-100 flex justify-center border-t border-gray-200">
              <button 
                onClick={captureImage} 
                className="px-8 py-3 bg-green-600 text-white font-bold rounded-none shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <Camera className="w-5 h-5" /> Take Photo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GoldLoanForm;
