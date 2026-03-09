import React, { useState } from 'react';
import './InventoryInquiry.css';

const InventoryInquiry = ({ onBack, username, environment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Professional Mock Data for Demo
  const inventoryData = [
    { item: '210', description: 'Mountain Bike - Red', branch: '30', onHand: 45, location: '1.A.1', uom: 'EA' },
    { item: '220', description: 'Touring Bike - Blue', branch: '30', onHand: 12, location: '1.A.2', uom: 'EA' },
    { item: '501', description: 'Brake Pads Professional', branch: '10', onHand: 150, location: 'REC', uom: 'SET' },
    { item: '600', description: 'Handlebar Grips', branch: '30', onHand: 5, location: '2.B.1', uom: 'PR' }
  ];

  // Logic to filter data based on user search
  const filteredData = inventoryData.filter(row => 
    row.item.includes(searchTerm) || 
    row.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="workspace-container animate-in">
      {/* Top Header Bar */}
      <header className="workspace-header">
        <div className="header-left">
          {/* Note: In Vite, images in public/ are accessed via absolute path */}
          <img src="/image.jpeg" alt="KT Logo" className="header-logo" />
          <div className="divider"></div>
          <h2>Inventory Management Portal</h2>
        </div>
        <div className="header-right">
          <span className="user-badge">
            <span className="pulse-icon"></span>
            {username} @ {environment}
          </span>
          <button className="exit-btn" onClick={onBack}>Exit to Hub</button>
        </div>
      </header>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-box">
          <label>Quick Item Lookup</label>
          <div className="search-input-wrapper">
            <input 
              type="text" 
              placeholder="Search by Item # or Description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="primary-search-btn">Fetch JDE Data</button>
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="results-container">
        <div className="table-header">
          <h3>On-Hand Inventory (AIS Live)</h3>
          <span className="record-count">{filteredData.length} Items Found</span>
        </div>
        
        <table className="jde-data-table">
          <thead>
            <tr>
              <th>Item Number</th>
              <th>Description</th>
              <th>Branch/Plant</th>
              <th>Location</th>
              <th>On Hand</th>
              <th>UOM</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={index}>
                  <td className="bold-cell">{row.item}</td>
                  <td>{row.description}</td>
                  <td>{row.branch}</td>
                  <td><span className="loc-tag">{row.location}</span></td>
                  <td className={row.onHand < 20 ? 'low-stock' : 'in-stock'}>
                    {row.onHand}
                  </td>
                  <td>{row.uom}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
                  No items found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default InventoryInquiry;