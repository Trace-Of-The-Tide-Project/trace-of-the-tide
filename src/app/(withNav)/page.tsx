import { redirect } from "next/navigation";

/** Temporary: land on admin dashboard instead of marketing home. */
export default function Home() {
  redirect("/admin");
}
