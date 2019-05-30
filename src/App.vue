<template>
  <div id="app">
    <Layout class="layout">
    <!--  <Header class="header">
        <router-link to="/Blank?to=/MyMarkets">空白</router-link>
      </Header>-->
      <!--<Header class="header">
        <div class="left">
          <div class="logo">
            <img src="./assets//images/mylogo_glb.png">
          </div>

          <Menu mode="horizontal" theme="dark" class="menus">
            <Submenu name="1" class="sub-menu">
              <template slot="title">
                <Icon type="md-settings" size="26" class="icon"/>
                <span>Editorial System</span>
              </template>
              <MenuItem name="a" class="menu-item">
                <a href="/mysteelglobal/index.htm">Articles</a>
              </MenuItem>
              <MenuItem name="a2" class="menu-item">
                <a href="https://mgt-net.mysteelcms.com/manager/" target="_blank">Pictures and Notifications</a>
              </MenuItem>
            </Submenu>
            <Submenu name="2" class="sub-menu">
              <template slot="title">
                <Icon type="md-person" size="26" class="icon"/>
                <span>CRM</span>
              </template>
              <MenuItem name="b" class="menu-item">
                <a href="/mysteelglobal/member/index.htm?iframeUrl=clue">Leads</a>
              </MenuItem>
              <MenuItem name="b2" class="menu-item">
                <a href="/mysteelglobal/member/index.htm?iframeUrl=company">Accounts</a>
              </MenuItem>
              <MenuItem name="b3" class="menu-item">
                <a href="/mysteelglobal/member/index.htm?iframeUrl=linker">Contacts</a>
              </MenuItem>
              <MenuItem name="b4" class="menu-item">
                <a target="_blank" href="https://mgt-en.mysteelcms.com/english/common/desktop.ms">Products</a>
              </MenuItem>
              <MenuItem name="b5" class="menu-item">
                <a href="/mysteelglobal/member/index.htm?iframeUrl=priceSetting">Quotation Calculator</a>
              </MenuItem>
              <MenuItem name="b6" class="menu-item">
                <a href="/mysteelglobal/statistics/index.htm">Activity Report</a>
              </MenuItem>
              <MenuItem name="b7" class="menu-item">
                <a href="/mysteelglobal/member/index.htm?iframeUrl=blacklist">Blacklist</a>
              </MenuItem>
              <MenuItem name="b8" class="menu-item">
                <a target="_blank" href="https://mgt-gt.mysteelcms.com/cmsweb/finance/invoice/listmyinvoice.ms?serverName=mgt-gt.mysteelcms.com">My Application</a>
              </MenuItem>
            </Submenu>

            <Submenu name="3" class="sub-menu">
              <template slot="title">
                <Icon type="md-mail" size="26" style="color:#fff;" />
                <span>EDM</span>
              </template>
              <MenuItem name="c" class="menu-item">
               <a target="_blank" href="javascript:;">Create marketing</a>
              </MenuItem>
              <MenuItem name="c2" class="menu-item">
                <a target="_blank" href="javascript:;">My marketing</a>
              </MenuItem>
            </Submenu>
          </Menu>
        </div>

        <Dropdown class="right" trigger="click">
          <div class="handle">
            <Icon type="md-person" class="person" size="26"/>
            <span>分为蜂窝发送</span>
          </div>
          <DropdownMenu slot="list" class="drop-down">
            <DropdownItem class="menu-item">
              <a href="https://mgt.mysteelcms.com/grzx" target="_blank">Member Center</a>
            </DropdownItem>
            <DropdownItem class="menu-item">
              <a href="/mip/admin_logout.ms" onclick="logout();">
                <Icon type="md-power" size="20"/>
                <span class="text">Exit</span>
              </a>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Header>-->
      <Layout>
        <Sider
          hide-trigger
          class="sider"
          style="width: 90px; min-width: 90px;z-index: 1;">
          <div>
            <!--@on-select="activeName = $event"-->
            <EdMenu class="menu" :activeName="meta.activeName">
              <EdSubMenu v-for="sub in menus" :key="sub.name" :name="sub.name">
                <div class="ed-sub-menu-title" slot="title">
                  <Icon :type="sub.icon" size="36" />
                  <span class="sub-title">{{sub.title}}</span>
                </div>
                <EdMenuItem
                  v-for="child in sub.children"
                  :key="child.name"
                  :name="child.name"
                  :to="child.to"
                >{{child.title}}</EdMenuItem>
              </EdSubMenu>
            </EdMenu>
          </div>
        </Sider>
        <Content class="content" ref="contentRef">
          <div class="bread">
            <!--v-if="$route.meta.parentName"-->
            <Breadcrumb separator="&gt;">
              <BreadcrumbItem
                class="bread-item"
                :to="item.to"
                v-for="item in breadcrumb"
                :key="item.label"
              >{{item.label}}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <router-view/>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  import MarketCategoryServe from './service/marketing/market-category.service';
  import CommonServe from './service/marketing/common.service';
  import { mapMutations } from 'vuex';
export default {
  name: "App",
  data() {
    return {
      menus: [
        {
          title: "Marketing",
          name: "Marketing",
          icon: "md-volume-up",
          children: [
            {
              title: "Create Marketing",
              name: "CreateMarketing",
              to: "/Marketing"
            },
            {
              title: "My Marketing",
              name: "MyMarkets",
              to: "/MyMarkets"
            }
          ]
        },
        {
          title: "Subscriber",
          name: "Subscriber",
          icon: "md-people",
          children: [
            {
              title: "All Subscribers",
              name: "AllSubscribers"
            },
            {
              title: "My List",
              name: "MyList"
            }
          ]
        },
        {
          title: "Library",
          name: "Library",
          icon: "md-image",
          children: [
            {
              title: "Image",
              name: "Image"
            },
            {
              title: "Email Template",
              name: "EmailTemplate"
            },
            {
              title: "Attachment",
              name: "Attachment"
            }
          ]
        },
        {
          title: "Automation",
          name: "Automation",
          icon: "md-refresh",
          children: [
            {
              title: "My Autoresponder",
              name: "MyAutoresponder"
            },
            {
              title: "Create Autoresponder",
              name: "CreateAutoresponder"
            }
          ]
        },
        {
          title: "ReportForm",
          name: "Report Form",
          icon: "md-pie",
          children: []
        }
      ]
    };
  },
  computed: {
    meta() {
      return this.$route.meta;
    },
    breadcrumb() {
      if (!this.meta.breadcrumb) return [];
      const isEdit = localStorage.getItem('isEdit');
      const marketingName = localStorage.getItem('marketingName');
      return isEdit && marketingName ? this.meta.breadcrumb.concat([{
        label: marketingName
      }]) : this.meta.breadcrumb;
    }
    /*isEditorPage() {
     return this.$route.name === "Editor";
    }*/
  },
  methods: mapMutations(['SET_USER_INFO']),
  /*watch: {
    meta() {
      if (!this.$refs["contentRef"]) return;
      const content = this.$refs["contentRef"].$el;
      if (this.isEditorPage) {
        content.style.cssText = `
            width:100%;
            margin-left: 0;
          `;
      } else {
        content.style.cssText = `
            width:calc(100% - 90px);
            margin-left: 90px;
          `;
      }
    }
  },*/
  created() {
    CommonServe.getContext().then(res => this.SET_USER_INFO(res));
  },



  beforeCreate() {
    console.log('5-29 17');
    MarketCategoryServe.initCategory().then(msg => {
      console.log('分类初始化' + msg);
    });
  }
};
</script>
<style lang="less" scoped>
@import "./assets/styles/variable";
@import "./assets/styles/mixin";
#app {
  .layout {
    /*.header {
      a {
        color: @font-color-prey;
        font-size: @font-size-normal;





        !* &:hover{
          // color: @font-color-primary;
          color: @color-white;
          background-color: @font-color-primary;
        } *!
      }
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      background-color: @bg-coffee;
      color: @color-white;
      width: 100%;
      height: 45px;
      line-height: 45px;
      padding: 1px 0;
      z-index: 1;
      font-size: @font-size-mid;
      .left {
        display: flex;
        height: 100%;
        .logo {
          height: 100%;
          margin-right: 10px;
          img {
            height: 100%;
          }
        }
        .menus {
          background-color: @bg-coffee;
          height: 100%;
          line-height: 43px;
          .sub-menu {
            span, .icon {
              color: @color-white;
              &.img {
                vertical-align: sub;
                margin-right: 12px;
              }
            }
            .menu-item {
              &:hover {
                background-color: @font-color-primary;
                a {
                  color: @color-white;
                }
              }
            }
          }
        }
      }
      .right {
        height: 100%;
        .handle {
          cursor: pointer;
          height: 43px;
          padding: 0 10px;
          &:hover {
            background-color: @color-black;
          }
          span {
            vertical-align: middle;
            margin-left: 15px;
            margin-right: 40px;
          }
        }
        .drop-down {
          width: 198px;
          .menu-item {
            &:hover {
              background-color: @font-color-primary;
              a {
                color: @color-white;
              }
            }
          }
        }
      }
    }*/
    .sider {
      position: fixed;
      left: 0;
      /*top: 45px;*/
      height: 100%;
      background-color: @bg-coffee;
      .menu {
        .ed-sub-menu-title {
          text-align: center;
          padding: 10px 0;

          .sub-title {
            display: block;
            font-size: @font-size-normal;
            margin-top: 10px;
          }
        }
      }
    }
    .content {
      width: calc(100% - 90px);
      background-color: @color-white;
      margin-left: 90px;
      /*margin-top: 45px;*/
      overflow-x: hidden;
      .bread {
        padding: 10px 18px;
        .bread-item{
          display: inline-block;
          .no-wrap;
          max-width: 900px;
          @media screen and (max-width:1200px) {
            max-width: 620px;
          }
        }
      }
    }
  }
}
</style>
