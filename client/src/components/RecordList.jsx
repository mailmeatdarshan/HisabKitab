import { useEffect, useState } from "react";
import {FileSpreadsheet,ChartArea} from "lucide-react";
import axiosInstance from "../utils/data-access";
import { Record } from "./Record";


export default function RecordList({records,categoryFilter, dateFilter,filteredRecords}) {
  return (
    <>

      <div className="border rounded-lg overflow-hidden shadow bg-white">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-100">
              <tr>
                <th className="h-12 px-4 text-left font-semibold">Amount</th>
                <th className="h-12 px-4 text-left font-semibold">Category</th>
                <th className="h-12 px-4 text-left font-semibold">Date</th>
                <th className="h-12 px-4 text-left font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <Record key={record._id} record={record} />
                ))
              ) : (filteredRecords.length === 0 && (categoryFilter || dateFilter)) ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No record found
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <Record key={record._id} record={record} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
