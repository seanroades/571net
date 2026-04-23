import ReleasesTable from "@/app/components/ReleasesTable";
import { fetchAllReleases } from "@/lib/spotify";
import type { Release } from "@/lib/spotify";

export const revalidate = 3600;

export default async function HomePage() {
  let releases: Release[] = [];
  try {
    releases = await fetchAllReleases();
  } catch {
    // Spotify credentials not configured or API error — show empty state
  }

  return <ReleasesTable releases={releases} />;
}
