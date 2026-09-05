export default function FondoAnimado() {
  return (
<div className="triangle-background" aria-hidden="true">
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="triPattern" width="320" height="240" patternUnits="userSpaceOnUse">
        <rect width="320" height="240" fill="#173F7B"/>

        {/* FILA 1 */}
        <polygon className="tri-a" points="0,0 80,0 40,60" fill="#1A478C"/>
        <polygon className="tri-b" points="80,0 160,0 120,60" fill="#1A4380"/>
        <polygon className="tri-c" points="160,0 240,0 200,60" fill="#194487"/>
        <polygon className="tri-d" points="240,0 320,0 280,60" fill="#183F79"/>

        {/* FILA 2 */}
        <polygon className="tri-b" points="0,60 40,120 80,60" fill="#184081"/>
        <polygon className="tri-c" points="80,60 120,120 160,60" fill="#1A478C"/>
        <polygon className="tri-a" points="160,60 200,120 240,60" fill="#194487"/>
        <polygon className="tri-d" points="240,60 280,120 320,60" fill="#183D79"/>

        {/* FILA 3 */}
        <polygon className="tri-c" points="0,120 80,120 40,180" fill="#1A478C"/>
        <polygon className="tri-d" points="80,120 160,120 120,180" fill="#173F7B"/>
        <polygon className="tri-b" points="160,120 240,120 200,180" fill="#194487"/>
        <polygon className="tri-a" points="240,120 320,120 280,180" fill="#1A478C"/>

        {/* FILA 4 */}
        <polygon className="tri-a" points="0,180 40,240 80,180" fill="#194487"/>
        <polygon className="tri-b" points="80,180 120,240 160,180" fill="#183F7B"/>
        <polygon className="tri-d" points="160,180 200,240 240,180" fill="#19427F"/>
        <polygon className="tri-c" points="240,180 280,240 320,180" fill="#1A478C"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#triPattern)"/>
  </svg>
</div>
  );
}
