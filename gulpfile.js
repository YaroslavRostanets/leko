var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch');

var cached = require('gulp-cached'),
    remember = require('gulp-remember'),
    connect = require('gulp-connect');

var less = require('gulp-less');

var compass = require('gulp-compass'),
    scss = require('gulp-sass');


var uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    cssBase64 = require('gulp-css-base64');

var jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    scssLint = require('gulp-scss-lint');

var dev_patches = {
    'js': ['./src/js/*'],
    'font': ['./src/font/*'],
    'less': ['./src/less/**/*.less'],
    'scss': ['./src/scss/**/*.scss'],
    'css': ['./src/css/main.css'],
    'css-base': './src/css/',
    'images-jpg': ['./src/img/**/*.jpg', './src/img/*.jpg'],
    'images-svg': ['./src/img/**/*.svg'],
    'images-png': ['./src/img/**/*.png'],
    'images': ['./src/img/**/*'],
    'images-css': ['./src/imgcss']
};

var build_patches = {
    'images': './local/templates/main/img/',
    'js': './local/templates/main/js/',
    'css': './local/templates/main/css/',
    'font': './local/templates/main/font/'
};

var build_patches_copy_list = {
    'images': './local/templates/main/img/**/*',
    'js': './local/templates/main/js/**/*',
    'css': './local/templates/main/css/**/*',
    'font': './local/templates/main/font/**/*'
};

var yii_base_path = '../web';
var yii_patches = {
    'images': yii_base_path + '/img/',
    'js': yii_base_path + '/js/',
    'css': yii_base_path + '/css/',
    'font': yii_base_path + '/font/'
};

gulp.task('watch', function () {
    gulp.watch(dev_patches['js'], ['scripts']);
    gulp.watch(dev_patches['images'], ['images']);
    gulp.watch(dev_patches['css'], ['minify-css']);
    gulp.watch(dev_patches['scss'], ['scss']);
    gulp.watch(dev_patches['less'], ['less']);
    gulp.watch(dev_patches['font'], ['font']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scss', 'less', 'scripts', 'images', 'minify-css']);
//'webserver', 'livereload', 'base64'
//------------------------------------------------------------------------


gulp.task('font', function () {
    gulp.src(dev_patches['font'])
        .pipe(gulp.dest(build_patches['font']));
});

//------------------------------------------------------------------------

gulp.task('compass', function () {
    gulp.src(dev_patches['scss'])
    // .pipe(plumber({
    //   errorHandler: function (error) {
    //     console.log(error.message);
    //     this.emit('end');
    // }}))
        .pipe(compass({
            css: dev_patches['css-base'],
            sass: 'scss',
            image: 'images'
        }))
        .on('error', console.log)
        .pipe(gulp.dest(dev_patches['css-base']))
        .pipe(minifyCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(build_patches['css']));
});

gulp.task('less', function () {
    return gulp.src(dev_patches['less'])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.less'}))
        .pipe(gulp.dest(dev_patches['css-base']));
});

gulp.task('scss', function () {
    return gulp.src(dev_patches['scss'])
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: ''}))
        .pipe(gulp.dest(dev_patches['css-base']));
});

gulp.task('lintSCSS', function () {
    return gulp.src(dev_patches['scss'])
        .pipe(cached('lintingCSS'))
        .on('error', console.log)
        .pipe(scssLint({
            // 'maxBuffer': 307200
        }));
});
//------------------------------------------------------------------------


gulp.task('minify-css', function () {
    return gulp.src(dev_patches['css'])
    //.pipe(cssBase64())
        .pipe(rename({
            'suffix': '.min'
        }))
        .pipe(minifyCss())
        .on('error', console.log)
        .pipe(gulp.dest(build_patches['css']))
        .pipe(connect.reload());
});


gulp.task('lintCSS', function () {
    return gulp.src(dev_patches['css'])
        .pipe(cached('lintingCSS'))
        .pipe(cssLint())
        .on('error', console.log)
        // .pipe(jshint.reporter('default'));
        .pipe(cssLint.reporter('jshint-stylish'));
});

//------------------------------------------------------------------------

gulp.task('scripts', ['minify-js', 'lintJS'], function () {
    return gulp.src(dev_patches['js'])
        .pipe(remember('lintingJS'))
        .pipe(concat('main.js'))
        .on('error', console.log)
        .pipe(gulp.dest(build_patches['js']));
});

gulp.task('minify-js', function () {
    return gulp.src(build_patches['scripts'] + 'main.js')
        .pipe(rename(build_patches['scripts'] + 'main.min.js'))
        .pipe(uglify())
        .on('error', console.log)
        .pipe(gulp.dest('.'));
});

gulp.task('lintJS', function () {
    return gulp.src(dev_patches['js'])
        .pipe(cached('lintingJS'))
        .pipe(jshint())
        // .pipe(jshint.reporter('default'));
        .pipe(jshint.reporter('jshint-stylish'));
});
//------------------------------------------------------------------------

gulp.task('images', ['image-jpg', 'image-png', 'image-svg']);

gulp.task('image-jpg', function () {
    return gulp.src(dev_patches['images-jpg'])
    // .pipe(imageminJpegtran({progressive: true})())
    // .on('error', console.log)
        .pipe(gulp.dest(build_patches['images']));
});

gulp.task('image-png', function () {
    return gulp.src(dev_patches['images-png'])
        .pipe(imagemin({
            use: [imagePngquant()]
        }))
        .on('error', console.log)
        .pipe(gulp.dest(build_patches['images']));
});

gulp.task('image-svg', function () {
    return gulp.src(dev_patches['images-svg'])
        .pipe(imagemin({
            svgoPlugins: [{removeViewBox: false}],
        }))
        .on('error', console.log)
        .pipe(gulp.dest(build_patches['images']));
});
//------------------------------------------------------------------------

gulp.task('lintHTML', function () {
    return gulp.src('./src/*.html')
        .pipe(cache('lintingHTML'))
        // if flag is not defined default value is 'auto'
        .pipe(jshint.extract('auto|always|never'))
        .pipe(jshint())
        // .pipe(jshint.reporter('default'));
        .pipe(jshint.reporter('jshint-stylish'));
});

//------------------------------------------------------------------------