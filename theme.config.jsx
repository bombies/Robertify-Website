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