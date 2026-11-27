# Cérebro médico

Mapa de conhecimento da Medicina UFF de Marcos Daniel: notas ligadas entre si, do 1º período em diante, com os materiais do Google Drive.

- `index.html` — o site e app (abre direto no GitHub Pages; dá para instalar no celular e no computador).
- `sw.js` e `manifest.webmanifest` — fazem o site funcionar como app e sem internet.
- `data/base.json` — notas; `data/materials.json` — arquivos do Drive; `data/updates/` — o que a atualização automática acrescenta toda madrugada; `data/manifest.json` lista o que o site carrega.
- `vendor/` — bibliotecas (d3 para o mapa, qrcode-generator para o QR de conexão), guardadas aqui para funcionar offline.

O progresso de leitura sincroniza entre aparelhos pelo repositório privado `painel-dados` (arquivo `cerebro/progresso.json`), com o mesmo token do Meu painel. Nenhum dado pessoal fica neste repositório público.
