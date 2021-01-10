<?php

namespace Tests\Stubs\Controllers;

use App\Http\Controllers\Api\BasicCrudController;
use Tests\Stubs\Models\VideoSub;

class VideoControllerStub extends BasicCrudController
{
    protected function model() 
    {
        return VideoSub::class;
    }

    protected function rulesStore() 
    {
        return [
            'name' => 'required|max:255'
        ];
    }

    protected function rulesUpdate() 
    {
        return [
            'name' => 'required|max:255'
        ];
    }
}