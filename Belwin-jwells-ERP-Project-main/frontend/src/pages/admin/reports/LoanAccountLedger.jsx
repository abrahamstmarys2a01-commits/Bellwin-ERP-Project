import React, { useState } from 'react';
import './LoanAccountLedger.css';
import { 
  Printer, FileText, FileSpreadsheet, RefreshCcw, Search, RotateCcw, 
  IndianRupee, Scale, History, FileCheck, Landmark, CheckCircle, 
  Eye, Download, BadgeCheck
} from 'lucide-react';

const LoanAccountLedger = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loanType, setLoanType] = useState('Gold Loan'); // Switch this to test

  // MOCK DATA as requested (No Backend)
  const mockData = {
    loanNumber: 'LN-GL-2026-08991',
    loanAccountNo: 'ACC-8991-GL',
    borrowerId: 'BOR-0002',
    borrowerName: 'Abraham',
    memberId: 'MEM-445',
    mobileNumber: '+91 9876543210',
    branch: 'Main Branch',
    loanScheme: 'Gold Premium Scheme',
    loanType: loanType,
    loanStatus: 'Active',
    applicationDate: '01 Aug 2026',
    approvalDate: '02 Aug 2026',
    disbursementDate: '03 Aug 2026',
    requestedAmount: 500000,
    approvedAmount: 480000,
    disbursedAmount: 475000,
    interestRate: 12.5,
    loanTenure: 12,
    maturityDate: '03 Aug 2027',
    
    // Summary
    totalCollection: 55000,
    principalPaid: 25000,
    interestPaid: 30000,
    penaltyCollected: 0,
    outstandingPrincipal: 455000,
    outstandingInterest: 5000,
    outstandingBalance: 460000,

    goldValue: 650000
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    ...(loanType === 'Gold Loan' ? [{ id: 'gold_details', label: 'Gold Details' }] : []),
    ...(loanType !== 'Gold Loan' ? [{ id: 'emi_details', label: 'EMI Details' }] : []),
    { id: 'transaction_history', label: 'Transaction History' },
    { id: 'collection_summary', label: 'Collection Summary' },
    { id: 'documents', label: 'Documents' },
    { id: 'approval_history', label: 'Approval History' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'loan_closing', label: 'Loan Closing' }
  ];

  return (
    <div className="ledger-container">
      {/* PAGE HEADER */}
      <div className="ledger-header">
        <div className="header-title-section">
          <h1>Loan Account Ledger</h1>
          <div className="header-subtitle">
            <span>{mockData.loanNumber}</span>
            <span>•</span>
            <span>{mockData.borrowerName}</span>
            <span>•</span>
            <span>{mockData.loanType}</span>
            <span>•</span>
            <span>{mockData.branch}</span>
            <span className="status-badge">{mockData.loanStatus}</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn"><Printer size={16} /> Print</button>
          <button className="btn"><FileText size={16} /> Export PDF</button>
          <button className="btn"><FileSpreadsheet size={16} /> Export Excel</button>
          <button className="btn btn-primary"><RefreshCcw size={16} /> Refresh</button>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="card">
        <div className="filter-grid">
          <div className="filter-group">
            <label>Loan Number</label>
            <input type="text" placeholder="Enter Loan No" defaultValue={mockData.loanNumber} />
          </div>
          <div className="filter-group">
            <label>Borrower Name</label>
            <input type="text" placeholder="Enter Name" />
          </div>
          <div className="filter-group">
            <label>Mobile Number</label>
            <input type="text" placeholder="Enter Mobile" />
          </div>
          <div className="filter-group">
            <label>Loan Type</label>
            <select value={loanType} onChange={(e) => setLoanType(e.target.value)}>
              <option value="Gold Loan">Gold Loan</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Vehicle Loan">Vehicle Loan</option>
              <option value="Business Loan">Business Loan</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Branch</label>
            <select><option>Main Branch</option></select>
          </div>
          <div className="filter-group">
            <label>Date Range</label>
            <input type="date" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button className="btn btn-primary"><Search size={16} /> Search</button>
          <button className="btn"><RotateCcw size={16} /> Reset</button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="summary-grid">
        <div className="card summary-card">
          <div className="summary-icon"><IndianRupee size={24} /></div>
          <div className="summary-content">
            <h3>Loan Amount</h3>
            <p>₹{mockData.approvedAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}><Scale size={24} /></div>
          <div className="summary-content">
            <h3>Outstanding Amount</h3>
            <p>₹{mockData.outstandingBalance.toLocaleString()}</p>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}><Landmark size={24} /></div>
          <div className="summary-content">
            <h3>Principal Paid</h3>
            <p>₹{mockData.principalPaid.toLocaleString()}</p>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#fefce8', color: '#ca8a04' }}><FileCheck size={24} /></div>
          <div className="summary-content">
            <h3>Interest Paid</h3>
            <p>₹{mockData.interestPaid.toLocaleString()}</p>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}><History size={24} /></div>
          <div className="summary-content">
            <h3>Total Collection</h3>
            <p>₹{mockData.totalCollection.toLocaleString()}</p>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}><CheckCircle size={24} /></div>
          <div className="summary-content">
            <h3>Loan Status</h3>
            <p style={{ fontSize: '18px' }}>{mockData.loanStatus}</p>
          </div>
        </div>
        {loanType === 'Gold Loan' && (
          <div className="card summary-card">
            <div className="summary-icon" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}><BadgeCheck size={24} /></div>
            <div className="summary-content">
              <h3>Gold Value</h3>
              <p>₹{mockData.goldValue.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* TAB LAYOUT */}
      <div className="tabs-container">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="card">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="detail-grid">
            {Object.entries(mockData).filter(([k]) => k !== 'loanType' && k !== 'goldValue').map(([key, value]) => (
              <div className="detail-item" key={key}>
                <div className="detail-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                <div className="detail-value">{value}</div>
              </div>
            ))}
          </div>
        )}

        {/* GOLD DETAILS TAB */}
        {activeTab === 'gold_details' && loanType === 'Gold Loan' && (
          <div className="table-wrapper">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Ornament Type</th>
                  <th>Ornament Name</th>
                  <th>Pieces</th>
                  <th>Purity</th>
                  <th>Gross Wt (g)</th>
                  <th>Stone Wt (g)</th>
                  <th>Net Wt (g)</th>
                  <th>Gold Rate</th>
                  <th>Gold Value</th>
                  <th>Locker No</th>
                  <th>Valuer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bangle</td>
                  <td>Gold Bangle 22K</td>
                  <td>2</td>
                  <td>22K</td>
                  <td>45.50</td>
                  <td>2.00</td>
                  <td>43.50</td>
                  <td>₹6,500</td>
                  <td>₹282,750</td>
                  <td>L-45</td>
                  <td>Mr. Smith</td>
                </tr>
                <tr>
                  <td>Chain</td>
                  <td>Thali Chain</td>
                  <td>1</td>
                  <td>22K</td>
                  <td>30.00</td>
                  <td>0.00</td>
                  <td>30.00</td>
                  <td>₹6,500</td>
                  <td>₹195,000</td>
                  <td>L-45</td>
                  <td>Mr. Smith</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* EMI DETAILS TAB */}
        {activeTab === 'emi_details' && loanType !== 'Gold Loan' && (
          <div className="table-wrapper">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>EMI No</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Penalty</th>
                  <th>EMI Amount</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>03 Sep 2026</td>
                  <td>02 Sep 2026</td>
                  <td>₹10,000</td>
                  <td>₹2,500</td>
                  <td>₹0</td>
                  <td>₹12,500</td>
                  <td>₹465,000</td>
                  <td><span className="status-badge">Paid</span></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>03 Oct 2026</td>
                  <td>-</td>
                  <td>₹10,000</td>
                  <td>₹2,400</td>
                  <td>₹0</td>
                  <td>₹12,400</td>
                  <td>₹455,000</td>
                  <td><span className="status-badge" style={{backgroundColor: '#fef3c7', color: '#b45309'}}>Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TRANSACTION HISTORY TAB */}
        {activeTab === 'transaction_history' && (
           <div className="table-wrapper">
             <table className="erp-table">
               <thead>
                 <tr>
                   <th>Date</th>
                   <th>Type</th>
                   <th>Debit</th>
                   <th>Credit</th>
                   <th>Balance</th>
                   <th>Mode</th>
                   <th>Receipt No</th>
                   <th>Employee</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>03 Aug 2026</td>
                   <td>Disbursement</td>
                   <td>₹475,000</td>
                   <td>-</td>
                   <td>₹475,000</td>
                   <td>Bank Transfer</td>
                   <td>DIS-001</td>
                   <td>Admin</td>
                 </tr>
                 <tr>
                   <td>02 Sep 2026</td>
                   <td>Repayment</td>
                   <td>-</td>
                   <td>₹12,500</td>
                   <td>₹462,500</td>
                   <td>Cash</td>
                   <td>REC-909</td>
                   <td>Cashier 1</td>
                 </tr>
               </tbody>
             </table>
           </div>
        )}

        {/* COLLECTION SUMMARY TAB */}
        {activeTab === 'collection_summary' && (
           <div className="detail-grid">
             <div className="detail-item"><div className="detail-label">Total Principal Paid</div><div className="detail-value">₹{mockData.principalPaid}</div></div>
             <div className="detail-item"><div className="detail-label">Total Interest Paid</div><div className="detail-value">₹{mockData.interestPaid}</div></div>
             <div className="detail-item"><div className="detail-label">Penalty Collected</div><div className="detail-value">₹{mockData.penaltyCollected}</div></div>
             <div className="detail-item"><div className="detail-label">Total Collection</div><div className="detail-value">₹{mockData.totalCollection}</div></div>
             <div className="detail-item"><div className="detail-label">Outstanding Principal</div><div className="detail-value">₹{mockData.outstandingPrincipal}</div></div>
             <div className="detail-item"><div className="detail-label">Outstanding Interest</div><div className="detail-value">₹{mockData.outstandingInterest}</div></div>
             <div className="detail-item"><div className="detail-label">Outstanding Balance</div><div className="detail-value">₹{mockData.outstandingBalance}</div></div>
           </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="document-grid">
            {['Aadhaar', 'PAN', 'Customer Photo', 'Signature', 'Address Proof'].map(doc => (
              <div className="doc-card" key={doc}>
                <div className="doc-icon"><FileText size={32} /></div>
                <div className="doc-title">{doc}</div>
                <div className="doc-status">Verified</div>
                <div className="doc-actions">
                  <button className="btn"><Eye size={14} /> View</button>
                  <button className="btn"><Download size={14} /> DL</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* APPROVAL HISTORY TAB */}
        {activeTab === 'approval_history' && (
          <div className="table-wrapper">
             <table className="erp-table">
               <thead>
                 <tr>
                   <th>Stage</th>
                   <th>Employee</th>
                   <th>Role</th>
                   <th>Date & Time</th>
                   <th>Status</th>
                   <th>Remarks</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>Employee Submitted</td>
                   <td>John Doe</td>
                   <td>Clerk</td>
                   <td>01 Aug 2026, 10:00 AM</td>
                   <td><span className="status-badge">Completed</span></td>
                   <td>All documents attached</td>
                 </tr>
                 <tr>
                   <td>Admin Approved</td>
                   <td>Super Admin</td>
                   <td>Admin</td>
                   <td>02 Aug 2026, 11:30 AM</td>
                   <td><span className="status-badge">Approved</span></td>
                   <td>Looks good, proceed</td>
                 </tr>
               </tbody>
             </table>
           </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-icon"></div>
              <div className="timeline-content">
                <h4>Loan Created</h4>
                <p>01 Aug 2026 - By John Doe</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon"></div>
              <div className="timeline-content">
                <h4>KYC Verified</h4>
                <p>01 Aug 2026 - By KYC Team</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon"></div>
              <div className="timeline-content">
                <h4>Loan Approved</h4>
                <p>02 Aug 2026 - By Super Admin</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon" style={{backgroundColor: '#e5e7eb', borderColor: '#e5e7eb'}}></div>
              <div className="timeline-content">
                <h4 style={{color: '#9ca3af'}}>Loan Disbursed</h4>
                <p>Pending</p>
              </div>
            </div>
          </div>
        )}

        {/* LOAN CLOSING TAB */}
        {activeTab === 'loan_closing' && (
          <div className="detail-grid">
             <div className="detail-item"><div className="detail-label">Closure Date</div><div className="detail-value">-</div></div>
             <div className="detail-item"><div className="detail-label">Closure Type</div><div className="detail-value">-</div></div>
             <div className="detail-item"><div className="detail-label">Settlement Amount</div><div className="detail-value">-</div></div>
             <div className="detail-item"><div className="detail-label">Gold Released</div><div className="detail-value">No</div></div>
             <div className="detail-item"><div className="detail-label">NOC Number</div><div className="detail-value">-</div></div>
             <div className="detail-item"><div className="detail-label">Closed By</div><div className="detail-value">-</div></div>
           </div>
        )}

      </div>

      {/* BOTTOM ACTIONS */}
      <div className="card" style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginBottom: '0' }}>
        <button className="btn"><Eye size={16} /> View</button>
        <button className="btn"><Printer size={16} /> Print</button>
        <button className="btn"><FileText size={16} /> Export PDF</button>
        <button className="btn"><FileSpreadsheet size={16} /> Export Excel</button>
        <button className="btn btn-primary"><Download size={16} /> Download Ledger</button>
      </div>

    </div>
  );
};

export default LoanAccountLedger;
