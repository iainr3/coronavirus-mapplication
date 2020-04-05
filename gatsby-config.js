module.exports = {
  plugins: [
    "gatsby-plugin-resolve-src",
    "gatsby-plugin-sass",
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    "gatsby-plugin-react-leaflet",
  ],
};
