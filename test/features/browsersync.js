import mix from './helpers/setup';
import mockRequire from 'mock-require';
import Browsersync from '../../src/components/Browsersync';

mockRequire(
    'browser-sync-webpack-plugin',
    class BrowserSyncPluginStub {
        apply() {}
    }
);

test.serial.cb('it handles Browsersync reloading', t => {
    let response = mix.browserSync('app.dev');

    t.is(mix, response);

    compile(t, config => {
        t.truthy(
            config.plugins.find(
                plugin => plugin.constructor.name === 'BrowserSyncPluginStub'
            )
        );
    });
});

test.serial('it injects the snippet in the right place', t => {
    let regex = new Browsersync().regex();

    t.is(regex.exec(`<div></div>`), null);
    t.is(regex.exec(`<body></body>`).index, 6);
    t.is(regex.exec(`<BODY></BODY>`).index, 6);
    t.is(regex.exec(`<pre></pre>`).index, 5);
    t.is(regex.exec(`<body><pre></pre></body>`).index, 17);
    t.is(
        regex.exec(`
            <body>
                <pre></pre>
                <div></div>
                <pre></pre>
            </body>
        `).index,
        116
    );
});
