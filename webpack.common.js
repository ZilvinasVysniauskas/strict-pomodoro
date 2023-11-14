const path = require('path');
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: {
        popup: path.resolve('src/popup/popup.ts'),
        background: path.resolve('src/background/background.ts'),
        forbiddenWebsitePopupScript: path.resolve('src/content-scripts/forbiddenWebsitePopup.ts')
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.ts?$/,
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                type: 'asset/resource',
                test: /\.(jpg|jpeg|png|otf)$/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('src/static'),
                    to: path.resolve('dist')
                }
            ]
        }),
        ...getHTMLPlugins([
            'popup',
            'options'
        ])
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}

function getHTMLPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'Pomodoro Extension',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}