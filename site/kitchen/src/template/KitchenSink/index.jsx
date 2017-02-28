/* eslint arrow-body-style: 0 */
import React from 'react';
import { List, Icon } from 'antd-mobile';
import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl';
import '../../static/style';
import enLocale from '../../en-US';
import cnLocale from '../../zh-CN';

const getLang = () => {
  const lang = window.location.search
    .replace(/^\?/, '')
    .split('&')
    .filter(item => item)
    .map(item => item.split('='))
    .find(item => item[0] && item[0] === 'lang');

  return lang && lang[1];
};

function getQuery(searchStr) {
  let query = {};
  const length = searchStr.length;
  if (length) {
    const queryStr = searchStr.substr(1, length - 1);
    const key = queryStr.split('=')[0];
    const value = queryStr.split('=')[1];
    query = {
      [key]: value,
    };
  }
  return query;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const lang = getLang();
    let appLocale;
    if (lang === 'zh-CN') {
      appLocale = cnLocale;
    } else {
      appLocale = enLocale;
    }
    addLocaleData(appLocale.data);
    this.state = {
      open: false,
      appLocale,
      cateOpend: [false, false, false, false, false, false, false],
    };
  }

  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  }

  addSearch = () => {
    return window.location.search ? `/${window.location.search}` : '';
  }

  render() {
    const { picked, themeConfig: config } = this.props;
    const { appLocale } = this.state;
    const lists = {};
    const query = getQuery(window.location.search);
    picked.components
      .filter(item => item.meta.filename.includes(appLocale.locale))
      .forEach((i) => {
        const meta = i.meta;
        if (!lists[meta.type]) {
          lists[meta.type] = [];
        }
        const fileName = meta.filename.split('/')[1];
        if (fileName && config.indexDemos.indexOf(fileName) > -1) {
          // add demos
          const demos = [];
          picked.indexDemos.forEach((j) => {
            if (j.component === fileName) {
              demos.push(j.meta);
            }
          });
          meta.demos = demos;
        }

        if (query.source && query.source === 'design') {
          if (meta.source && meta.source === 'design') {
            lists[meta.type].push(meta);
          }
        } else {
          lists[meta.type].push(meta);
        }
      });

    let rootPath = '/kitchen-sink/components';
    if (window.location.port) {
      rootPath = '/components';
    }
    return (
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <div className="am-demo-page">
          <div className="am-demo-hd">
            <h1 className="am-demo-title"><FormattedMessage id="app.site.title" /></h1>
            <h2 className="am-demo-subtitle"><FormattedMessage id="app.site.subTitle" /></h2>
          </div>
          <div className="am-demo-bd">
            {
              Object.keys(lists)
              .sort((a, b) => config.categoryOrder[a] - config.categoryOrder[b])
              .map((cate, index) => (lists[cate].length ? (
                <List
                  key={`${cate}-${index}`}
                  renderHeader={() => (
                    <div
                      onClick={() => {
                        const { cateOpend } = this.state;
                        cateOpend[index] = !cateOpend[index];
                        this.setState({ cateOpend });
                      }}
                      className="am-demo-category"
                    >
                      <div className="am-demo-category-name">{cate}</div>
                      <div className="am-demo-category-arrow"><span><Icon type="down" /></span></div>
                    </div>
                  )}
                  className={this.state.cateOpend[index] ? 'category-open' : 'category-closed'}
                >
                  {
                    lists[cate].sort((a, b) => b.english < a.english).map((item) => {
                      const paths = item.filename.split('/');
                      if (config.indexDemos.indexOf(paths[1]) > -1) {
                        return item.demos.map(j => (
                          <List.Item
                            arrow="horizontal"
                            key={`${j.filename}-${cate}`}
                            onClick={() => location.href = `${rootPath}/${paths[1]}${this.addSearch()}#${
                              paths[1] + config.hashSpliter + j.order
                            }`}
                          >
                            {`${item.english} ${item.chinese}-${j.title}`}
                          </List.Item>
                        ));
                      }
                      return (
                        <List.Item
                          arrow="horizontal"
                          key={`${item.filename}-${cate}`}
                          onClick={() => { location.href = `${rootPath}/${paths[1]}${this.addSearch()}`; }}
                        >
                          {`${item.title}`}
                        </List.Item>
                      );
                    })
                  }
                </List>
              ) : null))
            }
          </div>
        </div>
      </IntlProvider>
    );
  }
}
