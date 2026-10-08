import { auth } from "@clerk/nextjs/server";

type Props = object;

export default async function SessionsPage({}: Props) {
  await auth.protect();

  return <div>SessionsPage</div>;
}
