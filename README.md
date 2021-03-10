## Construindo listagens no front-end
Parabéns por chegar até aqui! Já temos nossa aplicação backend e vamos implementar o front-end com React.js.

Agora que entendemos como desenvolver com Laravel e React dentro do Docker, realizaremos a integração da SPA com a API Rest.

Nesta fase crie o ambiente do React mostrado no curso e crie três listagens:

Listagem de categorias com os dados:
    name
    is_active (formate se é ativo ou não para Sim ou Não)
    created_at (formate a data no formato brasileiro)

Listagem de membros do elenco com os dados:
    name
    type (mostre o texto correspondente ao tipo, 1 - Diretor, 2 - Ator, encontre uma maneira de fazer isto com o TypeScript sem usar IFs).
    created_at (formate a data no formato brasileiro)

Listagem de gêneros com os dados:
    name
    categories (Mostre todos os nomes das categorias separados por vírgula).
    is_active (formate se é ativo ou não para Sim ou Não)
    created_at (formate a data no formato brasileiro)