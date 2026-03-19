import LicenseForm from "./LicenseForm";

type SearchParams = Promise<{ plan?: string }>;

type NewLicensePageProps = {
  searchParams: SearchParams;
};

export default async function NewLicensePage({ searchParams }: NewLicensePageProps) {
  const { plan } = await searchParams;

  return <LicenseForm initialPlan={plan ?? "mensuel"} />;
}
