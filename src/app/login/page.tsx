import Login from "@/app/components/admin/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | AI-SecOps Research Admin",
  description: "Manage and view all login",
};

export default function LoginPage() {
  return (
    <div>
      <Login />
    </div>
  );
}
