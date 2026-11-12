/* ==========================================================================
   KickOff — script principal
   Desenvolvimento para a Web · ISCAC · 2026/2027

   1. Menu de navegação (telemóvel)
   2. Filtro dos campos
   3. Página de reservas (campos, horários, preço e validação)
   4. Formulário de contacto
   ========================================================================== */

"use strict";

/* ===================== 1. MENU DE NAVEGAÇÃO ===================== */
function iniciarMenu() {
  const botao = document.getElementById("menu-botao");
  const navegacao = document.getElementById("navegacao");
  if (!botao || !navegacao) return;

  botao.addEventListener("click", function () {
    const aberto = botao.getAttribute("aria-expanded") === "true";
    botao.setAttribute("aria-expanded", String(!aberto));
    botao.setAttribute("aria-label", aberto ? "Abrir menu de navegação" : "Fechar menu de navegação");
    navegacao.classList.toggle("aberta", !aberto);
  });

  // fecha o menu ao escolher uma ligação (no telemóvel)
  navegacao.addEventListener("click", function (evento) {
    if (evento.target.tagName === "A" && window.innerWidth < 900) {
      botao.setAttribute("aria-expanded", "false");
      navegacao.classList.remove("aberta");
    }
  });
}

/* ===================== 2. FILTRO DOS CAMPOS ===================== */
function iniciarFiltroCampos() {
  const lista = document.getElementById("lista-campos");
  if (!lista) return;

  const botoes = document.querySelectorAll(".filtros__botao");
  const cartoes = lista.querySelectorAll(".cartao");
  const contagem = document.getElementById("contagem");
  const semResultados = document.getElementById("sem-resultados");

  function aplicarFiltro(filtro) {
    let visiveis = 0;

    cartoes.forEach(function (cartao) {
      const mostrar = filtro === "todos" || cartao.dataset.modalidade === filtro;
      cartao.hidden = !mostrar;
      if (mostrar) visiveis++;
    });

    botoes.forEach(function (botao) {
      botao.setAttribute("aria-pressed", String(botao.dataset.filtro === filtro));
    });

    contagem.textContent = visiveis === 1
      ? "A mostrar 1 campo."
      : "A mostrar " + visiveis + " campos.";
    semResultados.hidden = visiveis > 0;
  }

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      aplicarFiltro(botao.dataset.filtro);
    });
  });

  // #futsal, #futebol7 ou #futebol11 no endereço aplicam logo o filtro correspondente
  const FILTROS_VALIDOS = ["futsal", "futebol7", "futebol11"];

  function filtroDaAncora() {
    const ancora = window.location.hash.replace("#", "");
    return FILTROS_VALIDOS.indexOf(ancora) !== -1 ? ancora : "todos";
  }

  aplicarFiltro(filtroDaAncora());

  // também reage quando só a âncora muda, sem recarregar a página
  window.addEventListener("hashchange", function () {
    aplicarFiltro(filtroDaAncora());
  });
}

/* ===================== 3. PÁGINA DE RESERVAS ===================== */

/* Dados dos campos. Cada campo pertence a um espaço real de Coimbra.
   precoPublicado: true  -> preço retirado do site do próprio espaço
   precoPublicado: false -> preço indicativo, apenas para efeitos deste projeto */
const CAMPOS = [
  { id: "1", modalidade: "futsal", espaco: "N10",
    nome: "N10 · Campo indoor",
    diurno: 40, noturno: 45, fimSemana: 45, precoPublicado: true },

  { id: "2", modalidade: "futsal", espaco: "N10",
    nome: "N10 · Campo exterior de 5",
    diurno: 39, noturno: 39, fimSemana: 39, precoPublicado: true },

  { id: "3", modalidade: "futsal", espaco: "CF Santa Clara",
    nome: "Pavilhão do CF Santa Clara",
    diurno: 30, noturno: 40, fimSemana: 50, precoPublicado: false },

  { id: "4", modalidade: "futebol7", espaco: "N10",
    nome: "N10 · Campo exterior de 7",
    diurno: 56, noturno: 56, fimSemana: 56, precoPublicado: true },

  { id: "5", modalidade: "futebol7", espaco: "Estádio Universitário",
    nome: "Estádio Universitário · Relvado sintético",
    diurno: 40, noturno: 55, fimSemana: 70, precoPublicado: false },

  { id: "6", modalidade: "futebol11", espaco: "Estádio Universitário",
    nome: "Estádio Universitário · Relvado natural",
    diurno: 60, noturno: 75, fimSemana: 80, precoPublicado: false },

  { id: "7", modalidade: "futebol11", espaco: "Academia Briosa XXI",
    nome: "Academia Briosa XXI · Relvado sintético",
    diurno: 55, noturno: 70, fimSemana: 75, precoPublicado: false },

  { id: "8", modalidade: "futebol11", espaco: "A. R. Casaense",
    nome: "Casaense · Campo principal",
    diurno: 45, noturno: 55, fimSemana: 60, precoPublicado: false }
];

const NOMES_MODALIDADE = {
  futsal: "Futsal",
  futebol7: "Futebol de 7",
  futebol11: "Futebol de 11"
};

const HORARIOS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00",
                  "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];

function iniciarReservas() {
  const formulario = document.getElementById("form-reserva");
  if (!formulario) return;

  const selModalidade = document.getElementById("modalidade");
  const selCampo = document.getElementById("campo");
  const inpData = document.getElementById("data");
  const divHorarios = document.getElementById("horarios");
  const inpJogadores = document.getElementById("jogadores");
  const sucesso = document.getElementById("reserva-sucesso");

  let horarioEscolhido = null;

  /* ---------- auxiliares ---------- */

  function euros(valor) {
    return valor.toFixed(2).replace(".", ",") + " €";
  }

  function campoAtual() {
    return CAMPOS.find(function (c) { return c.id === selCampo.value; }) || CAMPOS[0];
  }

  function eFimDeSemana(texto) {
    if (!texto) return false;
    const dia = new Date(texto + "T00:00:00").getDay();
    return dia === 0 || dia === 6;   // 0 = domingo, 6 = sábado
  }

  function precoHora() {
    const campo = campoAtual();
    if (eFimDeSemana(inpData.value)) return campo.fimSemana;
    if (horarioEscolhido && parseInt(horarioEscolhido, 10) >= 18) return campo.noturno;
    return campo.diurno;
  }

  /* Gera sempre os mesmos horários ocupados para o mesmo campo e a mesma data,
     para simular as reservas que já existem. */
  function horariosOcupados() {
    const semente = (selCampo.value + inpData.value).split("").reduce(
      function (total, letra) { return total + letra.charCodeAt(0); }, 0);

    return HORARIOS.filter(function (hora, indice) {
      return (semente * 7 + indice * 13) % 5 < 2;
    });
  }

  /* ---------- construção dos campos ---------- */

  function preencherCampos(idPreferido) {
    const disponiveis = CAMPOS.filter(function (c) {
      return c.modalidade === selModalidade.value;
    });

    selCampo.innerHTML = "";
    disponiveis.forEach(function (campo) {
      const opcao = document.createElement("option");
      opcao.value = campo.id;
      opcao.textContent = campo.nome;
      selCampo.appendChild(opcao);
    });

    if (idPreferido && disponiveis.some(function (c) { return c.id === idPreferido; })) {
      selCampo.value = idPreferido;
    }
  }

  function desenharHorarios() {
    const ocupados = horariosOcupados();
    divHorarios.innerHTML = "";

    HORARIOS.forEach(function (hora) {
      const botao = document.createElement("button");
      const ocupado = ocupados.indexOf(hora) !== -1;

      botao.type = "button";
      botao.className = "horario";
      botao.textContent = hora;
      botao.disabled = ocupado;
      botao.setAttribute("aria-pressed", String(hora === horarioEscolhido));
      if (ocupado) botao.setAttribute("aria-label", hora + " — já reservado");

      botao.addEventListener("click", function () {
        horarioEscolhido = hora;
        limparErro("horario");
        desenharHorarios();
        atualizarResumo();
      });

      divHorarios.appendChild(botao);
    });
  }

  /* ---------- resumo ---------- */

  function atualizarResumo() {
    const campo = campoAtual();
    const jogadores = Math.max(1, parseInt(inpJogadores.value, 10) || 1);
    const preco = precoHora();

    document.getElementById("r-modalidade").textContent = NOMES_MODALIDADE[selModalidade.value];
    document.getElementById("r-espaco").textContent = campo.espaco;
    document.getElementById("r-campo").textContent = campo.nome;

    document.getElementById("r-data").textContent = inpData.value
      ? new Date(inpData.value + "T00:00:00").toLocaleDateString("pt-PT",
          { day: "numeric", month: "long", year: "numeric" })
      : "—";

    document.getElementById("r-horario").textContent = horarioEscolhido
      ? horarioEscolhido + " – " + (parseInt(horarioEscolhido, 10) + 1) + ":00"
      : "—";

    document.getElementById("r-preco").textContent =
      euros(preco) + (campo.precoPublicado ? "" : " *");
    document.getElementById("nota-preco").hidden = campo.precoPublicado;
    document.getElementById("r-total").textContent = euros(preco);
    document.getElementById("r-jogador").textContent =
      euros(preco / jogadores) + " por jogador (" + jogadores +
      (jogadores === 1 ? " jogador)" : " jogadores)");
  }

  /* ---------- validação ---------- */

  function mostrarErro(nome, mensagem) {
    const aviso = document.querySelector('[data-erro="' + nome + '"]');
    const campo = document.getElementById(nome);
    if (aviso) aviso.textContent = mensagem;
    if (campo) campo.classList.add("invalido");
  }

  function limparErro(nome) {
    const aviso = document.querySelector('[data-erro="' + nome + '"]');
    const campo = document.getElementById(nome);
    if (aviso) aviso.textContent = "";
    if (campo) campo.classList.remove("invalido");
  }

  function validar() {
    const erros = [];
    ["data", "nome", "email", "telemovel", "jogadores", "horario"].forEach(limparErro);

    // data obrigatória e não pode ser no passado
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (!inpData.value) {
      mostrarErro("data", "Escolhe uma data.");
      erros.push("data");
    } else if (new Date(inpData.value + "T00:00:00") < hoje) {
      mostrarErro("data", "A data tem de ser hoje ou depois de hoje.");
      erros.push("data");
    }

    if (!horarioEscolhido) {
      mostrarErro("horario", "Escolhe um horário livre.");
      erros.push("horario");
    }

    const nome = document.getElementById("nome");
    if (nome.value.trim().length < 3) {
      mostrarErro("nome", "Escreve o teu nome completo.");
      erros.push("nome");
    }

    const email = document.getElementById("email");
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.value.trim())) {
      mostrarErro("email", "Escreve um endereço de e-mail válido.");
      erros.push("email");
    }

    const telemovel = document.getElementById("telemovel");
    if (!/^[0-9]{9}$/.test(telemovel.value.replace(/\s/g, ""))) {
      mostrarErro("telemovel", "O telemóvel tem de ter 9 dígitos.");
      erros.push("telemovel");
    }

    const jogadores = parseInt(inpJogadores.value, 10);
    if (isNaN(jogadores) || jogadores < 2 || jogadores > 30) {
      mostrarErro("jogadores", "Indica um número entre 2 e 30.");
      erros.push("jogadores");
    }

    return erros;
  }

  /* ---------- eventos ---------- */

  selModalidade.addEventListener("change", function () {
    preencherCampos();
    horarioEscolhido = null;
    desenharHorarios();
    atualizarResumo();
  });

  selCampo.addEventListener("change", function () {
    horarioEscolhido = null;
    desenharHorarios();
    atualizarResumo();
  });

  inpData.addEventListener("change", function () {
    horarioEscolhido = null;
    limparErro("data");
    desenharHorarios();
    atualizarResumo();
  });

  inpJogadores.addEventListener("input", atualizarResumo);

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const erros = validar();

    if (erros.length > 0) {
      sucesso.hidden = true;
      const primeiro = document.getElementById(erros[0]) || divHorarios;
      primeiro.scrollIntoView({ behavior: "smooth", block: "center" });
      if (primeiro.focus) primeiro.focus({ preventScroll: true });
      return;
    }

    sucesso.hidden = false;
    sucesso.scrollIntoView({ behavior: "smooth", block: "center" });
    formulario.reset();
    horarioEscolhido = null;
    arranque();
  });

  /* ---------- arranque ---------- */

  function arranque() {
    // data mínima: hoje
    const hoje = new Date();
    const dataHoje = hoje.getFullYear() + "-" +
      String(hoje.getMonth() + 1).padStart(2, "0") + "-" +
      String(hoje.getDate()).padStart(2, "0");
    inpData.min = dataHoje;
    if (!inpData.value) inpData.value = dataHoje;

    // se vier da página Campos com ?campo=3, já abre nesse campo
    const pedido = new URLSearchParams(window.location.search).get("campo");
    const campoPedido = CAMPOS.find(function (c) { return c.id === pedido; });
    if (campoPedido) selModalidade.value = campoPedido.modalidade;

    preencherCampos(campoPedido ? campoPedido.id : null);
    desenharHorarios();
    atualizarResumo();
  }

  arranque();
}

/* ===================== 4. FORMULÁRIO DE CONTACTO ===================== */
function iniciarContacto() {
  const formulario = document.getElementById("form-contacto");
  if (!formulario) return;

  const sucesso = document.getElementById("contacto-sucesso");

  function erro(id, mensagem) {
    document.querySelector('[data-erro="' + id + '"]').textContent = mensagem;
    document.getElementById(id).classList.add("invalido");
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let valido = true;

    ["contacto-nome", "contacto-email", "contacto-mensagem"].forEach(function (id) {
      document.querySelector('[data-erro="' + id + '"]').textContent = "";
      document.getElementById(id).classList.remove("invalido");
    });

    const nome = document.getElementById("contacto-nome");
    if (nome.value.trim().length < 3) {
      erro("contacto-nome", "Escreve o teu nome completo.");
      valido = false;
    }

    const email = document.getElementById("contacto-email");
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.value.trim())) {
      erro("contacto-email", "Escreve um endereço de e-mail válido.");
      valido = false;
    }

    const mensagem = document.getElementById("contacto-mensagem");
    if (mensagem.value.trim().length < 10) {
      erro("contacto-mensagem", "A mensagem tem de ter pelo menos 10 caracteres.");
      valido = false;
    }

    if (!valido) {
      sucesso.hidden = true;
      return;
    }

    sucesso.hidden = false;
    formulario.reset();
  });
}

/* ===================== ARRANQUE ===================== */
document.addEventListener("DOMContentLoaded", function () {
  iniciarMenu();
  iniciarFiltroCampos();
  iniciarReservas();
  iniciarContacto();
});
