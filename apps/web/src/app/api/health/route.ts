import { getWebHealth } from "@/health";

export function GET() {
  return Response.json(getWebHealth());
}
