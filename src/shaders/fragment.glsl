varying vec3 vColor;
varying vec2 vUv;

void main()
{
    //float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    //float strength = distanceToCenter;

    // float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.25);
    // gl_FragColor = vec4(vColor, strength);

    
    float strength = 1.0 - (step(0.25, distance(gl_PointCoord, vec2(0.5))));

    //clamp strength
    strength = clamp(strength, 0.0, 1.0);

    //gl_FragColor = vec4(strength, strength, strength, 1.0);
    //color
    gl_FragColor = vec4(vColor, strength);
    
}