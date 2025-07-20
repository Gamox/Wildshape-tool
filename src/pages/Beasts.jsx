import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import baseBeasts from '../data/beasts.json';
import monsters from '../data/monsters.json';

export default function Beasts() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Beast'); // Preselect 'Beast'
  const [crFilter, setCrFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const navigate = useNavigate();

  const sources = {
    SRD: baseBeasts,
    Monsters: monsters,
  };

  const combinedBeasts = Object.entries(sources).flatMap(([source, data]) =>
    data.map((b) => ({
      ...b,
      source,
      type: b.type ? b.type.charAt(0).toUpperCase() + b.type.slice(1) : 'Unknown',
    }))
  );

  const crOrder = ['0', '1/8', '1/4', '1/2'];
  for (let i = 1; i <= 30; i++) {
    crOrder.push(String(i));
  }

  const filtered = combinedBeasts
    .filter((b) =>
      b?.name?.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === 'All' || b.type === typeFilter) &&
      (crFilter === '' || String(b.challenge_rating) === crFilter) &&
      (sourceFilter === 'All' || b.source === sourceFilter)
    )
    .sort((a, b) => {
      const aIndex = crOrder.indexOf(String(a.challenge_rating));
      const bIndex = crOrder.indexOf(String(b.challenge_rating));
      return aIndex - bIndex;
    });
  console.log(crFilter)
  const groupedByCR = filtered.reduce((acc, beast) => {
    const cr = String(beast.challenge_rating);
    if (!acc[cr]) acc[cr] = [];
    acc[cr].push(beast);
    return acc;
  }, {});

  const uniqueTypes = ['All', ...new Set(combinedBeasts.map((b) => b.type))];
  const uniqueSources = ['All', ...Object.keys(sources)];
  const uniqueCRs = [...new Set(
    combinedBeasts
      .map((b) => String(b.challenge_rating))
      .filter((cr) => crOrder.includes(cr))
  )].sort((a, b) => crOrder.indexOf(a) - crOrder.indexOf(b));


  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-white">
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Name</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 px-3 py-1 rounded w-full sm:w-auto"
            placeholder="Search by name..."
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-800 px-3 py-1 rounded"
          >
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">CR</label>
          <select
            value={crFilter}
            onChange={(e) => setCrFilter(e.target.value)}
            className="bg-gray-800 px-3 py-1 rounded"
          >
            <option value="">All CR</option>
            {uniqueCRs.map((cr) => (
              <option key={cr}>{cr}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Source</label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-gray-800 px-3 py-1 rounded"
          >
            {uniqueSources.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>

      {Object.entries(groupedByCR)
        .sort(([a], [b]) => crOrder.indexOf(a) - crOrder.indexOf(b))
        .map(([cr, beasts]) => (
          <div key={cr} className="mb-6">
            <h2 className="text-xl font-bold text-purple-300 mb-2">CR {cr}</h2>
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {beasts.map((beast) => (
                <div
                  key={`${beast.name}-${beast.source}`}
                  onClick={() =>
                    navigate(`/sheet/${encodeURIComponent(beast.name)}?source=${encodeURIComponent(beast.source)}`)
                  }
                  className="cursor-pointer bg-gray-800 p-3 rounded hover:bg-gray-700 transition"
                >
                  <h3 className="text-lg font-bold mb-1">{beast.name}</h3>
                  <p className="text-sm text-gray-400">
                    {beast.type || 'Unknown'} | CR {beast.challenge_rating}
                  </p>
                  <span className="text-xs mt-2 inline-block bg-indigo-700 px-2 py-0.5 rounded text-white">
                    Source: {beast.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

    </div>
  );
}
