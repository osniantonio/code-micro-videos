## CRUD de cast member e genre no front-end
Nesta fase de projeto, você deverá criar os CRUDs de genre e cast member no front-end.

Detalhes importantes para cast member:

Para o campo type você poderá usar o componente Radio ou RadioGroup (preferível). Vide doc do Material UI
Você deverá usar o conceito de Controlled Components do React para lidar com o campo type, pois não será um campo HTML nativo e necessitará de especificação do evento onChage para pegar o novo valor e guardar no react-hook-form via setValue.
Detalhes importantes para genre:

Para o campo categories você poderá usar o componente Select ou Select nativo. Vide doc do Material UI
Você deverá usar o conceito de Controlled Components do React para lidar com o campo categories, pois não será um campo HTML nativo e necessita de especificação do evento onChage para pegar o novo valor e guardar no react-hook-form via setValue.
Este campo Select necessitará de uma alimentação do que o usuário escolhe, logo será necessário sempre atualizar a propriedade value dele, senão as opções escolhidas não serão de fato selecionadas. Use o método watch do react-hook-form no value do campo para mante-lo atualizado.
Use AJAX para pegar as categorias e hidratar o campo Select.

Boa sorte!