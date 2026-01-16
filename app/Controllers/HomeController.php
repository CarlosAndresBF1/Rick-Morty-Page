<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;

class HomeController extends Controller
{
    /**
     * Home page - redirects to characters
     * 
     * @return never
     */
    public function index(): never
    {
        $this->redirect('/characters');
    }
}