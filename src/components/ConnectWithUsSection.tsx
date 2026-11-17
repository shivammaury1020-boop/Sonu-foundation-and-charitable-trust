import React from 'react';
import { ExternalLink, Facebook, Instagram, Youtube } from 'lucide-react';
import { OFFICIAL_SOCIAL_PROFILES, SOCIAL_MEDIA_URLS } from '../data/siteData';

interface ConnectWithUsSectionProps {
  variant?: 'home' | 'contact';
}

export const ConnectWithUsSection: React.FC<ConnectWithUsSectionProps> = ({
  variant = 'home',
}) => {
  const isHome = variant === 'home';
  const instagramAndFacebookProfiles = OFFICIAL_SOCIAL_PROFILES.filter(
    (profile) => profile.platform !== 'youtube'
  );
  const youtubeProfile = OFFICIAL_SOCIAL_PROFILES.find(
    (profile) => profile.platform === 'youtube'
  );
  const youtubeChannelUrl = (youtubeProfile?.url || SOCIAL_MEDIA_URLS.youtubeChannel || '').trim();
  const isYouTubeChannelActive = /^https?:\/\//i.test(youtubeChannelUrl);

  return (
    <section
      aria-labelledby="connect-with-us-heading"
      className={
        isHome
          ? 'py-12 sm:py-14 bg-[#F6EFE7] border-t border-[#C8A15A]/25'
          : 'pt-8 border-t border-[#C8A15A]/30'
      }
    >
      <div className={isHome ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' : 'w-full'}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6B173D] block">
              OFFICIAL SOCIAL CHANNELS
            </span>
            <h2
              id="connect-with-us-heading"
              className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#201B1D] text-balance"
            >
              Connect With Us
            </h2>
            <p className="text-sm sm:text-base text-[#6E6265] leading-relaxed">
              Follow our studio updates, student showcases, tutorials, academy announcements, and community initiatives across our official Instagram, Facebook, and YouTube channels.
            </p>
          </div>

          {isYouTubeChannelActive ? (
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Subscribe on YouTube – Sonu's Beauty Studio & Academy (${SOCIAL_MEDIA_URLS.youtubeHandle}) (opens in a new tab)`}
              className="inline-flex items-center justify-center gap-2.5 bg-[#6B173D] hover:bg-[#4A0D29] text-white border border-[#C8A15A]/60 text-sm font-semibold px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B173D]"
            >
              <Youtube className="w-5 h-5 text-[#E6C98F] shrink-0" aria-hidden="true" />
              <span>Subscribe on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#E6C98F]/85 shrink-0" aria-hidden="true" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex items-center justify-center gap-2.5 bg-[#6B173D]/55 text-white/85 border border-[#C8A15A]/40 text-sm font-semibold px-5 py-3 rounded-xl opacity-80 cursor-not-allowed whitespace-nowrap shrink-0"
            >
              <Youtube className="w-5 h-5 text-[#E6C98F]/80 shrink-0" aria-hidden="true" />
              <span>YouTube · Pending Verification</span>
            </button>
          )}
        </div>

        {/* Instagram & Facebook Official Profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {instagramAndFacebookProfiles.map((profile) => {
            const isInstagram = profile.platform === 'instagram';

            return (
              <a
                key={profile.id}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${profile.platformLabel} – ${profile.accountName} (opens in a new tab)`}
                className="group bg-white hover:bg-[#FAF5EF] rounded-2xl p-5 border border-[#C8A15A]/40 hover:border-[#6B173D] shadow-sm hover:shadow-md transition-all duration-150 hover:-translate-y-0.5 flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B173D]"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-[#4A0D29] group-hover:bg-[#6B173D] border border-[#C8A15A]/60 flex items-center justify-center shrink-0 transition-colors duration-150"
                  aria-hidden="true"
                >
                  {isInstagram ? (
                    <Instagram className="w-5 h-5 text-[#E6C98F]" />
                  ) : (
                    <Facebook className="w-5 h-5 text-[#E6C98F]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B173D]">
                    {profile.platformLabel}
                  </div>
                  <div className="font-serif-luxury text-base font-bold text-[#201B1D] group-hover:text-[#4A0D29] leading-snug mt-0.5">
                    {profile.accountName}
                  </div>
                </div>

                <ExternalLink
                  className="w-4 h-4 text-[#C8A15A] group-hover:text-[#6B173D] shrink-0 transition-colors duration-150"
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>

        {/* Official YouTube Channel Feature Card */}
        {youtubeProfile && (
          isYouTubeChannelActive ? (
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${youtubeProfile.platformLabel} – ${youtubeProfile.accountName}${youtubeProfile.handle ? ` (${youtubeProfile.handle})` : ''} — Subscribe on YouTube (opens in a new tab)`}
              className="group mt-4 sm:mt-5 bg-white hover:bg-[#FAF5EF] rounded-2xl p-5 sm:p-6 border border-[#C8A15A]/45 hover:border-[#6B173D] shadow-sm hover:shadow-md transition-all duration-150 hover:-translate-y-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B173D]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-12 h-12 rounded-xl bg-[#4A0D29] group-hover:bg-[#6B173D] border border-[#C8A15A]/60 flex items-center justify-center shrink-0 transition-colors duration-150"
                  aria-hidden="true"
                >
                  <Youtube className="w-5 h-5 text-[#E6C98F]" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B173D]">
                      {youtubeProfile.platformLabel}
                    </span>
                    {youtubeProfile.handle && (
                      <>
                        <span aria-hidden="true" className="text-[#C8A15A]">·</span>
                        <span className="text-xs font-medium text-[#6E6265] truncate">
                          {youtubeProfile.handle}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="font-serif-luxury text-lg font-bold text-[#201B1D] group-hover:text-[#4A0D29] leading-snug mt-0.5">
                    {youtubeProfile.accountName}
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E6C98F] to-[#C8A15A] group-hover:from-[#F0D7A3] group-hover:to-[#C8A15A] text-[#201B1D] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-sm transition-all duration-150 whitespace-nowrap shrink-0">
                <Youtube className="w-4 h-4 text-[#4A0D29] shrink-0" aria-hidden="true" />
                <span>Subscribe on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#4A0D29]/80 shrink-0" aria-hidden="true" />
              </span>
            </a>
          ) : (
            <div
              aria-disabled="true"
              className="mt-4 sm:mt-5 bg-white/80 rounded-2xl p-5 sm:p-6 border border-[#C8A15A]/35 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-12 h-12 rounded-xl bg-[#4A0D29]/70 border border-[#C8A15A]/45 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Youtube className="w-5 h-5 text-[#E6C98F]/80" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B173D]">
                      {youtubeProfile.platformLabel}
                    </span>
                    <span aria-hidden="true" className="text-[#C8A15A]">·</span>
                    <span className="text-xs font-medium text-[#6E6265]">
                      Channel Link Pending Verification
                    </span>
                  </div>
                  <div className="font-serif-luxury text-lg font-bold text-[#201B1D] leading-snug mt-0.5">
                    {youtubeProfile.accountName}
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center justify-center gap-2 bg-[#E6C98F]/45 text-[#201B1D]/65 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl cursor-not-allowed whitespace-nowrap shrink-0"
              >
                <Youtube className="w-4 h-4 text-[#4A0D29]/60 shrink-0" aria-hidden="true" />
                <span>Pending Verification</span>
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
};
