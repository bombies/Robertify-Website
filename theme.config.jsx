export default {
    useNextSeoProps() {
        return {
            titleTemplate: 'Robertify - %s'
        }
    },
    logo: (
        <>
            <span>Robertify Docs</span>
        </>
        ),
    project: {
        link: 'https://github.com/bombies/Robertify-Bot',
    },
    banner: {
        dismissable: true,
        key: 'docs-banner',
        text: 'Robertify Docs v.0.0.1 now available! 🎉'
    },
    docsRepositoryBase: 'https://github.com/bombies/Robertify-Website/tree/dev',
    darkMode: true,
    primaryHue: 136,
    footer: {
        text: <span>
      MIT {new Date().getFullYear()} © <a href="https://robertify.me" target="_blank">Robertify</a>.
    </span>
    }
    ,
    faviconGlyph: "📖"
}