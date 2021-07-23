<?php

namespace App\Models\Traits;

use \Ramsey\Uuid\Uuid as RamseyUuid;

trait Uuid
{
    public static function boot()
    {
        parent::boot();
        /*static::creating(function($obj) {
            $obj->id = RamseyUuid::uuid4()->toString();
        });*/
        static::creating(function ($obj) {
            $obj->{$obj->getKeyName()} = (string)RamseyUuid::uuid4()->toString();
        });
    }
}
