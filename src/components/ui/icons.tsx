const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PersonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function PersonalStoryIcon() {
  return (
    <svg
      width={14}
      height={20}
      viewBox="0 0 14 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0.75 18.75V16.75C0.75 15.6891 1.17143 14.6717 1.92157 13.9216C2.67172 13.1714 3.68913 12.75 4.75 12.75H8.75C9.81087 12.75 10.8283 13.1714 11.5784 13.9216C12.3286 14.6717 12.75 15.6891 12.75 16.75V18.75M2.75 4.75C2.75 5.81087 3.17143 6.82828 3.92157 7.57843C4.67172 8.32857 5.68913 8.75 6.75 8.75C7.81087 8.75 8.82828 8.32857 9.57843 7.57843C10.3286 6.82828 10.75 5.81087 10.75 4.75C10.75 3.68913 10.3286 2.67172 9.57843 1.92157C8.82828 1.17143 7.81087 0.75 6.75 0.75C5.68913 0.75 4.67172 1.17143 3.92157 1.92157C3.17143 2.67172 2.75 3.68913 2.75 4.75Z" />
    </svg>
  );
}

export function EmailIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Navbar icons
export function LogoArrowsIcon() {
  return (
    <svg {...iconProps} width={24} height={24}>
      <path d="M4 8h6l3-2" strokeWidth={1.5} />
      <path d="M4 12h10l3-2" strokeWidth={1.5} />
      <path d="M4 16h14l3-2" strokeWidth={1.5} />
    </svg>
  );
}

export function GridIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function PersonPlusIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

export function GiftIcon() {
  return (
    <svg {...iconProps}>
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

export function PenLineIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function LanguagesIcon() {
  return (
    <svg
      width={15}
      height={16}
      viewBox="0 0 15 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0.75 2.41667H6.58333M4.91667 0.75V2.41667C4.91667 6.09833 3.05083 9.08333 0.75 9.08333M1.58333 5.75C1.58333 7.53667 4.04333 9.00667 7.16667 9.08333M7.41667 14.9167L10.75 7.41667L14.0833 14.9167M13.3333 13.25H8.16667" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg {...iconProps}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg {...iconProps}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// Footer icons
export function FacebookIcon() {
  return (
    <svg {...iconProps} viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function TwitterXIcon() {
  return (
    <svg {...iconProps} viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function YoutubeIcon() {
  return (
    <svg {...iconProps} viewBox="0 0 24 24">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg {...iconProps} viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function StoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3L4 9l4 6 4-6-4-6z" />
      <path d="M4 15l4 6 4-6" />
      <path d="M12 9l4 6 4-6" />
    </svg>
  );
}

export function SaltIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function CompassIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export function AnchorIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="22" x2="12" y2="8" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </svg>
  );
}

export function LeafIcon() {
  return (
    <svg {...iconProps}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function MapPinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function PaletteIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="13.5" cy="6.5" r="1.5" stroke="none" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="1.5" stroke="none" fill="currentColor" />
      <circle cx="8.5" cy="10.5" r="1.5" stroke="none" fill="currentColor" />
      <circle cx="13.5" cy="14.5" r="1.5" stroke="none" fill="currentColor" />
    </svg>
  );
}

export function MusicIcon() {
  return (
    <svg {...iconProps}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
    </svg>
  );
}

export function CameraIcon() {
  return (
    <svg {...iconProps}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export function FileTextIcon() {
  return (
    <svg {...iconProps}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

export function IdCardIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <circle cx="8" cy="10" r="2" />
      <line x1="14" y1="10" x2="20" y2="10" />
      <line x1="14" y1="14" x2="18" y2="14" />
    </svg>
  );
}

export function GlobeIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function CloudUploadIcon() {
  return (
    <svg {...iconProps} width={20} height={20}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export function ChevronDownIcon() {
  return (
    <svg {...iconProps} width={18} height={18}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function Grid2x2Icon() {
  return (
    <svg {...iconProps} width={16} height={16} viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg {...iconProps}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

export function HeadsetIcon() {
  return (
    <svg
      width="16"
      height="18"
      viewBox="0 0 15 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0.75 9.91667V7.41667C0.75 5.64856 1.45238 3.95286 2.70262 2.70262C3.95286 1.45238 5.64856 0.75 7.41667 0.75C9.18478 0.75 10.8805 1.45238 12.1307 2.70262C13.381 3.95286 14.0833 5.64856 14.0833 7.41667V9.91667M0.75 9.91667C0.75 9.47464 0.925595 9.05072 1.23816 8.73816C1.55072 8.42559 1.97464 8.25 2.41667 8.25H3.25C3.69203 8.25 4.11595 8.42559 4.42851 8.73816C4.74107 9.05072 4.91667 9.47464 4.91667 9.91667V12.4167C4.91667 12.8587 4.74107 13.2826 4.42851 13.5952C4.11595 13.9077 3.69203 14.0833 3.25 14.0833H2.41667C1.97464 14.0833 1.55072 13.9077 1.23816 13.5952C0.925595 13.2826 0.75 12.8587 0.75 12.4167V9.91667ZM14.0833 9.91667C14.0833 9.47464 13.9077 9.05072 13.5952 8.73816C13.2826 8.42559 12.8587 8.25 12.4167 8.25H11.5833C11.1413 8.25 10.7174 8.42559 10.4048 8.73816C10.0923 9.05072 9.91667 9.47464 9.91667 9.91667V12.4167C9.91667 12.8587 10.0923 13.2826 10.4048 13.5952C10.7174 13.9077 11.1413 14.0833 11.5833 14.0833H12.4167M14.0833 9.91667V12.4167C14.0833 12.8587 13.9077 13.2826 13.5952 13.5952C13.2826 13.9077 12.8587 14.0833 12.4167 14.0833M12.4167 14.0833C12.4167 15.4642 10.1783 16.5833 7.41667 16.5833" />
    </svg>
  );
}

export function ContributeIcon() {
  return (
    <svg
      width={30}
      height={29}
      viewBox="0 0 30 29"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M25.75 27.4167L22.4167 24.0833V4.08333C22.4167 2.215 23.8817 0.75 25.75 0.75C27.6183 0.75 29.0833 2.215 29.0833 4.08333V24.0833L25.75 27.4167ZM25.75 27.4167H4.08333C3.19928 27.4167 2.35143 27.0655 1.72631 26.4404C1.10119 25.8152 0.75 24.9674 0.75 24.0833C0.75 23.1993 1.10119 22.3514 1.72631 21.7263C2.35143 21.1012 3.19928 20.75 4.08333 20.75H10.75C11.6341 20.75 12.4819 20.3988 13.107 19.7737C13.7321 19.1486 14.0833 18.3007 14.0833 17.4167C14.0833 16.5326 13.7321 15.6848 13.107 15.0596C12.4819 14.4345 11.6341 14.0833 10.75 14.0833H5.75M22.4167 7.41667H29.0833" />
    </svg>
  );
}
