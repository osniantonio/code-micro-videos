<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

# Classe específica - vendor/bin/phpunit tests/Unit/CategoryTest.php
# Método específico em um arquivo - vendor/bin/phpunit --filter testeIfUseTraits tests/Unit/CategoryTest.php
# Método específico em uma classe - vendor/bin/phpunit --filter CategoryTest::testeIfUseTraits

class CategoryTest extends TestCase
{
    private $category;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = new Category();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
    }

    public function testFillable()
    {
        $fillable = ['name', 'description', 'is_active'];
        $this->assertEquals($fillable,  $this->category->getFillable());
    }

    public function testeIfUseTraits() {
        $traits = [SoftDeletes::class, Uuid::class];
        $categoryTraits = array_keys(class_uses(Category::class));
        $this->assertEquals($traits, $categoryTraits);
    }

    public function testCastsAttribute()
    {
        $casts = ['id' => 'string'];
        $this->assertEquals($casts,  $this->category->getCasts());
    }

    public function testIncrementingAttribute()
    {
        $this->assertFalse( $this->category->getIncrementing());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        foreach ($dates as $date) {
            $this->assertContains($date,  $this->category->getDates());
        }
        $this->assertCount(count($dates),  $this->category->getDates());
    }
}
