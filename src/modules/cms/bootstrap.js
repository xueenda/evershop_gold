const config = require('config');

module.exports = () => {
  const themeConfig = {
    logo: {
      alt: "BMO Capital Markets",
      src: "/images/bmo_econ_logo.jpg",
      width: "128px",
      height: "128px"
    },
    headTags: {
      links: [],
      metas: [],
      scripts: [],
      bases: []
    },
    copyRight: `© 2024 BMO Capital Markets. All Rights Reserved.`
  };
  config.util.setModuleDefaults('themeConfig', themeConfig);
  config.util.setModuleDefaults('system', {
    file_storage: 'local'
  });
};
