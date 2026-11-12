import { Record, RecordCard } from "./Record";

export default function RecordList({ records, categoryFilter, dateFilter, filteredRecords, onDelete, onRefresh }) {
  const displayRecords = (filteredRecords.length > 0 || categoryFilter || dateFilter) ? filteredRecords : records;
  const isEmpty = displayRecords.length === 0 && (categoryFilter || dateFilter);

  return (
    <>
      {/* Mobile card layout */}
      <div className="md:hidden flex flex-col gap-3">
        {isEmpty ? (
          <div className="text-center py-8 text-slate-400 dark:text-zinc-500">No record found</div>
        ) : displayRecords.length > 0 ? (
          displayRecords.map((record) => (
            <RecordCard key={record._id} record={record} onDelete={onDelete} onRefresh={onRefresh} />
          ))
        ) : (
          records.map((record) => (
            <RecordCard key={record._id} record={record} onDelete={onDelete} onRefresh={onRefresh} />
          ))
        )}
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1C1C1E]">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 text-slate-700 dark:text-zinc-300">
              <tr>
                <th className="h-12 px-4 text-left font-semibold">Amount</th>
                <th className="h-12 px-4 text-left font-semibold">Category</th>
                <th className="h-12 px-4 text-left font-semibold">Date</th>
                <th className="h-12 px-4 text-left font-semibold">Note</th>
                <th className="h-12 px-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <Record key={record._id} record={record} onDelete={onDelete} onRefresh={onRefresh} />
                ))
              ) : (filteredRecords.length === 0 && (categoryFilter || dateFilter)) ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 dark:text-zinc-500">
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <Record key={record._id} record={record} onDelete={onDelete} onRefresh={onRefresh} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
