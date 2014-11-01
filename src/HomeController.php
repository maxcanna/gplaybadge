<?php
/**
 * User: massimilianocannarozzo
 * Date: 05/10/14
 * Time: 20:29
 */

namespace GPlayInfo;

use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\RequestException;
use Silex\Application;
use Symfony\Component\HttpFoundation\Response;

class HomeController
{
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    public function homeAction()
    {
        $topApps = [];
        $guzzle = $this->app['guzzle_ws'];

        try {
            $topApps = $guzzle->get('/topFreeApps')->json();
        } catch (ClientException $e) {
            $this->app['monolog']->addError($e->getMessage());
            $this->app->abort(500);
        } catch (RequestException $e) {
            $this->app['monolog']->addError($e->getMessage());
            $this->app->abort(500);
        }

        shuffle($topApps);
        array_splice($topApps, 5);

        return (new Response($this->app['twig']->render($this->app['debug'] ? 'home.twig' : 'home.min.twig', [
            'top_apps' => $topApps
        ])))
            ->setExpires(new \DateTime('now +1 day'))
            ->setMaxAge(24 * 60 * 60)
            ->setSharedMaxAge(24 * 60 * 60);
    }

    public function faviconAction()
    {
        $topApps = [];
        $guzzle = $this->app['guzzle_ws'];

        try {
            $topApps = $guzzle->get('/topFreeApps')->json();
        } catch (ClientException $e) {
            $this->app['monolog']->addError($e->getMessage());
            $this->app->abort(500);
        } catch (RequestException $e) {
            $this->app['monolog']->addError($e->getMessage());
            $this->app->abort(500);
        }

        shuffle($topApps);

        return $this->app->redirect($topApps[0]['image']);
    }
}
