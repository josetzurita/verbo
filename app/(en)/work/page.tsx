import { WorkPage, workMetadata } from "@/components/pages/work-page";

export const metadata = workMetadata("en");

export default function Page() {
  return <WorkPage locale="en" />;
}
