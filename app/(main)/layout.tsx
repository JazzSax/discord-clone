import { NavigationSidebar } from "@/components/navigation";
const MainLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-18 z-30 flex-col fixed inset-y-0">
        <NavigationSidebar/>
      </div>
      <main className="h-full md:pl-18">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;