(function(){"use strict";function t(e){return e===1?0:e===2?1:t(e-1)+t(e-2)}self.onmessage=e=>{console.log("費氏數列");let s=e.data,i=t(s);self.postMessage(i)}})();
