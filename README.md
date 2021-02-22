## Catálogo de vídeos: Implementando API Resource

    Nesta fase, você deve implementar o recurso API Resource nos controllers e testa-los;

    Crie os resources para: Category, CastMember, Genre e Video;

    No resource de Genre, você deve incluir na serialização, as categorias relacionadas;

    No resource de Video, você deve incluir na serialização, as categorias e gêneros relacionados e as urls dos arquivos; 

    Aplique todos os resources nos controllers e faça os testes em todos os métodos do CRUD, exceto no destroy. Lembre-se de testar sempre a estrutura do JSON, com o método jsonStructure e também usando o método assertResource;

    Desafio (Opcional): Agora com a mudança para o API Resource, o controller básico de CRUD foi modificado, será necessário testa-lo também;

    Aplique os testes em todos os métodos, exceto no destroy. Lembre-se que neste controller não temos resposta HTTP, logo em cada retorno de cada ação do controller, teremos a instância do Resource para avaliar;

    Somente avalie se os dados do resource são iguais ao toArray do model CategoryStub.
 
Boa sorte!