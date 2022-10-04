uniform float uTime;
uniform float uSize;

attribute float aScale;

varying vec3 vColor;


void main()
{
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    /**
    *Size
    **/
    gl_PointSize = (uSize * aScale);

    /**
    * Color
    **/
    vColor = color;
}