import React, { useState, useEffect } from 'react';
import data from '../data/beasts.json';
import { useNavigate } from 'react-router-dom';

const Beasts = () => {
  const [filterName, setFilterName] = useState('');
  const [filterCR, setFilterCR] = useState('All');
  const [filterType, setFilterType] = useState('beast');
  const [groupedBeasts, setGroupedBeasts] = useState({});
  const navigate = useNavigate();

  const parseCR = (val) => {
    if (val == null) return Infinity;
    const crString = String(val).trim();

    const map = {
      '0': 0,
      '1/8': 0.125,
      '1/6': 0.1667,
      '1/4': 0.25,
      '1/3': 0.333,
      '1/2': 0.5,
    };

    return map[crString] ?? parseFloat(crString) ?? Infinity;
  };

  const getCRColor = (cr) => {
    const num = parseCR(cr);
    if (isNaN(num)) return 'bg-gray-600';
    if (num <= 1) return 'bg-green-600';
    if (num <= 4) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  useEffect(() => {
    const filtered = data.filter((b) => {
      const matchesName = b.name?.toLowerCase().includes(filterName.toLowerCase());
      const matchesCR = filterCR === 'All' || b.challenge_rating === filterCR;
      const matchesType = filterType === 'All' || b.type?.toLowerCase() === filterType.toLowerCase();
      return matchesName && matchesCR && matchesType;
    });

    const grouped = {};
    filtered.forEach((b) => {
      const cr = b.challenge_rating ?? 'Unknown';
      if (!grouped[cr]) grouped[cr] = [];
      grouped[cr].push(b);
    });

    setGroupedBeasts(grouped);
  }, [filterName, filterCR, filterType]);

  const allCRs = Array.from(new Set(data.map((b) => b.challenge_rating).filter(Boolean))).sort(
    (a, b) => parseCR(a) - parseCR(b)
  );
  const allTypes = Array.from(new Set(data.map((b) => b.type).filter(Boolean))).sort();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Compendium</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by name"
          className="bg-gray-800 text-white px-4 py-2 rounded w-60"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded w-40"
          value={filterCR}
          onChange={(e) => setFilterCR(e.target.value)}
        >
          <option value="All">All CR</option>
          {allCRs.map((cr) => (
            <option key={cr} value={cr}>
              CR {cr}
            </option>
          ))}
        </select>
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded w-48"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          {allTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(groupedBeasts)
        .sort((a, b) => parseCR(a[0]) - parseCR(b[0]))
        .map(([cr, beasts]) => (
          <div key={cr} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">CR {cr}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {beasts.map((beast) => (
                <div
                  key={beast.name}
                  onClick={() => navigate(`/sheet/${encodeURIComponent(beast.name)}`)}
                  className="cursor-pointer relative bg-gray-800 hover:bg-gray-700 transition rounded-lg border border-gray-700 shadow-sm overflow-hidden flex flex-col justify-between aspect-rectangle p-3"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-bold text-md mb-1">{beast.name}</h3>
                      <p className="text-xs text-gray-400">CR: {beast.challenge_rating ?? '—'}</p>
                      <p className="text-xs text-gray-400">Type: {beast.type ?? '—'}</p>
                    </div>
                  </div>
                  <div className={`absolute top-0 right-0 h-full w-2 ${getCRColor(beast.challenge_rating)}`} />
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Beasts;
