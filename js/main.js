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

    if (target === 'servicos') checkVisibility();
  });
});

// Visibilidade de serviços
const services = document.querySelectorAll('.service');

function checkVisibility() {
  const servicosSection = document.getElementById('servicos');
  if (!servicosSection.classList.contains('active')) return;

  const triggerBottom = window.innerHeight * 0.9;

  services.forEach(service => {
    const serviceTop = service.getBoundingClientRect().top;

    if (serviceTop < triggerBottom) {
      service.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);

// Modal de serviços
const servicesDivs = document.querySelectorAll('.service');
const modal = document.getElementById('service-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.querySelector('.modal .close');

servicesDivs.forEach(service => {
  service.addEventListener('click', () => {
    const icon = service.querySelector('.icon');
    const title = icon.getAttribute('data-title');
    const description = icon.getAttribute('data-description');

    modalTitle.textContent = title;
    modalDescription.textContent = description;

    modal.style.display = 'flex';
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
