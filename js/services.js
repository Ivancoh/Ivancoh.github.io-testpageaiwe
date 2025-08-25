// Função para carregar o cabeçalho e rodapé (reutilizável)
function loadSharedElements() {
  fetch('assets/data/services.json')
    .then(response => response.json())
    .then(services => {
      const header = document.getElementById('header');
      const footer = document.getElementById('footer');
      
      // Carrega cabeçalho e rodapé (pode ser via fetch ou template string)
      header.innerHTML = `
        <nav>...
		<button style="background:#F2CA00; color:#14161E; border:none; padding:10px 20px; cursor:pointer; font-weight:bold;" onclick="window.location.href='/Ivancoh.github.io-testpageaiwe/'">
          ← Voltar para o site
        </button>
		</nav>
      `;
      /*footer.innerHTML = `
	  <div class="social-links">
        <a href="https://facebook.com/suaempresa" target="_blank"><i class="fab fa-facebook"></i></a>
        <a href="https://instagram.com/suaempresa" target="_blank"><i class="fab fa-instagram"></i></a>
        <a href="https://linkedin.com/company/suaempresa" target="_blank"><i class="fab fa-linkedin"></i></a>
        <a href="https://wa.me/5511999999999" target="_blank"><i class="fab fa-whatsapp"></i></a>
      </div>
        <p>© 2025 Aiwe Tech Solutions</p>
      `;*/
    });
}

// Função para carregar o serviço específico
function loadService(serviceId) {
  fetch('assets/data/services.json')
    .then(response => response.json())
    .then(services => {
      const service = services.find(s => s.id === serviceId);
      const serviceContent = document.getElementById('service-content');
      
      if (service) {
        serviceContent.innerHTML = `
          <h1>${service.title}</h1>
          <img src="assets/images/${service.image}" alt="${service.title}">
          <p>${service.description}</p>
          <ul>
            ${service.features.map(feat => `<li>${feat}</li>`).join('')}
          </ul>
        `;
      } else {
        serviceContent.innerHTML = `<p>Serviço não encontrado.</p>`;
      }
    });
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  loadSharedElements();
});