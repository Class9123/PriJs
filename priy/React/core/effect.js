import {
  setCurrentEffect
} from "../globals.js";

// simple implementation of the useEffect function that supports , batching the effects and running them

function useEffect (callback) {
  const effect = {
    fn: callback,
    cleanup : null
  };
  setCurrentEffect(effect);
  effect.cleanup = callback();
  setCurrentEffect(null);
}

export default useEffect;