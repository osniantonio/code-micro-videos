<?php

namespace Tests\Feature\Models\Video;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

abstract class BaseVideoTestCase extends TestCase
{
    use DatabaseMigrations;

    protected $data;  

    protected function setUp(): void
    {
        parent::setUp();
        $this->data = [
            'title' => 'title',
            'description' => 'description',
            'year_launched' => 2010,
            'rating' => Video::RATING_LIST[0],
            'duration' => 90
        ];
    }

    protected function getFiles()
    {
        return
            [
                'thumb_file' => UploadedFile::fake()->image('thumb_file.jpg'),
                'banner_file' => UploadedFile::fake()->image('banner_file.jpg'),
                'video_file' => UploadedFile::fake()->create('video_file.mp4'),
                'trailer_file' => UploadedFile::fake()->create('trailer_file.mp4')
            ];
    }
}
