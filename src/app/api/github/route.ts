import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1hr

export async function GET() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;

  if (!username || username === "your_github_username") {
    return NextResponse.json({ repos: [] });
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=public`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const data = await res.json();

    const repos = data
      .filter((r: { fork: boolean }) => !r.fork)
      .slice(0, 6)
      .map((r: {
        id: number;
        name: string;
        description: string;
        html_url: string;
        stargazers_count: number;
        language: string;
        updated_at: string;
      }) => ({
        id: r.id,
        name: r.name,
        description: r.description || "",
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
        updatedAt: r.updated_at,
      }));

    return NextResponse.json({ repos });
  } catch {
    return NextResponse.json({ repos: [] });
  }
}
