exports.onCreatePage = async ({ page, actions }) => {
    const { createPage } = actions

    if (page.path.match(/^\/app/)) {
        page.matchPath = "/app/*"
        createPage(page)
    }
}

exports.onCreateWebpackConfig = ({ stage, actions }) => {
    actions.setWebpackConfig({
        resolve: {
            
        }
    })
};