## Nesta fase você deve criar o campo para upload do vídeo na tabela vídeos:

video_file, string e nullable

## Validação

    a) Os uploads não serão obrigatórios ao se enviar um POST ou PUT para /videos, logo nas regras de validação não teremos a regra required;

    b) Devemos validar o upload de vídeo requerendo somente o tipo video/mp4 e um tamanho máximo (especifique um valor simbolico para o tamanho). 
       Pesquise na documentação do Laravel como validar tipos de arquivo e o tamanho máximo de um arquivo;

    c) Crie o teste de validação do upload de vídeo, é necessário testar a invalidação do tipo do vídeo e o tamanho máximo.

## Upload

    Implemente o upload do vídeo (somente com POST) como foi mostrado no capítulo e aplique um teste para verificar se o arquivo foi criado corretamente após o término do cadastro.