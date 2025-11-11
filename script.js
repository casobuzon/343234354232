export default {
  async fetch(request) {
    // HTML que se mostrará
    const html = `
       `;

    // Respuesta con cabecera de tipo HTML
    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};

