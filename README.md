## Terminando uploads do model vídeo
Nesta fase, você deverá acrescentar mais campos de upload na tabela e no model Vídeo. Já temos video_file e thumb_file.

## Agora teremos:
banner_file
trailer_file
Você deve criar também os testes de validação de tamanho máximo para os 4 campos. Abaixo está o tamanho máximo permitido:

    video_file - 50GB
    thumb_file - 5MB
    banner_file - 10MB
    trailer_file - 1GB

Agora com todos estes arquivos em mãos, consolide os testes de upload no teste de integração do model Vídeo. Precisamos saber se no próprio model Video, os uploads estão funcionando. Você pode criar 4 testes: testCreateWithBasicFields e testUpdateWithBasicFields para testar somente a criação ou atualização do vídeo sem upload e testCreateWithFiles  e testUpdateWithFiles para focar somente no upload. 

Desafio (Opcional): Na trait de uploads, crie um método que receba o nome de um arquivo e devolva o endereço correto do arquivo, ou seja, o endereço WEB de acesso ao arquivo. Este método servirá como base para gerar qualquer endereço de qualquer arquivo do vídeo.

Você deve criar o teste deste método e criar mutators do Eloquent para permitir que os endereços sejam acessíveis como campos, exemplo: $video->thumb_file_url ou $video->video_file_url.