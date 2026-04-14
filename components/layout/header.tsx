export default function Header({ title }: { title: string }) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="bg-[#1B2233] px-4 py-2 rounded">User</div>
    </div>
  );
}
