import { redirect } from "next/navigation";

type Props = object;

export default function NotFoundPage({}: Props) {
  return redirect("/dashboard");
}
