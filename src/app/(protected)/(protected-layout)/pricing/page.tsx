import { auth } from "@clerk/nextjs/server";

type Props = object;

export default async function PricingPage({}: Props) {
  await auth.protect();

  return <div>PricingPage</div>;
}
