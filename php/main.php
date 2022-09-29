<?php

function writeLogs($message)
{
    $logs = fopen('php.log', 'a+');
    fwrite($logs, date('d.m.y H:i:s') . ': ' . $message . "\n");
    fclose($logs);
}

function validate() {
    return isset($_POST['X']) && isset($_POST['Y']) && isset($_POST['R']);
}

function checkTriangle($x, $y, $r) {
    return $x <= 0 && $y <= 0 && $y >= - $x - $r;
}

function checkRectangle($x, $y, $r) {
    return $x <= 0 && $x >= -$r && $y >= 0 && $y <= $r;
}
function checkSector ($x, $y, $r) {
    return $x >= 0 && $y >= 0 && sqrt($x * $x + $y * $y) <= $r * $r;
}

function checkArea($x, $y, $r) {
    return checkTriangle($x, $y, $r) || checkRectangle($x, $y, $r) || checkSector($x, $y, $r);
}

function validateX($x) {
    return is_numeric($x) && ($x == -4 || $x == -3 || $x == -2 || $x == -1 || $x == 0 || $x == 1 || $x == 2 || $x == 3 || $x == 4);
}

function validateY($y) {
    return is_numeric($y) && $y > -3 && $y < 3;
}

function validateR($r) {
    return is_numeric($r) && ($r == 1 || $r == 1.5 || $r == 2 || $r == 2.5 || $r == 3);
}

if (validate()) {
    date_default_timezone_set('Europe/Moscow');
    $x = trim($_POST['X']);
    $y = trim($_POST['Y']);
    $r = trim($_POST['R']);
    if (validateX($x) && validateY($y) && validateR($r)) {
        $currentTime = date("d.m.Y H:i:s", time());
        $scriptTime = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 6);
        $inArea = checkArea($x, $y, $r) ? 'Да':'Нет';
        $data =  "{\"x\" : $x, \"y\" : $y, \"r\" : $r, \"current\" : \"$currentTime\", \"execution\" : $scriptTime, \"result\" : \"$inArea\"}";
        echo $data;
    } else echo "{\"error\" : true}";
} else {
    echo "error";
}



