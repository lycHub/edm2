const MarketCategory = require('./database/market-category');
const Markets = require('./database/markets');
const Emails = require('./database/emails');
const TemplateCategory = require('./database/template-category');
const Templates = require('./database/templates');
const Files = require('./database/files');
module.exports = () => {
  return { Markets, MarketCategory, Emails, TemplateCategory, Templates, Files };
}
