import esbuild from 'esbuild'
import server from 'apprun-dev-server'

await esbuild.build({
    entryPoints:['src/index.tsx'],
    outfile:'app.js',
    bundle: true,
    watch: true
});

//server.start({host:'localhost', port:3001, watch:'.'})