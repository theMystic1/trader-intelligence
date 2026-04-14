export default function StatsCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-[#121826] p-4 rounded-2xl shadow-lg hover:scale-105 transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-xl font-bold mt-2">{value}</h3>
    </div>
  );
}
