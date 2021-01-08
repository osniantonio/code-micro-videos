<?php

namespace Tests\Stubs\Controllers;

use App\Http\Controllers\Api\BasicCrudController;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Tests\Stubs\Models\CategorySub;

class CategoryControllerStub extends BasicCrudController
{
    protected function model() 
    {
        return CategorySub::class;
    }

    protected function rulesStore() 
    {
        return [
            'name' => 'required|max:255',
            'description' => 'nullable'
        ];
    }

    protected function rulesUpdate() 
    {
        return [
            'name' => 'required|max:255',
            'description' => 'nullable'
        ];
    }
}
