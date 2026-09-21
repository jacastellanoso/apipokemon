// Íconos SVG inline para la sección de disponibilidad (sin librerías externas).
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

export function IconoLaboratorio({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

export function IconoEdificio({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <path d="M5 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16" />
      <path d="M13 21V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v12" />
      <path d="M9 8h.01M9 12h.01M9 16h.01" />
      <path d="M3 21h18" />
    </svg>
  );
}

export function IconoCapacidad({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    </svg>
  );
}

export function IconoReservas({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

export function IconoReservarAccion({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="M8.5 15l2 2 4.5-4.5" />
    </svg>
  );
}

export function IconoResponsable({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function IconoMotivo({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function IconoInicio({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export function IconoFin({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <path d="M5 21V4" />
      <path d="M5 4h13l-3 4 3 4H5" />
    </svg>
  );
}

export function IconoExito({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

export function IconoAdvertencia({ className }) {
  return (
    <svg {...PROPS_BASE} className={className}>
      <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
      <path d="M12 10v4M12 17h.01" />
    </svg>
  );
}
