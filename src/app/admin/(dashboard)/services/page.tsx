import { listServices } from './actions';
import { listPackages, initializePackages } from './packageActions';
import { ServicesAdminClient } from './ServicesAdminClient';

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  await initializePackages();
  
  const servicesResult = await listServices();
  const packagesResult = await listPackages();

  const services = servicesResult.success ? servicesResult.data : [];
  const packages = packagesResult.success ? packagesResult.data : [];

  return <ServicesAdminClient initialServices={services || []} initialPackages={packages || []} />;
}
