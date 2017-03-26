module.exports = {
    entry: './react/index.js',

    output: {
        path: __dirname + '/static/',
        filename: 'bundle.js'
    },

    devServer: {
        inline: true,
        port: 7777,
      contentBase: [
        __dirname + '/templates/',
        //__dirname + '/static/',
        __dirname + '/react/'
      ]
    },

    module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    exclude: /node_modules/,
                    query: {
                        cacheDirectory: true,
                        presets: ['es2015', 'react']
                    }
                },
              {test: /\.css/, loader: 'style-loader!css-loader'},
              {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader"
      }
            ]
        }
};
