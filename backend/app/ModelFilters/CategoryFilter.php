<?php

namespace App\ModelFilters;

use Log;
use Illuminate\Database\Eloquent\Builder;

class CategoryFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'is_active','created_at'];

    public function search($search) {
        $this->where('name', 'LIKE', "%$search%");
    }

    public function genres($genres) {
        $id = explode(",", $genres);
        $this->whereHas('genres', function (Builder $query) use($id) {
            $query
                ->whereIn('id', $id);
        });
    }
}
