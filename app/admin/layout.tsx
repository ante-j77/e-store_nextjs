import { PropsWithChildren } from "react";
import AdminNav from "../components/admin/AdminNav";

export const metadata = {
  title: "E-Shop Admin",
  description: "E-Shop Admin Dashboard",
};

const AdminLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <div>
        <AdminNav />
      </div>
      {children}
    </div>
  );
};

export default AdminLayout;
