import { Outlet } from "react-router-dom";
import AdminSidebar from "./sidebar";
import AdminHeaders from "./header";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* side bar  */}
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        {/* Admin headers  */}
        <AdminHeaders />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
