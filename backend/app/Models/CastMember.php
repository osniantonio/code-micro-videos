<?php

namespace App\Models;

use App\ModelFilters\CastMemberFilter;
use App\Models\Traits\SerializeDateToIso8601;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use EloquentFilter\Filterable;

class CastMember extends Model
{
    use SoftDeletes, Traits\Uuid, Filterable, SerializeDateToIso8601;
    public const TYPE_DIRECTOR = 1;
    public const TYPE_ACTOR = 2;
    protected $fillable = ['name', 'type'];
    protected $dates = ['deleted_at'];
    protected $casts = ['id' => 'string', 'type' => 'smallInteger'];
    public $incrementing = false;
    protected $keyType = 'string';
    
    public static function types()
    {
        return [
            self::TYPE_DIRECTOR,
            self::TYPE_ACTOR,
        ];
    }

    public function modelFilter()
    {
        return $this->provideFilter(CastMemberFilter::class);
    }
}
