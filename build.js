import esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['src/index.js'],
    outfile:'app.js',
    bundle: true,
    minify: true
});
