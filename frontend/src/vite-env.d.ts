/// <reference types="vite/client" />



declare module 'meshline' {
  export const MeshLineGeometry: any;
  export const MeshLineMaterial: any;
}

import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

declare module '@react-three/fiber' {
  export const Canvas: any;
  export const extend: any;
  export const useFrame: any;
  export const useThree: any;
  export interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
    ambientLight: any;
    mesh: any;
    meshPhysicalMaterial: any;
    group: any;
  }
}



