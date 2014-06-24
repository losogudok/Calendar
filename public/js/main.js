/**
 * Created by andrey on 02.05.14.
 */
require.config({
    paths: {
        widgets: './app/widgets',
        helpers: './helpers',
        pubsub: "./helpers/pubsub",
        locale: './locale'
    }
});
require(['app/app'], function(MYAPP){
    MYAPP.init();
});