Material Name: 
Material Type: ShaderMaterial

Program Info Log: Vertex shader is not compiled.

VERTEX

ERROR: 0:73: 'uv' : redefinition
ERROR: 0:74: 'position' : redefinition
ERROR: 0:77: 'projectionMatrix' : redefinition
ERROR: 0:78: 'modelViewMatrix' : redefinition
ERROR: 0:81: 'instanceMatrix' : redefinition'

  
  68: 	attribute vec4 skinIndex;
  69: 	attribute vec4 skinWeight;
  70: #endif
  71: 
  72: 
> 73:         attribute vec2 uv;
  74:         attribute vec3 position;
  75:         attribute float textureIndex;
  76: 
  77:         uniform mat4 projectionMatrix;
  78:         uniform mat4 modelViewMatrix;
  79: 