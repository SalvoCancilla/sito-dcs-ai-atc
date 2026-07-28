import { Breadcrumbs } from "@/components/breadcrumbs";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-16">
      <Breadcrumbs
        items={[{ name: "Home", href: "/" }, { name: "Legal" }]}
      />
      <article className="max-w-3xl space-y-6 text-muted-foreground [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_a]:text-radar [&_a]:underline-offset-4 [&_a:hover]:underline [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_p]:leading-relaxed">
        {children}
      </article>
    </div>
  );
}
