<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use \Ramsey\Uuid\Uuid as RamseyUuid;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class VideoTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(Video::class, 1)->create();
        $videos = Video::all();
        $this->assertCount(1, $videos);
        $videoKey = array_keys($videos->first()->getAttributes());
        $this->assertEqualsCanonicalizing(
            [
                'id',
                'title',
                'description',
                'year_launched',
                'opened',
                'rating',
                'duration',
                'created_at',
                'updated_at',
                'deleted_at'
            ],
            $videoKey
        );
    }

    public function testCreate()
    {
        $rating = Video::RATINT_LIST[0];
        $data = [
            'title' => 'test1',
            'description' => 'description 1',
            'year_launched' => 2021,
            'opened' => true,
            'rating' => $rating,
            'duration' => 1,
        ];
        $video = Video::create($data);
        $video->refresh();
        $this->assertEquals(36, strlen($video->id));
        $this->assertEquals('test1', $video->title);
        $this->assertTrue($video->opened);

        $data['opened'] = false;
        $video = Video::create($data);
        $this->assertFalse($video->opened);
    }

    public function testUpdate()
    {
        $video = factory(Video::class)->create([
            'opened' => true
        ]);
        $data = [
            'title' => 'test_name_updated',
            'opened' => false
        ];
        $video->update($data);
        foreach ($data as $key => $value) {
            $this->assertEquals($value, $video->{$key});
        }
    }

    public function testDelete()
    {
        $video = factory(Video::class)->create([
            'title' => 'test1',
            'opened' => true
        ])->first();
        $video->delete();
        $this->assertSoftDeleted('videos', [
            'id' => $video->id
        ]);
    }

    public function testUuid()
    {
        $video = factory(Video::class)->create([
            'title' => 'test1',
            'opened' => true
        ])->first();
        $this->assertTrue(RamseyUuid::isValid($video->id));
    }
}

