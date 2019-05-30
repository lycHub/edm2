<template>
  <ul class="ed-menu">
    <slot></slot>
  </ul>
</template>
<script>
  import {findComponentsDownward} from "iview/src/utils/assist";
  import Emitter from 'iview/src/mixins/emitter';

  export default {
    name: 'EdMenu',
    mixins: [ Emitter ],
    props: {
      openName: {
        type: String,
        default: ''
      },
      activeName: String
    },
   /* provide() {
      return {
        activeName: this.currentActiveName
      }
    },*/
    data() {
      return {
        currentOpenName: this.openName,
        currentActiveName: this.activeName
      }
    },
    watch: {
      openName (newVal) {
        this.currentOpenName = newVal;
      },
      activeName(newVal) {
        this.currentActiveName = newVal;
      },
      currentActiveName () {
        this.updateActiveName();
      }
    },
    methods: {
      updateActiveName () {
        if (this.currentActiveName === undefined) {
          this.currentActiveName = -1;
        }

        this.broadcast('EdSubMenu', 'on-update-active-name', false);
        this.broadcast('EdMenuItem', 'on-update-active-name', this.currentActiveName);
      /*  this.$children.forEach(child => {
          const name = child.$options.name;

          if (name === 'EdSubMenu') {
            child.$emit.apply(child, ['on-update-active-name', false]);
            child.$children.forEach(sonChild => {
              if (sonChild.$options.name === 'EdMenuItem') {
                sonChild.$emit.apply(sonChild, ['on-update-active-name', this.currentActiveName]);
              }
            })
          }
        });*/
      },


      updateOpenKeys (name, eventType = 'click') {
        if (this.currentOpenName === name) return;
        this.currentOpenName = name;
        this.updateOpened(eventType);
        this.$emit('on-open-change', this.currentOpenName);
      },
      updateOpened (eventType) {
        this.children = findComponentsDownward(this, 'EdSubMenu');
        if (this.children.length) {
          this.children.forEach(item => {
            item.opened = this.currentOpenName === item.name;
            if (eventType === 'click') {
              item.active = this.currentOpenName === item.name;
            }
          });
        }
      }
    },
    mounted() {
      this.updateActiveName();
      this.currentOpenName = this.openName;
      this.updateOpened();
      this.$on('on-menu-item-select', name => {
        this.currentActiveName = name;
        this.$emit('on-select', name);
      });
    }
  }
</script>
