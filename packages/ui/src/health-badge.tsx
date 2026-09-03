import type { HealthResponse } from "@pa/contracts";

export function HealthBadge({ health }: { health: HealthResponse }) {
  return (
    <p>
      {health.service} is {health.status}
    </p>
  );
}
