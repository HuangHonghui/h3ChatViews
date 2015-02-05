var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    nodemon = require('nodemon');
   //var  browserSync = require('browser-sync');

//
//// reload all browsers
//gulp.task('bs-reload', function () {
//    browserSync.reload();
//});

gulp.task('watch',['browser-sync'],function(){
    livereload.listen();

    nodemon({
        script: 'index.js',
        "ignore": ["src/*","bower_components/*","models/*"],
        stdout: false
    }).on('readable',function(){
        this.stdout.on('data',function(chunk){
            if(/^listening/.test(chunk)){
                livereload.reload()
            }
            process.stdout.write(chunk);
        })
    });
    //gulp.watch(["views/*.html","dist/**/*.js","dist/**/*.css"], ['bs-reload']);
});