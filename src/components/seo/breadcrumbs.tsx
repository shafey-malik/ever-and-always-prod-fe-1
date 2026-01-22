import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateBreadcrumbSchema, JsonLd } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/metadata";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Always include home
  const allItems = [
    { name: "Home", href: "/" },
    ...items,
  ];

  // Generate schema
  const schema = generateBreadcrumbSchema(
    allItems.map((item) => ({
      name: item.name,
      url: `${SITE_URL}${item.href}`,
    }))
  );

  return (
    <>
      <JsonLd data={schema} />
      <Breadcrumb className="container mx-auto px-4 py-4">
        <BreadcrumbList>
          {allItems.map((item, index) => (
            <div key={item.href} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === allItems.length - 1 ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
