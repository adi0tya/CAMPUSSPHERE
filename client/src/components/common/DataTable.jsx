const DataTable = ({ columns, data, emptyMessage = 'No data' }) => {
  if (!data || data.length === 0) return <p className="text-gray-600 text-center py-8">{emptyMessage}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead><tr className="border-b border-[#2a2a2a]">
          {columns.map((col, i) => <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{col.header}</th>)}
        </tr></thead>
        <tbody className="divide-y divide-[#1a1a1a]">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-[#0a0a0a] transition-colors">
              {columns.map((col, j) => <td key={j} className="px-4 py-3 text-sm text-gray-300">{col.render ? col.render(row) : row[col.accessor]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
