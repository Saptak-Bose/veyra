import { auth } from "@clerk/nextjs/server";

type Props = object;

export default async function DashboardPage({}: Props) {
  await auth.protect();

  return <div>DashboardPage</div>;
}
