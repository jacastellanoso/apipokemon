// Íconos SVG inline para el pie de página (sin librerías externas).
// Todos son decorativos: el texto que acompañan ya describe el dato.
const PROPS_BASE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

export function IconoFacebook({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <path d="M15.5 8.5H14a1.5 1.5 0 0 0-1.5 1.5v2H15l-.4 2.5h-2.1V21H10v-6.5H8.3v-2.5H10v-2A3.5 3.5 0 0 1 13.5 6h2v2.5Z" />
    </svg>
  );
}

export function IconoInstagram({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

export function IconoYoutube({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.3v5.4l5-2.7-5-2.7Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconoWhatsapp({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <path d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.5-1.2A9 9 0 1 0 12 3Z" />
      <path
        d="M8.5 8.6c.3-.6.6-.6 1-.6h.5c.2 0 .4.1.5.4l.7 1.5c.1.2 0 .5-.1.6l-.5.6c-.2.2-.2.4-.1.6.4.7 1.3 1.6 2 2 .2.1.4.1.6-.1l.6-.5c.2-.1.4-.2.6-.1l1.5.7c.3.1.4.3.4.5v.5c0 .4 0 .7-.6 1-1.3.7-3.3.1-5.1-1.7-1.8-1.7-2.4-3.7-1.7-5Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function IconoUbicacion({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function IconoTelefono({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <path d="M6.5 3h3l1.5 4-2 2a12 12 0 0 0 6 6l2-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
    </svg>
  );
}

export function IconoCorreo({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
