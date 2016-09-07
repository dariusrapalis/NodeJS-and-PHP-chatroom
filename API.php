<?php
/**
 * Created by PhpStorm.
 * User: Darius Rapalis
 * Date: 8/9/2016
 * Time: 7:10 PM
 */

/*
require_once 'core/globals.php';

spl_autoload_register(function($class) {
    require_once 'classes/' . $class . '.php';
});*/

//$privateKey = Input::get('privateKey');
$privateKey = $_POST['privateKey'];
$error = '';
if(strlen($privateKey) === 64) {
    //$check = DB::getInstance()->get('private_keys', [], ['key', '=', $privateKey]);
    //check if private key is valid and exists
    if(/*!$check->error() && $check->count()*/ true) {
        //$user = new User($check->result()->user);
        switch(/*Input::get('action')*/ $_POST['action']) {
            case 'send-chat-message':
                $message = $_POST['message'];
                /*$message = Chat::convert(Input::get('message'));
                DB::getInstance()->insert('chat',[
                    'user' => $user->data()->user,
                    'message' => $message,
                    'time' => time()
                ]);
                echo json_encode(['profilePicture' => $user->getProfilePicture(), 'name' => $user->getName(), 'message' => $message, 'time' => date("Y-m-d H:i:s"), 'userID' => $user->data()->user]);*/
                //saving message to database and returning new message
                echo json_encode(['profilePicture' => 'https://14415-presscdn-0-52-pagely.netdna-ssl.com/wp-content/uploads/brandwatch/troll.jpg', 'name' => rand(10000,99999), 'message' => $message, 'time' => date("Y-m-d H:i:s"), 'userID' => rand(0,10000)]);
                break;
            case 'delete-chat-message':
                if(/*$user->hasPermission('delete-chat-message')*/ true) { // check if user has a permission to delete
                    /*DB::getInstance()->delete('chat', ['id', '=', Input::get('message')]);*/
                    echo json_encode(['success' => 'Message '.(/*Input::get('message')*/$_POST['message']).' has been deleted']);
                } else {
                    $error = 'You don\'t have a permission to do this action';
                }
                break;
            default:
                $error = 'Unknown command...';
        }
    } else if(!$check->error()) {
        $error = 'Invalid private key!';
    } else {
        $error = 'Error occurred while getting results from database';
    }
} else {
    $error = 'Private key format is incorrect';
}
if($error != '') {
    /*Log::toFile('API.log', json_encode([$_SERVER['REMOTE_ADDR'] => $_POST, 'time' => time(), 'date' => date("Y-m-d H:i:s")]));*/ //logging messages
    echo json_encode(['error-message' => $error]);
}