import { createSignal, onMount } from 'solid-js'
import { potrace, init } from 'esm-potrace-wasm';

function App() {
  const [rasterImage, setRasterImage] = createSignal("");
  const [vectorImage, setVectorImage] = createSignal("");
  const [portraceSettings, setPortraceSetting] = createSignal({
    pathonly: false, // default false
    extractcolors: true, // default true

    turdsize: 2, // default 2
    turnpolicy: 4, // default 4
    alphamax: 1, // default 1
    opticurve: 1, // default 1
    opttolerance: 0.2, // default 0.2
    posterizelevel: 1, // [1, 255] // default 2
    posterizationalgorithm: 0, // 0: simple, 1: interpolation default 0
  });

  onMount(async() => {
    await init();
  })

  const handleFile = async (e: HTMLInputElement) => {
    if (!e?.files) return;
      const file_image = e.files[0];
      const imgUrl = URL.createObjectURL(file_image);
      setRasterImage(imgUrl);

      let blob = await fileToBlob(imgUrl);
      const svg = await convertToSvg(blob);
      setVectorImage(svg);
  }

  const fileToBlob = async (imageUrl: string) => fetch(imageUrl).then(res => res.blob());

  const convertToSvg = async (imageUrl: ImageBitmapSource) => {
    const svg = await potrace(imageUrl, portraceSettings())
    return svg;
  }

  const adjustPortraceSettings = async (prop: string, value: number | boolean) => {
    setPortraceSetting({
        ...portraceSettings(),
        [prop]: value 
    });

      console.log("settings changed", { [prop]: value  })
      if (!rasterImage()) return;

      let blob = await fileToBlob(rasterImage());
      const svg = await convertToSvg(blob);
      setVectorImage(svg);
  }

  return (
    <div>
      <div class="p-2 w-screen bg-gray-400">
        <input onChange={(e) => handleFile(e.target)}
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

      { vectorImage() && (
        <div class="bg-slate-100 p-5 w-[500px]">
          <div class="">
            <p class="font-extrabold">Adjust Vector Image</p>
          </div>

          <div class="grid grid-cols-2">
            <label class='block'>turdsize: [{portraceSettings().turdsize}]</label>
            <input type="range" min="1" max="100"
              value={portraceSettings().turdsize}
              onChange={ (e) => adjustPortraceSettings('turdsize', e.target.valueAsNumber)}
            />
          </div>
          <div class="grid grid-cols-2">
            <label class="block">turnpolicy: [{portraceSettings().turnpolicy}]</label>
            <input type="range" min="1" max="100"
              value={portraceSettings().turnpolicy}
              onChange={ (e) => adjustPortraceSettings('turnpolicy', e.target.valueAsNumber)}
            />
          </div>
          <div class="grid grid-cols-2">
            <label class="block">alphamax: [{portraceSettings().alphamax}]</label>
            <input type="range" min="0" max="2"
              value={portraceSettings().alphamax}
              onChange={ (e) => adjustPortraceSettings('alphamax', e.target.valueAsNumber)}
            />
          </div>
          <div class="grid grid-cols-2">
            <label class="block">opticurve: [{portraceSettings().opticurve}]</label>
            <input type="range" min="1" max="100"
              value={portraceSettings().opticurve}
              onChange={ (e) => adjustPortraceSettings('opticurve', e.target.valueAsNumber)}
            />
          </div>
          <div class="grid grid-cols-2">
            <label class="block">opttolerance: [{portraceSettings().opttolerance}]</label>
            <input type="range" min="1" max="100"
              value={portraceSettings().opttolerance}
              onChange={ (e) => adjustPortraceSettings('opttolerance', e.target.valueAsNumber)}
            />
          </div>
          <div class="grid grid-cols-2">
            <label class="block">posterizelevel: [{portraceSettings().posterizelevel}]</label>
            <input type="range" min="1" max="20"
              value={portraceSettings().posterizelevel}
              onChange={ (e) => adjustPortraceSettings('posterizelevel', e.target.valueAsNumber)}
            />
          </div>
          <div class="grid grid-cols-2">
            <label class="block">posterizationalgorithm: [{portraceSettings().posterizationalgorithm}] </label>
            <input type="range" min="0" max="1"
              value={portraceSettings().posterizationalgorithm}
              onChange={ (e) => adjustPortraceSettings('posterizationalgorithm', e.target.valueAsNumber)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
