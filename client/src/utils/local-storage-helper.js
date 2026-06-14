export const isUserAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && Date.now() < payload.exp * 1000) {
      return true;
    }
  } catch (e) {
    console.error("Failed to parse token payload", e);
  }
  return false;
};

export const getGuestRecords = () => {
  const data = localStorage.getItem("hisabkitab_guest_records");
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse guest records", e);
    return [];
  }
};

export const saveGuestRecords = (records) => {
  localStorage.setItem("hisabkitab_guest_records", JSON.stringify(records));
};

export const addGuestRecord = (record) => {
  const records = getGuestRecords();
  const dateStr = record.Date.includes("T") ? record.Date : `${record.Date}T00:00:00.000Z`;
  
  const newRecord = {
    _id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: parseInt(record.amount, 10),
    category: record.category,
    Date: dateStr,
    note: record.note || "",
  };
  
  records.unshift(newRecord); // Add to beginning like the backend's sort({ Date: -1 })
  saveGuestRecords(records);
  return newRecord;
};

export const updateGuestRecord = (id, updatedRecord) => {
  const records = getGuestRecords();
  const index = records.findIndex((r) => r._id === id);
  if (index !== -1) {
    const dateStr = updatedRecord.Date.includes("T") ? updatedRecord.Date : `${updatedRecord.Date}T00:00:00.000Z`;
    records[index] = {
      ...records[index],
      amount: parseInt(updatedRecord.amount, 10),
      category: updatedRecord.category,
      Date: dateStr,
      note: updatedRecord.note || "",
    };
    saveGuestRecords(records);
  }
};

export const deleteGuestRecord = (id) => {
  const records = getGuestRecords();
  const filtered = records.filter((r) => r._id !== id);
  saveGuestRecords(filtered);
};

export const filterGuestRecords = (records, category, date) => {
  return records.filter((r) => {
    const rDate = r.Date.split("T")[0];
    const matchCategory = !category || r.category === category;
    const matchDate = !date || rDate === date;
    return matchCategory && matchDate;
  });
};

export const getGuestSummary = (records, dateStr) => {
  const [yearStr, monthStr] = dateStr.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed

  const categoryTotals = {};
  records.forEach((r) => {
    const rDate = new Date(r.Date);
    if (rDate.getFullYear() === year && rDate.getMonth() === month) {
      const amountVal = parseFloat(r.amount);
      if (!isNaN(amountVal)) {
        categoryTotals[r.category] = (categoryTotals[r.category] || 0) + amountVal;
      }
    }
  });

  return Object.entries(categoryTotals).map(([category, total]) => ({
    _id: category,
    total: total,
  }));
};

export const clearGuestRecords = () => {
  localStorage.removeItem("hisabkitab_guest_records");
};
