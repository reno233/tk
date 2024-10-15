const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path'); // Importa o módulo path para manipular caminhos de arquivos

(async () => {
    console.log('[INFO] Iniciando o script de automação.');

    // Iniciar uma nova instância do Chromium sem depuração remota
    console.log('[INFO] Iniciando uma nova instância do Chromium...');
    const browser = await chromium.launch({ headless: false }); // Define headless: false se você quiser ver o navegador, ou true para execução headless.
    const context = await browser.newContext();

    try {
        // Carregar cookies do arquivo
        console.log('[INFO] Carregando cookies do arquivo cookies.json...');
        const cookiesPath = path.resolve(__dirname, 'cookies.json'); // Corrigindo o caminho do arquivo de cookies
        const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
        await context.addCookies(cookies);
        console.log('[INFO] Cookies carregados e aplicados com sucesso.');
    } catch (error) {
        console.error('[ERROR] Erro ao carregar cookies:', error);
        await browser.close();
        process.exit(1);
    }

    const page = await context.newPage();

    try {
        console.log('[INFO] Navegando para a URL do vídeo...');
        await page.goto('https://www.tiktok.com/@stuckkonearth/video/7401193456355282219', { timeout: 100000, waitUntil: 'networkidle' });
        console.log('[INFO] Página do vídeo acessada com sucesso.');

        // Captura de tela após carregar a página
        await page.screenshot({ path: 'screenshot.png' }); // Captura de tela
        console.log('[INFO] Captura de tela salva como screenshot.png');
        
    } catch (error) {
        console.error('[ERROR] Erro ao acessar a página:', error);
        await browser.close();
        process.exit(1);
    }

    // Aguarde 10 segundos para garantir que todos os elementos da página sejam carregados
    console.log('[INFO] Aguardando 10 segundos para o carregamento completo da página...');
    await page.waitForTimeout(120000);

    // Verifique se o usuário está logado
    console.log('[INFO] Verificando se o login foi realizado...');
    try {
        const userProfileSelector = '#header-more-menu-icon'; // Exemplo de seletor para o menu de usuário
        const isLoggedIn = await page.$(userProfileSelector);

        if (isLoggedIn) {
            console.log('[INFO] Usuário está logado.');
        } else {
            console.log('[WARN] Usuário não está logado. Tentando relogar usando os cookies...');
        }
    } catch (error) {
        console.error('[ERROR] Erro ao verificar o login:', error);
    }

    // Aguarde 5 segundos antes de pressionar a tecla "Tab"
    console.log('[INFO] Aguardando 5 segundos antes de pressionar "Tab"...');
    await page.waitForTimeout(5000);

    // Pressiona a tecla "Tab" cinco vezes para focar no botão de curtir
    console.log('[INFO] Pressionando a tecla "Tab" 5 vezes para navegar até o botão de curtir...');
    try {
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('Tab');
            console.log(`[INFO] Tecla "Tab" pressionada (${i + 1}/5).`);
        }
    } catch (error) {
        console.error('[ERROR] Erro ao pressionar a tecla "Tab":', error);
    }

    // Aguarde 5 segundos antes de pressionar a tecla "L"
    console.log('[INFO] Aguardando 5 segundos antes de pressionar "L"...');
    await page.waitForTimeout(5000);

    // Pressiona a tecla "L" para curtir o vídeo
    console.log('[INFO] Pressionando a tecla "L" para curtir o vídeo...');
    try {
        await page.keyboard.press('l');
        console.log('[INFO] Vídeo curtido com sucesso!');
    } catch (error) {
        console.error('[ERROR] Erro ao tentar curtir o vídeo:', error);
    }

    // Aguarde 10 segundos antes de fechar o navegador
    console.log('[INFO] Aguardando 10 segundos antes de fechar o navegador...');
    await page.waitForTimeout(100000);

    console.log('[INFO] Fechando o navegador...');
    await browser.close();
    console.log('[INFO] Navegador fechado com sucesso.');
})();
