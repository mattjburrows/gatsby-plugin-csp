const flatten = require('lodash.flatten')

const {
    createStaticAssetHashes,
    createCSPMetaTag
} = require(`./csp-builder`)

exports.onPreRenderHTML = function buildCSPs({
    getHeadComponents,
    replaceHeadComponents,
    getPreBodyComponents,
    getPostBodyComponents
}, pluginOptions) {
    const headComponents = getHeadComponents();
    const preBodyComponents = getPreBodyComponents();
    const postBodyComponents = getPostBodyComponents();
    const allStaticAssets = [
        ...flatten(headComponents),
        ...flatten(preBodyComponents),
        ...flatten(postBodyComponents)
    ]
    const staticAssetHashes = createStaticAssetHashes(allStaticAssets)
    const cspMetaTag = createCSPMetaTag(staticAssetHashes);

    console.log(`---pluginOptions---`, pluginOptions);
    console.log(`---allStaticAssets---`, staticAssetHashes);
    console.log(`---cspMetaTag---`, cspMetaTag);
}