import './Homepage.scss';
const test = 1;
const rest = {};

      <div className="home-page">
        <div className="home-page-header1" />
        <div className="home-page-header1" />
        <div {...rest} className={"home-page-header"} />
        <div className={"home-page-header"} {...rest} />

        <div className={test + "home-page-header"}>
          <div className="entry-container">
            <div className="entry-main">
            <div className="abc"></div>
              <div className="abc"></div>

              <div className="entry-main-title">
                    <div className="entry-main-title-text"></div>
                  </div>

                  <div className="entry-main-item entry-item">
                    <div
                      size="large"
                    />
                    <div className="entry-main-item-label">
                    </div>
                  </div>
            </div>
            <div className="entry-aside">
              <div className="entry-aside-list">
                <div className="entry-aside-row">
                      <div className="entry-aside-item">
                        <div className="entry-item entry-aside-item-box" >
                                <div>
                                  <div maxValue={99}>
                                    <div
                                      className={"entry-aside-list-icon1"}
                                      size="small"
                                      color="#6B80A8"
                                      backgroundColor="#F4F7FB"
                                      useIconFont={true}
                                    />
                                  </div>
                                  <div className="entry-aside-item-label">
                                  </div>
                                </div>
                                <div>
                                  <div
                                    className="entry-aside-list-icon"
                                    size="small"
                                    color="#6B80A8"
                                    backgroundColor="#F4F7FB"
                                    useIconFont={true}
                                  />
                                  <div className="entry-aside-item-label">
                                  </div>
                                </div>
                        </div>
                      </div>
                </div>
              </div>
            </div>

          </div>
          <div className='home-page-billType'>
            <div value="我的单据" arrow="right" border />
          </div>
        </div>

            <div className="home-content">
                <div className="home-list-loading" status="loading" loadingText=""/>
              <div
                alwaysShowLoadMore={true}
                autoRefreshOnNoMore={true}
              />
            </div>


        <canvas id='pressCanvas' className={'press-canvas'}/>


        <div />
        <div status="loading" text="上传中..." hasMask={true}
                 duration={0}></div>

      </ div>
