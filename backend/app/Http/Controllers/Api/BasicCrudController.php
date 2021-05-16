<?php

namespace App\Http\Controllers\Api;

use Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\ModelFilters\GenreFilter;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Database\Eloquent\Builder;

abstract class BasicCrudController extends Controller
{
    protected $defaultPerPage = 15;
    protected abstract function model();
    protected abstract function rulesStore();
    protected abstract function rulesUpdate();
    protected abstract function resource();
    protected abstract function resourceCollection();

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', $this->defaultPerPage);
        $hasFilter = in_array(Filterable::class, class_uses($this->model()));
        $query = $this->queryBuilder();

        if ($hasFilter) {
            $query = $query->filter($request->all());
        }

        // ini ajustes para filtrar ????
        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->input('search').'%');
        }

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('categories')) {
            $idOrNames = explode(",", $request->input('categories'));
            $query->whereHas('categories', function (Builder $query) use ($idOrNames) {
                $query
                    ->whereIn('id', $idOrNames)
                    ->orWhereIn('name', $idOrNames);
            });
        }
        
        if ($request->has('sort')) {
            $query->orderBy($request->input('sort'), $request->input('dir'));
        }
        // fim ajustes para filtrar ????


        $data = $request->has('all') || !$this->defaultPerPage
            ? $query->get()
            : $query->paginate($perPage);
        $resourceCollectionClass = $this->resourceCollection();
        $refClass = new \ReflectionClass($this->resourceCollection());

        return $refClass->isSubclassOf(ResourceCollection::class)
            ? new $resourceCollectionClass($data)
            : $resourceCollectionClass::collection($data);
    }

    protected function findOrFail($id)
    {
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->queryBuilder()->where($keyName, $id)->firstOrFail();
    }

    public function show($id)
    {
        $obj = $this->findOrFail($id);
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function store(Request $request)
    {
        $validateData = $this->validate($request, $this->rulesStore());
        $obj = $this->queryBuilder()->create($validateData);
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $obj->update($validatedData);
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function destroy($id)
    {
        $obj = $this->findOrFail($id);
        $obj->delete();
        return response()->noContent(); // status 204
    }

    protected function queryBuilder(): Builder{
        return $this->model()::query();
    }
}
