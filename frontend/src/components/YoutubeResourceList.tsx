"use client";

import { youtubeResources } from "@/data/mockData";

export default function YoutubeResourceList() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {youtubeResources.map((resource, i) => (
        <a
          key={resource.id}
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`card-glow animate-fade-in-up stagger-${i + 1} group rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden transition-all`}
        >
          {/* Thumbnail */}
          <div className="relative aspect-video w-full bg-zinc-800">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 shadow-lg shadow-red-900/30 transition-transform duration-200 group-hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>

            {/* Duration badge */}
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {resource.duration}
            </span>
          </div>

          {/* Info */}
          <div className="p-3.5">
            <h3 className="mb-1 line-clamp-2 text-sm font-medium leading-snug text-zinc-200 group-hover:text-white">
              {resource.title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <span>{resource.channel}</span>
              <span>·</span>
              <span>{resource.views} views</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
