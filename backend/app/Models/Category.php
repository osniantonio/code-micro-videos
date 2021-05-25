<?php

namespace App\Models;

use App\ModelFilters\CategoryFilter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use EloquentFilter\Filterable;

class Category extends Model
{
    use SoftDeletes, Traits\Uuid, Filterable;
    protected $fillable = ['name', 'description', 'is_active'];
    protected $dates = ['deleted_at'];
    protected $casts = ['id' => 'string', 'is_active' => 'boolean'];
    public $incrementing = false;

    public function modelFilter()
    {
        return $this->provideFilter(CategoryFilter::class);
    }

    public function genres() 
    {
        return $this->belongsToMany(Genre::class)->withTrashed();
    }
}
