const fs = require('fs');
const path = require('path');

const filePath = path.join('c:/Users/ADMIN/Desktop/Belwin-jwells-ERP-Project-main/Belwin-jwells-ERP-Project-main/frontend/src/pages/admin/reports/LoanAccountLedger.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace imports
content = content.replace(
  import { \n  Printer, FileText, FileSpreadsheet, RefreshCcw, Search, RotateCcw, \n  IndianRupee, Scale, History, FileCheck, Landmark, CheckCircle, \n  Eye, Download, BadgeCheck\n} from 'lucide-react';,
  import { \n  Printer, FileText, FileSpreadsheet, RefreshCcw, Search, RotateCcw, \n  IndianRupee, Scale, History, FileCheck, Landmark, CheckCircle, \n  Eye, Download, BadgeCheck, Loader\n} from 'lucide-react';\nimport api from '../../../services/api';
);

// Replace state and mockData
const stateStart =   const [activeTab, setActiveTab] = useState('overview');\n  const [loanType, setLoanType] = useState('Gold Loan'); // Switch this to test\n\n  // MOCK DATA as requested (No Backend);
const tabsEnd =     { id: 'loan_closing', label: 'Loan Closing' }\n  ];;

const newStateAndData =   const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.get(\/search/loan/\\);
      if (response.data.success && response.data.results.length > 0) {
        setLoanData(response.data.results[0]);
      } else {
        setLoanData(null);
        setError('No loan found');
      }
    } catch (err) {
      console.error(err);
      setError('Error searching loan');
      setLoanData(null);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setSearchQuery('');
    setLoanData(null);
    setError('');
  };

  const loan = loanData?.loan || {};
  const customer = loanData?.customer || {};
  const branchName = loanData?.branch?.branchName || 'Main Branch';
  const schemeName = loanData?.scheme?.schemeName || loan.schemeName || 'Gold Loan';
  const isGoldLoan = schemeName.toLowerCase().includes('gold');

  const displayData = loanData ? {
    loanNumber: loan.loanId || '-',
    loanAccountNo: loan.loanId || '-',
    borrowerId: customer.customerId || '-',
    borrowerName: customer.customerName || loan.name || '-',
    mobileNumber: customer.mobileNumber || loan.mobileNo || '-',
    branch: branchName,
    loanScheme: schemeName,
    loanType: schemeName,
    loanStatus: loan.status || 'Active',
    applicationDate: loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : '-',
    disbursementDate: loan.loanStartDate ? new Date(loan.loanStartDate).toLocaleDateString() : '-',
    approvedAmount: loan.loanAmount || 0,
    interestRate: loan.interestPercent || loan.interestRate || 0,
    loanTenure: loan.maturePeriod || 0,
    
    totalCollection: loan.payments?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0,
    principalPaid: loan.payments?.reduce((acc, p) => acc + (p.principalAmount || 0), 0) || 0,
    interestPaid: loan.payments?.reduce((acc, p) => acc + (p.interestAmount || 0), 0) || 0,
    penaltyCollected: loan.payments?.reduce((acc, p) => acc + (p.penalty || 0), 0) || 0,
    outstandingPrincipal: loan.remainingLoanAmount || loan.loanAmount || 0,
    outstandingInterest: loan.remainingInterestAmount || 0,
    outstandingBalance: (loan.remainingLoanAmount || 0) + (loan.remainingInterestAmount || 0),
    
    goldValue: loan.articles?.reduce((acc, item) => acc + (item.total || 0), 0) || 0
  } : null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    ...(isGoldLoan ? [{ id: 'gold_details', label: 'Gold Details' }] : []),
    ...(!isGoldLoan ? [{ id: 'emi_details', label: 'EMI Details' }] : []),
    { id: 'transaction_history', label: 'Transaction History' },
    { id: 'collection_summary', label: 'Collection Summary' },
    { id: 'documents', label: 'Documents' },
    { id: 'approval_history', label: 'Approval History' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'loan_closing', label: 'Loan Closing' }
  ];;

let startIndex = content.indexOf(\  const [activeTab, setActiveTab] = useState('overview');\);
let endIndex = content.indexOf(\  ];\, content.indexOf(\{ id: 'loan_closing', label: 'Loan Closing' }\)) + 4;
content = content.substring(0, startIndex) + newStateAndData + content.substring(endIndex);

// Replace mockData with displayData
content = content.replace(/mockData/g, 'displayData');
// Replace loanType with displayData.loanType
content = content.replace(/loanType === 'Gold Loan'/g, 'isGoldLoan');
content = content.replace(/loanType !== 'Gold Loan'/g, '!isGoldLoan');

// Update header and search section
const searchSectionStart = \      <div className="ledger-header">\;
const summaryGridStart = \      {/* SUMMARY CARDS */}\;
const newSearchSection = \      <div className="ledger-header">
        <div className="header-title-section">
          <h1>Loan Account Ledger</h1>
          {displayData && (
            <div className="header-subtitle">
              <span>{displayData.loanNumber}</span>
              <span>•</span>
              <span>{displayData.borrowerName}</span>
              <span>•</span>
              <span>{displayData.loanType}</span>
              <span>•</span>
              <span>{displayData.branch}</span>
              <span className="status-badge">{displayData.loanStatus}</span>
            </div>
          )}
        </div>
        <div className="header-actions">
          <button className="btn"><Printer size={16} /> Print</button>
          <button className="btn"><FileText size={16} /> Export PDF</button>
          <button className="btn"><FileSpreadsheet size={16} /> Export Excel</button>
          <button className="btn btn-primary" onClick={handleSearch}><RefreshCcw size={16} /> Refresh</button>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="card">
        <div className="filter-grid">
          <div className="filter-group">
            <label>Search by Loan Number or Name</label>
            <input 
              type="text" 
              placeholder="Enter Loan No or Name" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
        {error && <div style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
            {loading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />} Search
          </button>
          <button className="btn" onClick={handleReset}><RotateCcw size={16} /> Reset</button>
        </div>
      </div>

      {displayData ? (
        <>
      {/* SUMMARY CARDS */}\;

let headerIndex = content.indexOf(\      <div className="ledger-header">\);
let summaryIndex = content.indexOf(\      {/* SUMMARY CARDS */}\);
content = content.substring(0, headerIndex) + newSearchSection + content.substring(summaryIndex + \      {/* SUMMARY CARDS */}\.length);

// Also need to close the \{displayData ? ( <> ... </> ) : null}\ at the end
const endDiv = \    </div>\n  );\n};\;
content = content.replace(\    </div>\n  );\n};\, \        </>\n      ) : (\n        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>\n          Please search for a loan number or borrower name to view ledger details.\n        </div>\n      )}\n    </div>\n  );\n};\);

fs.writeFileSync(filePath, content);
console.log('Update complete');
