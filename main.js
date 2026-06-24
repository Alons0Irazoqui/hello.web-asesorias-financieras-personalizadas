/* ============================================================
   Créditos a Pensionados y Jubilados — JS principal
   Animaciones nativas (sin librerías externas)
   ============================================================ */
(function () {
  'use strict';

  /* ─── CLASES CSS para scroll-reveal (definidas en style.css) ─ */
  // .scroll-hidden  → estado inicial invisible
  // .scroll-visible → estado final visible

  /* ─── FORMULARIO → WHATSAPP ─────────────────────────────── */
  function initWhatsAppForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const WA = '5214492888888';

    form.addEventListener('submit', e => {
      e.preventDefault();

      const nombre       = (form.querySelector('#nombre')?.value        || '').trim();
      const telefono     = (form.querySelector('#telefono')?.value      || '').trim();
      const email        = (form.querySelector('#email')?.value         || '').trim();
      const sel          = form.querySelector('#servicio');
      const servicio     = sel && sel.selectedIndex > 0
        ? sel.options[sel.selectedIndex].text
        : 'No especificado';
      const nss          = (form.querySelector('#nss')?.value           || '').trim();
      const montoPension = (form.querySelector('#monto-pension')?.value || '').trim();
      const mensaje      = (form.querySelector('#mensaje')?.value       || '').trim();

      if (!nombre || !telefono) {
        alert('Por favor completa tu Nombre y Teléfono.');
        return;
      }

      const txt =
`¡Hola! Solicito información sobre un crédito para pensionados.

👤 *Nombre:* ${nombre}
📱 *Teléfono:* ${telefono}
📧 *Email:* ${email || 'No proporcionado'}
📋 *Tipo de pensión:* ${servicio}
🔢 *NSS:* ${nss || 'No proporcionado'}
💰 *Monto aprox. de pensión:* ${montoPension ? '$' + montoPension + ' MXN' : 'No proporcionado'}
💬 *Mensaje:* ${mensaje || 'Sin mensaje adicional'}`;

      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener,noreferrer');
    });
  }

  /* ─── CSS SCROLL-REVEAL (secciones que no son el hero) ───── */
  // hero-animations.js ya inyecta .scroll-hidden / .scroll-visible.
  // Este archivo sólo inicia el formulario WA y el header scroll.

  /* ─── HEADER SCROLL ──────────────────────────────────────── */
  // hero-animations.js ya lo maneja con initHeader().
  // No duplicar.

  /* ─── INIT ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initWhatsAppForm();
  });

})();
