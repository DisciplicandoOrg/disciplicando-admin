// app/reports/ReportsClient.jsx
"use client";

export default function ReportsClient({ rows }) {
    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Reportes</h2>

            {rows.length === 0 ? (
                <p className="text-slate-500">No hay datos para mostrar.</p>
            ) : (
                <div className="overflow-x-auto rounded-md border bg-white">
                    <table className="min-w-[600px] w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                {Object.keys(rows[0]).map((k) => (
                                    <th key={k} className="px-3 py-2 text-left font-medium text-slate-700">
                                        {k}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <tr key={i} className="border-t">
                                    {Object.keys(rows[0]).map((k) => (
                                        <td key={k} className="px-3 py-2">
                                            {String(r[k] ?? "")}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}