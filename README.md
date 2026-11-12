# KickOff — Reserva de campos de futsal e futebol

Plataforma que junta num só sítio os campos de **futsal**, **futebol de 7** e **futebol de 11**
de vários espaços de Coimbra. Permite comparar os campos e os preços, consultar os horários
disponíveis e fazer a reserva online, sem telefonemas.

> **Nota.** Este é um projeto académico. Os espaços desportivos mencionados existem, mas o
> KickOff não tem qualquer ligação a eles. A disponibilidade e as reservas são simuladas e,
> tirando as do N10, as tabelas de preços são indicativas.

Projeto da unidade curricular de **Desenvolvimento para a Web**
Licenciatura em Ciência de Dados para a Gestão · ISCAC · 2026/2027

---

## Páginas

| Página | Ficheiro | Conteúdo |
|---|---|---|
| Início | `index.html` | Destaque, modalidades, torneios, horário, mapa e formulário de contacto |
| Campos | `campos.html` | Os 8 campos com filtro por modalidade e tabela de preços por espaço |
| Reservas | `reservas.html` | Formulário de reserva com horários, validação e cálculo do preço |

## Organização dos ficheiros

```
KickOff/
├── index.html
├── campos.html
├── reservas.html
├── css/
│   └── estilo.css          folha de estilos única, organizada em 8 secções
├── js/
│   └── script.js           menu, filtro, reservas e validação dos formulários
├── img/
│   ├── logo.svg            logótipo
│   ├── favicon.svg         ícone do separador
│   ├── hero.svg            imagem de fundo do destaque
│   ├── n10-indoor.svg            N10 · campo indoor
│   ├── n10-exterior-5.svg        N10 · campo exterior de 5
│   ├── n10-exterior-7.svg        N10 · campo exterior de 7
│   ├── santa-clara-pavilhao.svg  Pavilhão do CF Santa Clara
│   ├── euc-sintetico.svg         Estádio Universitário · sintético
│   ├── euc-natural.svg           Estádio Universitário · natural
│   ├── briosa-sintetico.svg      Academia Briosa XXI
│   ├── casaense-principal.svg    A. R. Casaense
│   └── mapa.svg
├── esquemas/               esquemas da Entrega 1 (draw.io + PNG)
└── README.md
```

## Tecnologias

- **HTML5** semântico (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`,
  `fieldset`/`legend`, tabela com `caption`, `thead` e `th scope`)
- **CSS3** escrito de raiz, sem frameworks: variáveis (`:root`), Flexbox, CSS Grid,
  `aspect-ratio`, `position: sticky` e *media queries*
- **JavaScript** (ES6, sem bibliotecas) para o menu, o filtro, os horários,
  o cálculo do preço e a validação dos formulários

## Responsividade

Construído na abordagem *mobile first*, com três pontos de rutura:

| Largura | Comportamento |
|---|---|
| até 599 px | uma coluna, menu recolhido, horários em 3 colunas |
| 600 – 899 px | duas colunas nas grelhas e nos formulários, horários em 4 colunas |
| 900 px ou mais | menu horizontal, grelhas de 3 colunas, horários em 7 colunas, resumo da reserva fixo ao lado |

## Funcionalidades

- Menu de navegação adaptável, com botão de abrir e fechar no telemóvel
- Oito campos de cinco espaços de Coimbra
- Filtro de campos por modalidade, com contagem de resultados (também por âncora, `campos.html#futsal`)
- Tabela de preços por espaço, com indicação da origem de cada preço
- Reserva com escolha de modalidade, campo, data e horário
- Horários já reservados assinalados e bloqueados
- Preço calculado automaticamente conforme o campo e o horário (diurno, noturno ou fim de semana)
- Aviso no resumo quando o preço é indicativo e não publicado pelo espaço
- Valor a pagar por jogador
- Validação dos formulários de reserva e de contacto, com mensagens de erro por campo
- Ligação direta da página Campos para a reserva desse campo (`reservas.html?campo=3`)

## Imagens

As ilustrações são originais, desenhadas em SVG de raiz para este projeto, por isso não há
qualquer questão de direitos de autor. Cada campo tem a sua própria ilustração, com as iniciais do
espaço, para que os oito se distingam uns dos outros: pavilhões cobertos, relvados
exteriores, fim de tarde com holofotes, estádio com pista de atletismo e campo com bancada.

Para trocar por fotografias reais basta substituir cada ficheiro de `img/` mantendo o nome,
numa proporção aproximada de 5:3 e com menos de 300 KB por imagem.

## Acessibilidade

Atributos `aria-*` nos elementos interativos, `alt` em todas as imagens, ligação para saltar
para o conteúdo, contraste adequado e navegação possível só com o teclado.

## Fontes

- Preços e campos do N10: [n10.pt/aluguer_campos](https://www.n10.pt/aluguer_campos)
- Espaços desportivos de Coimbra: [superprof.pt](https://www.superprof.pt/blog/melhor-campo-futebol-coimbra/)

## Como abrir

Não precisa de instalação nem de servidor. Basta descarregar o repositório e abrir o
ficheiro `index.html` num navegador.

---

**Autor:** Tiago Simões Rodrigues (nº 2022138676)
