<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

# Classe específica - vendor/bin/phpunit tests/Unit/CategoryTest.php
# Método específico em um arquivo - vendor/bin/phpunit --filter testeIfUseTraits tests/Unit/CategoryTest.php
# Método específico em uma classe - vendor/bin/phpunit --filter CategoryTest::testeIfUseTraits

class CategoryTest extends TestCase
{

    use DatabaseMigrations;

    public function testCreate()
    {
        $category = Category::create(['name' => 'name value', 'description' => 'description value']);
        $this->assertNotNull($category);
    }

    public function testFillable()
    {
        $fillable = ['name', 'description', 'is_active'];
        $category = new Category();
        $this->assertEquals($fillable, $category->getFillable());
    }

    public function testeIfUseTraits() {
        $traits = [SoftDeletes::class, Uuid::class];
        $categoryTraits = array_keys(class_uses(Category::class));
        $this->assertEquals($traits, $categoryTraits);
    }

    public function testCastsAttribute()
    {
        $casts = ['id' => 'string'];
        $category = new Category();
        $this->assertEquals($casts, $category->getCasts());
    }

    public function testIncrementingAttribute()
    {
        $category = new Category();
        $this->assertFalse($category->getIncrementing());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $category = new Category();
        foreach ($dates as $date) {
            $this->assertContains($date, $category->getDates());
        }
        $this->assertCount(count($dates), $category->getDates());
    }
}
