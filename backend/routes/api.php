<?php

use Illuminate\Http\Request;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['namespace' => 'Api', 'as' => 'api.'], function () {
    $except = ['except' => ['create', 'edit']];

    Route::resource('categories', 'CategoryController', $except);
    Route::delete('categories', 'CategoryController@destroyCollection');

    Route::resource('genres', 'GenreController', $except);
    Route::delete('genres', 'GenreController@destroyCollection');

    Route::resource('cast_members', 'CastMemberController', $except);
    Route::delete('cast_members', 'CastMemberController@destroyCollection');

    Route::resource('videos', 'VideoController', $except);
    Route::delete('videos', 'VideoController@destroyCollection');
});
