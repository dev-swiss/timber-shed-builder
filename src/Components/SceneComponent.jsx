import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";

export default ({ camera, antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest }) => {
  const reactCanvas = useRef(null);

  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new Scene(engine, sceneOptions);
    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(scene);
      scene.render();
    });

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        scene.getEngine().resize();
      }
    };

    window.addEventListener("resize", resize);

    // Initial resize
    resize();

    return () => {
      scene.getEngine().dispose();
      window.removeEventListener("resize", resize);
    };
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, camera.current]);

  return <canvas ref={reactCanvas} {...rest} />;
};