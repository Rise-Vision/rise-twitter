const gulp = require('gulp');
const nodeSass = require('node-sass');
const path = require('path');
const fs = require('fs');
const map = require('map-stream');
const basePath = "src/";
const excludeDir = basePath+"bower_components/";
const ext = "**/*.html";
const includePaths = ['src/**/'];
const excludeDirs = [`!${basePath}/static/css/${ext}`,`!${basePath}/static/img/${ext}`,`!${basePath}/static/template/${ext}`]

gulp.task('watchSass', [], () => {
  gulp.watch(['src/static/css/**/*.scss', '!app/bower_components/**/*.scss'], ["injectSass"]);
});

gulp.task('injectSass', [], () => {
/* Original creator: David Vega.
 * Adapted by Jose A.
 */
return gulp.src([basePath + 'rise-twitter.html'])
    .pipe(map(function (file, cb) {
      console.log("start");
        var startStyle = "<!-- Start Style -->";
        var endStyle = "<!-- End Style -->";

        var regEx = new RegExp(startStyle+"[\\s\\S]*"+endStyle, "g");

        var contents = file.contents.toString();

        if (!regEx.test(contents)) {
          console.log("boo");
            return cb();
        }

            var scssFile = 'src/static/css/main.scss';
            fs.readFile(scssFile, function (err, data) {
                if (err || !data) {
                  console.log("here2");
                  console.log(err);
                  return cb();
                }
                nodeSass.render({
                        data: data.toString(),
                        includePaths: [path.join('app', 'style/'), ...includePaths],
                        outputStyle: 'compressed'
                    }, function (err, compiledScss) {
                      console.log("here");
                      console.log(err);
                      console.log(compiledScss);
                        if (err || !compiledScss)
                            return cb();

                            var injectSassContent = startStyle +
                                "<style>" +
                                compiledScss.css.toString() +
                                "</style>" +
                                endStyle;

                            file.contents = new Buffer(contents.replace(regEx, injectSassContent), 'binary');
                            return cb(null,file);
                            console.log(file.contents);
                 });
            });
        }))
    .pipe(gulp.dest(basePath));
});

gulp.task( "default", [], () => {
  console.log( "********************************************************************".yellow );
  console.log( "  gulp bower-clean-install: delete and re-install bower components".yellow );
  console.log( "  gulp bower-update: update bower components".yellow );
  console.log( "  gulp build: build a distribution version".yellow );
  console.log( "  gulp bump: bump the release version".yellow );
  console.log( "  gulp test: run e2e, integration, and unit tests".yellow );
  console.log( "********************************************************************".yellow );
  return true;
} );
