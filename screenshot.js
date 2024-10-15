const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('[INFO] Iniciando o script de automação.');

    // Iniciar uma nova instância do Chromium sem depuração remota
    const browser = await chromium.launch({ headless: true }); // Define headless: true para execução em segundo plano
    const context = await browser.newContext();

    try {
        // Carregar cookies do arquivo
        console.log('[INFO] Carregando cookies do arquivo cookies.json...');
        const cookiesPath = path.resolve(__dirname, 'cookies.json'); // Corrigindo o caminho do arquivo de cookies
        const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
        await context.addCookies(cookies);
        console.log('[INFO] Cookies carregados e aplicados com sucesso.');

        // Criar uma nova página após carregar os cookies
        const page = await context.newPage(); // Mover a criação da página aqui
        await page.screenshot({ path: 'screenshot_load_cookies.png' }); // Captura de tela após carregar cookies

        console.log('[INFO] Navegando para a URL do vídeo...');
        await page.goto('https://www.tiktok.com/@stuckkonearth/video/7401193456355282219', { timeout: 100000, waitUntil: 'networkidle' });
        console.log('[INFO] Página do vídeo acessada com sucesso.');
        await page.screenshot({ path: 'screenshot_page_accessed.png' }); // Captura de tela após acessar a página

    } catch (error) {
        console.error('[ERROR] Erro:', error);
        await browser.close();
        process.exit(1);
    }

    // Aguarde 2 minutos para garantir que todos os elementos da página sejam carregados
    await page.waitForTimeout(120000);
    
    console.log('[INFO] Fechando o navegador...');
    await browser.close();
    console.log('[INFO] Navegador fechado com sucesso.');

})();
