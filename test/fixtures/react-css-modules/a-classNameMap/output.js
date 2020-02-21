"use strict";

var _getClassName2 = _interopRequireDefault(require("@zongze/babel-plugin-react-css-modules/dist/browser/getClassName"));

require("./Homepage.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _styleModuleImportMap = {
  "./Homepage.scss": {
    "home-page": "Homepage__home-page",
    "at-row": "Homepage__at-row",
    "welcome-title": "Homepage__welcome-title",
    "home-page-header": "Homepage__home-page-header",
    "home-page-billType": "Homepage__home-page-billType",
    "at-list__item": "Homepage__at-list__item",
    "item-extra__icon-arrow": "Homepage__item-extra__icon-arrow",
    "at-icon": "Homepage__at-icon",
    "home-content": "Homepage__home-content",
    "entry-container": "Homepage__entry-container",
    "entry-item": "Homepage__entry-item",
    "entry-main": "Homepage__entry-main",
    "entry-main-item": "Homepage__entry-main-item",
    "entry-aside": "Homepage__entry-aside",
    "entry-aside-list": "Homepage__entry-aside-list",
    "entry-aside-row": "Homepage__entry-aside-row",
    "entry-aside-item": "Homepage__entry-aside-item",
    "process-bg": "Homepage__process-bg",
    "process-color": "Homepage__process-color",
    "press-canvas": "Homepage__press-canvas"
  }
};
const test = 1;
const rest = {};
<div className="Homepage__home-page">
        <div className="home-page-header1" />
        <div className="home-page-header1" />
        <div {...rest} className={"home-page-header" + (" " + (rest ? rest.className || "" : ""))} />
        <div className={"home-page-header" + (" " + (rest ? rest.className || "" : ""))} {...rest} />

        <div className={(0, _getClassName2.default)(test + "home-page-header", _styleModuleImportMap, {
    "autoResolveMultipleImports": true,
    "handleMissingStyleName": "warn",
    "include": {
      "0": "a-classNameMap"
    }
  })}>
          <div className="Homepage__entry-container">
            <div className="Homepage__entry-main">
            <div className="abc"></div>
              <div className="abc"></div>

              <div className="entry-main-title">
                    <div className="entry-main-title-text"></div>
                  </div>

                  <div className="Homepage__entry-main-item Homepage__entry-item">
                    <div size="large" />
                    <div className="entry-main-item-label">
                    </div>
                  </div>
            </div>
            <div className="Homepage__entry-aside">
              <div className="Homepage__entry-aside-list">
                <div className="Homepage__entry-aside-row">
                      <div className="Homepage__entry-aside-item">
                        <div className="Homepage__entry-item">
                                <div>
                                  <div maxValue={99}>
                                    <div className={"entry-aside-list-icon1"} size="small" color="#6B80A8" backgroundColor="#F4F7FB" useIconFont={true} />
                                  </div>
                                  <div className="entry-aside-item-label">
                                  </div>
                                </div>
                                <div>
                                  <div className="entry-aside-list-icon" size="small" color="#6B80A8" backgroundColor="#F4F7FB" useIconFont={true} />
                                  <div className="entry-aside-item-label">
                                  </div>
                                </div>
                        </div>
                      </div>
                </div>
              </div>
            </div>

          </div>
          <div className="Homepage__home-page-billType">
            <div value="我的单据" arrow="right" border />
          </div>
        </div>

            <div className="Homepage__home-content">
                <div className="home-list-loading" status="loading" loadingText="" />
              <div alwaysShowLoadMore={true} autoRefreshOnNoMore={true} />
            </div>


        <canvas id='pressCanvas' className={'press-canvas'} />


        <div />
        <div status="loading" text="上传中..." hasMask={true} duration={0}></div>

      </div>;
