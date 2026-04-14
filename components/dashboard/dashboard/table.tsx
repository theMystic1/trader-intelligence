import { ReactNode } from "react";

export const TableWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`w-full overflow-x-auto ${className ?? ""}`}>{children}</div>
);
export const Table = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <table className={`w-full border-collapse ${className ?? ""}`}>
    {children}
  </table>
);
export const TableRow = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <tr className={className ?? ""}>{children}</tr>;
export const TableHeadWithRow = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <thead>
    <TableRow className={className}>{children}</TableRow>
  </thead>
);
export const Th = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <th
    className={`${className ?? ""} text-[11px] font-semibold text-[#6b7280] px-5 py-2 text-left border-b border-b-[#2a3040] bg-[#0f1117]`}
  >
    {children}
  </th>
);
export const TableBody = ({ children }: { children: ReactNode }) => (
  <tbody>{children}</tbody>
);
export const TableCell = ({
  children,
  className,
  colSpan,
}: {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}) => (
  <td
    className={`${className ?? ""} text-start px-5 py-3 text-[#6b7280]`}
    colSpan={colSpan}
  >
    {children}
  </td>
);
