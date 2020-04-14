<?php

use GPlayInfo\Controller\FaviconController;
use GPlayInfo\Controller\HomeController;
use GPlayInfo\Service\BadgeGenerator;
use GPlayInfo\Service\DataFetcher;
use GuzzleHttp\Client;
use Monolog\Handler\ErrorLogHandler;
use Silex\Application;
use GPlayInfo\Controller\BadgeController;
use Silex\Provider\MonologServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\RoutingServiceProvider;
use Symfony\Component\HttpFoundation\Request;

require_once __DIR__ . '/../vendor/autoload.php';

$app = new Application();

$app['debug'] = getenv('ENVIRONMENT') == 'dev';

$app->register(new TwigServiceProvider(), [
    'twig.path' => __DIR__ . '/../res/views'
]);

$app->register(new MonologServiceProvider(), [
    'monolog.logfile' => '/dev/null',
    'monolog.name' => 'gplay.ws',
    'monolog.handler' => new ErrorLogHandler()
]);

$app->register(new ServiceControllerServiceProvider());

$app->register(new RoutingServiceProvider());

$app['ws.auth.header.name'] = 'X-RapidAPI-Key';
$app['ws.auth.header.value'] = getenv('RAPIDAPI_KEY');
$app['ws.url'] = 'https://gplaystore.p.rapidapi.com';

$app['controllers.badge'] = function() use ($app) {
    return new BadgeController($app);
};

$app['controllers.home'] = function() use ($app) {
    return new HomeController($app);
};

$app['controllers.favicon'] = function() use ($app) {
    return new FaviconController($app);
};

$app['service.generator'] = function() use ($app) {
    return new BadgeGenerator($app);
};

$app['service.fetcher'] = function() use ($app) {
    return new DataFetcher($app);
};

$app['service.guzzle'] = function() use ($app) {
    $g = new Client([
        'base_uri' => $app['ws.url'],
        'headers' => [
            'X-Forwarded-For' => $app['request_stack']->getCurrentRequest()->getClientIp(),
            'User-Agent' => $app['request_stack']->getCurrentRequest()->headers->get('User-Agent'),
            $app['ws.auth.header.name'] => $app['ws.auth.header.value']
        ]
    ]);
    return $g;
};

//Error handler
$app->error(function(\Exception $e, $code) use ($app) {
    if ($app['debug']) {
        return null;
    }

    switch ($code) {
        case 404:
            $message = 'Sorry, the page you are looking for could not be found.';
            break;
        default:
            $message = 'We are sorry, but something went terribly wrong.';
    }

    return $app['twig']->render('error.twig', ['message' => $message]);
});

//Routes
$app->get('/', 'controllers.home:homeAction')
    ->bind('home');

$app->get('/badge/', 'controllers.badge:badgeAction')
    ->assert('lang', '[a-z]{2}')
    ->bind('badge');

$app->get('/favicon.ico', 'controllers.favicon:faviconAction');
$app->get('/apple-touch-icon{modifier}.png', 'controllers.favicon:faviconAction')
    ->assert('modifier', '(-.*)*');

//Enable heroku reverse proxy
if ($app['debug']) {
    Request::setTrustedProxies([$_SERVER['REMOTE_ADDR']]);
}

$app->run();
