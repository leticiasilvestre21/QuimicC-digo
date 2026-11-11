(function () {
    const chaveTema = "quimic-codigo-tema";
    function aplicarTema(tema) {
        document.body.classList.toggle("tema-escuro", tema === "escuro");
        document.querySelectorAll(".tema-toggle").forEach(function (botao) {
            botao.textContent = tema === "escuro" ? "Modo claro" : "Modo escuro";
            botao.setAttribute("aria-pressed", tema === "escuro" ? "true" : "false");
        });
    }
    const temaSalvo = localStorage.getItem(chaveTema) || "claro";
    aplicarTema(temaSalvo);
    document.querySelectorAll(".tema-toggle").forEach(function (botao) {
        botao.addEventListener("click", function () {
            const novoTema = document.body.classList.contains("tema-escuro") ? "claro" : "escuro";
            localStorage.setItem(chaveTema, novoTema);
            aplicarTema(novoTema);
        });
    });

    const botao = document.getElementById("botaoMais");
    const resumo = document.getElementById("resumo");
    resumo.style.display = "none";
    botao.addEventListener("click", function() {
        if (resumo.style.display === "none") {
            resumo.style.display = "block";
            botao.textContent = "Ver menos";
        } else {
            resumo.style.display = "none";
            botao.textContent = "Ver mais";
        }
    });

    

    function abrirModal(titulo, mensagem, textoBotao) {
        const fundo = document.createElement("div");
        fundo.className = "modal-fundo";
        fundo.setAttribute("role", "dialog");
        fundo.setAttribute("aria-modal", "true");
        fundo.setAttribute("aria-label", titulo);
        const caixa = document.createElement("div");
        caixa.className = "modal-caixa";
        const h2 = document.createElement("h2");
        h2.textContent = titulo;
        const p = document.createElement("p");
        p.textContent = mensagem;
        const fechar = document.createElement("button");
        fechar.type = "button";
        fechar.textContent = textoBotao || "Continuar";
        fechar.addEventListener("click", function () { fundo.remove(); });
        fundo.addEventListener("click", function (evento) {
            if (evento.target === fundo) fundo.remove();
        });
        caixa.append(h2, p, fechar);
        fundo.appendChild(caixa);
        document.body.appendChild(fundo);
        fechar.focus();
    }

    if (location.pathname.endsWith("/index.html") || location.pathname === "/" || location.pathname.endsWith("/")) {
        if (!sessionStorage.getItem("quimic-codigo-boas-vindas")) {
            sessionStorage.setItem("quimic-codigo-boas-vindas", "sim");
            abrirModal("Bem-vindo ao Quimic Código!", "Explore os conteúdos de Química, aprenda no seu ritmo e teste seus conhecimentos no quiz.", "Começar a explorar");
        }
    }

    if ("speechSynthesis" in window) {
        const controlesVoz = document.createElement("div");
        controlesVoz.className = "controles-voz";
        controlesVoz.innerHTML = '<button type="button" id="lerTexto">Ler texto em voz alta</button><button type="button" id="pararLeitura">Parar leitura</button>';
        const principal = document.querySelector("main");
        if (principal) principal.insertBefore(controlesVoz, principal.firstChild);

        document.getElementById("lerTexto").addEventListener("click", function () {
            window.speechSynthesis.cancel();
            const copia = principal.cloneNode(true);
            copia.querySelectorAll("button, input, textarea, select, .carrossel-imagens, .controles-voz").forEach(function (item) { item.remove(); });
            const texto = copia.innerText.trim();
            if (!texto) return;
            const fala = new SpeechSynthesisUtterance(texto);
            fala.lang = "pt-BR";
            fala.rate = 1;
            window.speechSynthesis.speak(fala);
        });
        
        document.getElementById("pararLeitura").addEventListener("click", function () {
            window.speechSynthesis.cancel();
        });
    }

    const principal = document.querySelector("main");
    if (principal) {
        const imagens = Array.from(principal.querySelectorAll("img"))
            .filter(function (img) { return img.getAttribute("src") && !img.closest(".carrossel-imagens"); });
        if (imagens.length >= 2) {
            const carrossel = document.createElement("section");
            carrossel.className = "carrossel-imagens";
            carrossel.innerHTML = '<h2>Galeria de imagens</h2><div class="carrossel-area"><button type="button" class="carrossel-anterior" aria-label="Imagem anterior">‹</button><figure><img class="carrossel-foto" alt=""><figcaption></figcaption></figure><button type="button" class="carrossel-proximo" aria-label="Próxima imagem">›</button></div><p class="carrossel-contador" aria-live="polite"></p>';
            principal.appendChild(carrossel);
            let indice = 0;
            const foto = carrossel.querySelector(".carrossel-foto");
            const legenda = carrossel.querySelector("figcaption");
            const contador = carrossel.querySelector(".carrossel-contador");
            function mostrarImagem() {
                const imagem = imagens[indice];
                foto.src = imagem.src;
                foto.alt = imagem.alt || "Imagem " + (indice + 1);
                legenda.textContent = imagem.alt || "Imagem " + (indice + 1);
                contador.textContent = (indice + 1) + " de " + imagens.length;
            }
            carrossel.querySelector(".carrossel-anterior").addEventListener("click", function () {
                indice = (indice - 1 + imagens.length) % imagens.length;
                mostrarImagem();
            });
            carrossel.querySelector(".carrossel-proximo").addEventListener("click", function () {
                indice = (indice + 1) % imagens.length;
                mostrarImagem();
            });
            mostrarImagem();
        }
    }

    const quiz = document.getElementById("quiz");
    if (quiz) {
        quiz.addEventListener("submit", function () {
            setTimeout(function () {
                const resultado = document.getElementById("resultado");
                if (resultado) abrirModal("Resultado do quiz", resultado.textContent, "Fechar resultado");
            }, 0);
        });
    }
})();