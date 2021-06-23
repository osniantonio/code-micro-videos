<?php

use Illuminate\Http\Request;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['namespace' => 'Api', 'as' => 'api.'], function () {
    $except = ['except' => ['create', 'edit']];
    Route::resource('categories', 'CategoryController', $except);
    Route::resource('genres', 'GenreController', $except);
    Route::resource('cast_members', 'CastMemberController', $except);
    Route::resource('videos', 'VideoController', $except);
});
