module.exports = class Util {

  /**
   * Check if a rect intersect a point
   *
   * @param  {Object}  p A Point x, y
   * @param  {Object}  r A Rect x, y, width, height
   *
   * @return {Boolean}
   */
  static isPointInRect(p, r) {
    return p.x >= r.x && p.x <= (r.x + r.width) && p.y >= r.y && p.y <= (r.y + r.height);
  }

  static intersectRect(r1, r2) {
    return !(r2.x > r1.x + r1.width ||
             r2.x + r2.width < r1.x ||
             r2.y > r1.y+r1.height ||
             r2.y+r2.height < r1.y);
  }

  static blobToBuffer(blob) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = function() {
        resolve(new Buffer(this.result));
      };
      fileReader.onerror = function(err) {
        reject(err);
      };
      fileReader.readAsArrayBuffer(blob);
    });
  }

  static canvasToImageBuffer(canvas, opt) {
    opt = typeof opt === 'object' ? opt : {};
    opt.mimeType == opt.mimeType ? opt.mimeType : 'image/jpeg';
    opt.quality == opt.quality ? opt.quality : 1;
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        Util.blobToBuffer(blob)
        .then(buff => {
          resolve(buff);
        })
        .catch(reject);
      }, opt.mimeType, opt.quality);
    });
  }

}
