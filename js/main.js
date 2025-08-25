// tsParticles
tsParticles.load("particles-js", {
  background: {
    color: { value: "#14161E" }
  },
  fpsLimit: 60,
  particles: {
    color: { value: "#F2CA00" },
    links: {
      enable: true,
      color: "#B20000",
      distance: 150,
      opacity: 0.5,
      twinkle: {
        enable: true,
        frequency: 0.1,
        color: { value: "#ffffff" }
      }
    },
    move: {
      enable: true,
      speed: 2
    },
    number: {
      value: 50
    },
    opacity: {
      value: 0.5
    },
    size: {
      value: { min: 1, max: 5 }
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.05,
        color: { value: "#ffffff" }
      }
    }
  }
});

// Navegação entre seções
const navButtons = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('main section');

navButtons.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    const target = button.getAttribute('data-section');

    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(target).classList.add('active');

    if (target === 'servicos') {
      checkVisibility();
      setTimeout(() => {
        ativarEventosNosServicos();
      }, 50);
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const headerHeight = document.querySelector('header').offsetHeight;
  const main = document.querySelector('main');

  const updatePadding = () => {
    const activeSection = document.querySelector('main section.active');
    if (activeSection) {
  main.style.paddingTop = `${headerHeight + 20}px`;
}
  };

  // Atualiza o padding ao carregar a página
  updatePadding();

  // E também quando os botões de navegação forem clicados
  const navButtons = document.querySelectorAll('nav button');
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Espera um pouco para dar tempo de trocar a seção
      setTimeout(updatePadding, 50);
    });
  });
});

const servicosResumo = {
  "Firewall": "Protege sua rede contra acessos não autorizados.",
  "Endpoint Protection": "Segurança para dispositivos e controle centralizado.",
  "Backup": "Backup automático e criptografado na nuvem.",
  "VPS": "Hospedagem segura e escalável para seus sistemas.",
  "Pentest": "Identificação de vulnerabilidades na sua infraestrutura.",
  "Gestão de TI": "Gerenciamento completo de ativos e suporte contínuo.",
  "Licenciamento": "Licenças originais para softwares corporativos.",
  "Email Profissional": "E-mails com domínio corporativo e antispam."
};

document.querySelectorAll('.servico-item').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const servico = el.getAttribute('data-target');

    document.getElementById('mini-title').innerText = servico;
    document.getElementById('mini-description').innerText = servicosResumo[servico] || '';
    document.getElementById('mini-info').style.display = 'block';
    document.getElementById('mini-overlay').style.display = 'block';

    document.getElementById('btn-saber-mais').onclick = () => {
      window.location.href = `${servico.toLowerCase().replace(/\s+/g, '-')}.html`;
    };
  });
});

// Fechar ao clicar no overlay
document.getElementById('mini-overlay').addEventListener('click', () => {
  document.getElementById('mini-info').style.display = 'none';
  document.getElementById('mini-overlay').style.display = 'none';
});





