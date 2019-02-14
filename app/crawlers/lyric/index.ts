import {requestData, requestJson} from "../../utils";

interface Params {
  name: string;
  artist: string;
}

async function getLyricFromGecimi(params: Params) {
  const uri = `http://gecimi.com/api/lyric/${params.name}/${params.artist}`;
  const data = await requestJson(uri) as any;
  if (Array.isArray(data.result) && data.result[0]) {
      const [{ lrc: lrcURL }] = data.result;
      return requestData(lrcURL);
  }
}

function getLyric(info: Params) {
    return getLyricFromGecimi(info)
}

async function launch() {
    
}

// (async () => {
//     await getLyricFromGecimi({
//         name: '海阔天空',
//         artist: 'Beyond'
//     });
// })()
//   .then(() => process.exit(0))
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   });


export {
    launch,
    getLyric
}
