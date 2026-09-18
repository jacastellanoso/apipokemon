# Recurso general para asistentes de IA

## Propósito: COMPOUND

Lo aprendido se deposita, no se olvida. Este documento conserva las reglas y el proceso que cualquier asistente de IA debe respetar al colaborar en este repositorio.

## Reglas de oro

### 1. El servidor no confía en la entrada

- Considera no confiable todo dato que provenga de clientes, formularios, rutas, consultas, encabezados, archivos o servicios externos.
- Valida tipo, formato, longitud, rango y campos permitidos en el servidor antes de procesar los datos.
- Rechaza entradas inválidas con mensajes seguros y códigos HTTP apropiados.
- Escapa o parametriza los datos según su destino para prevenir XSS, inyección y otros ataques.
- No dependas exclusivamente de validaciones realizadas en el navegador.

### 2. Secretos en `.env`, nunca en el código

- No escribas contraseñas, tokens, claves privadas ni credenciales directamente en el código, las pruebas, la documentación o una colección Postman.
- Guarda los valores locales en archivos `.env`, que deben permanecer ignorados por Git.
- Documenta solamente los nombres de las variables en `.env.example`, con valores vacíos o ejemplos evidentemente ficticios.
- Antes de cada commit, comprueba que ningún secreto ni archivo `.env` esté incluido.
- Recuerda que las variables con prefijo `VITE_` se incorporan al código del navegador y, por tanto, no pueden contener secretos privados.

### 3. Si se filtra una clave: revocar y rotar

1. Detén su uso y notifica a la persona responsable del servicio.
2. Revoca o desactiva inmediatamente la credencial comprometida.
3. Genera una credencial nueva con los permisos mínimos necesarios.
4. Actualiza la nueva credencial en los entornos autorizados, nunca en Git.
5. Revisa registros y actividad para detectar usos no autorizados.
6. Elimina la credencial del código y, si fue publicada, coordina la limpieza del historial de Git. Borrarla del último commit no basta.
7. Verifica el funcionamiento y documenta el incidente sin copiar el secreto.

## Pruebas de Postman versionadas

1. Abre la colección en Postman.
2. Selecciona **More actions > Export**.
3. Elige **Collection v2.1**.
4. Exporta el archivo JSON dentro de `postman/`.
5. Revisa el JSON antes del commit y reemplaza secretos por variables, por ejemplo `{{api_key}}`.
6. No exportes valores sensibles de ambientes de Postman.

Convención recomendada: `postman/PokeWeb.postman_collection.json`.

## Entrega con Git

- [ ] Ejecutar `git fetch origin` y partir del `main` remoto actualizado.
- [ ] Trabajar en una rama dedicada, nunca directamente en `main`.
- [ ] Revisar `git diff` y `git status`.
- [ ] Confirmar que `.env` no aparezca entre los archivos preparados.
- [ ] Confirmar que `.env.example` sí esté versionado y no contenga secretos.
- [ ] Confirmar que la colección Postman v2.1 no contenga credenciales.
- [ ] Crear un commit descriptivo.
- [ ] Publicar la rama y abrir un Pull Request hacia `main`.
- [ ] Registrar qué pruebas y validadores se ejecutaron realmente.

## Límites para cualquier IA

- No inventar resultados de pruebas ni afirmar que algo fue verificado si no se ejecutó.
- No agregar dependencias sin autorización.
- No reducir controles de seguridad para resolver errores.
- No modificar archivos ajenos al objetivo solicitado.
- Explicar cualquier riesgo, supuesto o tarea pendiente de forma visible.
