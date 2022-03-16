uniform sampler2D envMap;
uniform vec2 resolution;

varying vec3 worldNormal;
varying vec3 viewDirection;

float ior = 1.5;

void main() {
	// screen coordinates
	vec2 uv = gl_FragCoord.xy / resolution;

	// combine backface and frontface normal
	vec3 normal = worldNormal;

	// calculate refraction and apply to uv
	vec3 refracted = refract(viewDirection, normal, 1.0/ior);
	uv += refracted.xy;

	// sample environment texture
	vec4 tex = texture2D(envMap, uv);

	vec4 color = tex;

	gl_FragColor = vec4(color.rgb, 1.0);
}