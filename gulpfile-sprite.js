// [ БАЗОВІ НАЛАШТУВАННЯ ]
var gulp = require('gulp'); //Відповідно сам gulp
var sprite = require('gulp-sprite-generator');

//source
var dev_paths = {
    'js': ['./build/js/*'],
    'less': ['./build/less/**/*.less'],
    'scss': ['./build/scss/**/*.scss'],
    'css': ['./build/css/main.scss.css'],
    'css-base': './build/css/',
    'images-jpg': ['./build/img/**/*.jpg', './build/img/*.jpg'],
    'images-svg': ['./build/img/**/*.svg'],
    'images-png': ['./build/img/**/*.png'],
    'images': ['./build/img/**/*'],
    'images-css': ['./build/imgcss']
};
//destination
var build_paths = {
    'images': './public/img/',
    'js': './public/js/',
    'css': './public/css/'
};

gulp.task('sprites', function () {
    var spriteOutput;

    spriteOutput = gulp.src("./build/css/*.css")
        .pipe(sprite({
            //baseUrl: "./build",
            spriteSheetName: "sprite.png",
            spriteSheetPath: "../img"
        }));

    spriteOutput.css.pipe(gulp.dest("./build/css1"));
    spriteOutput.img.pipe(gulp.dest("./build/img"));
});