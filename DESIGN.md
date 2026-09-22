---
name: Tribo de Jah
description: Palco, estrada e arquivo em uma narrativa digital de reggae.
colors:
  backstage-black: "#070706"
  archive-paper: "#f2eee3"
  road-muted: "#b9b4a7"
  stage-amber: "#f2b544"
  roots-green: "#4f7c50"
  signal-red: "#b8392d"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(3.5rem, 8vw, 7rem)"
    fontWeight: 700
    lineHeight: 0.82
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  control: "999px"
  circular: "50%"
spacing:
  page-min: "1.25rem"
  page-fluid: "6vw"
  page-max: "6rem"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.archive-paper}"
    rounded: "{rounded.control}"
    padding: "0 1.35rem"
    height: "3.25rem"
  menu-trigger:
    backgroundColor: "rgba(7, 7, 6, 0.5)"
    textColor: "{colors.archive-paper}"
    rounded: "{rounded.circular}"
    size: "3rem"
---

# Design System: Tribo de Jah

## Overview

**Creative North Star: "Roteiro de Luz"**

O sistema parece ter sido montado entre o palco e a estrada: grandes campos escuros, explosões de luz âmbar, fotografia ao vivo e pausas claras que funcionam como páginas de arquivo. A energia vem da escala, da compressão tipográfica e do movimento de elementos com função — câmera, ônibus e discos — não de ornamento espalhado.

O resultado deve ser autoral e musical sem depender de símbolos genéricos de reggae. Verde, amarelo e vermelho aparecem como sinalização pequena; a atmosfera principal nasce do preto quente, do papel claro e da luz do show.

**Key Characteristics:**

- Fotografia de palco em escala total.
- Tipografia condensada com ritmo de cartaz.
- Alternância entre bastidor escuro e arquivo claro.
- Movimento concentrado em três momentos memoráveis.
- Conteúdo provisório sempre identificado com honestidade.

## Colors

A paleta combina noite de palco, papel de arquivo e luz âmbar; as cores rastafári funcionam como marcações, nunca como preenchimento dominante.

### Primary

- **Stage Amber:** aciona progresso, foco, estados ativos e grandes superfícies editoriais de alta energia.

### Secondary

- **Roots Green:** aparece na assinatura tricolor e em pequenos sinais de identidade.
- **Signal Red:** completa a assinatura e marca alertas cromáticos pontuais.

### Neutral

- **Backstage Black:** base dominante das cenas, menus escuros e superfícies musicais.
- **Archive Paper:** texto principal no escuro e fundo das pausas históricas.
- **Road Muted:** informação secundária, placeholders e metadados.

**The Small Signal Rule.** Verde, amarelo e vermelho juntos pertencem a marcas pequenas; não formar grandes faixas decorativas.

## Typography

**Display Font:** Barlow Condensed (com Arial Narrow como fallback)
**Body Font:** Archivo (com sans-serif como fallback)

**Character:** o display é estreito, direto e alto como um cartaz de festival. O corpo é sóbrio e aberto o bastante para sustentar textos históricos e informações de agenda.

### Hierarchy

- **Display** (700, `clamp(3.5rem, 8vw, 7rem)`, 0.82): títulos de seção e mensagens de escala pública.
- **Hero** (700, até `9rem`, 0.75): primeira tela e assinatura final.
- **Title** (600, 1.25rem–1.7rem): contatos, links sociais e nomes de álbuns.
- **Body** (400, 1rem, 1.7): narrativa histórica e explicações, com linhas curtas.
- **Label** (600, 0.72rem–0.86rem, espaçamento amplo, caixa alta): metadados e estados de interação.

**The Poster Scale Rule.** Um título condensado deve carregar cada composição; textos auxiliares recuam em tamanho e contraste.

## Layout

O conteúdo usa margens fluidas entre 1.25rem e 6rem e seções altas com bastante intervalo vertical. Desktop alterna composições de duas colunas; abaixo de 700px elas se tornam lineares, enquanto galerias e discos passam a trilhos horizontais com encaixe por gesto.

O primeiro viewport é sempre ocupado pela imagem de palco. As seções seguintes variam densidade para criar respiração: fotografia total, página clara, rota escura, prateleira musical e grande campo âmbar.

## Elevation & Depth

A profundidade é fotográfica e tonal. Sombras aparecem apenas quando um objeto precisa se separar fisicamente — capas, vinis e o ônibus — com deslocamento vertical e desfoque suave. Superfícies editoriais permanecem planas.

**The Stage Depth Rule.** Use luz, sobreposição e contraste para profundidade; reserve sombras para objetos que se movem.

## Shapes

Grandes regiões e capas são retangulares e sem arredondamento. Círculos pertencem aos discos, rodas e controles compactos. O formato pílula é reservado a botões pequenos, nunca a contêineres de conteúdo.

## Components

### Buttons

- **Shape:** controle em pílula para ações textuais e círculo para o menu.
- **Outline:** transparente, com borda clara e altura de 3.25rem.
- **Hover / Focus:** inversão para papel claro; foco âmbar externo e visível.

### Cards / Containers

- **Corner Style:** cantos retos.
- **Background:** campos sólidos do sistema ou fotografia real.
- **Shadow Strategy:** somente capas e objetos móveis recebem sombra difusa.
- **Border:** linhas de 1px com baixa opacidade para listas e divisões.

### Navigation

O cabeçalho fica sobre a imagem, reduzido à marca e a um botão circular. O menu abre como um único campo âmbar e usa links condensados em escala de cartaz; fecha por botão, Escape ou seleção de destino.

### Album Sleeve

A capa quadrada cobre parcialmente um disco escuro. Ao ativar, a capa recua, o vinil avança e gira por até quinze segundos. Apenas um álbum pode permanecer ativo, e o estado precisa estar exposto no rótulo e no progresso.

### Tour Route

Uma linha fina conecta partida e destino. O avanço colore a rota em âmbar e move o ônibus no mesmo valor, preservando a relação entre posição e progresso.

## Do's and Don'ts

### Do:

- **Do** usar fotografia real de palco como principal fonte de atmosfera.
- **Do** manter títulos curtos, condensados e com grande contraste de escala.
- **Do** concentrar movimento em interações ligadas à música e à estrada.
- **Do** identificar claramente conteúdo provisório e links ausentes.

### Don't:

- **Don't** preencher grandes áreas com verde, amarelo e vermelho apenas para sinalizar reggae.
- **Don't** transformar cada conteúdo em cartão arredondado.
- **Don't** adicionar brilhos, transparências ou animações sem função narrativa.
- **Don't** inventar agenda, história, capas, músicas ou contatos.
