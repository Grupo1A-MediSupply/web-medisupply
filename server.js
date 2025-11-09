const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Serve static files from the dist directory
// This must come before the catch-all route
app.use(express.static(path.join(__dirname, 'dist/medical-distribution-prototype'), {
  maxAge: '1y',
  etag: false,
  index: false, // Don't serve index.html for directory requests
  setHeaders: (res, filePath) => {
    // Set correct MIME types for JavaScript files
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Handle Angular routing - serve index.html for all non-file requests
// This must come after the static files middleware
app.get('*', (req, res) => {
  // Only serve index.html for routes that don't have file extensions
  if (!req.path.includes('.')) {
    const indexPath = path.join(__dirname, 'dist/medical-distribution-prototype/index.html');
    
    // Leer el archivo index.html
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Inyectar las variables de entorno en window.env antes del cierre de </head>
    const envScript = `
    <script>
      window.env = {
        PROD_AUTH_URL: '${process.env.PROD_AUTH_URL || ''}',
        PROD_PRODUCT_URL: '${process.env.PROD_PRODUCT_URL || ''}',
        PROD_ORDER_URL: '${process.env.PROD_ORDER_URL || ''}',
        PROD_LOGISTICS_URL: '${process.env.PROD_LOGISTICS_URL || ''}',
        PROD_NOTIFICATIONS_URL: '${process.env.PROD_NOTIFICATIONS_URL || ''}'
      };
    </script>
    `;
    
    // Insertar el script antes del cierre de </head> o al inicio de <body>
    if (html.includes('</head>')) {
      html = html.replace('</head>', envScript + '</head>');
    } else if (html.includes('<body>')) {
      html = html.replace('<body>', '<body>' + envScript);
    } else {
      html = envScript + html;
    }
    
    res.send(html);
  } else {
    // If it's a file request that wasn't found, return 404
    res.status(404).send('File not found');
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
