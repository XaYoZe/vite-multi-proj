import Vap from 'video-animation-player/dist/index.d';

declare module '*.vue' {
  import { defineComponent } from 'vue';
}

declare module 'video-animation-player' {
  export default Vap;
}

export {};
