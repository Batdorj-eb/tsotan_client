import { ContactForm } from "@/components/contact-form";
import { getContactPage } from "@/lib/api";

export const metadata = { title: "Холбоо барих" };

export default async function ContactPage() {
  const page = await getContactPage();
  return <ContactForm page={page} />;
}
