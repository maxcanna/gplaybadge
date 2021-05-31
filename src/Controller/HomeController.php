<?php
/**
 * User: massimilianocannarozzo
 * Date: 05/10/14
 * Time: 20:29
 */

namespace GPlayInfo\Controller;

use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\RequestException;
use Silex\Application;
use Symfony\Component\HttpFoundation\Response;

class HomeController
{
    protected $app;
    protected $dataFetcher;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->dataFetcher = $this->app['service.fetcher'];
    }

    public function homeAction()
    {
        $topApps = $this->dataFetcher->fetchTopApps();

        return (new Response($this->app['twig']->render('home.twig', [
            'top_apps' => $topApps,
            'ua' => getenv('UA'),
        ])))
            ->setExpires(new \DateTime('now +1 day'))
            ->setMaxAge(24 * 60 * 60)
            ->setSharedMaxAge(24 * 60 * 60);
    }
}
