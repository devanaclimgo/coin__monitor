import 'react';
import 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      mesh: any;
      boxGeometry: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
    }
  }
}