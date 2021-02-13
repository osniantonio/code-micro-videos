<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Traits\TestSaves;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

abstract class BaseVideoControllerTestCase extends TestCase
{
    use DatabaseMigrations;

    protected $video;
    protected $sendData;

    protected function setUp(): void
    {
        parent::setup();
        $this->video = factory(Video::class)->create([
            'opened' => false
        ]);
        $this->sendData = [
            'title' => 'title',
            'description' => 'description',
            'year_launched' => 1992,
            'rating' => Video::RATING_LIST[0],
            'duration' => 90,
        ];
    }

    protected function getFiles()
    {
        return
            [
                'thumb_file' => UploadedFile::fake()->create('thumb_file.jpg'),
                'banner_file' => UploadedFile::fake()->create('banner_file.jpg'),
                'video_file' => UploadedFile::fake()->create('video_file.mp4'),
                'trailer_file' => UploadedFile::fake()->create('trailer_file.mp4')
            ];
    }

    public function assertHasCategory($videoId, $categoryId)
    {
        $this->assertDatabaseHas('category_video', ['category_id' => $categoryId, 'video_id' => $videoId]);
    }

    public function assertHasGenre($videoId, $genreId)
    {
        $this->assertDatabaseHas('genre_video', ['video_id' => $videoId, 'genre_id' => $genreId]);
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model()
    {
        return Video::class;
    }
}
