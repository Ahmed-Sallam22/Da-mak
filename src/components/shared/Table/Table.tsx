import { useState, useRef, useEffect, useMemo } from "react";
import type { TableProps, SortDirection } from "./Table.types";

const Table = <T,>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No data available",
  isLoading = false,
  sortable = true,
  resizable = true,
  onSort,
}: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({
    key: "",
    direction: null,
  });

  // Calculate default widths from columns
  const defaultWidths = useMemo(() => {
    const defaults: Record<string, number> = {};
    columns.forEach((column) => {
      defaults[column.key] = column.minWidth || 150;
    });
    return defaults;
  }, [columns]);

  const [columnWidths, setColumnWidths] =
    useState<Record<string, number>>(defaultWidths);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // Handle column sorting
  const handleSort = (columnKey: string, isSortable: boolean = true) => {
    if (!sortable || !isSortable) return;

    let direction: SortDirection = "asc";

    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key: columnKey, direction });

    if (onSort) {
      onSort(columnKey, direction);
    }
  };

  // Handle column resize start
  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    if (!resizable) return;

    e.preventDefault();
    e.stopPropagation();

    setResizingColumn(columnKey);
    startXRef.current = e.clientX;
    startWidthRef.current =
      columnWidths[columnKey] || defaultWidths[columnKey] || 150;
  };

  // Handle double-click to reset column width
  const handleResizeDoubleClick = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();

    setColumnWidths((prev) => ({
      ...prev,
      [columnKey]: defaultWidths[columnKey] || 150,
    }));
  };

  // Handle column resize
  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startXRef.current;
      const newWidth = Math.max(100, startWidthRef.current + diff);

      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingColumn]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl  overflow-hidden  border-0 w-[98%] mx-auto mt-2">
      <div className="overflow-x-auto" ref={tableRef}>
        <table className="w-full min-w-max">
          <thead className="bg-[#F5F7FA] border-b border-[#E1E4EA]">
            <tr>
              {columns.map((column) => {
                const isSortable = sortable && column.sortable !== false;
                const isResizable = resizable && column.resizable !== false;
                const width =
                  columnWidths[column.key] ||
                  defaultWidths[column.key] ||
                  column.minWidth ||
                  150;
                const isSorted = sortConfig.key === column.key;
                const isHovered = hoveredColumn === column.key;

                return (
                  <th
                    key={column.key}
                    style={{
                      width: `${width}px`,
                      minWidth: `${column.minWidth || 100}px`,
                    }}
                    className={` relative px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray
                                group transition-colors duration-150
                                ${
                                  isSortable
                                    ? "cursor-pointer hover:bg-[#E8ECEF] select-none"
                                    : ""
                                }
                                ${column.headerClassName || ""}`}
                    onClick={() => handleSort(column.key, isSortable)}
                    onMouseEnter={() => setHoveredColumn(column.key)}
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{column.header}</span>

                      {/* Sort Icons */}
                      {isSortable && (
                        <div className="flex flex-col gap-0.5">
                          <svg
                            className={`w-3 h-3 transition-colors duration-150 ${
                              isSorted && sortConfig.direction === "asc"
                                ? "text-primary"
                                : "text-gray/40 group-hover:text-gray"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                          </svg>
                          <svg
                            className={`w-3 h-3 transition-colors duration-150 ${
                              isSorted && sortConfig.direction === "desc"
                                ? "text-primary"
                                : "text-gray/40 group-hover:text-gray"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                          </svg>
                        </div>
                      )}

                      {/* Resize Handle */}
                      {isResizable && (
                        <div
                          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize 
                                     hover:bg-primary/30 transition-colors duration-150 group/resize"
                          onMouseDown={(e) => handleResizeStart(e, column.key)}
                          onDoubleClick={(e) =>
                            handleResizeDoubleClick(e, column.key)
                          }
                          onClick={(e) => e.stopPropagation()}
                          title="Double-click to reset width"
                        >
                          <div className="h-full w-full" />

                          {/* Resize tooltip */}
                          <div
                            className="absolute z-50 bottom-full right-0 mb-2 px-2 py-1 
                                          bg-dark text-white text-xs rounded shadow-lg 
                                          whitespace-nowrap opacity-0 group-hover/resize:opacity-100
                                          transition-opacity duration-150 pointer-events-none"
                          >
                            Double-click to reset
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Column Tooltip */}
                    {(column.tooltip || isHovered) && isHovered && (
                      <div
                        className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                                      px-3 py-2 bg-dark text-white text-xs rounded-lg shadow-lg 
                                      whitespace-nowrap animate-in fade-in zoom-in-95 duration-150
                                      pointer-events-none"
                      >
                        {column.tooltip || column.header}
                        <div
                          className="absolute top-full left-1/2 transform -translate-x-1/2 
                                        border-4 border-transparent border-t-dark"
                        />
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1E4EA]">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`
                  transition-colors duration-150
                  ${onRowClick ? "cursor-pointer hover:bg-[#F5F7FA]" : ""}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-dark ${
                      column.className || ""
                    }`}
                  >
                    {column.render
                      ? column.render(
                          (row as Record<string, unknown>)[column.key],
                          row
                        )
                      : ((row as Record<string, unknown>)[
                          column.key
                        ] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
