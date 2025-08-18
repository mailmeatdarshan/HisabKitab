export const Record = ({ record }) => {
  const { amount, category, Date, note } = record;
  const dateFormat = Date.split("T")[0];
  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4 align-middle">{amount}</td>
      <td className="p-4 align-middle">{category}</td>
      <td className="p-4 align-middle">{dateFormat}</td>
      <td className="p-4 align-middle">{note}</td>
    </tr>
  );
};