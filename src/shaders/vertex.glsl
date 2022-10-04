uniform float uTime;
uniform float uSize;

attribute float aScale;


varying vec3 vColor;
varying vec2 vUv;


void main()
{
         vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

     vUv = uv;
    /**
    *Size
    **/
    gl_PointSize = (uSize * aScale);

    /**
    * Color
    **/
    vColor = color;
}