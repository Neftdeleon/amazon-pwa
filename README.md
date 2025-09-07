# Landing Afiliados - Neftalí

Landing tipo Linktree para usar con tu bio de Instagram. Contiene integración PWA (manifest + service worker) y workflow para deploy automático en GitHub Pages.

## ¿Cómo usar?
1. Clona este repositorio.
2. Coloca tus imágenes en la carpeta `images/`:
   - `perfil.jpg` (foto para header)
   - `avatar-192.png` y `avatar-512.png` (icons del manifest)
   - `placeholder-product.jpg` (opcional)
3. Edita `index.html` y reemplaza los enlaces `https://...` por tus links reales (Instagram, TikTok, Amazon con `?tag=TU-ID-AFILIADO-20`).
4. Haz commit y push a la rama `main`. El workflow `.github/workflows/pages.yml` desplegará automáticamente en GitHub Pages.
5. Ve a Settings → Pages en tu repo y configura el dominio si necesitas (por defecto `https://TU_USUARIO.github.io/TU_REPO/`).

## Notas de seguridad y mejoras
- Nunca coloques tus claves secretas (Amazon PA-API) en el frontend.
- Si quieres que la app obtenga imágenes automáticamente desde Amazon, configura una Function (Vercel/Firebase/Supabase) que llame a la PA-API y devuelva los datos al frontend.
