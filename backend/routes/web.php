<?php

Route::get('/', function () {
    return view('welcome');
});
Route::get('/admin/{react?}', function ($react = null) {
    return view('admin-frontend.index');
})->where('react', '.*');
//http://localhost:8000/admin/categories