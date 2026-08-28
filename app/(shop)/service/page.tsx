import { ServiceView } from "@/components/service-view";
import { getServicePage } from "@/lib/api";

export async function generateMetadata() {
  const page = await getServicePage();
  return { title: page.title || "Үйлчилгээ" };
}

export default async function ServicePage() {
  const page = await getServicePage();
  return <ServiceView page={page} />;
}
