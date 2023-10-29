import { createSignal, onMount } from 'solid-js'
import { potrace, init } from 'esm-potrace-wasm';

function App() {
  // const [count, setCount] = createSignal(0)

  onMount(async() => {
    await init();
  })

  const handleFile = async (e: Event) => {
    if (!e.target) return;
      const file_image = e.target.files[0];
      const imgUrl = URL.createObjectURL(file_image)
      const blob = await fetch(imgUrl).then(res=>res.blob());

      const svg = await potrace(
        blob,
        {
          turdsize: .50,
          turnpolicy: 4,
          alphamax: 1,
          opticurve: 1,
          opttolerance: 0.2,
          pathonly: false,
          extractcolors: true,
          posterizelevel: 2, // [1, 255]
          posterizationalgorithm: 1, // 0: simple, 1: interpolation
        }
      );

      document.querySelector('div#rasterImg').innerHTML = `<img src="${imgUrl}"/>`
      document.querySelector('div#vectorImg').innerHTML = svg;
  }

  return (
    <div>
      <div class="p-2 w-screen bg-gray-400">
        <input onChange={handleFile}
          accept='image/*'
          class="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="default_size" type="file" />
      </div> 

      <div class="p-2 h-96 body grid grid-cols-2">
        <div id="rasterImg"></div>
        <div id="vectorImg"></div>
      </div> 
    </div>
  )
}

export default App
