## Iniciando CRUD de vídeo
Nesta fase, você deverá terminar o crud de vídeo, implemente a listagem dos vídeos e o formulário de criação/edição.

Na listagem do vídeo, devemos listar os seguintes campos: id, título, gêneros, categorias, criado em e ações (edição).

Na criação/edição do vídeo, é importante lembrar:

- Crie o componente CastMemberField utilizando o AsyncAutocomplete permitindo a inclusão de vários membros de elenco ao vídeo.
- Temos os campos definidos com react-hook-form: cast_members, genres, categories, 
mas na requisição HTTP devemos enviar somente os ids com os campos cast_members_id, genres_id, categories_id.
Ou seja, será necessário uma formatação dos dados antes do envio.
- Gere arquivos de imagens e vídeos minúsculos para testar os uploads, o Nginx no momento só aceita o body da requisição com tamanho máximo de 1MB. Gere arquivos menores que isto para testar (aprenderemos depois a configurar isto no Nginx).
- É necessário fazer os uploads e para isto não podemos usar o tipo JSON para enviar de dados, use o FormData do JavaScript para abrigar os dados do vídeo e envia-lo para o API.
- Infelizmente o PHP não suporta envio de uploads pelo verbo PUT, logo devemos fazer a edição do vídeo utilizando o método POST, ou seja, será uma requisição POST /api/videos/:id.
Entretanto esta rota não existe, mas podemos usar um recurso do Laravel, chamado de method spoofing que possibilitará não criar esta rota nova, pesquise sobre isto na documentação e implemente a edição dos vídeos enviando os arquivos utlizando o verbo POST.
- Crie uma validação com yup para verificar se há gêneros escolhidos que não tem categorias ainda selecionadas. Exemplo: no momento podemos ter 2 gêneros e 1 categoria selecionada, porém esta
categoria faz parte somente do gênero 1 e o gênero 2 está órfão, o formulário não acusaria um erro disto. Para fazer isto com YUP pesquise na documentação sobre o método test().

Boa sorte!!