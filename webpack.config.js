// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
//
// module.exports = {
//   entry: './src/js/main.js',
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'bundle.js',
//     clean: true,
//     publicPath: '/',
//   },
//   devServer: {
//     static: './dist',
//     open: true,
//     hot: true,
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './src/index.html',
//     }),
//     new MiniCssExtractPlugin({
//       filename: 'style.css',
//     }),
//     new CopyWebpackPlugin({
//       patterns: [
//         {
//           from: 'src/assets/images',
//           to: 'assets/images',
//           noErrorOnMissing: true
//         },
//         {
//           from: 'src/assets/icons',
//           to: 'assets/icons',
//           noErrorOnMissing: true
//         },
//       ]
//     })
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.html$/i,
//         loader: 'html-loader',
//         options: {
//           sources: {
//             list: [
//               {
//                 tag: 'img',
//                 attribute: 'src',
//                 type: 'src',
//               },
//               {
//                 tag: 'img',
//                 attribute: 'srcset',
//                 type: 'srcset',
//               },
//               {
//                 tag: 'link',
//                 attribute: 'href',
//                 type: 'src',
//               },
//             ]
//           }
//         }
//       },
//       {
//         test: /\.scss$/i,
//         use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
//       },
//       {
//         test: /\.(png|svg|jpg|jpeg|gif)$/i,
//         type: 'asset/resource',
//         generator: {
//           filename: (pathData) => {
//             const relativePath = path.relative(path.resolve(__dirname, 'src'), pathData.filename);
//
//             if (relativePath.includes('/icons/') || relativePath.includes('\\icons\\')) {
//               return 'assets/icons/[name][ext][query]';
//             } else {
//               return 'assets/images/[hash][ext][query]';
//             }
//           }
//         }
//       },
//       {
//         test: /\.(woff|woff2|eot|ttf|otf)$/i,
//         type: 'asset/resource',
//         generator: {
//           filename: 'assets/fonts/[hash][ext][query]'
//         }
//       },
//     ],
//   },
//   mode: 'development',
// };

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/',
  },
  devServer: {
    static: './dist',
    open: true,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/images',
          to: 'assets/images',
          noErrorOnMissing: true
        },
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext][query]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]'
        }
      },
      {
        test: /\.svg$/i,
        include: path.resolve(__dirname, 'src/assets/icons'),
        type: 'asset/resource',
        generator: {
          filename: 'assets/icons/[name][ext][query]'
        }
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
    }
  },
  mode: 'development',
};