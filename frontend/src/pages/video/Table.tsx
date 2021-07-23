import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import DefaultTable, {
  MuiDataTableRefComponent,
  TableColumn,
} from "../../components/Table";
import { useSnackbar } from "notistack";
import { Category, listResponse, Video } from "../../util/models";
import useFilter from "../../hooks/useFilter";
import videoHttp from "../../util/http/video-http";
import categoryHttp from "../../util/http/category-http";
import FilterResetButton from "../../components/Table/FilterResetButton";
import { format, parseISO } from "date-fns";
import * as yup from "../../util/vendor/yup";
import IconButton from "@material-ui/core/IconButton/IconButton";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import { DeleteDialog } from "../../components/DeleteDialog";
import useDeleteCollection from "../../hooks/useDeleteCollection";
import LoadingContext from "../../components/loading/LoadingContext";

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
    name: "title",
    label: "Titulo",
    width: "20%",
    options: {
      filter: false,
    },
  },
  {
    name: "genres",
    label: "Gẽneros",
    width: "13%",
    options: {
      filter: false,
      customBodyRender(value, tableMeta, updateValue) {
        return (
          <span>
            {" "}
            {value.map((value: { name: any }) => value.name).join(", ")}{" "}
          </span>
        );
      },
    },
  },
  {
    name: "categories",
    label: "Categorias",
    width: "12%",
    options: {
      filterType: "multiselect",
      filterOptions: {
        names: [],
      },
      customBodyRender(value, tableMeta, updateValue) {
        return (
          <span>
            {" "}
            {value.map((value: { name: any }) => value.name).join(", ")}{" "}
          </span>
        );
      },
    },
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
            to={`/videos/${tableMeta.rowData[0]}/edit`}
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
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<Video[]>([]);
  const subscribed = useRef(true);
  const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;
  const [categories, setCategories] = useState<Category[]>();
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    rowsToDelete,
    setRowsToDelete,
  } = useDeleteCollection();

  const loading = useContext(LoadingContext);

  const {
    columns,
    filterManager,
    filterState,
    debouncedFilterState,
    totalRecords,
    setTotalRecords,
  } = useFilter({
    columns: columnsDefinitions,
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: rowsPerPageOptions,
    debounceTime: debounceTime,
    tableRef: tableRef,
    extraFilter: {
      createValidationSchema: () => {
        return yup.object().shape({
          categories: yup
            .mixed()
            .nullable()
            .transform((value) => {
              return !value || value === "" ? undefined : value.split(",");
            })
            .default(null),
        });
      },
      formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter
          ? {
              ...(debouncedState.extraFilter.categories && {
                categories: debouncedState.extraFilter.categories.join(","),
              }),
            }
          : undefined;
      },
      getStateFromURL: (queryParams) => {
        return {
          categories: queryParams.get("categories"),
        };
      },
    },
  });

  const indexColumnCategories = columns.findIndex(
    (c) => c.name === "categories"
  );
  const columnCategories = columns[indexColumnCategories];
  const categoriesFilterValue =
    debouncedFilterState.extraFilter &&
    debouncedFilterState.extraFilter.categories;
  (columnCategories.options as any).filterList = categoriesFilterValue
    ? categoriesFilterValue
    : [];

  const serverSideFilterList = columns.map((column) => []);
  if (categoriesFilterValue) {
    serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
  }

  useEffect(() => {
    subscribed.current = true;

    (async () => {
      try {
        const { data } = await categoryHttp.list({ queryParams: { all: "" } });

        if (subscribed.current) {
          setCategories(data.data);
          (columnCategories.options as any).filterOptions.names = data.data.map(
            (category) => category.name
          );
        }
      } catch (e) {
        console.log(e);
        if (categoryHttp.isCancelledRequest(e)) {
          return;
        }
        enqueueSnackbar("Não foi possível carregar as informações", {
          variant: "error",
        });
      }
    })();

    return () => {
      subscribed.current = false;
    };
  }, [enqueueSnackbar]);

  const filteredSearch = filterManager.clearSearchText(
    debouncedFilterState.search
  );

  useEffect(() => {
    subscribed.current = true;
    getData();
    filterManager.pushHistory();

    return () => {
      subscribed.current = false;
    };
  }, [
    filteredSearch,
    debouncedFilterState.pagination.page,
    debouncedFilterState.pagination.per_page,
    debouncedFilterState.order,
    JSON.stringify(debouncedFilterState.extraFilter),
  ]);

  async function getData() {
    try {
      const { data } = await videoHttp.list<listResponse<Video>>({
        queryParams: {
          search: filterManager.clearSearchText(debouncedFilterState.search),
          page: debouncedFilterState.pagination.page,
          per_page: debouncedFilterState.pagination.per_page,
          sort: debouncedFilterState.order.sort,
          dir: debouncedFilterState.order.dir,
          ...(debouncedFilterState.extraFilter &&
            debouncedFilterState.extraFilter.categories && {
              categories: debouncedFilterState.extraFilter.categories.join(","),
            }),
        },
      });

      if (subscribed.current) {
        setData(data.data);
        setTotalRecords(data.meta.total);
      }
    } catch (e) {
      console.log(e);
      if (videoHttp.isCancelledRequest(e)) {
        return;
      }
      enqueueSnackbar("Não foi possível carregar as informações", {
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

      await videoHttp.deleteCollection({ ids });

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

      enqueueSnackbar("Registros excluidos com sucesso!", {
        variant: "success",
      });
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Não foi possível excluir os registros", {
        variant: "error",
      });
    }
  }

  return (
    <React.Fragment>
      <DeleteDialog open={openDeleteDialog} handleClose={deleteRows} />
      <DefaultTable
        title={"Videos"}
        data={data}
        columns={columns}
        debounceSearchTime={debouncedSearchTime}
        loading={loading}
        ref={tableRef}
        options={{
          serverSide: true,
          searchText: filterState.search as any,
          page: filterState.pagination.page - 1,
          rowsPerPage: rowsPerPage,
          rowsPerPageOptions: rowsPerPageOptions,
          count: totalRecords,
          customToolbar: () => {
            return (
              <FilterResetButton
                handleClick={() => filterManager.resetFilter()}
              />
            );
          },
          onFilterChange: (column, filterList, type) => {
            const columnIndex = columns.findIndex((c) => c.name === column);

            if (columnIndex && filterList[columnIndex]) {
              filterManager.changeExtraFilter({
                [column]: filterList[columnIndex].length
                  ? filterList[columnIndex]
                  : null,
              });
            } else {
              filterManager.clearExtraFilter();
            }
          },
          onSearchChange: (value) => filterManager.changeSearch(value),
          onChangePage: (page) => filterManager.changePage(page),
          onChangeRowsPerPage: (per_page) =>
            filterManager.changeRowsPerPage(per_page),
          onColumnSortChange: (changedColumn: string, direction: string) =>
            filterManager.changeSort(changedColumn, direction),
          onRowsDelete: (rowsDeleted) => {
            setRowsToDelete(rowsDeleted as any);
            return false;
          },
        }}
      />
    </React.Fragment>
  );
};

export default Table;
