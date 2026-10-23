# Portfólio e blog do Wilson Brandão

Site estático feito com **Jekyll**, que o GitHub Pages compila sozinho. Você não precisa instalar nada para publicar: basta enviar os arquivos para o GitHub.

## Conteúdo

```
_config.yml            configurações do site (nome, links, url)
_data/projects.yml     lista de projetos
_data/trilha.yml       trilha de estudos e progresso
_data/navigation.yml   itens do menu
_posts/                posts do blog (um arquivo .md por post)
_templates/            modelo de post (não é publicado)
assets/css, assets/js  estilo e scripts
assets/img/            coloque aqui as imagens dos posts
index.html, blog.html, projetos.html, trilha.html, sobre.md   as páginas
```

---

## 1. Publicar no GitHub Pages (primeira vez)

### Passo 1: crie o repositório
No GitHub, crie um repositório **público**. Você tem duas opções de nome:

| Nome do repositório | Endereço final | `baseurl` no `_config.yml` |
|---|---|---|
| `SEU-USUARIO.github.io` | `https://SEU-USUARIO.github.io` | `""` (vazio) |
| qualquer outro, ex. `portfolio` | `https://SEU-USUARIO.github.io/portfolio` | `"/portfolio"` |

A primeira opção dá o endereço mais limpo e é a melhor para um portfólio.

### Passo 2: ajuste o `_config.yml`
Edite os campos marcados com `EDITE`:

```yaml
github_username: seu-usuario
linkedin_username: seu-usuario-linkedin
url: "https://seu-usuario.github.io"
baseurl: ""            # ou "/portfolio" se o repositório tiver outro nome
```

Enquanto os campos `SEU-USUARIO...` não forem trocados, os links de GitHub e LinkedIn ficam ocultos no site.

### Passo 3: envie os arquivos
Pela linha de comando, dentro desta pasta:

```bash
git init
git add .
git commit -m "Primeira versão do portfólio"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```

Se preferir sem terminal: no repositório vazio, clique em **Add file > Upload files** e arraste o conteúdo da pasta (inclusive as pastas que começam com `_`).

### Passo 4: ative o Pages
No repositório: **Settings > Pages > Build and deployment**
- Source: **Deploy from a branch**
- Branch: **main**, pasta **/ (root)**
- Clique em **Save**

Em 1 a 3 minutos o site estará no ar. O progresso aparece na aba **Actions**.

---

## 2. Publicar um post novo

1. Copie `_templates/modelo-de-post.md` para a pasta `_posts/`.
2. Renomeie para `AAAA-MM-DD-titulo-do-post.md`, por exemplo `2026-11-05-o-que-e-mlops.md`.
3. Edite o cabeçalho (título, descrição, tags) e escreva o texto em Markdown.
4. Faça commit. O site é atualizado em alguns minutos.

Dá para fazer tudo direto no navegador: na pasta `_posts` do repositório, clique em **Add file > Create new file**.

Pontos de atenção:
- **Posts com data futura não aparecem** até a data chegar. Se um post sumiu, confira a data no nome do arquivo.
- As **tags** formam os filtros da página do blog. Use sempre a mesma grafia (`Feature Engineering`, não `feature engineering` e `Feature-Engineering` ao mesmo tempo).
- Para ligar um tema da trilha aos posts, use na tag o mesmo nome do campo `tag` em `_data/trilha.yml`.
- **Nota em destaque:** escreva uma citação (`> texto`) e, na linha logo abaixo, `{: .nota}`.
- **Imagens:** coloque o arquivo em `assets/img/` e use `![descrição]({{ '/assets/img/arquivo.png' | relative_url }})`.

## 3. Adicionar um projeto

Abra `_data/projects.yml`, copie um bloco e preencha:

```yaml
- title: Nome do projeto
  summary: Uma ou duas frases sobre o problema que ele resolve.
  status: andamento      # concluido | andamento | planejado
  featured: true         # true = também aparece na página inicial
  stack: [Python, FastAPI, Docker]
  repo: "https://github.com/SEU-USUARIO/nome-do-repo"
  demo: ""               # deixe vazio se não houver demo
```

**Os três projetos que vêm no arquivo são exemplos planejados.** Troque-os pelos seus assim que existirem.

## 4. Atualizar a trilha de estudos

Em `_data/trilha.yml`, mude `done: false` para `done: true` conforme termina cada tópico. A barra de progresso se atualiza sozinha. Mude o `status` da área entre `proximo`, `estudando` e `concluido`.

## 5. Ver o site no seu computador (opcional)

Requer Ruby instalado.

```bash
bundle install
bundle exec jekyll serve
```

Abra `http://localhost:4000`. As mudanças aparecem ao salvar os arquivos.

---

## Recomendações para o portfólio

- **Nunca publique código, dados ou detalhes internos do Itaú.** Use conjuntos de dados públicos ou sintéticos. Isso também é um ponto a favor numa avaliação.
- Cada projeto deve ter um `README.md` no próprio repositório explicando: o problema, os dados, a abordagem, como rodar e o que você aprenderia de diferente na próxima vez.
- Prefira poucos projetos bem acabados a muitos pela metade, e fixe os melhores no seu perfil do GitHub.
- Para a página **Sobre**, acrescente seus anos de experiência e as tecnologias do seu dia a dia.
