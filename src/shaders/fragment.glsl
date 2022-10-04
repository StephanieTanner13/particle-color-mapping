varying vec3 vColor;

void main()
{
    // float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    // float strength = 0.05 / distanceToCenter - 0.1;

    //float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.25);
    // gl_FragColor = vec4(vColor, strength);
    gl_FragColor = vec4(vColor, 1.0);
    
}