// src/App.jsx
import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Produce');
  const [expiry, setExpiry] = useState(''); // REPLACED: expiryDate -> expiry
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/items/all');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName || !expiry) return; // REPLACED: expiryDate -> expiry

    try {
      const response = await fetch('http://localhost:5000/api/items/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, category, expiry: expiry }) // Sends 'expiry' mapped correctly
      });

      if (response.ok) {
        setItemName('');
        setExpiry(''); // REPLACED: expiryDate -> expiry
        fetchItems();
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Advanced Feature: Search & Category Filter Analytics
  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilter === 'All' || item.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  // Advanced Feature: Smart Statistics Counters
  const totalItems = items.length;
  const criticalItems = items.filter(item => {
    const daysLeft = Math.ceil((new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 2;
  }).length;

  const getUrgencyBadge = (dateString) => {
    const daysLeft = Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) return { label: 'Expired', style: 'bg-red-500/10 text-red-400 border-red-500/20' };
    if (daysLeft <= 2) return { label: `${daysLeft}d left`, style: 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' };
    return { label: `${daysLeft} days`, style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
            SMARTSHELF // CORE
          </h1>
          <p className="text-sm text-slate-400 mt-1">Predictive multi-layered expiry management ecosystem</p>
        </div>
        <div className="flex gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 self-center animate-ping"></span>
          LOCAL NODE ACTIVE
        </div>
      </header>

      {/* METRICS DASHBOARD */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-6 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total Monitored Vol</p>
          <p className="text-3xl font-bold mt-2 text-slate-200">{totalItems} <span className="text-sm font-normal text-slate-500">units</span></p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-l-2 border-l-amber-500">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Critical State Alerts</p>
          <p className="text-3xl font-bold mt-2 text-amber-400">{criticalItems} <span className="text-sm font-normal text-slate-500">at risk</span></p>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">System Integrity</p>
          <p className="text-3xl font-bold mt-2 text-emerald-400">100% <span className="text-sm font-normal text-slate-500">stable</span></p>
        </div>
      </section>

      {/* MAIN SYSTEM BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INPUT HUB */}
        <div className="glass-panel p-6 rounded-2xl h-fit">
          <h3 className="text-lg font-bold text-slate-200 mb-4 tracking-tight">Ingest Stock Packet</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Item Identifier</label>
              <input 
                type="text" 
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Ex. Organic Spinach"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category Classification</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
              >
                <option value="Produce">Produce (Veg/Fruits)</option>
                <option value="Dairy">Dairy & Eggs</option>
                <option value="Meat">Meat & Seafood</option>
                <option value="Pantry">Pantry Items</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Expiration Boundary</label>
              <input 
                type="date" 
                value={expiry} // REPLACED: expiryDate -> expiry
                onChange={(e) => setExpiry(e.target.value)} // REPLACED: expiryDate -> expiry
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition"
              />
            </div>
            <button className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/10">
              Commit Entry to DB
            </button>
          </form>
        </div>

        {/* INVENTORY TRACKER BOARD */}
        <div className="lg:col-span-2 space-y-6">
          {/* ADVANCED LEDGER CONTROLS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
            <input 
              type="text"
              placeholder="🔍 Search ledger matrix..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            />
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              {['All', 'Produce', 'Dairy', 'Meat', 'Pantry'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium whitespace-nowrap ${selectedFilter === cat ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold' : 'border-slate-800 text-slate-400 hover:text-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC CARD VIEW GRID */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm">
              No parameters matched the active query matrix.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const status = getUrgencyBadge(item.expiry);
                return (
                  <div key={item._id} className="glass-panel p-5 rounded-xl flex flex-col justify-between group hover:border-slate-700 transition duration-300">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                          // {item.category}
                        </span>
                        <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${status.style}`}>
                          {status.label}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-200 group-hover:text-emerald-400 transition">
                        {item.itemName}
                      </h4>
                    </div>
                    
                    <div className="mt-6 pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-400">
                      <span>EXPIRY FIELD:</span>
                      <span className="font-mono font-semibold text-slate-300">
                        {new Date(item.expiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;