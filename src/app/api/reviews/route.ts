import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export const revalidate = 3600; // cache 1 hour

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url?: string;
  author_url?: string;
}

export async function GET() {
  const { placesApiKey: apiKey, placeId } = config.google;

  if (!apiKey || !placeId) {
    return NextResponse.json({ reviews: [], rating: null, total: null });
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { reviews: [], rating: null, total: null, error: `HTTP ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { reviews: [], rating: null, total: null, error: `Places API: ${data.status}`, detail: data.error_message ?? null },
        { status: 502 }
      );
    }

    const result = data.result;
    const reviews = (result.reviews || []).map((r: GoogleReview, i: number) => ({
      id: String(i),
      name: r.author_name,
      role: "Google Review",
      company: "",
      content: r.text,
      rating: r.rating,
      avatar: r.profile_photo_url || null,
      time: r.time,
    }));

    return NextResponse.json({
      reviews,
      rating: result.rating,
      total: result.user_ratings_total,
    });
  } catch (err) {
    return NextResponse.json(
      { reviews: [], rating: null, total: null, error: String(err) },
      { status: 500 }
    );
  }
}
