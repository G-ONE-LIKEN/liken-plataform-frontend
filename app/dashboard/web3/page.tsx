import { redirect } from "next/navigation";

export default function DashboardWeb3RedirectPage() {
  redirect("/dashboard/wallet");
}
