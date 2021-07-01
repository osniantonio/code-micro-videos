// @flow
import * as React from "react";
import { useEffect, useReducer, useRef, useState } from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import categoryHttp from "../../util/http/category-http";
import { BadgeNo, BadgeYes } from "../../components/Badge";
import { ActiveMap, Category, ListResponse } from "../../util/models";
import DefaultTable, {
  makeActionsStyles,
  MuiDataTableRefComponent,
  TableColumn,
} from "../../components/Table";
import { useSnackbar } from "notistack";
import { IconButton, MuiThemeProvider } from "@material-ui/core";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import { Creators } from "../../store/filter";
import useFilter from "../../hooks/useFilter";
import { useContext } from "react";
import { FilterResetButton } from "../../components/Table/FilterResetButton";
import LoadingContext from "../../components/loading/LoadingContext";
import * as yup from "../../util/vendor/yup";
import {DeleteDialog} from "../../components/DeleteDialog";
import useDeleteCollection from "../../hooks/useDeleteCollection";

const isActiveValues = Object.values(ActiveMap);

const columnsDefinitions: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    width: "30%",
    options: {
      sort: false,
      filter: false,
    },
  },
  {
    name: "name",
    label: "Nome",
    width: "43%",
    options: {
      filter: false,
    },
  },
  {
    name: "is_active",
    label: "Ativo?",
    options: {
      filterOptions: {
        names: ["Sim", "Nāo"],
      },
      customBodyRender(value, tableMeta, updateValue) {
        return value ? <BadgeYes /> : <BadgeNo />;
      },
    },
    width: "4%",
  },
  {
    name: "created_at",
    label: "Criado em",
    width: "10%",
    options: {
      filter: false,
      customBodyRender(value, tableMeta, updateValue) {
        return <span> {format(parseISO(value), "dd/MM/yyyy")} </span>;
      },
    },
  },
  {
    name: "actions",
    label: "Ações",
    width: "13%",
    options: {
      sort: false,
      filter: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <IconButton
            color={"secondary"}
            component={Link}
            to={`/categories/${tableMeta.rowData[0]}/edit`}
          >
            <EditIcon />
          </IconButton>
        );
      },
    },
  },
];

const debounceTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];

const Table = () => {
  const snackbar = useSnackbar();
  const subscribed = useRef(true);
  const [data, setData] = useState<Category[]>([]);
  const loading = useContext(LoadingContext);
  const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;
  const {openDeleteDialog, setOpenDeleteDialog, rowsToDelete, setRowsToDelete} = useDeleteCollection();

  const {
    columns,
    filterManager,
    filterState,
    debouncedFilterState,
    dispatch,
    totalRecords,
    setTotalRecords,    
  } = useFilter({
    columns: columnsDefinitions,
    debounceTime: debounceTime,
    rowsPerPage,
    rowsPerPageOptions,
    tableRef,
    extraFilter: {
      createValidationSchema: () => {
        return yup.object().shape({
          is_active: yup
            .string()
            .nullable()
            .transform((value) => {
              return !value || !isActiveValues.includes(value)
                ? undefined
                : value;
            })
            .default(null),
        });
      },
      formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter
          ? {
              ...(debouncedState.extraFilter.is_active && {
                is_active: debouncedState.extraFilter.is_active,
              }),
            }
          : undefined;
      },
      getStateFromURL: (queryParams) => {
        return {
          is_active: queryParams.get("is_active"),
        };
      },
    },
  }); 

  useEffect(() => {
    subscribed.current = true;
    filterManager.pushHistory();
    getData();
    return () => {
      subscribed.current = false;
    };
  }, [
    filterManager.cleanSearchText(debouncedFilterState.search),
    debouncedFilterState.pagination.page,
    debouncedFilterState.pagination.per_page,
    debouncedFilterState.order,
    JSON.stringify(debouncedFilterState.extraFilter),
  ]);

  const indexColumnType = columns.findIndex(c => c.name === "is_active");
  const columnType = columns[indexColumnType];
  const typeFilterValue =
    filterState.extraFilter && (filterState.extraFilter.is_active as never);
  (columnType.options as any).filterList = typeFilterValue
    ? [typeFilterValue]
    : [];

  const serverSideFilterList = columns.map(column => []);
  if (typeFilterValue) {
    serverSideFilterList[indexColumnType] = [typeFilterValue];
  }

  async function getData() {
    try {
      console.log(debouncedFilterState.extraFilter);
      const { data } = await categoryHttp.list<ListResponse<Category>>({
        queryParams: {
          search: filterManager.cleanSearchText(debouncedFilterState.search),
          page: debouncedFilterState.pagination.page,
          per_page: debouncedFilterState.pagination.per_page,
          sort: debouncedFilterState.order.sort,
          dir: debouncedFilterState.order.dir,
          ...(debouncedFilterState.extraFilter &&
            debouncedFilterState.extraFilter.is_active && {
              is_active: debouncedFilterState.extraFilter.is_active,
            })
        },
      });

      if (subscribed.current) {
        setData(data.data);
        setTotalRecords(data.meta.total);
        if (openDeleteDialog) {
          setOpenDeleteDialog(false);
        }
      }
    } catch (error) {
      if (categoryHttp.isCancelledRequest(error)) {
        return;
      }
      snackbar.enqueueSnackbar("Nāo foi possível carregar as informações", {
        variant: "error",
      });
    }
  }

  async function deleteRows(confirmed: boolean) {
    if (!confirmed) {
      setOpenDeleteDialog(false);
      return;
    }

    try {
      const ids = rowsToDelete.data
        .map((value) => data[value.index].id)
        .join(",");

      await categoryHttp.deleteCollection({ ids });

      if (
        rowsToDelete.data.length === debouncedFilterState.pagination.per_page &&
        debouncedFilterState.pagination.page > 1
      ) {
        const page = debouncedFilterState.pagination.page - 2;
        filterManager.changePage(page);
      } else {
        await getData();
      }

      setOpenDeleteDialog(false);

      snackbar.enqueueSnackbar("Registros excluidos com sucesso!", {
        variant: "success",
      });
    } catch (e) {
      console.log(e);
      snackbar.enqueueSnackbar("Não foi possível excluir os registros", {
        variant: "error",
      });
    }
  }

  return (
    <MuiThemeProvider theme={makeActionsStyles(columnsDefinitions.length - 1)}>
        <DeleteDialog open={openDeleteDialog} handleClose={deleteRows}/>
        <DefaultTable
            title="Listagem de categorias"
            columns={columns}
            data={data}
            loading={loading}
            debounceSearchTime={debouncedSearchTime}
            ref={tableRef}
            options={
                {
                    serverSideFilterList,
                    serverSide: true,
                    responsive: "scrollMaxHeight",
                    searchText: filterState.search as any,
                    page: filterState.pagination.page - 1,
                    rowsPerPage: filterState.pagination.per_page,
                    rowsPerPageOptions,
                    count: totalRecords,
                    customToolbar: () => (
                        <FilterResetButton
                            handleClick={() => filterManager.resetFilter()}
                        />
                    ),
                    onSearchChange: (value: any) => filterManager.changeSearch(value),
                    onChangePage: (page: number) => filterManager.changePage(page),
                    onChangeRowsPerPage: (perPage: number) => filterManager.changeRowsPerPage(perPage),
                    onColumnSortChange: (changedColumn: string, direction: string) => filterManager.changeColumnSort(changedColumn, direction),
                    onRowsDelete: (rowsDeleted) => {
                      setRowsToDelete(rowsDeleted as any);
                      return false;
                    }
                }
            }
        />
    </MuiThemeProvider>
  );
};

export default Table;
