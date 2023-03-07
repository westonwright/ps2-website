import * as THREE from 'three'

const createMaterial = () =>
{
    return new THREE.ShaderMaterial(
        {
            uniforms:
            {
                colorTexture:
                {
                    value: null
                }
            },
    
            vertexShader:
            [
                'varying vec2 vUv;',
    
                'void main() {',
                    'vUv = vec2(uv.x, uv.y);',
                    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                '}'
            ].join('\n'),
            fragmentShader:
            [
                'uniform sampler2D colorTexture;',
    
                'varying vec2 vUv;',
    
                'void main() {',
    
                    'vec4 colorTexel = texture2D(colorTexture, vUv);',
                    'gl_FragColor = colorTexel;',
                '}'
            ].join('\n')
        }
    ); 
}

export default createMaterial;