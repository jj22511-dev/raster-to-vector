import { createSignal, onMount } from 'solid-js'
import { potrace, init } from 'esm-potrace-wasm';

function App() {
  const [rasterImage, setRasterImage] = createSignal("");
  const [vectorImage, setVectorImage] = createSignal("");

  onMount(async() => {
    await init();
  })

  const handleFile = async (e: Event) => {
    if (!e.target) return;
      const file_image = e.target.files[0];
      const imgUrl = URL.createObjectURL(file_image);
      const blob = await fetch(imgUrl).then(res=>res.blob());

      setRasterImage(imgUrl);

      const svg = await potrace(
        blob,
        {
          pathonly: false, // default false
          extractcolors: true, // default true
          
          turdsize: 2, // default 2
          turnpolicy: 4, // default 4
          alphamax: 1, // default 1
          opticurve: 1, // default 1
          opttolerance: 0.2, // default 0.2
          posterizelevel: 1, // [1, 255] // default 2
          posterizationalgorithm: 0, // 0: simple, 1: interpolation default 0
        }
      );

      setVectorImage(svg);
  }

  return (
    <div>
      <div class="p-2 w-screen bg-gray-400">
        <input onChange={handleFile}
          accept='image/*'
          class="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="default_size" type="file" />
      </div> 

      <div class="p-2 h-96 body grid grid-cols-2">
        { rasterImage() &&
          <div id="rasterImg" class="">
            <h3>Original</h3>
            <img src={ rasterImage() } alt="" />
          </div>
        }

        { vectorImage() && 
          <div id="vectorImg">
            <h3>Vectored</h3>
            <img src={`data:image/svg+xml;utf8,${encodeURIComponent( vectorImage() )}`} />
          </div>
        }

      </div> 
      <div class="bg-slate-100 p-5">
        <h3>Adjust Vector Image</h3>

        <div>
          <label class='block'>turdsize: </label>
          <input class="w-1/4" type="range" min="1" max="100" value="50" />
        </div>
        <div class="">
          <label class="block">turnpolicy: </label>
          <input class="w-1/4" type="range" min="1" max="100" value="50" />
        </div>
        <div class="">
          <label class="block">alphamax: </label>
          <input class="w-1/4" type="range" min="1" max="100" value="50" />
        </div>
        <div class="">
          <label class="block">opticurve: </label>
          <input class="w-1/4" type="range" min="1" max="100" value="50" />
        </div>
        <div class="">
          <label class="block">opttolerance: </label>
          <input class="w-1/4" type="range" min="1" max="100" value="50" />
        </div>
        <div class="">
          <label class="block">posterizelevel: </label>
          <input class="w-1/4" type="range" min="1" max="100" value="50" />
        </div>
        <div class="">
          <label class="block">posterizationalgorithm: </label>
          <input class="w-1/4" type="range" min="1" max="100" value="50" />
        </div>
      </div>
    </div>
  )
}

export default App
