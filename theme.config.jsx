export default {
    useNextSeoProps() {
        return {
            titleTemplate: 'Robertify - %s',
            description: 'The official documentation for the Robertify Discord bot.',
            color: "green",
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
    docsRepositoryBase: 'https://github.com/bombies/Robertify-Website/tree/dev',
    darkMode: true,
    primaryHue: 136,
    footer: {
        text: <span>
      MIT {new Date().getFullYear()} © <a href="https://robertify.me" target="_blank">Robertify</a>.
    </span>
    },
    nextThemes: {
        defaultTheme: "dark",
    },
    faviconGlyph: "📖"
}