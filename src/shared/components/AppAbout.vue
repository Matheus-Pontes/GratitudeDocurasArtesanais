<script setup>
function abrirWhatsApp() {
  const mensagem = encodeURIComponent(
    'Olá! Estava no site da Gratitude e gostaria de tirar uma dúvida sobre os doces e encomendas.'
  )
  window.open(`https://wa.me/5511999999999?text=${mensagem}`, '_blank')
}
</script>

<template>
  <section id="sobre" class="app-about" aria-labelledby="titulo-sobre">
    <div class="gr-container">
      <div v-reveal class="app-about__card">
        <div v-reveal="'scale'" class="app-about__media">
          <div class="app-about__logo-frame">
            <img
              src="/images/logo.png"
              alt="Gratitude Doçuras Artesanais"
              class="app-about__logo-img"
            />
          </div>
          <div class="app-about__badge-craft">
            <i class="pi pi-heart-fill"></i>
            <span>Feito com Amor & Afeto</span>
          </div>
        </div>

        <div v-reveal data-reveal-delay="150" class="app-about__content">
          <span class="gr-eyebrow">
            <i class="pi pi-heart"></i> Sobre a Gratitude
          </span>
          <h2 id="titulo-sobre" class="app-about__title">
            Um sonho que nasceu do carinho e da vontade de compartilhar
          </h2>

          <div class="app-about__story">
            <p class="app-about__paragraph">
              Hoje começamos oficialmente um sonho que nasceu de um jeito simples e cheio de amor:
              descobrimos há pouco tempo o quanto amamos cozinhar juntos e como esse momento se tornou
              especial para nós. Entre receitas, risadas e muita dedicação, percebemos que queríamos ir
              além… queríamos compartilhar um pedacinho das nossas delícias com vocês. 💛
            </p>

            <blockquote class="app-about__quote">
              E foi assim que nasceu a Gratitude.
            </blockquote>

            <p class="app-about__paragraph">
              Escolhemos esse nome porque acreditamos que a gratidão é a chave para todas as coisas
              boas da vida. É com esse sentimento que iniciamos essa nova fase, colocando carinho em
              cada detalhe e em cada doce que sair da nossa cozinha.
            </p>

            <p class="app-about__paragraph">
              Esse é só o começo de uma jornada feita com amor, sabor e muita gratidão.
              Esperamos adoçar muitos momentos ao lado de vocês! 🍰💖
            </p>

            <div class="app-about__welcome">
              <span class="app-about__welcome-text">Sejam bem-vindos à nossa família!</span>
              <span class="app-about__signature">Com carinho, Gratitude Doçuras Artesanais</span>
            </div>
          </div>

          <div class="app-about__cta-wrap">
            <button class="app-about__whatsapp-btn" type="button" @click="abrirWhatsApp">
              <i class="pi pi-whatsapp"></i>
              <span>Fale com a gente no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.app-about {
  padding: 40px 0 70px;
}

.app-about__card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(220, 195, 160, 0.5);
  border-radius: var(--gr-radius-lg);
  padding: 48px;
  box-shadow: var(--gr-shadow-card);
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 48px;
  align-items: center;
}

.app-about__media {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
}

.app-about__logo-frame {
  width: 210px;
  height: 210px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #f7e1b5 0%, #c59a4e 45%, #8b621e 100%);
  box-shadow:
    0 16px 36px -8px rgba(56, 10, 20, 0.3),
    0 6px 18px rgba(197, 154, 78, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-about__logo-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.app-about__badge-craft {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--gr-wine-900);
  color: var(--gr-gold-300);
  padding: 6px 18px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(56, 10, 20, 0.2);
}

.app-about__badge-craft i {
  color: #ff6b8b;
  font-size: 0.76rem;
}

.app-about__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.app-about__title {
  font-family: var(--gr-font-display);
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  color: var(--gr-wine-900);
  line-height: 1.25;
}

.app-about__story {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.app-about__paragraph {
  font-size: 0.98rem;
  color: var(--gr-cacao-700);
  line-height: 1.7;
}

.app-about__quote {
  margin: 4px 0;
  padding: 10px 18px;
  border-left: 3px solid var(--gr-gold-500);
  background: var(--gr-cream-100);
  border-radius: 0 10px 10px 0;
  font-family: var(--gr-font-display);
  font-size: 1.15rem;
  font-style: italic;
  font-weight: 600;
  color: var(--gr-wine-900);
}

.app-about__welcome {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 10px;
  border-top: 1px dashed rgba(220, 195, 160, 0.6);
}

.app-about__welcome-text {
  font-family: var(--gr-font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--gr-wine-900);
}

.app-about__signature {
  font-size: 0.85rem;
  color: var(--gr-gold-700);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.app-about__cta-wrap {
  margin-top: 6px;
}

.app-about__whatsapp-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #25d366;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 9999px;
  font-family: var(--gr-font-body);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 6px 18px rgba(37, 211, 102, 0.35);
}

.app-about__whatsapp-btn:hover {
  background: #1eb956;
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(37, 211, 102, 0.45);
}

.app-about__whatsapp-btn i {
  font-size: 1.15rem;
}

@media (max-width: 900px) {
  .app-about__card {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 32px 20px;
    text-align: center;
  }
  .app-about__content {
    align-items: center;
  }
  .app-about__quote {
    border-left: none;
    border-top: 2px solid var(--gr-gold-500);
    border-bottom: 2px solid var(--gr-gold-500);
    border-radius: 8px;
  }
  .app-about__welcome {
    align-items: center;
  }
}
</style>
