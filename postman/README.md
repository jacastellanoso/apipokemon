# Colecciones de Postman

Guarda en esta carpeta las pruebas exportadas desde Postman con el formato **Collection v2.1**.

Nombre recomendado:

```text
PokeWeb.postman_collection.json
```

Antes de versionar una colección:

- elimina tokens, contraseñas, cookies y claves reales;
- utiliza variables de Postman, como `{{base_url}}` y `{{api_key}}`;
- verifica que los ejemplos de solicitudes y respuestas no contengan datos sensibles;
- importa nuevamente el JSON para comprobar que la colección sea válida.

> El archivo JSON debe provenir de la colección real. No se incluye una colección ficticia porque no representaría las pruebas ejecutadas del proyecto.
