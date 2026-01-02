import Table from "../../../components/shared/Table/Table";
import type { TableColumn } from "../../../components/shared/Table/Table.types";

interface DataTableSectionProps<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
}

const DataTableSection = <T,>({
  title,
  columns,
  data,
}: DataTableSectionProps<T>) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E1E4EA] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-dark">{title}</h2>
      </div>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default DataTableSection;
