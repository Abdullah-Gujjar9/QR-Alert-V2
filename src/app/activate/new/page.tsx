import { redirect } from "next/navigation";

// /activate/new → just go to the activation form with a placeholder
// The form itself validates the code against the DB
export default function ActivateNew() {
  redirect("/activate/start");
}
