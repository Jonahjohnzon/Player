/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers":
    "Content-Length,Content-Range,Accept-Ranges",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET(req) {
  const url = new URL(req.url);


  const target = url.searchParams.get("path");
  const originParam =
    url.searchParams.get("origin") || "https://vidrock.ru";
  const refererParam =
    url.searchParams.get("referer") || "https://vidrock.ru";

  if (!target) {
    return new Response("Missing path", {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  if (!target.startsWith("http")) {
    return new Response("Invalid URL", {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  try {
    const headers = {
      "User-Agent":
        req.headers.get("user-agent") ||
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      Origin: originParam,
      Referer: refererParam,
    };

    const range = req.headers.get("range");
    if (range) headers.Range = range;

    const upstream = await fetch(target, {
      method: "GET",
      headers,
      redirect: "follow",
    });

    const contentType = upstream.headers.get("content-type") || "";

    const isPlaylist =
      target.includes(".m3u8") ||
      contentType.includes("mpegurl") ||
      contentType.includes("application/vnd.apple.mpegurl");

    // =========================
    // HLS PLAYLIST REWRITE
    // =========================
    if (isPlaylist) {
      let playlist = await upstream.text();

      const rewriteUrl = (resourceUrl) => {
        const absolute = resourceUrl.startsWith("http")
          ? resourceUrl
          : new URL(resourceUrl, target).href;

        return `/api/proxy?path=${encodeURIComponent(
          absolute
        )}&origin=${encodeURIComponent(originParam)}&referer=${encodeURIComponent(
          refererParam
        )}`;
      };

      // rewrite URI tags
      playlist = playlist.replace(
        /URI="([^"]+)"/g,
        (_, uri) => `URI="${rewriteUrl(uri)}"`
      );

      // rewrite segment lines
      playlist = playlist.replace(
        /^([^#\r\n][^\r\n]*)$/gm,
        (line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) return line;
          return rewriteUrl(trimmed);
        }
      );

      return new Response(playlist, {
        status: upstream.status,
        headers: {
          ...CORS_HEADERS,
          "Content-Type":
            "application/vnd.apple.mpegurl",
          "Cache-Control": "no-cache",
        },
      });
    }

    // =========================
    // STREAM PASS THROUGH
    // =========================
    const responseHeaders = new Headers(CORS_HEADERS);

    upstream.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response("Proxy error: " + err.message, {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}