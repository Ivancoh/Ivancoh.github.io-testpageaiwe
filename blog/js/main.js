document.addEventListener("DOMContentLoaded", () => {
  const isPostPage = window.location.pathname.includes("post.html");
  const postId = new URLSearchParams(window.location.search).get("id");

  const darkBtn = document.getElementById('darkModeBtn');
  const lightBtn = document.getElementById('lightModeBtn');
  const body = document.body;

  // Verifica se o usuário já escolheu um tema e aplica ao carregar a página
  const userTheme = localStorage.getItem('theme');
  if (userTheme === 'light') {
    body.classList.add('light-mode');
    if (darkBtn) darkBtn.style.display = 'none';
    if (lightBtn) lightBtn.style.display = 'inline';
  }

  // Aplica classes nos botões
  if (darkBtn) {
    darkBtn.classList.add('active');
    darkBtn.addEventListener('click', () => {
      body.classList.add('light-mode');
      darkBtn.style.display = 'none';
      lightBtn.style.display = 'inline';
      localStorage.setItem('theme', 'light');
    });
  }

  if (lightBtn) {
    lightBtn.addEventListener('click', () => {
      body.classList.remove('light-mode');
      lightBtn.style.display = 'none';
      darkBtn.style.display = 'inline';
      localStorage.setItem('theme', 'dark');
    });
  }

  // ---------------------
  // O RESTANTE DO SEU CÓDIGO VAI AQUI
  // ---------------------
  
  fetch("data/posts.json")
    .then(res => res.json())
    .then(posts => {
      if (isPostPage) {
        const post = posts.find(p => p.id === postId);
        if (!post) {
          document.getElementById("post-content").innerHTML = "<p>Post não encontrado.</p>";
          return;
        }

        document.title = post.title;
        document.getElementById("post-title").innerText = post.title;
        document.getElementById("post-date").innerText = post.date;
        document.getElementById("post-content").innerHTML = `
          ${post.content}
          <a href="index.html"><img src="assets/imagens/seta_voltar.png"><a href="index.html"></a>
        `;

        const hero = document.getElementById("hero");
        hero.style.backgroundImage = `url(${post.image})`;

        const initialSize = 130;
        window.addEventListener("scroll", () => {
          const scrollY = window.scrollY;
          const newSize = Math.max(100, initialSize - scrollY / 4);
          const blur = scrollY / 100;
          const opacity = Math.max(0, 1 - scrollY / 500);

          hero.style.backgroundSize = `${newSize}%`;
          hero.style.filter = `blur(${blur}px)`;
          hero.style.opacity = opacity;
        });
      } else {
        const container = document.getElementById("blog-list");
        posts.forEach(post => {
          const card = document.createElement("a");
          card.href = `post.html?id=${post.id}`;
          card.className = "card";
          card.innerHTML = `
            <img src="${post.image}" alt="${post.title}" />
            <h2>${post.title}</h2>
            <p>${post.description}</p>
          `;
          container.appendChild(card);
        });
      }
    })
    .catch(err => {
      console.error("Erro ao carregar os posts:", err);
    });

});
