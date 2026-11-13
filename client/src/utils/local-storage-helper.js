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

export const getActiveUserPrefix = () => {
  const token = localStorage.getItem("token");
  if (!token) return "guest";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id || payload.email || "user";
  } catch (e) {
    return "guest";
  }
};

export const getBudget = () => {
  const prefix = getActiveUserPrefix();
  const data = localStorage.getItem(`hisabkitab_budget_${prefix}`);
  return data ? parseInt(data, 10) : 0;
};

export const saveBudget = (amount) => {
  const prefix = getActiveUserPrefix();
  localStorage.setItem(`hisabkitab_budget_${prefix}`, amount.toString());
};

export const getSubscriptions = () => {
  const prefix = getActiveUserPrefix();
  const data = localStorage.getItem(`hisabkitab_subscriptions_${prefix}`);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse subscriptions", e);
    return [];
  }
};

export const saveSubscriptions = (subs) => {
  const prefix = getActiveUserPrefix();
  localStorage.setItem(`hisabkitab_subscriptions_${prefix}`, JSON.stringify(subs));
};

export const getDebts = () => {
  const prefix = getActiveUserPrefix();
  const data = localStorage.getItem(`hisabkitab_debts_${prefix}`);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse debts", e);
    return [];
  }
};

export const saveDebts = (debts) => {
  const prefix = getActiveUserPrefix();
  localStorage.setItem(`hisabkitab_debts_${prefix}`, JSON.stringify(debts));
};

export const getLenDenParties = () => {
  const prefix = getActiveUserPrefix();
  const data = localStorage.getItem(`hisabkitab_lenden_${prefix}`);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse lenden parties", e);
    }
  }

  // Automatic Migration from legacy debts if any
  const legacyDebtsData = localStorage.getItem(`hisabkitab_debts_${prefix}`);
  if (legacyDebtsData) {
    try {
      const legacyDebts = JSON.parse(legacyDebtsData);
      if (Array.isArray(legacyDebts) && legacyDebts.length > 0) {
        const partyMap = {};
        legacyDebts.forEach((d) => {
          const personName = (d.person || "Unknown").trim();
          if (!partyMap[personName]) {
            partyMap[personName] = {
              id: `party_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              name: personName,
              createdAt: d.dueDate ? new Date(d.dueDate).toISOString() : new Date().toISOString(),
              entries: [],
            };
          }
          partyMap[personName].entries.push({
            id: d.id || `entry_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            type: d.type === "lent" ? "give" : "get",
            amount: parseFloat(d.amount) || 0,
            date: d.dueDate || new Date().toISOString().split("T")[0],
            note: d.note || (d.type === "lent" ? "Given" : "Received"),
            createdAt: d.dueDate ? new Date(d.dueDate).toISOString() : new Date().toISOString(),
          });
          if (d.settled) {
            partyMap[personName].entries.push({
              id: `settle_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              type: d.type === "lent" ? "get" : "give",
              amount: parseFloat(d.amount) || 0,
              date: d.settledDate || new Date().toISOString().split("T")[0],
              note: `[Settled] ${d.note || "Settlement"}`,
              createdAt: new Date().toISOString(),
            });
          }
        });
        const migrated = Object.values(partyMap);
        saveLenDenParties(migrated);
        return migrated;
      }
    } catch (err) {
      console.error("Failed to migrate legacy debts", err);
    }
  }

  return [];
};

export const saveLenDenParties = (parties) => {
  const prefix = getActiveUserPrefix();
  localStorage.setItem(`hisabkitab_lenden_${prefix}`, JSON.stringify(parties));
};

export const getGullakGoals = () => {
  const prefix = getActiveUserPrefix();
  const data = localStorage.getItem(`hisabkitab_gullak_${prefix}`);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse Gullak goals", e);
    return [];
  }
};

export const saveGullakGoals = (goals) => {
  const prefix = getActiveUserPrefix();
  localStorage.setItem(`hisabkitab_gullak_${prefix}`, JSON.stringify(goals));
};
