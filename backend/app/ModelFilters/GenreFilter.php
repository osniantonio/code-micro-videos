<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;

class GenreFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'is_active', 'created_at'];

    public function search($search)
    {
        $this->query->where('name', 'LIKE', "%$search%");
    }

    public function is_active($is_active)
    {
        $this->query->where('is_active', $is_active);
    }

    public function categories($categories)
    {
        $ids = explode(",", $categories);
        $this->whereHas('categories', function (Builder $query) use ($ids) {
            $query
                ->whereIn('id', $ids)
                ->orWhereIn('name', $ids);
        });
    }
}
