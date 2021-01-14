## Implementando recurso de vídeo e relacionamentos
Nesta fase, você deverá implementar o CRUD de vídeo com o seguintes dados:

    id
    title
    description
    year_launched
    opened
    rating
    duration

Além disto, implemente os relacionamentos do vídeo com categorias e gêneros. Os dois relacionamentos são many-to-many.

Implemente os testes:

    Unitário e integração do model Video.
    No teste unitário do model Video, você deve seguir a mesma linha do curso, verificando fillable, casts e etc.
    Integração do VideoController.
    Crie os testes do CRUD
    Verifique nos testes de criação e atualização se categorias e gêneros estão relacionados com o video.
    Lembre-se dos testes de validação

------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Todo gênero será relacionado com categorias também, então crie um relacionamento many-to-many entre eles, isto servirá mais tarde para verificar quais gêneros uma categoria tem, ou vice-versa.

O relacionamento de gêneros e categorias se dará através do CRUD de gêneros, logo na criação e atualização devemos ser obrigados a passar uma lista de categorias relacionadas (se espelhe no exemplo que foi feito no CRUD de vídeo).

Implemente os testes de integração em GenreControllerTest para avaliar se as categorias estão sendo relacionadas corretamente (lembre-se de acrescentar a asserção de validação de categories_id).

------------------------------------------------------------------------------------------------------------------------------------------------------------------------

(Opcional) Desafio

Como gêneros e categorias estão relacionados, no momento de atribui-los aos videos elas também deverão estar relacionados. Exemplo:

Categorias X, Y e Z

Gêneros A, B e C

------------------------------

Gênero A é relacionado com Categoria X

Gênero B é relacionado com Categoria Y

Gênero C é relacionado com Categoria Z

No momento de criar ou atualizar o vídeo, não podemos validar o envio de categories_id ou genres_id que não estejam relacionados, então, está errado se enviarmos na requisição:

genres_id => A (não relacionado)

categories_id => Y

-------------------------

genres_id => B (não relacionado)

categories_id => X

-------------------------

genres_id => A, B (como existe B no envio, tem que ter alguma categoria relacionada com ele no envio)

categories_id => X 

Está correto enviar:

genres_id => A

categories_id => X

-------------------------

genres_id => B

categories_id => Y

-------------------------

genres_id => A, B

categories_id => X, Y 

Ao passar um gênero ou um categoria no envio na requisição, este deve estar relacionado com pelo menos um do outro lado, senão é inválido.

Portanto, o desafio é criar uma regra de validação personalizada que será usada no VideoController para validar isto. Consulte a documentação do Laravel: https://laravel.com/docs/6.x/validation#custom-validation-rules para verificar como criar uma regra de validação personalizada.

