<?php
/**
 * User: massimilianocannarozzo
 * Date: 05/11/16
 * Time: 20:29
 */

namespace GPlayInfo\Controller;

use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\RequestException;
use Silex\Application;
use Symfony\Component\HttpFoundation\Response;

class FaviconController
{
    protected $app;
    protected $dataFetcher;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->dataFetcher = $this->app['service.fetcher'];
    }

    public function faviconAction()
    {
        $topApps = $this->dataFetcher->fetchTopApps();

        return $this->app->redirect($topApps[0]['image']);
    }
}
