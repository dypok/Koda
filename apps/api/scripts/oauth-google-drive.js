const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { google } = require('../node_modules/googleapis');

// Cargar variables de entorno desde apps/api/.env si existen
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID || process.argv[2];
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET || process.argv[3];
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:3333';
const FOLDER_ID = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || '11QZj-lMJBWMzylTEzsos1BB7ld9JRf0X';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: GOOGLE_DRIVE_CLIENT_ID y GOOGLE_DRIVE_CLIENT_SECRET deben estar definidos en apps/api/.env o pasarse como argumentos.');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);
  if (reqUrl.pathname === '/' || reqUrl.pathname === '/callback') {
    const code = reqUrl.query.code;
    const error = reqUrl.query.error;

    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>Error de Autorización</h1><p>${error}</p>`);
      console.error('Error de autorización:', error);
      server.close();
      return;
    }

    if (!code) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>Esperando autorización de Google Drive...</h1>');
      return;
    }

    try {
      console.log('\n[1/3] Código de autorización recibido de Google! Canjeando tokens...');
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Guardar tokens en apps/api/config/google-oauth-tokens.json
      const configDir = path.resolve(__dirname, '../config');
      if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
      
      const tokenPath = path.join(configDir, 'google-oauth-tokens.json');
      fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2), 'utf8');
      console.log('[2/3] Tokens guardados exitosamente en:', tokenPath);

      // Actualizar .env con las variables de OAuth
      const envPath = path.resolve(__dirname, '../.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        if (!envContent.includes('GOOGLE_DRIVE_CLIENT_ID')) {
          envContent += `\nGOOGLE_DRIVE_CLIENT_ID=${CLIENT_ID}\nGOOGLE_DRIVE_CLIENT_SECRET=${CLIENT_SECRET}\n`;
        }
        if (tokens.refresh_token) {
          if (envContent.includes('GOOGLE_DRIVE_REFRESH_TOKEN=')) {
            envContent = envContent.replace(/GOOGLE_DRIVE_REFRESH_TOKEN=.*/g, `GOOGLE_DRIVE_REFRESH_TOKEN=${tokens.refresh_token}`);
          } else {
            envContent += `GOOGLE_DRIVE_REFRESH_TOKEN=${tokens.refresh_token}\n`;
          }
        }
        fs.writeFileSync(envPath, envContent, 'utf8');
        console.log('Variables añadidas a apps/api/.env');
      }

      // Subir archivo de prueba "hola_mundo_koda.txt"
      console.log('[3/3] Subiendo archivo "hola_mundo_koda.txt" a Google Drive en la carpeta de 5TB...');
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const fileContent = '¡Hola Mundo Koda! 🦊\n\nEste archivo fue subido exitosamente a través de Google Drive API v3 con OAuth2.\nPropietario: bughunt3rs.dev@gmail.com\nAlmacenamiento: Plan Google Pro 5TB\nCarpeta: Koda_Certificados (ID: ' + FOLDER_ID + ')\nFecha y hora: ' + new Date().toISOString() + '\n';
      
      const stream = new Readable();
      stream.push(fileContent);
      stream.push(null);

      const driveRes = await drive.files.create({
        requestBody: {
          name: 'hola_mundo_koda.txt',
          parents: [FOLDER_ID],
          mimeType: 'text/plain',
        },
        media: {
          mimeType: 'text/plain',
          body: stream,
        },
        fields: 'id, name, webViewLink, webContentLink, size, createdTime',
      });

      console.log('\n======================================================');
      console.log('✅ ÉXITO TOTAL: ARCHIVO SUBIDO A TU GOOGLE DRIVE DE 5TB!');
      console.log('ID del archivo:', driveRes.data.id);
      console.log('Nombre:', driveRes.data.name);
      console.log('Enlace para ver:', driveRes.data.webViewLink);
      console.log('======================================================\n');

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family: sans-serif; text-align: center; padding: 40px; background: #0B0F19; color: #F8FAFC; min-height: 100vh;">
          <h1 style="color: #F59E0B;">🦊 ¡Koda Drive Conectado con Éxito!</h1>
          <p style="font-size: 18px; color: #94A3B8;">Tu cuenta de Google Drive con 5TB ha sido vinculada correctamente.</p>
          <div style="background: #1E293B; display: inline-block; padding: 20px 30px; border-radius: 12px; margin-top: 20px; border: 1px solid #334155;">
            <p style="margin: 0 0 10px 0; color: #10B981; font-weight: bold;">✔ Archivo de prueba creado:</p>
            <p style="margin: 0; font-family: monospace; font-size: 16px;">hola_mundo_koda.txt</p>
            <a href="${driveRes.data.webViewLink}" target="_blank" style="display: inline-block; margin-top: 15px; background: #38BDF8; color: #0B0F19; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">Abrir en Google Drive ↗</a>
          </div>
          <p style="margin-top: 30px; color: #64748B;">Ya puedes cerrar esta ventana y regresar a la terminal.</p>
        </div>
      `);

      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 3000);

    } catch (err) {
      console.error('Error durante el proceso:', err);
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>Error: ${err.message}</h1>`);
      server.close();
    }
  }
});

server.listen(3333, '127.0.0.1', () => {
  console.log('Servidor de captura escuchando en http://localhost:3333');
  console.log('Esperando que el usuario autorice el acceso en el navegador...');
});
