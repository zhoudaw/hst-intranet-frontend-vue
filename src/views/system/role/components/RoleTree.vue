<script>
export default {
  props: {
    node: {
      default() {
        return {};
      }
    }
  },
  methods: {
    generateMenus(menus = []) {
      const h = this.$createElement;
      return menus
        .filter(v => v.show)
        .map(v => {
          if (v.childList) {
            this.generateMenus(v.childList || []);
          }
          return h("ul", [
            h("h4", v.name),
            ...this.generateItems(v.childList || [])
          ]);
        });
    },
    generateItems(items = []) {
      const h = this.$createElement;
      return items
        .filter(v => v.show)
        .map(v => {
          return h("li", [v.name]);
        });
    }
  },
  render(h) {
    const { childList, name } = this.node;
    return h("div", { class: "role-box" }, [
      h("h3", [name || "-"]),
      h("div", { class: "role-tree" }, this.generateMenus(childList || []))
    ]);
  }
};
</script>
<style lang="scss" scoped>
.role-box {
  height: 240px;
  font-size: 14px;
  box-sizing: border-box;
  border: 1px solid #d5d9e0;
  user-select: none;
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  overflow: hidden;

  & > h3 {
    background-color: #f5f7fa;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    font-weight: 400;
    margin: 0;
    padding: 0 20px;
  }

  & > .role-tree {
    flex: 1;
    box-sizing: border-box;
    padding: 10px 30px;
    overflow: auto;

    ul,
    li {
      position: relative;
      list-style: none;
      cursor: text;
      &:before,
      &:after {
        content: "";
        display: inline-block;
        position: absolute;
      }
    }
    ul {
      position: relative;
      padding: 0 4px;
      margin: 0;
      margin-bottom: 10px;
      &:after {
        width: 6px;
        height: 6px;
        left: -8px;
        top: 7px;
        transform: translateY(-50%);
        background-color: #d5d9e0;
      }
      &:before {
        width: 8px;
        height: calc(100% + 10px);
        border-top: solid 1px #d5d9e0;
        border-left: solid 1px #d5d9e0;
        left: -16px;
        top: 7px;
      }
      &:last-of-type {
        margin-bottom: 0;
        &:before {
          border-left-color: transparent;
        }
      }
      h4 {
        font-size: 14px;
        font-weight: normal;
        position: relative;
        margin: 0;
        padding-bottom: 5px;
        display: flex;
        align-items: center;
      }
      li {
        padding: 10px;
        padding-left: 24px;
        display: flex;
        align-items: center;
        &:after {
          width: 6px;
          height: 6px;
          left: 14px;
          bottom: 50%;
          transform: translateY(50%);
          border: solid 1px #d5d9e0;
        }
        &:before {
          width: 8px;
          height: calc(100% + 10px);
          border-bottom: solid 1px #d5d9e0;
          border-left: solid 1px #d5d9e0;
          left: 6px;
          bottom: 50%;
        }
        &:first-of-type {
          &:before {
            height: calc(100% - 10px - 5px);
          }
        }
      }
    }
    &:only-of-type {
      ul {
        &:only-of-type {
          margin-left: -10px;
          &:before {
            border: none;
          }
          &:after {
            background: transparent;
          }
        }
      }
    }
  }
}
</style>
