const crypto = require(`crypto`)

function createHashFromInlinedStaticAssets (staticAsset) {
    const inlinedStaticAssetContents = staticAsset.props.dangerouslySetInnerHTML.__html
    const hashedStaticAsset = crypto
        .createHash(`sha256`)
        .update(inlinedStaticAssetContents, `utf-8`)
        .digest(`base64`)
    
    return `'sha256-${hashedStaticAsset}'`
}

function isInlineAssetType (staticAsset, type) {
    return staticAsset.type === type && !!staticAsset.props.dangerouslySetInnerHTML
}

function createStaticAssetHashes (allStaticAssets) {
    return allStaticAssets.reduce(
        (accumulator, staticAsset) => {
            if (isInlineAssetType(staticAsset, `style`)) {
                accumulator.style.push(createHashFromInlinedStaticAssets(staticAsset))
            }
            if (isInlineAssetType(staticAsset, `script`)) {
                accumulator.script.push(createHashFromInlinedStaticAssets(staticAsset))
            }
            return accumulator
        },
        {
            style: [],
            script: []
        }
    )
}

function createAssetPolicyByType (assets, type) {
    if (assets && assets.length) {
        return `${type}-src ${assets.join(` `)};`
    }
    return ``
}

function createCSPMetaTag (staticAssetHashes) {
    return `<meta
        httpEquiv="Content-Security-Policy"
        content="
            default-src 'self';
            ${createAssetPolicyByType(staticAssetHashes.style, `style`)}
            ${createAssetPolicyByType(staticAssetHashes.script, `script`)}
        " />`
}

module.exports = {
    createStaticAssetHashes,
    createCSPMetaTag
}