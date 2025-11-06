const fetch = require('node-fetch');

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
      url: "https://www.aiwe.com.br/servicos-landing/backup.html",
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

// Queries otimizadas em português para cada serviço
const SERVICE_QUERIES = {
  'firewall': [
    'firewall segurança empresa Brasil',
    'ataque cibernético proteção rede',
    'ransomware firewall prevenção',
    'segurança rede pequenas empresas'
  ],
  'backup': [
    'backup dados nuvem empresa',
    'ransomware backup recuperação dados', 
    'perda dados negócio prevenção',
    'backup automático nuvem segurança'
  ],
  'gestao-ti': [
    'gestão TI empresas produtividade',
    'terceirização TI economia custos',
    'monitoramento TI infraestrutura',
    'otimização TI pequenas empresas'
  ],
  'help-desk': [
    'suporte técnico help desk empresas',
    'terceirização suporte TI economia',
    'atendimento remoto TI eficiência', 
    'suporte 24h produtividade empresas'
  ],
  'servicos-personalizados': [
    'soluções TI personalizadas empresas',
    'desenvolvimento software sob medida',
    'consultoria TI transformação digital',
    'sistemas customizados negócios'
  ]
};

// Detecta o serviço baseado na query
function detectService(query) {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('firewall') || queryLower.includes('segurança') || queryLower.includes('ataque')) {
    return 'firewall';
  } else if (queryLower.includes('backup') || queryLower.includes('dados') || queryLower.includes('ransomware')) {
    return 'backup'; 
  } else if (queryLower.includes('gestão') || queryLower.includes('ti') || queryLower.includes('infraestrutura')) {
    return 'gestao-ti';
  } else if (queryLower.includes('help') || queryLower.includes('suporte') || queryLower.includes('atendimento')) {
    return 'help-desk';
  } else if (queryLower.includes('personalizad') || queryLower.includes('sob medida') || queryLower.includes('custom')) {
    return 'servicos-personalizados';
  }
  
  return 'firewall'; // default
}

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
    const { q = 'segurança firewall', max = 5, service } = event.queryStringParameters;
    const apiKey = process.env.GNEWS_API_KEY;
    
    // Detecta o serviço automaticamente se não especificado
    const detectedService = service || detectService(q);
    
    console.log('Função executando - Service:', detectedService, 'Query:', q);
    
    // Se não tem API key, retorna fallback específico do serviço
    if (!apiKey) {
      const fallbackNews = SERVICE_FALLBACKS[detectedService] || SERVICE_FALLBACKS.firewall;
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          articles: fallbackNews, 
          source: 'fallback',
          service: detectedService,
          message: 'Usando conteúdo AIWE para ' + detectedService
        })
      };
    }
    
    // Usa query específica do serviço ou a query recebida
    const serviceQueries = SERVICE_QUERIES[detectedService] || SERVICE_QUERIES.firewall;
    const randomQuery = serviceQueries[Math.floor(Math.random() * serviceQueries.length)];
    const searchQuery = q !== 'segurança firewall' ? q : randomQuery;
    
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=pt&country=br&max=${max}&apikey=${apiKey}`;
    
    console.log('Buscando notícias da GNews:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`GNews API retornou status ${response.status}`);
    }
    
    const data = await response.json();

    // Se não encontrou notícias, usa fallback específico
    if (!data.articles || data.articles.length === 0) {
      const fallbackNews = SERVICE_FALLBACKS[detectedService] || SERVICE_FALLBACKS.firewall;
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          articles: fallbackNews, 
          source: 'fallback',
          service: detectedService,
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
        service: detectedService,
        message: 'Notícias em tempo real para ' + detectedService
      })
    };
    
  } catch (error) {
    console.error('Erro na Netlify Function:', error);
    
    const { q = 'segurança firewall' } = event.queryStringParameters;
    const detectedService = detectService(q);
    const fallbackNews = SERVICE_FALLBACKS[detectedService] || SERVICE_FALLBACKS.firewall;
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        articles: fallbackNews,
        source: 'fallback',
        service: detectedService,
        error: error.message,
        message: 'Erro na API, usando conteúdo AIWE'
      })
    };
  }
};