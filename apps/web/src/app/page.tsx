import { CONFIG_PACKAGE } from "@pa/config";
import { HealthBadge } from "@pa/ui";
import { getWebHealth } from "@/health";

export default function HomePage() {
  const health = getWebHealth();

  return (
    <main>
      <h1>Personalized Audio Platform</h1>
      <p>The web process is running. Product surfaces arrive in later stories.</p>
      <HealthBadge health={health} />
      <p>Config package: {CONFIG_PACKAGE.name}</p>
    </main>
  );
}
