const assert = require(`assert`)

const {
    createStaticAssetHashes,
    createCSPMetaTag
} = require(`../csp-builder`)

const staticAssetsMap = [
    {
        type: `style`,
        props: {
            dangerouslySetInnerHTML: {
                __html: `display: none`
            }
        }
    },
    {
        type: `script`,
        props: {
            dangerouslySetInnerHTML: {
                __html: `const foo = 'bar'`
            }
        }
    }
]
const staticAssetHashes = {
    style: ['foo'],
    script: ['bar']
}

describe(`csp-builder.js`, () => {
    describe(`createStaticAssetHashes`, () => {
        it(`creates and pushes hashed style onto a style key`, () => {            
            assert.strictEqual(
                createStaticAssetHashes(staticAssetsMap).style[0],
                `'sha256-ZdHxw9eWtnxUb3mk6tBS+gIiVUPE3pGM470keHPDFlE='`
            )
        })
        it(`creates and pushes hashed script onto a script key`, () => {
            assert.strictEqual(
                createStaticAssetHashes(staticAssetsMap).script[0],
                `'sha256-1STyt2r13iyEAeLjWm1IO4eBbzpg+kLGle/KOoeBrVc='`
            )
        })
    })

    describe(`createCSPMetaTag`, () => {
        it(`does not add on a script-src or style-src when no inline css or js exists`, () => {
            const cspMetaTag = createCSPMetaTag([])
            assert.strictEqual(
                cspMetaTag.includes(`script-src`),
                false
            )
            assert.strictEqual(
                cspMetaTag.includes(`style-src`),
                false
            )
        })
        it(`add style-src onto the meta tag`, () => {
            assert.strictEqual(
                createCSPMetaTag(staticAssetHashes).includes(`style-src foo`),
                true
            )
        })
        it(`adds script-src onto the meta tag`, () => {
            assert.strictEqual(
                createCSPMetaTag(staticAssetHashes).includes(`script-src bar`),
                true
            )
        })
    })
})