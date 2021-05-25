## Terminando sistema de filtro e utilizando fowardRef
Nesta fase, você deverá aplicar a lógica de sistema de filtro, usando reducer, useFilter nas listagens de categorias, gêneros e cast members.

Além disto, será necessário criar:

    Um método dentro da classe FilterManager para controlar a limpeza dos filtros aplicados. O componente Table apenas chamará filterManager.resetFilter() e os filtros serão limpos.
    Quando acontece a limpeza dos filtros ou a aplicação da ordenação e a paginação atual está na página > 1, a paginação atual retorna a 1, porém isto não se reflete no visual, como vimos nas aulas.
    
        Este é um bug no state do componente Table do mui-datatables. 
        Para resolve-lo, devemos pegar a referência do Table do mui-datatables e chamar o método changePage para forçar a mudança do estado novamente.
        Para pegar a referência da tabela você deverá usar a técnica ForwardRef do React (consulte a documentação da biblioteca)
        A referência deverá ser passada para o useFilter e usada no FilterManager como última instrução no resetFilter e no changeColumnSort
        Ou seja, após estas duas operações forçarem a atualização do estado de paginação do Table do mui-datatables

Implemente estas solicitações e nos envie o projeot para correção.
Boa sorte!