import React, { useState } from 'react';
import { VIDEO_LECTURES, VideoLecture } from '../data/coaData';
import { Play, ExternalLink, Clock, Video, X } from 'lucide-react';

interface VideosViewProps {
  onSelectChapterNotes: (chapterId: string) => void;
}

export const VideosView: React.FC<VideosViewProps> = ({ onSelectChapterNotes }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);

  const filteredVideos = selectedFilter === 'all'
    ? VIDEO_LECTURES
    : VIDEO_LECTURES.filter(v => v.chapterId === selectedFilter);

  const filters = [
    { id: 'all', label: 'All Lectures' },
    { id: 'number-systems', label: 'Number Systems' },
    { id: 'cpu-registers', label: 'CPU & Registers' },
    { id: 'memory-hierarchy-cache', label: 'Memory & Cache' },
    { id: 'instruction-cycle-addressing', label: 'Addressing Modes' },
    { id: 'pipelining-io', label: 'Pipelining & DMA' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
      {/* Heading */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 mb-1">
          <Video className="w-4 h-4 text-blue-400" />
          <span>CURATED UNIVERSITY & GATE LECTURES</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Video Lectures by Topic
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Watch top-rated lectures from Gate Smashers, Jenny's Lectures, and Knowledge Gate directly inside the hub.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-[#0a1020] border border-blue-900/50 rounded-xl max-w-fit shadow-md">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedFilter === f.id
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Active Video Modal / Overlay */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070b16] rounded-2xl overflow-hidden max-w-4xl w-full border border-blue-900/60 shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-[#0a1020] flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white line-clamp-1">{activeVideo.title}</h3>
                <span className="text-xs text-blue-300">{activeVideo.channel} · {activeVideo.duration}</span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Iframe Container */}
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0a1020] border-t border-slate-800 flex items-center justify-between">
              <div className="flex flex-wrap gap-2 text-xs">
                {activeVideo.keyTopics.map((top, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300 font-mono">
                    {top}
                  </span>
                ))}
              </div>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeVideo.searchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                <span>Search Playlist on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((v) => (
          <div
            key={v.id}
            className="bg-[#080d1a] border border-blue-900/40 rounded-2xl overflow-hidden hover:border-blue-500/60 hover:shadow-xl transition-all flex flex-col"
          >
            {/* Thumbnail Canvas */}
            <div
              onClick={() => setActiveVideo(v)}
              className="relative aspect-video bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 flex items-center justify-center cursor-pointer group overflow-hidden border-b border-slate-800"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-500 transition-all">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
              <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 font-mono text-[11px] text-slate-200 border border-slate-700">
                {v.duration}
              </span>
            </div>

            {/* Video Meta */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-blue-400 mb-1.5">
                  <span>{v.channel}</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 leading-snug">
                  {v.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {v.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectChapterNotes(v.chapterId)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Read Notes →
                </button>
                <button
                  onClick={() => setActiveVideo(v)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors shadow-xs"
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
