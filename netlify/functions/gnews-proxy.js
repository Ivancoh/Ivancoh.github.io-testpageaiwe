// Fallbacks específicos para cada serviço
const SERVICE_FALLBACKS = {
  'firewall': [
    {
      title: "Firewall AIWE: Proteção avançada contra ataques cibernéticos",
      description: "Soluções de segurança de última geração para empresas brasileiras",
      url: "https://www.aiwe.com.br/servicos-landing/firewall.html",
      publishedAt: new Date().toISOString(),
      source: { name: "AIWE Segurança" }
    },
    {
      title: "Ataques cibernéticos aumentam 150% no Brasil em 2024",
      description: "Firewalls profissionais são essenciais para proteção empresarial",
      url: "https://www.aiwe.com.br/servicos-landing/firewall.html",
      publishedAt: new Date().toISOString(),
      source: { name: "AIWE Alertas" }
    }
  ],
  'backup': [
    {
      title: "Backup AIWE: Proteção completa contra perda de dados",
      description: "Soluções em nuvem com criptografia avançada",
      url: "https://valor.globo.com/patrocinado/dino/noticia/2025/08/08/transportadora-reduz-custos-em-40-ao-migrar-para-nuvem-1.ghtml",
      publishedAt: new Date().toISOString(),
      source: { name: "AIWE Backup" }
    },
    {
      title: "Ransomware: 70% das PMEs pagam resgate sem backup adequado",
      description: "Backup automatizado previne prejuízos milionários",
      url: "https://www.aiwe.com.br/servicos-landing/backup.html",
      publishedAt: new Date().toISOString(),
      source: { name: "AIWE Segurança" }
    }
  ],
  'gestao-ti': [
    {
      title: "Gestão de TI AIWE: Otimização completa da infraestrutura",
      description: "Aumente a eficiência e reduza custos operacionais",
      url: "https://www.aiwe.com.br/servicos-landing/gestao-ti.html",
      publishedAt: new Date().toISOString(),
      source: { name: "AIWE Gestão" }
    },
    {
      title: "Empresas com gestão de TI profissional têm 45% mais produtividade",
      description: "Monitoramento proativo evita problemas e otimiza recursos",
      url: "https://www.aiwe.com.br/servicos-landing/gestao-ti.html",
      publishedAt: new Date().toISOString(),
      source: { name: "AIWE Eficiência" }
    }
  ],
  'help-desk': [
    {
      title: "Help Desk AIWE: Suporte técnico 24/7 especializado",
      description: "Resolução rápida de problemas com equipe certificada",
      url: "https://www.aiwe.com.br/servicos-landing/help-desk.html",
      publishedAt: new Date().toISOString(),
      source: { name: "AIWE Suporte" }
    },
    {
      title: "Suporte remoto resolve 85% dos problemas em menos de 15 minutos",
      description: "Tecnologia de acesso remoto agiliza atendimento",
      url: "https://www.aiwe.com.br/servicos-landing/help-desk.html",
      publishedAt: new Date().toISOString(),
      source: { name: "AIWE Eficiência" }
    }
  ],
  'servicos-personalizados': [
    {
      title: "Soluções Personalizadas AIWE: TI sob medida para seu negócio",
      description: "Desenvolvimento de software e infraestrutura customizada",
      url: "https://www.aiwe.com.br/servicos-landing/servicos-personalizados.html",
      publishedAt: new Date().toISOString(),
      source: { name: "AIWE Custom" }
    },
    {
      title: "Soluções TI personalizadas aumentam eficiência em 60%",
      description: "Sistemas desenvolvidos especificamente para seu negócio",
      url: "https://www.aiwe.com.br/servicos-landing/servicos-personalizados.html",
      publishedAt: new Date().toISOString(),
      source: { name: "AIWE Inovação" }
    }
  ]
};

exports.handler = async function(event, context) {
  // Configura CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Responde a preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { q = 'segurança firewall', max = 5, service = 'firewall' } = event.queryStringParameters;
    const apiKey = process.env.GNEWS_API_KEY;
    
    console.log('Função executando - Service:', service, 'Query:', q);
    
    // Se não tem API key, retorna fallback específico do serviço
    if (!apiKey) {
      const fallbackNews = SERVICE_FALLBACKS[service] || SERVICE_FALLBACKS.firewall;
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          articles: fallbackNews, 
          source: 'fallback',
          service: service,
          message: 'Usando conteúdo AIWE para ' + service
        })
      };
    }
    
    // Usando fetch nativo (disponível no ambiente Netlify Functions)
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=pt&country=br&max=${max}&apikey=${apiKey}`;
    
    console.log('Buscando notícias da GNews:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`GNews API retornou status ${response.status}`);
    }
    
    const data = await response.json();

    // Se não encontrou notícias, usa fallback específico
    if (!data.articles || data.articles.length === 0) {
      const fallbackNews = SERVICE_FALLBACKS[service] || SERVICE_FALLBACKS.firewall;
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          articles: fallbackNews, 
          source: 'fallback',
          service: service,
          message: 'Nenhuma notícia encontrada, usando conteúdo AIWE'
        })
      };
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...data, 
        source: 'gnews',
        service: service,
        message: 'Notícias em tempo real para ' + service
      })
    };
    
  } catch (error) {
    console.error('Erro na Netlify Function:', error);
    
    const { service = 'firewall' } = event.queryStringParameters;
    const fallbackNews = SERVICE_FALLBACKS[service] || SERVICE_FALLBACKS.firewall;
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        articles: fallbackNews,
        source: 'fallback',
        service: service,
        error: error.message,
        message: 'Erro na API, usando conteúdo AIWE'
      })
    };
  }
};