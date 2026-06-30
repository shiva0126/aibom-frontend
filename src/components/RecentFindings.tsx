import { recentFindings } from '../data/mock';

const severityColors: Record<string, string> = {
  Critical: 'bg-[#ef444420] text-[#ef4444] border border-[#ef444440]',
  High: 'bg-[#f9731620] text-[#f97316] border border-[#f9731640]',
  Medium: 'bg-[#f59e0b20] text-[#f59e0b] border border-[#f59e0b40]',
};

const statusColors: Record<string, string> = {
  New: 'bg-[#8b5cf620] text-[#8b5cf6] border border-[#8b5cf640]',
  'In Progress': 'bg-[#3b82f620] text-[#3b82f6] border border-[#3b82f640]',
  Open: 'bg-[#21262d] text-[#8b949e] border border-[#30363d]',
};

export default function RecentFindings() {
  return (
    <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[#e6edf3]">Recent Critical Findings</span>
        <button className="text-xs text-[#58a6ff] hover:underline">View all findings →</button>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="text-[#8b949e] border-b border-[#21262d]">
            <th className="text-left pb-2 font-medium">Finding</th>
            <th className="text-left pb-2 font-medium">System</th>
            <th className="text-left pb-2 font-medium">Severity</th>
            <th className="text-left pb-2 font-medium">First Detected</th>
            <th className="text-left pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentFindings.map((f, i) => (
            <tr key={i} className="border-b border-[#21262d] last:border-0">
              <td className="py-2.5 text-[#e6edf3] pr-4">{f.finding}</td>
              <td className="py-2.5 text-[#8b949e] pr-4">{f.system}</td>
              <td className="py-2.5 pr-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${severityColors[f.severity]}`}>
                  {f.severity}
                </span>
              </td>
              <td className="py-2.5 text-[#8b949e] pr-4 whitespace-nowrap">{f.firstDetected}</td>
              <td className="py-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusColors[f.status]}`}>
                  {f.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
