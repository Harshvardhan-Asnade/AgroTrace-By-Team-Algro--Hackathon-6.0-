export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="pb-4 border-b mb-8">
        <h1 className="text-3xl font-bold font-headline">Admin Panel</h1>
      </div>
      {children}
    </div>
  );
}
