import Device from './wglr/Device';
import Context from './wglr/Context';
import ShaderManager from './wglr/ShaderManager';
import TextureManager from './wglr/TextureManager';
import Mesh, { getDefaultQuad, resetDefaultQuad } from './wglr/Mesh';
import DrawState from './wglr/state/DrawState';
import RenderState from './wglr/state/RenderState';
import SceneState from './wglr/state/SceneState';
import TextureSampler from './wglr/TextureSampler';
import * as glm from 'gl-matrix';

export default class GameView {
  constructor() {}

  initialize(canvas) {
    this.initialized = false;
    if (canvas) {
      this.canvas = canvas;
      this.context = Device.createContext(this.canvas, {});

      this.shaderManager = new ShaderManager(Device.gl);
      this.textureManager = new TextureManager(Device.gl);

      this.shaderManager
        .downloadShaders({
          default: {
            vertex: '/shaders/default-2d-vs.glsl',
            fragment: '/shaders/default-2d-fs.glsl'
          }
        })
        .then(() => {
          this.textureManager.downloadTextures({
            player: '/images/runner.png'
          });
        })
        .then(() => {
          resetDefaultQuad();
          this.quad = getDefaultQuad();
        })
        .then(() => {
          const program = this.shaderManager.shaderMap['default'];

          program.makeUniformAutomatic(
            'u_angle',
            (context, drawState, sceneState) => 0
          );
          program.makeUniformAutomatic(
            'u_panningSpeed',
            (context, drawState, sceneState) => glm.vec2.fromValues(0, 0)
          );
          program.makeUniformAutomatic(
            'u_position',
            (context, drawState, sceneState) => glm.vec2.fromValues(0, 0)
          );
          program.makeUniformAutomatic(
            'u_resolution',
            (context, drawState, sceneState) => {
              const { width, height } = context.canvas;
              return glm.vec2.fromValues(width, height);
            }
          );
          program.makeUniformAutomatic(
            'u_size',
            (context, drawState, sceneState) => {
              const { width, height } = context.canvas;
              return glm.vec2.fromValues(width, height);
            }
          );
          program.makeUniformAutomatic(
            'u_time',
            (context, drawState, sceneState) => performance.now() / 1000
          );

          this.initialized = true;
        });
    }
  }

  free = () => {
    this.shaderManager.free();
    this.textureManager.free();
    this.quad.free();
    Device.context.free();
  };

  render = () => {
    const defaultSampler = Object.create(TextureSampler);
    defaultSampler.wrapS = Device.gl.MIRRORED_REPEAT;
    defaultSampler.wrapT = Device.gl.MIRRORED_REPEAT;
    defaultSampler.minificationFilter = Device.gl.LINEAR;
    defaultSampler.magnificationFilter = Device.gl.LINEAR;

    if (this.initialized) {
      const program = this.shaderManager.shaderMap['default'];

      this.context.resize();
      this.context.clear({ color: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 } });
      const drawState = Object.create(DrawState);
      drawState.renderState = Object.create(RenderState);
      drawState.shaderProgram = program;
      drawState.vertexArray = this.quad.toVertexArray();

      this.context.textureUnits = [
        {
          texture: this.textureManager.textureMap['player'],
          sampler: defaultSampler
        }
      ];

      this.context.draw(
        Device.gl.TRIANGLES,
        0,
        6,
        drawState,
        Object.create(SceneState)
      );
    }
  };
}
